import { createSignal, For } from 'solid-js';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import pencil from '../assets/pencil-alt 1.png';
import profile from '../assets/1326226.jpeg';

const SettingPage = () => {
  const [sidebarOpen, setSidebarOpen] = createSignal(false);

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
          <Topbar toggleSidebar={() => setSidebarOpen(!sidebarOpen())} title="Setting" />
          <div class="p-4 sm:p-8 space-y-6">
            <div class="bg-white rounded-xl p-6 shadow">
              <h2 class="text-lg font-semibold font-inter text-yellow-500 mb-4">Edit Profile</h2>
              <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div class="md:col-span-3 flex justify-center">
                  <div class="relative">
                    <img src={profile} class="w-30 h-30 rounded-full object-cover" />
                    <button class="absolute top-24 right-2 w-6 h-6 bg-yellow-400 rounded-full text-white flex items-center justify-center text-xs">
                      <img src={pencil} alt="" />
                    </button>
                  </div>
                </div>
                <div class="md:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="text-sm text-hitam">Your Name</label>
                    <input type="text" class="w-full p-2 border border-gray-300 rounded-md bg-white" value="Charlene Reed" />
                  </div>
                  <div>
                    <label class="text-sm text-hitam">User Name</label>
                    <input type="text" class="w-full p-2 border border-gray-300 rounded-md bg-white" value="Charlene Reed" />
                  </div>
                  <div>
                    <label class="text-sm text-hitam">Email</label>
                    <input type="email" class="w-full p-2 border border-gray-300 rounded-md bg-white" value="charlenereed@gmail.com" />
                  </div>
                  <div>
                    <label class="text-sm text-hitam">Password</label>
                    <input type="password" class="w-full p-2 border border-gray-300 rounded-md bg-white" value="********" />
                  </div>
                  <div>
                    <label class="text-sm text-hitam">Date of Birth</label>
                    <input type="date" class="w-full p-2 border border-gray-300 rounded-md bg-white" />
                  </div>
                  <div>
                    <label class="text-sm text-hitam">Present Address</label>
                    <input type="text" class="w-full p-2 border border-gray-300 rounded-md bg-white" value="San Jose, California, USA" />
                  </div>
                  <div>
                    <label class="text-sm text-hitam">Permanent Address</label>
                    <input type="text" class="w-full p-2 border border-gray-300 rounded-md bg-white" value="San Jose, California, USA" />
                  </div>
                  <div>
                    <label class="text-sm text-hitam">City</label>
                    <input type="text" class="w-full p-2 border border-gray-300 rounded-md bg-white" value="San Jose" />
                  </div>
                  <div>
                    <label class="text-sm text-hitam">Postal Code</label>
                    <input type="text" class="w-full p-2 border border-gray-300 rounded-md bg-white" value="45962" />
                  </div>
                  <div>
                    <label class="text-sm text-hitam">Country</label>
                    <input type="text" class="w-full p-2 border border-gray-300 rounded-md bg-white" value="USA" />
                  </div>
                </div>
                <div class="md:col-span-12 flex justify-end mt-4">
                  <button class="bg-primer2 font-semibold font-inter text-white px-9 py-2 rounded-md mt-2">Save</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingPage;
