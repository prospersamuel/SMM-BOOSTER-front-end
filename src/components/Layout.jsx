// src/components/Layout.jsx
import { Outlet } from "react-router-dom";
import Header from "./Header";
import ToastProvider from "./ToastProvider";
import Sidebar from "./Sidebar";

export default function Layout() {
  return (
    <div className="min-h-screen">
      <ToastProvider />
      <Header />
        <Sidebar/>
      <main className="px-4 ml-0 lg:ml-64 transition-all duration-30 py-6 lg:px-6 lg:py-8">
        <Outlet />
      </main>
    </div>
  );
}