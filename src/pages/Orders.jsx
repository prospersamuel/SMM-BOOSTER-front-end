// src/pages/Orders.jsx
import { useEffect, useState } from "react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Search, Filter, RefreshCw, Loader, Copy } from "lucide-react";
import toast from "react-hot-toast";

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, [user.uid]);

  const fetchOrders = async () => {
    try {
      const ordersRef = collection(db, "orders");
      const q = query(
        ordersRef,
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc")
      );

      const querySnapshot = await getDocs(q);
      const ordersList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setOrders(ordersList);
      setFilteredOrders(ordersList);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = [...orders];

    // Search
    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.serviceName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.link?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.id?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status
    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    // Date
    if (dateFilter !== "all") {
      const now = new Date();
      let pastDate = new Date();

      if (dateFilter === "today") pastDate.setDate(now.getDate() - 1);
      if (dateFilter === "week") pastDate.setDate(now.getDate() - 7);
      if (dateFilter === "month") pastDate.setMonth(now.getMonth() - 1);

      filtered = filtered.filter((order) => {
        const orderDate =
          order.createdAt?.toDate?.() || new Date(order.createdAt);
        return orderDate >= pastDate;
      });
    }

    setFilteredOrders(filtered);
  }, [orders, searchTerm, statusFilter, dateFilter]);

  const handleRefresh = async () => {
    try {
      fetchOrders();
      toast.success("Orders refreshed");
    } catch (err) {
      console.log("Error refreshing orders:", err);
      toast.error("Failed to fetch orders. Please try again.");
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    const d = new Date(date);
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
          <Loader className="animate-spin text-[#00786A] rounded-full h-12 w-12" />
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 lg:pt-0">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Orders</h1>
        <p className="text-gray-600 mt-2">
          Track and manage all your SMM orders
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-md shadow-lg border border-gray-100 p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-3">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search orders by service or link..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 md:py-3 outline-0 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#00786A] focus:border-[#00786A] transition"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 md:py-3 border outline-0 border-gray-300 rounded-md focus:ring-2 focus:ring-[#00786A] focus:border-[#00786A] transition"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="in progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            {/* Date Filter */}
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-4 py-2 md:py-3 border outline-0 border-gray-300 rounded-md focus:ring-2 focus:ring-[#00786A] focus:border-[#00786A] transition"
            >
              <option value="all">All Time</option>
              <option value="today">Last 24 Hours</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
            </select>
          </div>

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            className="lg:w-auto px-6 py-3 border cursor-pointer border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition flex items-center justify-center gap-2"
          >
            <RefreshCw className="h-5 w-5" />
            Refresh
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-md shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">
              Order History ({filteredOrders.length})
            </h2>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 truncate py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Remains
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50 animate-in fade-in slide-in-from-bottom- text-gray-500 transition"
                >
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm gap-1 flex items-center font-medium truncate max-w-[120px]">
                      <Copy
                        onClick={() =>
                          navigator.clipboard.writeText(order.id) &&
                          toast.success("Order ID copied to clipboard")
                        }
                        className="w-3 cursor-pointer hover:text-neutral-400 active:text-neutral-400"
                      />
                      {order.id.slice(0, 4)}...{order.id.slice(-4)}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div>
                      <div className="text-sm font-medium truncate text-gray-500">
                        {order.serviceName || "Unknown Service"}
                      </div>
                      <div className="text-xs text-gray-500 truncate max-w-[200px]">
                        {order.link}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium">
                      {order.quantity}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="text-sm">
                      ₦
                      {order.amount?.toLocaleString("en-NG", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }) || "0.00"}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm font-medium px-2 py-1 rounded-md ${
                          order.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : order.status === "pending" ||
                              order.status === "processing" ||
                              order.status === "in progress"
                            ? "bg-yellow-100 text-yellow-800"
                            : order.status === "cancelled"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {order.status || "unknown"}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium">
                      {order.remains || 0}
                    </span>
                  </td>
                  <td className="whitespace-nowrap text-sm px-4 text-gray-500">
                    {formatDate(order.createdAt?.toDate?.())}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-16">
            <Filter className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700">
              No orders found
            </h3>
            <p className="text-gray-500 mt-2">
              {searchTerm || statusFilter !== "all" || dateFilter !== "all"
                ? "Try changing your filters"
                : "Start by placing your first order"}
            </p>
            {!searchTerm && statusFilter === "all" && dateFilter === "all" && (
              <button
                onClick={() => navigate("/order")}
                className="mt-4 bg-[#00786A] text-white font-medium py-2 px-6 rounded-md hover:bg-[#004D3E] cursor-pointer transition"
              >
                Place Your First Order
              </button>
            )}
          </div>
        )}
      </div>

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
