import { createSignal, For, Show } from 'solid-js';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

const AddData = () => {
  const [sidebarOpen, setSidebarOpen] = createSignal(false);
  const [sidebarExpanded, setSidebarExpanded] = createSignal(true);
  const [activeTab, setActiveTab] = createSignal('utang');
  
  // Form signals untuk Utang/Piutang
  const [formData, setFormData] = createSignal({
    name: '',
    method: '',
    date: '',
    amount: ''
  });
  
  // Loading dan error states
  const [isLoading, setIsLoading] = createSignal(false);
  const [message, setMessage] = createSignal({ text: '', type: '' });

  const tabs = [
    { label: 'Add Utang', key: 'utang' },
    { label: 'Add Piutang', key: 'piutang' }
  ];

  const handleSidebarToggle = (isOpen: boolean) => {
    setSidebarExpanded(isOpen);
  };

  // Helper function untuk mendapatkan JWT token
  const getAuthToken = () => {
    return localStorage.getItem('token') || localStorage.getItem('authToken') || sessionStorage.getItem('token');
  };

  // Helper function untuk update form data
  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Submit handler untuk Utang/Piutang
  const handleSubmitDebt = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: '', type: '' });

    const token = getAuthToken();
    if (!token) {
      setMessage({ text: 'Please login first', type: 'error' });
      setIsLoading(false);
      return;
    }

    // Validasi form
    const { name, method, date, amount } = formData();
    if (!name || !method || !date || !amount) {
      setMessage({ text: 'Please fill all fields', type: 'error' });
      setIsLoading(false);
      return;
    }

    // Validasi amount
    const amountNum = parseInt(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setMessage({ text: 'Amount must be a positive number', type: 'error' });
      setIsLoading(false);
      return;
    }

    // Tentukan type berdasarkan active tab
    const type = activeTab() === 'utang' ? 'Utang' : 'Meminjamkan';

    // Format date ke format yang Rust NaiveDateTime pahami
    // HTML date input format: "2025-08-11" -> perlu dikonversi ke "2025-08-11T00:00:00"
    let formattedDate;
    try {
      if (date.includes('T')) {
        // Sudah dalam format datetime
        formattedDate = date;
      } else {
        // Masih format date saja, tambahkan waktu
        formattedDate = `${date}T00:00:00`;
      }
      
      // Validasi apakah date valid
      const dateTest = new Date(formattedDate);
      if (isNaN(dateTest.getTime())) {
        throw new Error('Invalid date');
      }
    } catch (error) {
      setMessage({ text: 'Invalid date format', type: 'error' });
      setIsLoading(false);
      return;
    }

    // Format data untuk API - pastikan sesuai dengan struct CreateDebt
    const payload = {
      name: name.trim(),
      type: type,
      method: method,
      date: formattedDate, // Format: "2025-08-11T00:00:00"
      amount: amountNum
    };

    console.log('Sending payload:', payload);

    try {
      const response = await fetch('/api/debts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        console.error('Non-JSON response:', textResponse);
        throw new Error(`Server returned non-JSON response: ${textResponse.substring(0, 100)}...`);
      }

      const result = await response.json();
      console.log('Response data:', result);

      if (response.ok) {
        setMessage({ 
          text: `${type} "${name}" berhasil ditambahkan dengan amount ${new Intl.NumberFormat('id-ID').format(amountNum)}!`, 
          type: 'success' 
        });
        
        // Reset form
        setFormData({
          name: '',
          method: '',
          date: '',
          amount: ''
        });
      } else {
        // Handle different error status codes
        let errorMessage = 'Terjadi kesalahan';
        if (response.status === 401) {
          errorMessage = 'Unauthorized - Please login again';
        } else if (response.status === 422) {
          errorMessage = result.error || 'Invalid data format';
        } else if (response.status === 500) {
          errorMessage = 'Server error - Please try again later';
        } else {
          errorMessage = result.error || `HTTP ${response.status} Error`;
        }
        
        setMessage({ 
          text: errorMessage, 
          type: 'error' 
        });
      }
    } catch (error) {
      console.error('Error submitting debt:', error);
      
      let errorMessage = 'Terjadi kesalahan koneksi';
      if (error.message.includes('fetch')) {
        errorMessage = 'Cannot connect to server - Make sure backend is running';
      } else if (error.message.includes('JSON')) {
        errorMessage = 'Server response format error';
      } else {
        errorMessage = error.message;
      }
      
      setMessage({ 
        text: errorMessage, 
        type: 'error' 
      });
    } finally {
      setIsLoading(false);
    }
  };
  // Clear message setelah tab berubah
  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    setMessage({ text: '', type: '' });
  };

  const renderUtangPiutangForm = () => (
    <form onSubmit={handleSubmitDebt} class="grid grid-cols-1 md:grid-cols-2 gap-11">
      <div>
        <label class="text-sm font-inter text-gray-500">Name *</label>
        <input 
          type="text" 
          placeholder="Enter name here" 
          class="w-full p-2 border border-blue-100 rounded-md bg-white focus:border-blue-300 focus:outline-none"
          value={formData().name}
          onInput={(e) => updateFormData('name', e.target.value)}
          required
        />
      </div>
      <div>
        <label class="text-sm font-inter text-gray-500">Date *</label>
        <input 
          type="date" 
          class="w-full p-2 border border-blue-100 rounded-md bg-white focus:border-blue-300 focus:outline-none"
          value={formData().date}
          onInput={(e) => updateFormData('date', e.target.value)}
          max={new Date().toISOString().split('T')[0]} // Maksimal hari ini
          required
        />
      </div>
      <div>
        <label class="text-sm font-inter text-gray-500">Method *</label>
        <select 
          class="w-full p-2 border border-blue-100 rounded-md bg-white focus:border-blue-300 focus:outline-none"
          value={formData().method}
          onChange={(e) => updateFormData('method', e.target.value)}
          required
        >
          <option value="">Choose here</option>
          <option value="Cash">Cash</option>
          <option value="Transfer">Transfer</option>
          <option value="E-Wallet">E-Wallet</option>
          <option value="Credit Card">Credit Card</option>
        </select>
      </div>
      <div>
        <label class="text-sm font-inter text-gray-500">Amount *</label>
        <input 
          type="number" 
          placeholder="Enter an amount here" 
          class="w-full p-2 border border-blue-100 rounded-md bg-white focus:border-blue-300 focus:outline-none"
          value={formData().amount}
          onInput={(e) => updateFormData('amount', e.target.value)}
          min="1"
          step="1"
          required
        />
      </div>
      
      {/* Type indicator */}
      <div class="md:col-span-2">
        <div class="bg-blue-50 p-3 rounded-md border border-blue-200">
          <span class="text-sm font-inter text-blue-700">
            Type: <strong>{activeTab() === 'utang' ? 'Utang' : 'Meminjamkan'}</strong>
          </span>
        </div>
      </div>

      <div class="md:col-span-2 py-5 flex justify-end">
        <button 
          type="submit" 
          class="bg-primer2 font-inter font-semibold text-white px-9 py-2 rounded-md mt-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-opacity-90 transition-all"
          disabled={isLoading()}
        >
          {isLoading() ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );

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
            <div class="bg-white rounded-xl p-6 shadow">
              {/* Success/Error Message */}
              <Show when={message().text}>
                <div class={`mb-4 p-3 rounded-md ${
                  message().type === 'success' 
                    ? 'bg-green-50 border border-green-200 text-green-700' 
                    : message().type === 'error'
                    ? 'bg-red-50 border border-red-200 text-red-700'
                    : 'bg-blue-50 border border-blue-200 text-blue-700'
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

              {/* Tabs */}
              <div class="flex space-x-6 mb-4">
                <For each={tabs}>{(tab) => (
                  <button
                    class={`pb-2 font-medium font-inter transition-colors ${
                      activeTab() === tab.key
                        ? 'text-secondary border-b-2 border-primer2'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => handleTabChange(tab.key)}
                  >
                    {tab.label}
                  </button>
                )}</For>
              </div>

              {/* Tab Content */}
              <Show when={activeTab() === 'utang'}>{renderUtangPiutangForm()}</Show>
              <Show when={activeTab() === 'piutang'}>{renderUtangPiutangForm()}</Show>
            </div>
          </div>
        </div>
      </div>
  );
};

export default AddData;