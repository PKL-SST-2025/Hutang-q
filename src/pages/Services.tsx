import { createSignal } from 'solid-js';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import ToggleSwitch from '../components/ToggleSwitch';

const Services = () => {
 const [sidebarOpen, setSidebarOpen] = createSignal(false);
  const [sidebarExpanded, setSidebarExpanded] = createSignal(true);
  const [currency, setCurrency] = createSignal('USD');
  const [timezone, setTimezone] = createSignal('(GMT-12:00) International Date Line West');
  const [notif1, setNotif1] = createSignal();
  const [notif2, setNotif2] = createSignal();
  const [notif3, setNotif3] = createSignal();

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
          <div class="p-4 sm:p-8">
            <div class="bg-white rounded-xl p-6 shadow">
              <h2 class="text-lg font-semibold text-yellow-500 mb-4 border-b pb-2">Preferences</h2>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label class="block text-hitam font-inter mb-1">Currency</label>
                  <input
                    type="text"
                    class="w-full border text-gray-400 border-gray-200 rounded-md bg-white p-2"
                    value={currency()}
                    onInput={(e) => setCurrency(e.currentTarget.value)}
                  />
                </div>

                <div>
                  <label class="block text-hitam font-inter mb-1">Time Zone</label>
                  <input
                    type="text"
                    class="w-full border text-gray-400 border-gray-200 rounded-md bg-white p-2"
                    value={timezone()}
                    onInput={(e) => setTimezone(e.currentTarget.value)}
                  />
                </div>
              </div>

              <div class="space-y-4">
                <div class="flex items-center space-x-4">
                  <ToggleSwitch/>
                  <span>I send or receive digital currency</span>
                </div>
                <div class="flex items-center space-x-4">
                  <ToggleSwitch/>
                  <span>I receive merchant order</span>
                </div>
                <div class="flex items-center space-x-4">
                  <ToggleSwitch/>
                  <span>There are recommendations for my account</span>
                </div>
              </div>

              <div class="flex justify-end mt-6">
                <button type="submit" class="bg-primer2 font-semibold font-inter text-white px-9 py-2 rounded-md mt-2">Save</button>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Services;
