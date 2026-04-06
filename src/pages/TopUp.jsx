// src/pages/TopUp.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FlutterWaveButton } from "flutterwave-react-v3";
import {
  Wallet,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";

export default function TopUp() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  const presetAmounts = [1000, 2000, 5000, 10000, 20000, 50000];

  const handlePresetClick = (value) => {
    setAmount(value.toString());
    setSelectedAmount(value);
  };

  const config = {
    public_key: import.meta.env.VITE_FLW_PUBLIC_KEY,
    tx_ref: "wallet-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
    amount: Number(amount),
    currency: "NGN",
    payment_options: "card, bank, banktransfer, ussd, mobilemoney",
    customer: {
      email: user?.email,
      name: user?.displayName || user?.email?.split('@')[0] || "Customer",
      phone_number: user.phoneNumber || '',
    },
    customizations: {
      title: "SMM Wallet Top Up",
      description: `Add ₦${Number(amount).toLocaleString()} to your wallet`,
      logo: "https://earnwithuplink.vercel.app/assets/logo-6xeeZcLX.png",
    },
    meta: {
      user_id: user?.uid,
      amount: amount,
    },
  };
  
  const fwConfig = {
    ...config,
    text: isProcessing ? "Processing..." : `Pay ₦${Number(amount).toLocaleString()}`,
callback: async (response) => {
  setIsProcessing(true);

  try {
    const res = await fetch("http://localhost:3000/verify-payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        transaction_id: response.transaction_id,
        tx_ref: response.tx_ref,
      }),
    });

    const data = await res.json();

    if (data.success) {
      navigate("/dashboard", {
        state: {
          success: true,
          message: "Wallet funded successfully",
        },
      });
    } else {
      setError("Payment verification failed");
    }
  } catch (err) {
    setError("Server error verifying payment");
    console.log(err);
    
  }

  setIsProcessing(false);
}
  };

  return (
    <div className="min-h-screen pt-24 md:pt-0 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        {/* Header with back button */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 cursor-pointer hover:text-[#00786A] transition-colors group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back</span>
          </button>
        </div>

        <div className="grid grid-cols-1">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-md shadow-xl overflow-hidden">
              {/* Header */}
              <div className="bg-[#00786A] p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 backdrop-blur rounded-md">
                    <Wallet className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-white">Top Up Wallet</h1>
                    <p className="text-emerald-100 text-sm mt-1">
                      Add funds to your account instantly
                    </p>
                  </div>
                </div>
              </div>

              {/* Amount Selection */}
              <div className="p-4">
                {/* Preset Amounts */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Quick Amounts
                  </label>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                    {presetAmounts.map((preset) => (
                      <button
                        key={preset}
                        onClick={() => handlePresetClick(preset)}
                        className={`p-3 rounded-md cursor-pointer border-2 transition-all duration-300 ${
                          selectedAmount === preset
                            ? "border-[#00786A] bg-emerald-50 text-[#00786A] scale-105 shadow-lg"
                            : "border-gray-200 hover:border-[#00786A] hover:bg-gray-50 text-gray-700"
                        }`}
                      >
                        <span className="font-semibold">₦{preset.toLocaleString()}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Amount */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Custom Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
                      ₦
                    </span>
                    <input
                      type="number"
                      min="10"
                      step="100"
                      placeholder="Enter amount (min ₦100)"
                      className="w-full pl-10 pr-4 outline-0 py-4 border-2 border-gray-200 rounded-md focus:border-[#00786A] transition-all duration-300 text-lg"
                      value={amount}
                      onChange={(e) => {
                        setAmount(e.target.value);
                        setSelectedAmount(null);
                      }}
                    />
                  </div>
                  {amount && Number(amount) < 100 && (
                    <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                      <AlertCircle size={14} />
                      Minimum amount is ₦10
                    </p>
                  )}
                </div>

                {/* Error Message */}
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="h-5 w-5 text-red-600" />
                      <p className="text-red-600 text-sm">{error}</p>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => navigate(-1)}
                    className="flex-1 border-2 cursor-pointer border-gray-200 text-gray-700 font-semibold py-4 px-4 rounded-md hover:bg-gray-50 transition-all duration-300"
                  >
                    Cancel
                  </button>
                  
                  {amount > 0 && Number(amount) >= 10 && (
                    <FlutterWaveButton
                      {...fwConfig}
                      className="flex-1 bg-[#00786A] cursor-pointer text-white font-semibold py-4 px-4 rounded-md hover:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}