// src/pages/Profile.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  orderBy,
  getDocs,
  limit,
  startAfter,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import toast from "react-hot-toast";
import {
  User,
  Mail,
  Shield,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Edit2,
  Save,
  History,
  Trash2,
  Smartphone,
  Loader,
  User2,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Copy,
} from "lucide-react";

export default function Profile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [profile, setProfile] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [loadingSaveProfile, setLoadingSaveProfile] = useState(false);
  const [formData, setFormData] = useState({
    displayName: "",
    phone: "",
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);

useEffect(() => {
  if (!user) return;
  fetchProfileData();
  fetchTransactions();
}, [user]);


  let profileErrorShown = false;

const fetchProfileData = async () => {
   try {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data();

      setProfile(userData);
      setFormData({
        displayName: userData.displayName || user.email.split("@")[0],
        phone: userData.phone || "",
      });
    } catch (error) {
    console.error(error);

    if (!profileErrorShown) {
      toast.error("Failed to load profile data");
      profileErrorShown = true;
    }
  } finally {
    setLoading(false);
  }
};

  const fetchTransactions = async (loadMore = false) => {
    if (!user?.uid) return;
    try {
      if (loadMore) {
        setLoadingMore(true);
      }

      const transactionsRef = collection(db, "transactions");
      let q = query(
        transactionsRef,
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc"),
        limit(5) // Always limit to 5 per page
      );

      // If loading more and we have a last document, start after it
      if (loadMore && lastVisible) {
        q = query(
          transactionsRef,
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc"),
          startAfter(lastVisible),
          limit(5)
        );
      }

      const querySnapshot = await getDocs(q);

      // Get the last visible document for pagination
      const lastVisibleDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
      setLastVisible(lastVisibleDoc);

      // Check if there are more documents
      setHasMore(querySnapshot.docs.length === 5);

      const transactionsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
      }));

      if (loadMore) {
        setTransactions((prev) => [...prev, ...transactionsList]);
      } else {
        setTransactions(transactionsList);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast.error("Failed to load transactions");
    } finally {
      if (loadMore) {
        setLoadingMore(false);
      }
    }
  };

  const handleLoadMore = () => {
    fetchTransactions(true);
  };

  const handleRefreshTransactions = async () => {
    try {
      setLastVisible(null);
      setHasMore(true);

      await fetchTransactions(false);

      toast.success("Transactions refreshed");
    } catch (err) {
      console.log(err);

      toast.error("Failed to refresh transactions");
    }
  };

  const handleUpdateProfile = async () => {
    setLoadingSaveProfile(true);
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        displayName: formData.displayName,
        phone: formData.phone,
        updatedAt: new Date(),
      });

      toast.success("Profile updated successfully");
      setEditMode(false);
      fetchProfileData();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setLoadingSaveProfile(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      toast.success("Password changed successfully");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("Failed to change password");
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    const d = date instanceof Date ? date : new Date(date);

    if (isNaN(d)) return "Invalid date";

    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="pt-16 lg:pt-0 flex items-center justify-center min-h-[400px]">
        <div className="flex items-center justify-center min-h-[70vh]">
          <Loader className="animate-spin text-[#00786A] h-12 w-12" />
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "personal", label: "Personal Info", icon: <User size={18} /> },
    { id: "security", label: "Security", icon: <Shield size={18} /> },
    { id: "transactions", label: "Transactions", icon: <History size={18} /> },
  ];

  return (
    <div className="pt-24 lg:pt-0">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Profile Settings</h1>
          <p className="text-gray-600 mt-2">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar */}
          <div className="lg:w-64">
            <div className="bg-white rounded-md shadow-lg border border-gray-100 overflow-hidden sticky top-24">
              {/* Profile Card */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex flex-col items-center text-center">
                  <div className="relative group">
                    <div className="w-24 h-24 bg-[#00786A] rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-lg group-hover:shadow-xl transition-all">
                      {profile?.displayName?.[0]?.toUpperCase() ||
                        user.email[0].toUpperCase()}
                    </div>
                  </div>
                  <h2 className="text-xl font-bold truncate text-gray-800">
                    {profile?.displayName || user.email.split("@")[0]}
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">{user.email}</p>
                </div>
              </div>

              {/* Tabs */}
              <nav className="p-4">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center cursor-pointer gap-3 px-4 py-3 rounded-md transition-all mb-1 ${
                      activeTab === tab.id
                        ? "border-2 border-[#00786A] text-[#00786A] shadow-sm"
                        : "hover:bg-gray-50 text-gray-600"
                    }`}
                  >
                    {tab.icon}
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Personal Info Tab */}
            {activeTab === "personal" && (
              <div className="bg-white rounded-md shadow-lg border border-gray-100">
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">
                        Personal Information
                      </h2>
                      <p className="text-gray-600 text-sm mt-1">
                        Update your personal details
                      </p>
                    </div>
                    {!editMode ? (
                      <button
                        onClick={() => setEditMode(true)}
                        className="flex items-center cursor-pointer gap-1 px-3 py-2 text-[#00786A] text-sm font-medium hover:bg-emerald-50 rounded-md transition-all"
                      >
                        <Edit2 size={12} />
                        Edit Profile
                      </button>
                    ) : (
                      <div className="flex items-center">
                        <button
                          onClick={() => {
                            setEditMode(false);
                            setFormData({
                              displayName:
                                profile.displayName || user.email.split("@")[0],
                              phone: profile.phone || "",
                            });
                          }}
                          className="flex items-center text-sm cursor-pointer gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-l-md hover:bg-gray-200 transition-all"
                        >
                          <XCircle size={15} />
                        </button>
                        <button
                          onClick={handleUpdateProfile}
                          disabled={loadingSaveProfile}
                          className="flex items-center gap-2 cursor-pointer px-4 py-2 bg-[#00786A] text-white rounded-r-md transition-all disabled:opacity-50"
                        >
                          {loadingSaveProfile ? (
                            <Loader size={15} className="animate-spin" />
                          ) : (
                            <Save size={15} />
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Email (Read-only) */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <div className="flex items-center gap-2">
                          <Mail size={16} className="text-gray-400" />
                          Email Address
                        </div>
                      </label>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                        <span className="text-gray-800">{user.email}</span>
                        <CheckCircle size={16} className="text-[#00786A]" />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Email cannot be changed
                      </p>
                    </div>

                    {/* Display Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <div className="flex items-center gap-2">
                          <User2 size={16} className="text-gray-400" />
                          Display Name
                        </div>
                      </label>
                      {editMode ? (
                        <input
                          type="text"
                          value={formData.displayName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              displayName: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 outline-0 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#00786A] focus:border-[#00786A] transition"
                          placeholder="Enter display name"
                        />
                      ) : (
                        <div className="p-3 bg-gray-50 rounded-md">
                          <span className="text-gray-800">
                            {profile?.displayName || "Not set"}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <div className="flex items-center gap-2">
                          <Smartphone size={16} className="text-gray-400" />
                          Phone Number
                        </div>
                      </label>
                      {editMode ? (
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          className="w-full px-4 py-3 border outline-0 border-gray-300 rounded-md focus:ring-2 focus:ring-[#00786A] focus:border-[#00786A]transition"
                          placeholder="+234 123 456 7890"
                        />
                      ) : (
                        <div className="p-3 bg-gray-50 rounded-md">
                          <span className="text-gray-800">
                            {profile?.phone || "Not set"}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* User ID */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        User ID
                      </label>
                      <div className="p-3 bg-gray-50 rounded-md font-mono text-sm">
                        {user.uid.slice(0, 8)}...{user.uid.slice(-4)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <div className="bg-white rounded-md shadow-lg border border-gray-100">
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <Shield className="h-6 w-6 text-[#00786A]" />
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">
                        Security Settings
                      </h2>
                      <p className="text-gray-600 text-sm mt-1">
                        Manage your account security
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 space-y-6">
                  {/* Change Password */}
                  <div className="border border-gray-200 rounded-md p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Change Password
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Current Password
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            value={passwordForm.currentPassword}
                            onChange={(e) =>
                              setPasswordForm({
                                ...passwordForm,
                                currentPassword: e.target.value,
                              })
                            }
                            className="w-full px-4 py-3 outline-0 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#00786A] focus:border-[#00786A] transition pr-12"
                            placeholder="Enter current password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          >
                            {showPassword ? (
                              <EyeOff size={20} />
                            ) : (
                              <Eye size={20} />
                            )}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          New Password
                        </label>
                        <input
                          type={showPassword ? "text" : "password"}
                          value={passwordForm.newPassword}
                          onChange={(e) =>
                            setPasswordForm({
                              ...passwordForm,
                              newPassword: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border outline-0 border-gray-300 rounded-md focus:ring-2 focus:ring-[#00786A] focus:border-[#00786A] transition"
                          placeholder="Enter new password"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Confirm New Password
                        </label>
                        <input
                          type={showPassword ? "text" : "password"}
                          value={passwordForm.confirmPassword}
                          onChange={(e) =>
                            setPasswordForm({
                              ...passwordForm,
                              confirmPassword: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border outline-0 border-gray-300 rounded-md focus:ring-2 focus:ring-[#00786A] focus:border-[#00786A] transition"
                          placeholder="Confirm new password"
                        />
                      </div>

                      <button
                        onClick={handlePasswordChange}
                        className="w-full cursor-pointer bg-[#00786A] text-white font-semibold py-3 px-4 rounded-md transition"
                      >
                        Update Password
                      </button>
                    </div>
                  </div>

                  {/* Danger Zone */}
                  <div className="border border-red-200 rounded-md p-6 bg-red-50">
                    <div className="space-y-4">
                      <button className="flex items-center cursor-pointer gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-md hover:from-red-700 hover:to-red-800 transition">
                        <Trash2 size={18} />
                        Delete Account
                      </button>
                      <p className="text-sm text-red-600">
                        Once you delete your account, there is no going back.
                        Please be certain.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Transactions Tab */}
            {activeTab === "transactions" && (
              <div className="bg-white rounded-md shadow-lg border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <History className="h-6 w-6 text-[#00786A]" />
                      <div>
                        <h2 className="text-xl font-semibold text-gray-800">
                          Transaction History
                        </h2>
                        <p className="text-gray-600 text-sm mt-1">
                          View all your deposits and payments
                        </p>
                      </div>
                    </div>

                    {/* Refresh Button */}
                    <button
                      onClick={handleRefreshTransactions}
                      className="p-2 text-gray-600 cursor-pointer hover:text-[#00786A] hover:bg-emerald-50 rounded-md transition-all"
                      title="Refresh transactions"
                    >
                      <RefreshCw size={20} />
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider truncate">
                          Date & Time
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {transactions.length > 0 ? (
                        transactions.map((transaction, index) => (
                          <tr
                            key={transaction.id}
                            className="hover:bg-gray-50 transition animate-in fade-in slide-in-from-bottom-1"
                            style={{ animationDelay: `${index * 50}ms` }}
                          >
                            <td className="px-6 text-left py-4 whitespace-nowrap">
                              <span className="text-sm gap-1 flex items-center text-gray-500">
                                <Copy
                                  onClick={() =>
                                    navigator.clipboard.writeText(
                                      transaction.id
                                    ) &&
                                    toast.success(
                                      "Transaction ID copied to clipboard"
                                    )
                                  }
                                  className="w-3 cursor-pointer hover:text-neutral-400 active:text-neutral-400"
                                />
                                {transaction.id.slice(0, 4)}...
                                {transaction.id.slice(-4)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(transaction.createdAt)}
                            </td>
                            <td className="px-6 text-center py-4 whitespace-nowrap">
                              <span className="text-sm text-gray-500">
                                ₦
                                {transaction.amount?.toLocaleString("en-NG", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </span>
                            </td>
                            <td className="px-6 text-right py-4 whitespace-nowrap">
                              <span
                                className={`px-3 py-1 rounded-md text-xs font-medium ${
                                  transaction.status === "completed"
                                    ? "text-[#00786A] bg-emerald-100"
                                    : "text-red-700 bg-red-100"
                                }`}
                              >
                                {transaction.status === "completed"
                                  ? "Completed"
                                  : "Failed"}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="px-6 py-12 text-center">
                            <History className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-700">
                              No transactions yet or check you connection and refresh
                            </h3>
                            <p className="text-gray-500 mt-2">
                              Your transaction history will appear here
                            </p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Load More Button with counter */}
                {transactions.length > 0 && hasMore && (
                  <div className="p-6 border-t border-gray-100">
                    <div className="flex flex-col items-center gap-3">
                      <p className="text-sm text-gray-500">
                        Showing {transactions.length} transactions
                      </p>
                      <button
                        onClick={handleLoadMore}
                        disabled={loadingMore}
                        className="w-full flex items-center justify-center gap-2 border-2 border-gray-200 text-gray-700 cursor-pointer font-medium py-3 px-4 rounded-md hover:border-[#00786A] hover:bg-emerald-50 hover:text-[#00786A] transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                      >
                        {loadingMore ? (
                          <>
                            <Loader className="animate-spin h-5 w-5" />
                            Loading...
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-5 w-5 group-hover:translate-y-1 transition-transform" />
                            Load 5 More Transactions
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* End of list message */}
                {transactions.length > 0 && !hasMore && (
                  <div className="p-6 border-t border-gray-100 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <ChevronUp className="h-5 w-5 text-gray-400" />
                      <p className="text-sm text-gray-500">
                        You've viewed all {transactions.length} transactions
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add animation styles */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slide-in-from-bottom-1 {
          from {
            transform: translateY(10px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-in {
          animation-duration: 0.3s;
          animation-timing-function: ease-out;
          animation-fill-mode: forwards;
        }

        .fade-in {
          animation-name: fade-in;
        }

        .slide-in-from-bottom-1 {
          animation-name: slide-in-from-bottom-1;
        }
      `}</style>
    </div>
  );
}
