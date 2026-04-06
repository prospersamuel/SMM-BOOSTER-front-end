// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { collection, query, where, getDocs, getDoc, doc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../context/AuthContext";
import {
  DollarSign,
  Clock,
  Package,
  PlusCircle,
  ListOrdered,
  User,
  Loader,
} from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch user profile
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        setProfile(userSnap.data());

        // Fetch orders
        const ordersRef = collection(db, "orders");
        const q = query(ordersRef, where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        
        const orders = [];
        let totalOrders = 0;
        let pendingOrders = 0;

        querySnapshot.forEach((doc) => {
          const order = { id: doc.id, ...doc.data() };
          orders.push(order);
          totalOrders++;
          if (order.status === 'pending') pendingOrders++;          
        });

        setStats({ totalOrders, pendingOrders });
        setRecentOrders(orders.slice(0, 5).reverse());
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user.uid]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <Loader className="animate-spin text-[#00786A] rounded-full h-12 w-12"/>
      </div>
    );
  }

const statCards = [
  {
    title: "Account Balance",
    value: `₦${profile?.balance?.toLocaleString("en-NG",{
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) || "0.00"}`,

    icon: DollarSign,
    bgColor: "bg-[#00786A]",
  },
  {
    title: "Total Orders",
    value: stats.totalOrders,
    icon: Package,
    bgColor: "bg-[#00786A]",
  },
  {
    title: "Pending Orders",
    value: stats.pendingOrders,
    icon: Clock,
    bgColor: "bg-[#00786A]",
  },
];

  return (
    <div className="pt-24 lg:pt-0">
      <div className="mb-8">
        <p className="text-gray-600">Welcome back,</p>
        <h1 className="text-3xl font-bold text-gray-800"> {profile?.displayName || profile?.email?.split('@')[0]}</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className={`bg-white ${stat.title=='Account Balance'?'col-span-2':''} rounded-md shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-md ${stat.bgColor}`}>
                <stat.icon className="h-4 w-4 lg:w-6 lg:h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-[#00786A]">
                {stat.value}
              </span>
            </div>
            <h3 className="text-gray-600 font-medium">{stat.title}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-md shadow-lg border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800">Recent Orders</h2>
              <p className="text-gray-600 text-sm mt-1">Your latest SMM orders</p>
            </div>
            <div className="p-2">
              {recentOrders.length > 0 ? (
                <div className="">
                  {recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-2 hover:bg-gray-50 transition"
                    >
                      <div>
                        <h4 className="font-medium text-gray-800">
                          {order.serviceName || "Unknown Service"}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Quantity: {order.quantity} • ₦{order.totalPrice?.toLocaleString("en-NG", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }) || "0.00"}
                        </p>
                      </div>
                      <div className="flex items-center">
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
                        <span className="ml-4 text-sm text-gray-500">
                          {new Date(order.createdAt?.toDate?.() || order.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-700">No orders yet</h3>
                  <p className="text-gray-500 mt-2">
                    Start by creating your first SMM order
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-md shadow-lg border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800">Quick Actions</h2>
            </div>
            <div className="p-6 space-y-4">
              <button
                onClick={() => window.location.href = '/order'}
                className="w-full bg-[#00786A] text-white font-medium py-3 px-4 rounded-md transition cursor-pointer hover:bg-[#004D3E] flex items-center justify-center gap-2"
              >
                <PlusCircle size={20} />
                Place New Order
              </button>
              <button
                onClick={() => window.location.href = '/orders'}
                className="w-full border border-gray-300 text-gray-700 font-medium py-3 px-4 rounded-md hover:bg-gray-50 cursor-pointer transition flex items-center justify-center gap-2"
              >
                <ListOrdered size={20} />
                View All Orders
              </button>
              <button
                onClick={() => window.location.href = '/profile'}
                className="w-full border cursor-pointer border-gray-300 text-gray-700 font-medium py-3 px-4 rounded-md hover:bg-gray-50 transition flex items-center justify-center gap-2"
              >
                <User size={20} />
                Update Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}