import { createSignal, For } from 'solid-js';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import Cards from '../components/Cards';
import { AgGridSolid } from 'ag-grid-solid';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';


const Transaction = () => {
  const [sidebarOpen, setSidebarOpen] = createSignal(false);
  const [sidebarExpanded, setSidebarExpanded] = createSignal(true);

  const spending = [
    { month: 'Aug', amount: 16000 },
    { month: 'Sep', amount: 10000 },
    { month: 'Oct', amount: 3500 },
    { month: 'Nov', amount: 6000 },
    { month: 'Dec', amount: 12500 },
    { month: 'Jan', amount: 5000 },
  ];

  const transactions = [
    { name: 'Albertus Christ', type: 'Meminjamkan', method: 'Cash', date: '28 Jan, 12:30 AM', amount: 'Rp.10.000' },
    { name: 'Jonhson', type: 'Meminjamkan', method: 'Transfer', date: '25 Jan, 10:40 PM', amount: 'Rp.10.000' },
    { name: 'Jonhson', type: 'Utang', method: 'Cash', date: '19 Jan, 03:29 PM', amount: 'Rp.5.000' },
    { name: 'Emily', type: 'Utang', method: 'Cash', date: '15 Jan, 03:29 PM', amount: 'Rp.5.000' },
    { name: 'Emily', type: 'Utang', method: 'Cash', date: '14 Jan, 10:40 PM', amount: 'Rp.5.000' },
  ];

  const handleSidebarToggle = (isOpen: boolean) => {
    setSidebarExpanded(isOpen);
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
        <div class="p-4 sm:p-8 space-y-8">
            {/* My Card & Chart */}
            <div class="grid md:grid-cols-2 gap-6">
              <Cards/>

              <div class="bg-white rounded-xl p-6 shadow">
                <h2 class="text-xl font-inter font-semibold text-secondary mb-4">Pengeluaran</h2>
                <div class="flex items-end justify-between h-32">
                  <For each={spending}>{(item) => (
                    <div class="flex flex-col items-center">
                      <div
                        class={`w-12 rounded-md bg-primer2 ${item.amount === 12500 ? 'h-24' : 'h-16'} transition-all`}
                        style={{ height: `${item.amount / 200}px` }}
                      ></div>
                      <span class="text-xs mt-2 text-gray-500">{item.month}</span>
                    </div>
                  )}</For>
                </div>
              </div>
            </div>

            {/* Table Transactions */}
            <div class="bg-white rounded-xl p-6 shadow">
              <div class="flex justify-between items-center mb-4">
                <h2 class="text-xl font-inter font-semibold text-secondary">Recent Transactions</h2>
                <a href="/AllData" class="text-sm font-medium font-inter text-yellow-500 hover:underline">See All</a>
              </div>
              <div class="overflow-x-auto">
                <table class="min-w-full text-sm">
                  <thead>
                    <tr class="text-left font-inter font-medium text-gray-500 border-b border-gray-200">
                      <th class="py-2">Name</th>
                      <th>Type</th>
                      <th>Method</th>
                      <th class='md:pl-8'>Date</th>
                      <th>Amount</th>
                      <th>Check</th>
                    </tr>
                  </thead>
                  <tbody>
                    <For each={transactions}>{(trx) => (
                      <tr class="border-b border-gray-100 font-inte text-hitam">
                        <td class="py-5">{trx.name}</td>
                        <td>{trx.type}</td>
                        <td>{trx.method}</td>
                        <td class='text-nowrap'>{trx.date}</td>
                        <td class="font-medium">{trx.amount}</td>
                        <td class='md:pl-4'><input type="checkbox" /></td>
                      </tr>
                    )}</For>
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </div>
  );
};

export default Transaction;
