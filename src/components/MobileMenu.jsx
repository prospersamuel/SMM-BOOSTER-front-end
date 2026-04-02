// src/components/MobileMenu.jsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, PlusCircle, ListOrdered, User, LogOut, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function MobileMenu({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: <Home size={20} /> },
    { path: "/order", label: "New Order", icon: <PlusCircle size={20} /> },
    { path: "/orders", label: "My Orders", icon: <ListOrdered size={20} /> },
    { path: "/profile", label: "My Profile", icon: <User size={20} /> },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/login");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="lg:hidden fixed inset-0 z-40">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Sidebar */}
      <div className="absolute top-0 left-0 h-full w-64 bg-white shadow-xl transform transition-transform duration-300">

        {/* Navigation */}
        <nav className="p-4 mt-24">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-3 rounded-md mb-1 ${
                location.pathname === item.path
                  ? "bg-[#00786A] text-white"
                  : "text-gray-700 border-2 border-[#00786A] hover:bg-gray-100"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
          
          {/* Logout Button */}
         <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 border-2 border-[#00786A] rounded-md text-[#00786A] cursor-pointer transition-all hover:bg-emerald-50"
          >
            <LogOut size={18} />
            Logout
          </button>
        </nav>
      </div>
    </div>
  );
}