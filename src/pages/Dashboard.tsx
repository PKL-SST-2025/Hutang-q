import { For, createSignal, createResource, createEffect, onCleanup, onMount } from 'solid-js';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import Cards from '../components/Cards';
import { apiService, type Transaction, type DebtStats, type WeeklyActivityData, type BalanceHistoryData, type YearlyActivityData } from '../services/api';

interface TransactionDisplay {
  name: string;
  date: string;
  amount: string;
  color: string;
}

// Removed duplicate YearlyActivityData interface since it's already imported from api service

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = createSignal(false);
  const [sidebarExpanded, setSidebarExpanded] = createSignal(true);

  const handleSidebarToggle = (isOpen: boolean) => {
    setSidebarExpanded(isOpen);
  };

  // Fetch recent transactions
  const [recentTransactions, { refetch: refetchTransactions }] = createResource<TransactionDisplay[]>(async () => {
    try {
      const data = await apiService.getRecentTransactions();
      return data.map(transaction => ({
        name: transaction.name,
        date: new Date(transaction.date).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        }),
        amount: transaction.type === 'Utang' 
          ? `-${transaction.amount.toLocaleString()}` 
          : `+${transaction.amount.toLocaleString()}`,
        color: transaction.type === 'Utang' ? 'text-red-500' : 'text-green-500'
      }));
    } catch (error) {
      console.error('Failed to fetch recent transactions:', error);
      throw error;
    }
  });

  // Fetch debt stats
  const [debtStats, { refetch: refetchStats }] = createResource<DebtStats>(async () => {
    try {
      return await apiService.getDebtStats();
    } catch (error) {
      console.error('Failed to fetch debt stats:', error);
      throw error;
    }
  });

  // Fetch yearly activity data
  const [yearlyActivity, { refetch: refetchYearly }] = createResource<YearlyActivityData[]>(async () => {
    try {
      return await apiService.getYearlyActivity(3);
    } catch (error) {
      console.error('Failed to fetch yearly activity:', error);
      throw error;
    }
  });

  // Fetch balance history data
  const [balanceHistory, { refetch: refetchBalance }] = createResource<BalanceHistoryData[]>(async () => {
    try {
      return await apiService.getBalanceHistory(7);
    } catch (error) {
      console.error('Failed to fetch balance history:', error);
      throw error;
    }
  });

  // Simple Chart Components using Canvas
  const createYearlyChart = (canvasRef: HTMLCanvasElement, data: YearlyActivityData[]) => {
    const ctx = canvasRef.getContext('2d');
    if (!ctx || !data || data.length === 0) return;

    const width = canvasRef.width = canvasRef.offsetWidth * window.devicePixelRatio;
    const height = canvasRef.height = canvasRef.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const chartWidth = canvasRef.offsetWidth - 80;
    const chartHeight = canvasRef.offsetHeight - 100;
    const barWidth = 60;
    const barSpacing = 40;
    const startX = 60;
    const startY = 50;

    // Clear canvas
    ctx.clearRect(0, 0, canvasRef.offsetWidth, canvasRef.offsetHeight);

    // Find max value for scaling
    const maxValue = Math.max(
      ...data.map(d => Math.max(d.utang || 0, d.piutang || 0)),
      1000000 // Minimum scale
    );

    // Draw background
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, canvasRef.offsetWidth, canvasRef.offsetHeight);

    // Draw grid lines
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = startY + (chartHeight * i / 5);
      ctx.beginPath();
      ctx.moveTo(startX, y);
      ctx.lineTo(startX + chartWidth, y);
      ctx.stroke();
    }

    // Draw bars and labels
    data.forEach((item, index) => {
      const x = startX + (index * (barWidth * 2 + barSpacing));
      
      // Utang bar (red)
      const utangValue = item.utang || 0;
      const utangHeight = (utangValue / maxValue) * chartHeight;
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(x, startY + chartHeight - utangHeight, barWidth, utangHeight);
      
      // Piutang bar (green)
      const piutangValue = item.piutang || 0;
      const piutangHeight = (piutangValue / maxValue) * chartHeight;
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(x + barWidth + 5, startY + chartHeight - piutangHeight, barWidth, piutangHeight);
      
      // Year label
      ctx.fillStyle = '#374151';
      ctx.font = '14px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(item.year, x + barWidth, startY + chartHeight + 25);
      
      // Value labels on bars
      ctx.fillStyle = '#ffffff';
      ctx.font = '10px Inter, sans-serif';
      
      // Utang value
      if (utangHeight > 20) {
        ctx.fillText(
          `${Math.round(utangValue / 1000000)}M`,
          x + barWidth / 2,
          startY + chartHeight - utangHeight / 2 + 3
        );
      }
      
      // Piutang value
      if (piutangHeight > 20) {
        ctx.fillText(
          `${Math.round(piutangValue / 1000000)}M`,
          x + barWidth + 5 + barWidth / 2,
          startY + chartHeight - piutangHeight / 2 + 3
        );
      }
    });

    // Draw Y-axis labels
    ctx.fillStyle = '#6b7280';
    ctx.font = '12px Inter, sans-serif';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
      const value = (maxValue * (5 - i) / 5);
      const y = startY + (chartHeight * i / 5);
      ctx.fillText(`${Math.round(value / 1000000)}M`, startX - 10, y + 4);
    }

    // Draw legend
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(startX, startY - 35, 15, 15);
    ctx.fillStyle = '#374151';
    ctx.font = '12px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Utang', startX + 20, startY - 25);

    ctx.fillStyle = '#22c55e';
    ctx.fillRect(startX + 80, startY - 35, 15, 15);
    ctx.fillText('Piutang', startX + 100, startY - 25);

    // Chart title
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 14px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Yearly Financial Summary', canvasRef.offsetWidth / 2, 20);
  };

  const createBalanceChart = (canvasRef: HTMLCanvasElement, data: BalanceHistoryData[]) => {
    const ctx = canvasRef.getContext('2d');
    if (!ctx || !data || data.length === 0) return;

    const width = canvasRef.width = canvasRef.offsetWidth * window.devicePixelRatio;
    const height = canvasRef.height = canvasRef.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const chartWidth = canvasRef.offsetWidth - 80;
    const chartHeight = canvasRef.offsetHeight - 80;
    const startX = 50;
    const startY = 30;

    // Clear canvas
    ctx.clearRect(0, 0, canvasRef.offsetWidth, canvasRef.offsetHeight);

    // Find max and min values for scaling
    const values = data.map(d => d.balance || 0);
    const maxValue = Math.max(...values, 0);
    const minValue = Math.min(...values, 0);
    const range = Math.max(maxValue - minValue, 1000000); // Minimum range

    // Draw background
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, canvasRef.offsetWidth, canvasRef.offsetHeight);

    // Draw grid lines
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = startY + (chartHeight * i / 5);
      ctx.beginPath();
      ctx.moveTo(startX, y);
      ctx.lineTo(startX + chartWidth, y);
      ctx.stroke();
    }

    // Calculate points
    const points = data.map((item, index) => {
      const x = startX + (index * chartWidth / (data.length - 1));
      const normalizedValue = ((item.balance || 0) - minValue) / range;
      const y = startY + chartHeight - (normalizedValue * chartHeight);
      return { x, y, value: item.balance || 0, month: item.month };
    });

    // Draw line
    if (points.length > 1) {
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.stroke();

      // Draw fill area
      ctx.fillStyle = 'rgba(59, 130, 246, 0.1)';
      ctx.beginPath();
      ctx.moveTo(points[0].x, startY + chartHeight);
      ctx.lineTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.lineTo(points[points.length - 1].x, startY + chartHeight);
      ctx.closePath();
      ctx.fill();
    }

    // Draw points
    points.forEach(point => {
      ctx.fillStyle = '#3b82f6';
      ctx.beginPath();
      ctx.arc(point.x, point.y, 4, 0, 2 * Math.PI);
      ctx.fill();
      
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // Draw X-axis labels
    ctx.fillStyle = '#6b7280';
    ctx.font = '12px Inter, sans-serif';
    ctx.textAlign = 'center';
    data.forEach((item, index) => {
      const x = startX + (index * chartWidth / (data.length - 1));
      ctx.fillText(item.month || '', x, startY + chartHeight + 20);
    });

    // Draw Y-axis labels
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
      const value = minValue + (range * (5 - i) / 5);
      const y = startY + (chartHeight * i / 5);
      ctx.fillText(`${Math.round(value / 1000000)}M`, startX - 10, y + 4);
    }

    // Chart title
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 14px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Balance Trend', canvasRef.offsetWidth / 2, 20);
  };

  // Chart refs
  let yearlyChartRef: HTMLCanvasElement | undefined;
  let balanceChartRef: HTMLCanvasElement | undefined;

  // Initialize charts when data changes
  createEffect(() => {
    const yearlyData = yearlyActivity();
    if (yearlyData && !yearlyActivity.loading && yearlyChartRef) {
      setTimeout(() => createYearlyChart(yearlyChartRef!, yearlyData), 100);
    }
  });

  createEffect(() => {
    const balanceData = balanceHistory();
    if (balanceData && !balanceHistory.loading && balanceChartRef && balanceData.length > 0) {
      setTimeout(() => createBalanceChart(balanceChartRef!, balanceData), 100);
    }
  });

  return (
    <div class="bg-[#f8fafc] min-h-screen">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen() && (
        <div class="fixed inset-0 z-50 bg-black/40 md:hidden" onClick={() => setSidebarOpen(false)}>
          <div
            class="absolute left-0 top-0 bottom-0 w-2/3 sm:w-1/2"
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
        <Topbar toggleSidebar={() => setSidebarOpen(!sidebarOpen())} title="Dashboard" />
        <div class="p-8">
          <div class="grid grid-cols-1 gap-6">

            {/* Recent Transactions */}
            <div class="bg-white p-4 rounded-xl shadow">
              <div class="flex justify-between items-center mb-3">
                <h2 class="text-lg font-semibold">Recent Transaction</h2>
                <button 
                  class="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                  onClick={() => refetchTransactions()}
                >
                  Refresh
                </button>
              </div>
              {recentTransactions.loading ? (
                <div class="flex justify-center items-center py-8">
                  <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : recentTransactions.error ? (
                <div class="text-center py-8 text-red-500">
                  <p>Failed to load transactions</p>
                  <button 
                    class="mt-2 px-4 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                    onClick={() => refetchTransactions()}
                  >
                    Retry
                  </button>
                </div>
              ) : recentTransactions()?.length === 0 ? (
                <div class="text-center py-8 text-gray-500">
                  <p>No recent transactions</p>
                  <p class="text-sm mt-1">Start by adding your first debt or loan</p>
                </div>
              ) : (
                <div class="space-y-2">
                  <For each={recentTransactions()}>{(trx) => (
                    <div class="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg transition-colors">
                      <div class="flex items-center space-x-3">
                        <div class="w-3 h-3 rounded-full bg-yellow-400"></div>
                        <div>
                          <p class="text-sm font-medium text-gray-900">{trx.name}</p>
                          <p class="text-xs text-gray-400">{trx.date}</p>
                        </div>
                      </div>
                      <p class={`text-sm font-bold ${trx.color}`}>{trx.amount}</p>
                    </div>
                  )}</For>
                </div>
              )}
            </div>
          </div>

          {/* Stats Summary Cards */}
          <div class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-shadow">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-sm font-medium text-red-600">Total Utang</h3>
                  <p class="text-2xl font-bold text-red-600 mt-1">
                    {debtStats.loading ? (
                      <div class="animate-pulse bg-gray-200 h-8 w-24 rounded"></div>
                    ) : debtStats.error ? (
                      <span class="text-sm">Error</span>
                    ) : (
                      `Rp ${debtStats()?.utang?.toLocaleString() || '0'}`
                    )}
                  </p>
                </div>
                <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                  </svg>
                </div>
              </div>
            </div>

            <div class="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-shadow">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-sm font-medium text-green-600">Total Piutang</h3>
                  <p class="text-2xl font-bold text-green-600 mt-1">
                    {debtStats.loading ? (
                      <div class="animate-pulse bg-gray-200 h-8 w-24 rounded"></div>
                    ) : debtStats.error ? (
                      <span class="text-sm">Error</span>
                    ) : (
                      `Rp ${debtStats()?.piutang?.toLocaleString() || '0'}`
                    )}
                  </p>
                </div>
                <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
                  </svg>
                </div>
              </div>
            </div>

            <div class="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-shadow">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-sm font-medium text-blue-600">Net Balance</h3>
                  <p class={`text-2xl font-bold mt-1 ${
                    (debtStats()?.total || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {debtStats.loading ? (
                      <div class="animate-pulse bg-gray-200 h-8 w-24 rounded"></div>
                    ) : debtStats.error ? (
                      <span class="text-sm">Error</span>
                    ) : (
                      `Rp ${debtStats()?.total?.toLocaleString() || '0'}`
                    )}
                  </p>
                </div>
                <div class={`w-12 h-12 rounded-full flex items-center justify-center ${
                  (debtStats()?.total || 0) >= 0 ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  <svg class={`w-6 h-6 ${
                    (debtStats()?.total || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Yearly Activity Chart */}
          <div class="mt-8 bg-white p-6 rounded-xl shadow">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-lg font-semibold">Yearly Financial Activity</h2>
              <button 
                class="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                onClick={() => {
                  refetchYearly();
                  setTimeout(() => {
                    if (yearlyChartRef && yearlyActivity()) {
                      createYearlyChart(yearlyChartRef, yearlyActivity()!);
                    }
                  }, 100);
                }}
              >
                Refresh
              </button>
            </div>
            {yearlyActivity.loading ? (
              <div class="flex justify-center items-center h-64">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : yearlyActivity.error ? (
              <div class="text-center py-8 text-red-500">
                <p>Failed to load yearly activity</p>
                <button 
                  class="mt-2 px-4 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                  onClick={() => refetchYearly()}
                >
                  Retry
                </button>
              </div>
            ) : yearlyActivity()?.length === 0 ? (
              <div class="text-center py-12 text-gray-500">
                <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
                <p>No yearly data available</p>
                <p class="text-sm mt-1">Data will appear as you add transactions over multiple years</p>
              </div>
            ) : (
              <canvas 
                ref={yearlyChartRef} 
                class="w-full h-64 cursor-pointer hover:opacity-90 transition-opacity"
                style={{ height: '256px' }}
              ></canvas>
            )}
          </div>

          {/* Balance History Chart */}
          <div class="mt-8 bg-white p-6 rounded-xl shadow">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-lg font-semibold">Balance History</h2>
              <button 
                class="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                onClick={() => {
                  refetchBalance();
                  setTimeout(() => {
                    if (balanceChartRef && balanceHistory()) {
                      createBalanceChart(balanceChartRef, balanceHistory()!);
                    }
                  }, 100);
                }}
              >
                Refresh
              </button>
            </div>
            {balanceHistory.loading ? (
              <div class="flex justify-center items-center h-64">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : balanceHistory.error ? (
              <div class="text-center py-8 text-red-500">
                <p>Failed to load balance history</p>
                <button 
                  class="mt-2 px-4 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                  onClick={() => refetchBalance()}
                >
                  Retry
                </button>
              </div>
            ) : balanceHistory()?.length > 0 ? (
              <canvas 
                ref={balanceChartRef} 
                class="w-full h-64 cursor-pointer hover:opacity-90 transition-opacity"
                style={{ height: '256px' }}
              ></canvas>
            ) : (
              <div class="text-center py-12 text-gray-500">
                <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
                <p>No balance history available</p>
                <p class="text-sm mt-1">Data will appear as you add more transactions</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;