// src/components/BalanceDisplay.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import { Wallet, PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function BalanceDisplay({ onBalanceLoaded }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    
    // real-time listener
    const unsubscribe = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        const newBalance = docSnap.data().balance || 0;
        setBalance(newBalance);
        setLoading(false);
        onBalanceLoaded?.(newBalance);
      }
    }, (error) => {
      console.error("Balance listener error:", error);
      setLoading(false);
    });

    return () => unsubscribe(); // cleanup on unmount
  }, [user, onBalanceLoaded]);

  const formatBalance = (amount) => {
    return `₦${amount.toLocaleString('en-NG', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
  };
  // Default variant
  return (
    <div className="flex items-center gap-3 border-2 border-[#00786A] px-2 py-1 rounded-md">
      <Wallet className="h-5 w-5 text-[#00786A]" />
      <div>
        <p className="text-xs text-gray-600">Balance</p>
        <p className="font-semibold text-sm text-[#00786A]">
          {loading ? (
            <span className="animate-pulse">Loading...</span>
          ) : (
            formatBalance(balance)
          )}
        </p>
      </div>
      <PlusCircle
        onClick={() => navigate('/topup')}
        className="h-5 w-5 text-[#00786A] hover:text-[#004D3E] cursor-pointer"
      />
    </div>
  );
}