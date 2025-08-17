import { createSignal, onMount, For, Show } from 'solid-js';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import MyCard from '../components/Cards';
import group from "../assets/Group.png";
import medical from "../assets/001-medical.png";
import saving from "../assets/003-saving.png";

const Accounts = () => {
  const [sidebarOpen, setSidebarOpen] = createSignal(false);
  const [sidebarExpanded, setSidebarExpanded] = createSignal(true);
  const [stats, setStats] = createSignal({
    utang: 0,
    piutang: 0,
    total: 0
  }); 
  const [recentTransactions, setRecentTransactions] = createSignal([]);
  const [isLoading, setIsLoading] = createSignal(true);
  const [isUpdating, setIsUpdating] = createSignal(false);

  const handleSidebarToggle = (isOpen: boolean) => {
    setSidebarExpanded(isOpen);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getAuthToken = () => {
    return localStorage.getItem('token') || localStorage.getItem('authToken') || sessionStorage.getItem('token');
  };

  const statsDisplay = () => [
    { label: 'Utang', amount: formatCurrency(stats().utang), color: 'text-[#718EBF]', background: 'bg-[#E7EDFF]', icon: group },
    { label: 'Piutang', amount: formatCurrency(stats().piutang), color: 'text-[#FF82AC]', background: 'bg-[#FFE0EB]', icon: medical },
    { label: 'Total', amount: formatCurrency(stats().total), color: 'text-[#16DBCC]', background: 'bg-[#DCFAF8]', icon: saving }
  ];

  // Fetch stats from backend
  const fetchStats = async () => {
    const token = getAuthToken();
    if (!token) return;

    try {
      const response = await fetch('/api/debts/stats', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
        console.log('Stats loaded:', data);
      } else {
        console.error('Failed to load stats');
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  // Fetch recent transactions from backend
  const fetchRecentTransactions = async () => {
    const token = getAuthToken();
    if (!token) return;

    try {
      const response = await fetch('/api/debts/recent', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setRecentTransactions(data);
        console.log('Recent transactions loaded:', data);
      } else {
        console.error('Failed to load recent transactions');
      }
    } catch (error) {
      console.error('Error fetching recent transactions:', error);
    }
  };

  // Toggle debt status (checklist feature)
  const toggleDebtStatus = async (debtId) => {
    const token = getAuthToken();
    if (!token) return;

    setIsUpdating(true);
    try {
      const response = await fetch(`/api/debts/${debtId}/toggle`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const updatedDebt = await response.json();
        console.log('Debt status toggled:', updatedDebt);
        
        // Update the recent transactions list locally
        setRecentTransactions(prev => 
          prev.map(debt => 
            debt.id === debtId 
              ? { ...debt, is_checked: updatedDebt.is_checked }
              : debt
          )
        );
        
        // Refresh stats to reflect the changes
        await fetchStats();
      } else {
        console.error('Failed to toggle debt status');
      }
    } catch (error) {
      console.error('Error toggling debt status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Transform debt data to transaction display format - Only show 3 most recent
  const transformedTransactions = () => {
    return recentTransactions()
      .slice(0, 3) // Limit to only 3 most recent transactions
      .map(debt => ({
        id: debt.id,
        name: debt.name,
        type: debt.type, // "Utang" or "Meminjamkan"
        method: debt.method,
        status: debt.is_checked ? 'Completed' : 'Pending',
        amount: debt.type === 'Utang' ? `-${formatCurrency(debt.amount)}` : formatCurrency(debt.amount),
        date: formatDate(debt.date),
        isNegative: debt.type === 'Utang',
        isChecked: debt.is_checked,
        rawAmount: debt.amount
      }));
  };

  const refreshAllData = async () => {
    setIsLoading(true);
    await Promise.all([fetchStats(), fetchRecentTransactions()]);
    setIsLoading(false);
  };

  const chartData = [
    { day: 'Sat', cash: 180, transfer: 300 },
    { day: 'Sun', cash: 250, transfer: 150 },
    { day: 'Mon', cash: 230, transfer: 280 },
    { day: 'Tue', cash: 300, transfer: 180 },
    { day: 'Wed', cash: 220, transfer: 300 },
    { day: 'Thu', cash: 240, transfer: 260 },
    { day: 'Fri', cash: 260, transfer: 320 }
  ];

  onMount(async () => {
    await refreshAllData();
  });

  return (
    <div class="bg-[#f8fafc] min-h-screen">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen() && (
        <div class="fixed inset-0 z-50 bg-black/40 md:hidden" onClick={() => setSidebarOpen(false)}>
          <div
            class="absolute left-0 top-0 bottom-0 w-2/3 sm:w-1/2 bg-white shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar onToggle={handleSidebarToggle} />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div class="hidden md:block">
        <Sidebar onToggle={handleSidebarToggle} />
      </div>

      {/* Main Content */}
      <div
        class={`transition-all duration-300 ${
          sidebarExpanded() ? 'md:ml-64' : 'md:ml-20'
        }`}
      >
        <Topbar toggleSidebar={() => setSidebarOpen(!sidebarOpen())} title="Page Title" />
        <div class="p-4 sm:p-8 space-y-6">
            
            {/* Loading State */}
            <Show when={isLoading()}>
              <div class="text-center py-8">
                <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <p class="mt-2 text-gray-500">Loading data...</p>
              </div>
            </Show>

            <Show when={!isLoading()}>
              {/* Summary Boxes */}
              <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <For each={statsDisplay()}>{(item) => (
                  <div class='bg-white shadow-sm rounded-xl p-4 flex justify-center gap-8'>
                    <div class={`flex justify-center p-3 w-14 h-14 rounded-full ${item.background}`}>
                      <img src={item.icon} class="w-7 h-7 object-contain" alt="" />
                    </div>
                    <div class='text-center font-medium font-inter'>
                      <p class={`${item.color}`}>{item.label}</p>
                      <h2 class="text-lg font-inter font-semibold mt-2">{item.amount}</h2>
                    </div>
                  </div>
                )}</For>
              </div>

              {/* Transaction + Card */}
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-white rounded-xl py-2 px-5 shadow">
                  <div class="flex justify-between items-center mb-2">
                    <h2 class="text-lg font-inter text-secondary font-semibold">Last Transaction</h2>
                    <button 
                      onClick={() => refreshAllData()}
                      disabled={isLoading()}
                      class="text-blue-500 hover:text-blue-700 text-sm font-medium disabled:text-gray-400"
                    >
                      {isLoading() ? 'Loading...' : 'Refresh'}
                    </button>
                  </div>
                  
                  <Show 
                    when={transformedTransactions().length > 0}
                    fallback={
                      <div class="text-center py-3 text-gray-500">
                        <p class="text-sm">No recent transactions</p>
                      </div>
                    }
                  >
                    <For each={transformedTransactions()}>{(trx) => (
                      <div class="flex items-center justify-between py-1 text-sm border-b border-gray-100 last:border-b-0">
                        <div class="flex items-center gap-3">
                          {/* Checkbox for toggle feature */}
                          <div 
                            class={`w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-all duration-200 ${
                              trx.isChecked 
                                ? 'bg-green-500 border-green-500' 
                                : 'border-gray-300 hover:border-blue-400'
                            } ${isUpdating() ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={() => !isUpdating() && toggleDebtStatus(trx.id)}
                          >
                            {trx.isChecked && (
                              <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                              </svg>
                            )}
                          </div>
                          
                          <div class={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                            trx.type === 'Utang' ? 'bg-red-500' : 'bg-green-500'
                          }`}>
                            {trx.name.charAt(0).toUpperCase()}
                          </div>
                          <div class='font-inter'>
                            <p class={`font-medium ${trx.isChecked ? 'text-gray-400 line-through' : 'text-hitam'}`}>
                              {trx.name}
                            </p>
                            <p class="text-xs text-gray-400">{trx.date}</p>
                          </div>
                        </div>
                        <div class="text-right font-inter">
                          <p class={`text-sm ${trx.isChecked ? 'text-gray-400' : 'text-hitam'}`}>
                            {trx.type}
                          </p>
                          <div class="flex items-center gap-2">
                            <p class={`text-xs ${trx.isChecked ? 'text-gray-400' : 'text-blue-500'}`}>
                              {trx.method}
                            </p>
                            <span class={`text-xs px-2 py-1 rounded-full ${
                              trx.status === 'Pending' 
                                ? 'text-yellow-600 bg-yellow-100' 
                                : 'text-green-600 bg-green-100'
                            }`}>
                              {trx.status}
                            </span>
                          </div>
                          <p class={`text-sm font-medium mt-1 ${
                            trx.isChecked 
                              ? 'text-gray-400 line-through' 
                              : trx.isNegative ? 'text-red-500' : 'text-green-500'
                          }`}>
                            {trx.amount}
                          </p>
                        </div>
                      </div>
                    )}</For>
                  </Show>
                </div>
                <MyCard/>
              </div>

              {/* Cash & Transfer Overview */}
              <div class="bg-white rounded-xl p-6 shadow">
                <div class='flex justify-between'>
                  <h2 class="text-lg font-semibold mb-3 font-inter text-secondary">Cash & Transfer Overview</h2>
                  <div class="flex justify-center gap-4 mt-4 text-sm">
                    <div class="flex items-center gap-1">
                      <div class="w-3 h-3 bg-[#F3E014] rounded-full"></div>
                      <span>Cash</span>
                    </div>
                    <div class="flex items-center gap-1">
                      <div class="w-3 h-3 bg-primer2 rounded-full"></div>
                      <span>Transfer</span>
                    </div>
                  </div>
                </div>
                <div class="grid grid-cols-7 gap-4 h-64 items-end">
                  <For each={chartData}>{(day) => (
                    <div class="flex flex-col items-center justify-end h-full">
                      <div class="flex gap-1 items-end h-full">
                        <div class="w-5 sm:w-6 md:w-7 lg:w-9 bg-[#F3E014] rounded-t" style={{ height: `${day.cash * 0.3}px` }}></div>
                        <div class="w-5 sm:w-6 md:w-7 lg:w-9 bg-primer2 rounded-t" style={{ height: `${day.transfer * 0.3}px` }}></div>
                      </div>
                      <span class="text-sm font-medium text-hitam mt-2 font-inter">{day.day}</span>
                    </div>
                  )}</For>
                </div>
              </div>
            </Show>
          </div>
        </div>
      </div>
  );
};

export default Accounts;