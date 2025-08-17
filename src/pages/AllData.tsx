import { createSignal, onMount, For, Show } from 'solid-js';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

const AllData = () => {
  const [sidebarOpen, setSidebarOpen] = createSignal(false);
  const [sidebarExpanded, setSidebarExpanded] = createSignal(true);
  const [debts, setDebts] = createSignal([]);
  const [stats, setStats] = createSignal({
    utang: 0,
    piutang: 0,
    total: 0
  });
  const [isLoading, setIsLoading] = createSignal(true);
  const [message, setMessage] = createSignal({ text: '', type: '' });
  const [updatingId, setUpdatingId] = createSignal(null);

  // Helper function untuk mendapatkan JWT token
  const getAuthToken = () => {
    return localStorage.getItem('token') || localStorage.getItem('authToken') || sessionStorage.getItem('token');
  };

  const handleSidebarToggle = (isOpen: boolean) => {
    setSidebarExpanded(isOpen);
  };

  // Format currency ke Rupiah
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format date ke format yang readable
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Fetch all debts from API
  const fetchDebts = async () => {
    const token = getAuthToken();
    if (!token) {
      setMessage({ text: 'Please login first', type: 'error' });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/debts', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setDebts(data);
        console.log('Debts loaded:', data);
      } else {
        const error = await response.json();
        setMessage({ 
          text: error.error || 'Failed to load debts', 
          type: 'error' 
        });
      }
    } catch (error) {
      console.error('Error fetching debts:', error);
      setMessage({ 
        text: 'Connection error - please try again', 
        type: 'error' 
      });
    }
  };

  // Fetch stats from API
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

  // Toggle debt status (check/uncheck)
  const toggleDebtStatus = async (debtId, currentStatus) => {
    const token = getAuthToken();
    if (!token) {
      setMessage({ text: 'Please login first', type: 'error' });
      return;
    }

    setUpdatingId(debtId);
    
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
        
        // Update debt dalam array
        setDebts(prevDebts => 
          prevDebts.map(debt => 
            debt.id === debtId ? updatedDebt : debt
          )
        );

        // Refresh stats karena status berubah
        await fetchStats();

        setMessage({ 
          text: updatedDebt.is_checked 
            ? `${updatedDebt.name} marked as completed!` 
            : `${updatedDebt.name} marked as pending!`, 
          type: 'success' 
        });

        // Clear message after 3 seconds
        setTimeout(() => {
          setMessage({ text: '', type: '' });
        }, 3000);

      } else {
        const error = await response.json();
        setMessage({ 
          text: error.error || 'Failed to update status', 
          type: 'error' 
        });
      }
    } catch (error) {
      console.error('Error toggling debt status:', error);
      setMessage({ 
        text: 'Connection error - please try again', 
        type: 'error' 
      });
    } finally {
      setUpdatingId(null);
    }
  };

  // Delete debt
  const deleteDebt = async (debtId, debtName) => {
    if (!confirm(`Are you sure you want to delete "${debtName}"?`)) {
      return;
    }

    const token = getAuthToken();
    if (!token) {
      setMessage({ text: 'Please login first', type: 'error' });
      return;
    }

    try {
      const response = await fetch(`/api/debts/${debtId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        // Remove debt from array
        setDebts(prevDebts => 
          prevDebts.filter(debt => debt.id !== debtId)
        );

        // Refresh stats
        await fetchStats();

        setMessage({ 
          text: `"${debtName}" has been deleted`, 
          type: 'success' 
        });

        setTimeout(() => {
          setMessage({ text: '', type: '' });
        }, 3000);

      } else {
        const error = await response.json();
        setMessage({ 
          text: error.error || 'Failed to delete debt', 
          type: 'error' 
        });
      }
    } catch (error) {
      console.error('Error deleting debt:', error);
      setMessage({ 
        text: 'Connection error - please try again', 
        type: 'error' 
      });
    }
  };

  // Load data on component mount
  onMount(async () => {
    setIsLoading(true);
    await Promise.all([fetchDebts(), fetchStats()]);
    setIsLoading(false);
  });

  // Computed stats untuk display
  const statsDisplay = () => [
    { 
      label: 'Utang', 
      value: formatCurrency(stats().utang), 
      color: 'text-red-500',
      bgColor: 'bg-red-50 border-red-200'
    },
    { 
      label: 'Piutang', 
      value: formatCurrency(stats().piutang), 
      color: 'text-green-500',
      bgColor: 'bg-green-50 border-green-200'
    },
    { 
      label: 'Total', 
      value: formatCurrency(stats().total), 
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 border-blue-200'
    }
  ];

  // Filter and sort debts - FIXED: Proper date comparison
  const sortedDebts = () => {
    return debts().sort((a, b) => {
      // Sort by: unchecked first, then by date (newest first)
      if (a.is_checked !== b.is_checked) {
        return a.is_checked ? 1 : -1;
      }
      // Fix: Convert dates to timestamps for proper comparison
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  };

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
              {/* Success/Error Message */}
              <Show when={message().text}>
                <div class={`p-4 rounded-md border ${
                  message().type === 'success' 
                    ? 'bg-green-50 border-green-200 text-green-700' 
                    : 'bg-red-50 border-red-200 text-red-700'
                }`}>
                  <div class="flex items-center justify-between">
                    <span class="text-sm">{message().text}</span>
                    <button 
                      onClick={() => setMessage({ text: '', type: '' })}
                      class="ml-2 text-lg leading-none cursor-pointer hover:opacity-70"
                    >
                      ×
                    </button>
                  </div>
                </div>
              </Show>

              {/* Stats */}
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <For each={statsDisplay()}>{(stat) => (
                  <div class={`p-4 rounded-xl shadow border text-center transition-all hover:shadow-md ${stat.bgColor}`}>
                    <p class={`${stat.color} font-inter font-medium text-sm`}>{stat.label}</p>
                    <p class="text-lg font-inter font-semibold mt-2 text-gray-800">{stat.value}</p>
                  </div>
                )}</For>
              </div>

              {/* Loans Table */}
              <div class="bg-white rounded-xl p-6 shadow overflow-auto">
                <div class="flex items-center justify-between mb-4">
                  <h2 class="text-lg font-semibold text-gray-800">
                    All Debts ({debts().length})
                  </h2>
                  <button 
                    onClick={() => {
                      fetchDebts();
                      fetchStats();
                    }}
                    class="text-blue-500 hover:text-blue-700 text-sm font-medium"
                  >
                    Refresh
                  </button>
                </div>

                <Show 
                  when={debts().length > 0}
                  fallback={
                    <div class="text-center py-8 text-gray-500">
                      <p class="text-lg">No debts found</p>
                      <p class="text-sm mt-1">Start by adding your first debt!</p>
                    </div>
                  }
                >
                  <div class="overflow-x-auto">
                    <table class="w-full text-sm min-w-[600px]">
                      <thead class="text-left text-gray-500 border-b">
                        <tr>
                          <th class="py-3 font-medium">Name</th>
                          <th class="font-medium">Type</th>
                          <th class="font-medium">Method</th>
                          <th class="font-medium">Date</th>
                          <th class="font-medium text-right">Amount</th>
                          <th class="font-medium text-center">Status</th>
                          <th class="font-medium text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <For each={sortedDebts()}>{(debt) => (
                          <tr class={`border-t border-gray-100 hover:bg-gray-50 transition-colors ${debt.is_checked ? 'opacity-60' : ''}`}>
                            <td class="py-4">
                              <div class={`font-medium ${debt.is_checked ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                                {debt.name}
                              </div>
                            </td>
                            <td>
                              <span class={`px-2 py-1 rounded-full text-xs font-medium ${
                                debt.type === 'Utang' 
                                  ? 'bg-red-100 text-red-700' 
                                  : 'bg-green-100 text-green-700'
                              }`}>
                                {debt.type}
                              </span>
                            </td>
                            <td class="text-gray-600">{debt.method}</td>
                            <td class="text-gray-600">{formatDate(debt.date)}</td>
                            <td class="text-right font-semibold text-gray-800">
                              {formatCurrency(debt.amount)}
                            </td>
                            <td class="text-center">
                              <button
                                onClick={() => toggleDebtStatus(debt.id, debt.is_checked)}
                                disabled={updatingId() === debt.id}
                                class="relative"
                              >
                                <input 
                                  type="checkbox" 
                                  checked={debt.is_checked}
                                  disabled={updatingId() === debt.id}
                                  class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer disabled:cursor-not-allowed"
                                />
                                <Show when={updatingId() === debt.id}>
                                  <div class="absolute inset-0 flex items-center justify-center">
                                    <div class="w-3 h-3 border border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                  </div>
                                </Show>
                              </button>
                            </td>
                            <td class="text-center">
                              <button
                                onClick={() => deleteDebt(debt.id, debt.name)}
                                class="text-red-500 hover:text-red-700 text-sm font-medium px-2 py-1 rounded hover:bg-red-50 transition-colors"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        )}</For>
                      </tbody>
                    </table>
                  </div>
                </Show>
              </div>

              {/* Summary Info */}
              <Show when={debts().length > 0}>
                <div class="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <p class="text-sm text-blue-600 font-medium">Total Items</p>
                      <p class="text-lg font-semibold text-blue-800">{debts().length}</p>
                    </div>
                    <div>
                      <p class="text-sm text-blue-600 font-medium">Completed</p>
                      <p class="text-lg font-semibold text-blue-800">
                        {debts().filter(d => d.is_checked).length}
                      </p>
                    </div>
                    <div>
                      <p class="text-sm text-blue-600 font-medium">Pending</p>
                      <p class="text-lg font-semibold text-blue-800">
                        {debts().filter(d => !d.is_checked).length}
                      </p>
                    </div>
                    <div>
                      <p class="text-sm text-blue-600 font-medium">Completion</p>
                      <p class="text-lg font-semibold text-blue-800">
                        {debts().length > 0 ? Math.round((debts().filter(d => d.is_checked).length / debts().length) * 100) : 0}%
                      </p>
                    </div>
                  </div>
                </div>
              </Show>
            </Show>
          </div>
        </div>
      </div>
  );
};

export default AllData;