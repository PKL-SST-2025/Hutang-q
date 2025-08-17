import { createSignal, Show, onMount } from 'solid-js';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import pencil from '../assets/pencil-alt 1.png';
import profile from '../assets/1326226.jpeg';

const SettingPage = () => {
  const [sidebarOpen, setSidebarOpen] = createSignal(false);
  const [sidebarExpanded, setSidebarExpanded] = createSignal(true);
  const [editMode, setEditMode] = createSignal(false);
  
  // User data signals
  const [fullName, setFullName] = createSignal('');
  const [email, setEmail] = createSignal('');
  const [password, setPassword] = createSignal('');
  const [dateOfBirth, setDateOfBirth] = createSignal('');
  const [address, setAddress] = createSignal('');
  const [city, setCity] = createSignal('');
  const [postalCode, setPostalCode] = createSignal('');
  const [country, setCountry] = createSignal('');
  
  // Loading and error states
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal('');
  const [success, setSuccess] = createSignal('');

  const handleSidebarToggle = (isOpen: boolean) => {
    setSidebarExpanded(isOpen);
  };

  // Fetch user data
  const fetchUserData = async () => {
    const token = localStorage.getItem("token");
    
    console.log("Token from localStorage:", token); // Debug log
    
    if (!token) {
      setError("No authentication token found. Please login again.");
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      console.log("Making request to:", "http://localhost:3000/api/user/settings"); // Debug log
      
      const res = await fetch("http://localhost:3000/api/user/settings", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Response status:", res.status); // Debug log
      console.log("Response headers:", Object.fromEntries(res.headers.entries())); // Debug log

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Error response:", errorText);
        
        if (res.status === 401) {
          setError("Authentication failed. Please login again.");
          localStorage.removeItem("token"); // Clear invalid token
          // Redirect to login
          setTimeout(() => window.location.href = "/signin", 2000);
        } else {
          setError(`Failed to load user data: ${res.status} - ${errorText}`);
        }
        return;
      }

      const user = await res.json();
      console.log("User data received:", user);

      // Set the signals with fetched data
      setFullName(user.full_name || '');
      setEmail(user.email || '');
      setDateOfBirth(user.date_of_birth || '');
      setAddress(user.address || '');
      setCity(user.city || '');
      setPostalCode(user.postal_code || '');
      setCountry(user.country || '');
      
    } catch (err) {
      console.error("Network error:", err);
      setError("Network error occurred. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  // Save user data
  const handleSave = async () => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      setError("No authentication token found");
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      // Prepare data object - only send fields that have values
      const updateData: any = {};
      
      if (fullName().trim()) updateData.full_name = fullName().trim();
      if (email().trim()) updateData.email = email().trim();
      if (password().trim()) updateData.password = password().trim();
      if (dateOfBirth()) updateData.date_of_birth = dateOfBirth();
      if (address().trim()) updateData.address = address().trim();
      if (city().trim()) updateData.city = city().trim();
      if (postalCode().trim()) updateData.postal_code = postalCode().trim();
      if (country().trim()) updateData.country = country().trim();

      console.log("Sending data:", updateData);

      const response = await fetch('http://localhost:3000/api/user/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to update user settings:", errorText);
        setError(`Failed to save: ${response.status} ${response.statusText}`);
        return;
      }

      const data = await response.json();
      console.log("Save response:", data);
      
      setSuccess("Profile updated successfully!");
      setEditMode(false);
      
      // Clear password field after successful save
      setPassword('');
      
      // Refresh user data
      await fetchUserData();
      
    } catch (err) {
      console.error("Error saving user data:", err);
      setError("Network error occurred while saving");
    } finally {
      setLoading(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    // Redirect to login page or home
    window.location.href = "/signin";
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long', 
      year: 'numeric'
    });
  };

  // Load user data on mount
  onMount(() => {
    fetchUserData();
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
            <div class="bg-white rounded-xl p-6 shadow">
              
              {/* Error and Success Messages */}
              {error() && (
                <div class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error()}
                </div>
              )}
              
              {success() && (
                <div class="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                  {success()}
                </div>
              )}
              
              {loading() && (
                <div class="mb-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded">
                  Loading...
                </div>
              )}

              <Show when={editMode()} fallback={
                // Profile View Mode
                <div>
                  <div class="flex justify-between items-center mb-6">
                    <h2 class="text-lg font-semibold font-inter text-yellow-500">Profile</h2>
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div class="md:col-span-3 flex justify-center">
                      <img src={profile} class="w-32 h-32 rounded-full object-cover" />
                    </div>
                    <div class="md:col-span-9">
                      <p class="text-3xl font-semibold text-hitam font-montserrat">
                        {fullName() || 'No name set'}
                      </p>
                      <p class="text-xl text-primer2 font-montserrat font-semibold mb-1">
                        {fullName() ? fullName().split(' ')[0] : 'User'}
                      </p>
                      <p class="text-sm font-light font-montserrat mb-2">
                        {formatDate(dateOfBirth()) || 'No birth date set'}
                      </p>
                      <div class="grid grid-cols-2 gap-4 text-sm mt-5">
                        <div>
                          <p class="font-semibold text-primer2 text-lg">Email :</p>
                          <p class='font-light text-base'>{email() || 'No email set'}</p>
                        </div>
                        <div>
                          <p class="font-semibold text-primer2 text-lg">Password :</p>
                          <p class='font-light text-base'>**********</p>
                        </div>
                      </div>
                      <div class="mt-5">
                        <p class="font-semibold text-lg text-primer2">Address :</p>
                        <p class="text-base font-light">
                          {address() && city() && postalCode() && country() 
                            ? `${address()}, ${city()}, ${postalCode()}, ${country()}`
                            : 'No address set'
                          }
                        </p>
                      </div>
                      <div class="flex gap-4 justify-end mt-9">
                        <button 
                          class="bg-red-500 font-montserrat text-white px-4 py-2 rounded-md hover:bg-red-600"
                          onClick={handleLogout}
                        >
                          Logout
                        </button>
                        <button 
                          class="bg-yellow-500 font-montserrat text-white px-4 py-2 rounded-md hover:bg-yellow-600" 
                          onClick={() => setEditMode(true)}
                          disabled={loading()}
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              }>
                {/* Edit Profile Mode */}
                <div>
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
                        <label class="text-sm text-hitam">Full Name</label>
                        <input 
                          type="text" 
                          class="w-full p-2 border border-gray-300 rounded-md bg-white"
                          value={fullName()} 
                          onInput={(e) => setFullName(e.currentTarget.value)}
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <label class="text-sm text-hitam">Email</label>
                        <input 
                          type="email" 
                          class="w-full p-2 border border-gray-300 rounded-md bg-white" 
                          value={email()} 
                          onInput={(e) => setEmail(e.currentTarget.value)}
                          placeholder="Enter your email"
                        />
                      </div>
                      <div>
                        <label class="text-sm text-hitam">Password (leave blank to keep current)</label>
                        <input 
                          type="password" 
                          class="w-full p-2 border border-gray-300 rounded-md bg-white" 
                          value={password()} 
                          onInput={(e) => setPassword(e.currentTarget.value)}
                          placeholder="Enter new password"
                        />
                      </div>
                      <div>
                        <label class="text-sm text-hitam">Date of Birth</label>
                        <input 
                          type="date" 
                          class="w-full p-2 border border-gray-300 rounded-md bg-white" 
                          value={dateOfBirth()} 
                          onInput={(e) => setDateOfBirth(e.currentTarget.value)}
                        />
                      </div>
                      <div>
                        <label class="text-sm text-hitam">Address</label>
                        <input 
                          type="text" 
                          class="w-full p-2 border border-gray-300 rounded-md bg-white" 
                          value={address()} 
                          onInput={(e) => setAddress(e.currentTarget.value)}
                          placeholder="Enter your address"
                        />
                      </div>
                      <div>
                        <label class="text-sm text-hitam">City</label>
                        <input 
                          type="text" 
                          class="w-full p-2 border border-gray-300 rounded-md bg-white" 
                          value={city()} 
                          onInput={(e) => setCity(e.currentTarget.value)}
                          placeholder="Enter your city"
                        />
                      </div>
                      <div>
                        <label class="text-sm text-hitam">Postal Code</label>
                        <input 
                          type="text" 
                          class="w-full p-2 border border-gray-300 rounded-md bg-white" 
                          value={postalCode()} 
                          onInput={(e) => setPostalCode(e.currentTarget.value)}
                          placeholder="Enter postal code"
                        />
                      </div>
                      <div>
                        <label class="text-sm text-hitam">Country</label>
                        <input 
                          type="text" 
                          class="w-full p-2 border border-gray-300 rounded-md bg-white" 
                          value={country()} 
                          onInput={(e) => setCountry(e.currentTarget.value)}
                          placeholder="Enter your country"
                        />
                      </div>
                    </div>
                    <div class="md:col-span-12 flex justify-end mt-4 gap-4">
                      <button 
                        class="bg-gray-300 font-semibold font-inter text-black px-9 py-2 rounded-md hover:bg-gray-400" 
                        onClick={() => {
                          setEditMode(false);
                          setError('');
                          setSuccess('');
                          setPassword(''); // Clear password when canceling
                        }}
                        disabled={loading()}
                      >
                        Cancel
                      </button>
                      <button 
                        class="bg-primer2 font-semibold font-inter text-white px-9 py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400" 
                        onClick={handleSave}
                        disabled={loading()}
                      >
                        {loading() ? 'Saving...' : 'Save'}
                      </button>
                    </div>
                  </div>
                </div>
              </Show>
            </div>
          </div>
        </div>
      </div>
  );
};

export default SettingPage;