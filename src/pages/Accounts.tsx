import { createSignal, For } from 'solid-js';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import MyCard from '../components/Cards';
import group from "../assets/Group.png";
import medical from "../assets/001-medical.png";
import saving from "../assets/003-saving.png";

const Accounts = () => {
  const [sidebarOpen, setSidebarOpen] = createSignal(false);

  const cardInfo = {
    utang: 'Rp. 5,756',
    cardHolder: 'Alfazri Maulana',
    pinjaman: 'Rp.10.000'
  };

  const summary = [
    { label: 'Utang', amount: 'Rp.500.000', color: 'text-[#718EBF]', background: 'bg-[#E7EDFF]' , icon: group },
    { label: 'Piutang', amount: 'Rp.10.000', color: 'text-[#FF82AC]', background: 'bg-[#FFE0EB]' , icon: medical },
    { label: 'Total Utang', amount: 'Rp.155.000', color: 'text-[#16DBCC]', background: 'bg-[#DCFAF8]' , icon: saving }
  ];

  const transactions = [
    { name: 'Albertus Christ', type: 'Meminjamkan', method: 'Cash', status: 'Pending', amount: '-Rp.10.000', date: '25 Jan 2021' },
    { name: 'Johnson', type: 'Membayar', method: 'Transfer', status: 'Completed', amount: 'Rp.150.000', date: '25 Jan 2021' },
    { name: 'Johnson', type: 'Utang', method: 'Transfer', status: 'Pending', amount: '-Rp.150.000', date: '25 Jan 2021' }
  ];

  const chartData = [
    { day: 'Sat', cash: 180, transfer: 300 },
    { day: 'Sun', cash: 250, transfer: 150 },
    { day: 'Mon', cash: 230, transfer: 280 },
    { day: 'Tue', cash: 300, transfer: 180 },
    { day: 'Wed', cash: 220, transfer: 300 },
    { day: 'Thu', cash: 240, transfer: 260 },
    { day: 'Fri', cash: 260, transfer: 320 }
  ];

  return (
    <div class="relative bg-[#f8fafc] min-h-screen">
      {sidebarOpen() && (
        <div class="fixed inset-0 z-50 bg-black/40 md:hidden" onClick={() => setSidebarOpen(false)}>
          <div
            class="absolute left-0 top-0 bottom-0 w-2/3 sm:w-1/2 bg-white shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar />
          </div>
        </div>
      )}

      <div class="md:flex">
        <div class="hidden md:block">
          <Sidebar />
        </div>
        <div class="flex-1">
          <Topbar toggleSidebar={() => setSidebarOpen(!sidebarOpen())} title="Accounts" />
          <div class="p-4 sm:p-8 space-y-6">
            {/* Summary Boxes */}
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <For each={summary}>{(item) => (
                <div class='bg-white shadow-sm rounded-xl p-4 flex justify-center gap-8'>
                  <div class={`flex justify-center p-3 w-14 h-14 rounded-full ${item.background}`}>
                    <img src={item.icon} class="w-7 h-7 object-contain" alt="" />
                  </div>
                  <div class=' text-center font-medium  font-inter'>
                    <p class={`${item.color}`}>{item.label}</p>
                    <h2 class="text-lg font-inter font-semibold mt-2">{item.amount}</h2>
                  </div>
                </div>
              )}</For>
            </div>

            {/* Transaction + Card */}
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="bg-white rounded-xl p-6 shadow">
                <h2 class="text-lg font-inter text-secondary font-semibold mb-4">Last Transaction</h2>
                <For each={transactions}>{(trx) => (
                  <div class="flex items-center justify-between py-1 text-sm">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 bg-red-100 rounded-full" />
                      <div class='font-inter'>
                        <p class="font-medium text-hitam">{trx.name}</p>
                        <p class="text-xs text-gray-400">{trx.date}</p>
                      </div>
                    </div>
                    <div class="text-right font-inter">
                      <p class='text-hitam'>{trx.type}</p>
                      <p class="text-blue-500 text-xs inline-block mr-1">{trx.method}</p>
                      <span class={`text-xs ${trx.status === 'Pending' ? 'text-yellow-500' : 'text-green-500'}`}>{trx.status}</span>
                      <p class={`text-sm font-medium ${trx.amount.includes('-') ? 'text-red-500' : 'text-green-500'}`}>{trx.amount}</p>
                    </div>
                  </div>
                )}</For>
              </div>
              <MyCard
                utang={cardInfo.utang}
                pinjaman={cardInfo.pinjaman}
                cardHolder={cardInfo.cardHolder}
              />
            </div>

            {/* Cash & Transfer Overview */}
            <div class="bg-white rounded-xl p-6 shadow">
                <div class='flex justify-between'>
                    <h2 class="text-lg font-semibold mb-4 font-inter text-secondary">Cash & Transfer Overview</h2>
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

          </div>
        </div>
      </div>
    </div>
  );
};

export default Accounts;
