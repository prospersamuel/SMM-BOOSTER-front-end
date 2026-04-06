// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import CreateOrder from "./pages/CreateOrder";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import { AuthProvider } from "./context/AuthContext";
import TopUp from "./pages/TopUp";
import ToastProvider from "./components/ToastProvider";
import Support from "./pages/Support";
import PrivacyTerms from "./pages/PrivacyTerms";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider/>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/privacy" element={<PrivacyTerms />} />
          <Route path="*" element={<div>404 - Not Found</div>} />
          <Route path="support" element={<Support />} />
          
          {/* Protected Routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="order" element={<CreateOrder />} />
            <Route path="orders" element={<Orders />} />
            <Route path="profile" element={<Profile />} />
            <Route path="topup" element={<TopUp />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}