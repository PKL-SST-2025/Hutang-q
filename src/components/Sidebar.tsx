import { createSignal } from "solid-js";
import { useLocation, A } from "@solidjs/router";
import HomeIconA from "../assets/Yellow/home2.png";
import HomeIcon from "../assets/Gray/home 2.png";
import TfIconA from "../assets/Yellow/17-transfer.png";
import TfIcon from "../assets/Gray/transfer 1.png";
import AccIconA from "../assets/Yellow/user 3 1.png";
import AccIcon from "../assets/Gray/user 3 1.png";
import AddIconA from "../assets/Yellow/economic-investment 1.png";
import AddIcon from "../assets/Gray/economic-investment 1.png";
import AllIconA from "../assets/Yellow/loan 1.png";
import AllIcon from "../assets/Gray/loan 1.png";
import ServiceIconA from "../assets/Yellow/service 1.png";
import ServiceIcon from "../assets/Gray/service 1.png";
import SettingsIconA from "../assets/Yellow/settings solid 1.png";
import SettingsIcon from "../assets/Gray/settings solid 1.png";
import Logo from "../assets/Logo-removebg-preview(1).png";

interface SidebarProps {
  onToggle?: (isOpen: boolean) => void;
}

const Sidebar = (props: SidebarProps) => {
  const location = useLocation();
  const [open, setOpen] = createSignal(true);

  const handleToggle = () => {
    const newState = !open();
    setOpen(newState);
    props.onToggle?.(newState);
  };

  const menus = [
    { name: "Dashboard", icon: HomeIcon, Activeicon: HomeIconA, href: "/Dashboard" },
    { name: "Transactions", icon: TfIcon, Activeicon: TfIconA, href: "/Transaction" },
    { name: "Accounts", icon: AccIcon, Activeicon: AccIconA, href: "/Accounts" },
    { name: "Add", icon: AddIcon, Activeicon: AddIconA, href: "/AddData" },
    { name: "All Data", icon: AllIcon, Activeicon: AllIconA, href: "/AllData" },
    { name: "Services", icon: ServiceIcon, Activeicon: ServiceIconA, href: "/Services" },
    { name: "Setting", icon: SettingsIcon, Activeicon: SettingsIconA, href: "/Settings" },
  ];

  return (
    <div
      class={`fixed left-0 top-0 h-screen bg-white shadow-lg p-4 transition-all duration-300 z-40 ${
        open() ? "w-64" : "w-20"
      }`}
    >
      {/* Logo dan tombol toggle */}
      <div class="flex items-center justify-between mb-8">
        <div class="flex items-center gap-2">
          <img class="h-7" src={Logo} alt="Logo" />
          {open() && <h2 class="text-xl font-extrabold text-yellow-500 font-montserrat">Hutang-q</h2>}
        </div>
        <button
          class="text-gray-500 md:block hidden"
          onClick={handleToggle}
          title={open() ? "Tutup Sidebar" : "Buka Sidebar"}
        >
          <span class="text-xl hover:text-primer1">{open() ? "⮜" : "⮞"}</span>
        </button>
      </div>

      {/* Menu */}
      <ul class="space-y-6">
        {menus.map((menu) => {
          const isActive = location.pathname === menu.href;
          return (
            <li>
              <A
                href={menu.href}
                class={`flex items-center gap-3 cursor-pointer transition-colors ${
                  isActive ? "text-yellow-500 font-bold" : "text-gray-500 hover:text-yellow-400"
                }`}
              >
                <img
                  src={isActive ? menu.Activeicon : menu.icon}
                  alt={menu.name}
                  class="w-6 h-6"
                />
                {open() && <span class="text-sm font-medium font-inter">{menu.name}</span>}
              </A>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Sidebar;