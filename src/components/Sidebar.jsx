// src/components/Sidebar.jsx
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Home,
  PlusCircle,
  ListOrdered,
  User,
  LogOut,
  Menu,
  X,
  BarChart,
} from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import BalanceDisplay from "./BalanceDisplay";
import MobileMenu from "./MobileMenu";
import { BiSupport } from "react-icons/bi";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        try {
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);
          setProfile(userSnap.data());
        } catch (error) {
          console.error("Error fetching profile:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProfile();
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: <Home size={20} /> },
    { path: "/order", label: "New Order", icon: <PlusCircle size={20} /> },
    { path: "/orders", label: "My Orders", icon: <ListOrdered size={20} /> },
    { path: "/profile", label: "Profile", icon: <User size={20} /> },
    { path: "/support", label: "Support", icon: <BiSupport size={20} /> },
  ];

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 border-b border-neutral-700 z-50 p-4 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
          <div className="flex items-center gap-3">
            <BalanceDisplay variant="default" />
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block border-r border-neutral-200 fixed top-0 left-0 h-screen w-64 shadow-md z-40 bg-white">
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 text-white bg-[#00786A] rounded-md">
              <BarChart size={24} />
            </div>
            <h1 className="text-xl font-bold text-gray-800">SMM Booster</h1>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-md transition-all ${
                location.pathname === item.path
                  ? "text-white bg-[#00786A] shadow-lg"
                  : "hover:bg-[#00786A] border border-[#00786A] hover:text-white text-gray-700"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#00786A] rounded-full flex items-center text-white justify-center">
                <span className="font-semibold">
                  {profile?.displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">
                  {profile?.displayName || user?.email?.split("@")[0]}
                </p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 border-2 border-[#00786A] rounded-md text-[#00786A] cursor-pointer transition-all hover:bg-emerald-50"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu isOpen={isOpen} onClose={() => setIsOpen(false)} profile={profile} />
    </>
  );
}