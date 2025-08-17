import { createSignal, onMount } from 'solid-js';

type MyCardProps = {
  // Props bisa dikosongkan karena data akan diambil dari API
};

const MyCard = (props: MyCardProps) => {
  const [utang, setUtang] = createSignal('Rp 0');
  const [pinjaman, setPinjaman] = createSignal('Rp 0');
  const [cardHolder, setCardHolder] = createSignal('Loading...');
  const [isLoading, setIsLoading] = createSignal(true);

  // Helper function untuk mendapatkan JWT token
  const getAuthToken = () => {
    return localStorage.getItem('token') || localStorage.getItem('authToken') || sessionStorage.getItem('token');
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

  // Fetch debt statistics dari API
  const fetchStats = async () => {
    const token = getAuthToken();
    if (!token) {
      console.error('No token found');
      return;
    }

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
        console.log('Stats loaded:', data);
        
        // Update state dengan formatted currency
        setUtang(formatCurrency(data.utang));
        setPinjaman(formatCurrency(data.piutang));
      } else {
        console.error('Failed to fetch stats');
        setUtang('Rp 0');
        setPinjaman('Rp 0');
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      setUtang('Rp 0');
      setPinjaman('Rp 0');
    }
  };

  // Fetch user settings untuk mendapatkan full_name
  const fetchUserSettings = async () => {
    const token = getAuthToken();
    if (!token) {
      console.error('No token found');
      setCardHolder('Unknown User');
      return;
    }

    try {
      const response = await fetch('/api/user/settings', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('User settings loaded:', data);
        
        // Set card holder name dari full_name, fallback ke email jika full_name kosong
        const name = data.full_name || data.email || 'Unknown User';
        setCardHolder(name.toUpperCase()); // Card holder biasanya uppercase
      } else {
        console.error('Failed to fetch user settings');
        setCardHolder('Unknown User');
      }
    } catch (error) {
      console.error('Error fetching user settings:', error);
      setCardHolder('Unknown User');
    }
  };

  // Load data saat component mount
  onMount(async () => {
    setIsLoading(true);
    await Promise.all([fetchStats(), fetchUserSettings()]);
    setIsLoading(false);
  });

  return (
    <div class="bg-gradient-to-br from-yellow-300 to-orange-400 rounded-xl shadow text-white flex flex-col min-h-[12rem]">
      <div class="flex-1 px-6 pt-6 pb-6">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-sm">Utang</p>
            <h2 class="text-2xl font-bold">
              {isLoading() ? (
                <div class="inline-block animate-pulse bg-white/20 rounded w-20 h-8"></div>
              ) : (
                utang()
              )}
            </h2>
            <p class="mt-2 text-sm">Piutang</p>
            <h2 class="text-2xl font-bold">
              {isLoading() ? (
                <div class="inline-block animate-pulse bg-white/20 rounded w-20 h-8"></div>
              ) : (
                pinjaman()
              )}
            </h2>
          </div>
          <a 
            class="text-xs hover:underline transition-all hover:text-yellow-100" 
            href="/AddData"
          >
            + Add Transaksi
          </a>
        </div>
      </div>
      <div class="h-20 w-full px-6 pt-5 rounded-xl bg-white/20 backdrop-blur-md">
        <p class="text-sm text-white">CARD HOLDER</p>
        <p class="text-md font-semibold text-white">
          {isLoading() ? (
            <div class="inline-block animate-pulse bg-white/20 rounded w-32 h-6"></div>
          ) : (
            cardHolder()
          )}
        </p>
      </div>
    </div>
  );
};

export default MyCard;