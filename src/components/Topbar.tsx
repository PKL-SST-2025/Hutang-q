import setting from "../assets/settings 1.png";
import profile from "../assets/1326226.jpeg";

// src/components/Topbar.tsx
type TopbarProps = {
  toggleSidebar: () => void;
  title: string;
};

const Topbar = (props: TopbarProps) => {
  return (
    <div class="flex justify-between items-center p-4 bg-white shadow-sm">
      {/* Tombol Toggle Sidebar */}
      <button onClick={props.toggleSidebar} class="md:hidden">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-600" fill="none"
          viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Judul Dashboard */}
      <h1 class="text-2xl font-inter font-bold text-secondary hidden md:block">{props.title}</h1>

      {/* Search dan Avatar */}
      <div class="flex items-center space-x-4">
        <input
          type="text"
          placeholder="Search"
          class="px-4 py-1 rounded-full border border-gray-300 text-sm bg-gray-100 focus:outline-none"
        />
        <button class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
          <img class="h-4" src={setting} alt="" />
        </button>
        <button class="w-8 h-8 bg-green-100 rounded-full overflow-hidden">
          <img src={profile} alt="Profile" class="w-full h-full object-cover" />
        </button>
      </div>
    </div>
  );
};

export default Topbar;
