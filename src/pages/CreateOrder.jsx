// src/pages/CreateOrder.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Loader } from "lucide-react";
import toast from "react-hot-toast";
import { API_URL } from "../lib/api";

// Image URLs for platforms
const platformImages = {
  tiktok:
    "https://res.cloudinary.com/dukkthlxa/image/upload/v1722425357/socialMediaCategories/tiktok_logo_200x200_cu8npx.png",
  instagram:
    "https://res.cloudinary.com/dukkthlxa/image/upload/v1722425359/socialMediaCategories/Instagram_logo_200x200_nvmthj.webp",
  facebook:
    "https://res.cloudinary.com/dukkthlxa/image/upload/v1722425358/socialMediaCategories/facebook_logo_200x200_xjsrkd.webp",
  twitter:
    "https://res.cloudinary.com/dukkthlxa/image/upload/v1739205139/socialMediaCategories/twitter-x-logo-png_seeklogo-492396_w2qodz.png",
  youtube:
    "https://res.cloudinary.com/dukkthlxa/image/upload/v1722425359/socialMediaCategories/Youtube_logo_sdigm4.png",
  whatsapp:
    "https://res.cloudinary.com/dukkthlxa/image/upload/v1726941724/WhatsApp_icon-min_qj2pv0.png",
  telegram:
    "https://res.cloudinary.com/dukkthlxa/image/upload/v1722425358/socialMediaCategories/telegram_logo_200x200_t1h0ym.webp",
};

function CreateOrder() {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({ service: "", link: "", quantity: "" });
  const [filteredServices, setFilteredServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const SERVICES_CACHE_KEY = "smm_services_cache";
  const SERVICES_CACHE_TIME_KEY = "smm_services_cache_time";
  const CACHE_DURATION = 1000 * 60 * 30; // 30 minutes

  // Fetch services on mount
  useEffect(() => {
    const loadServices = async () => {
      try {
        const cachedServices = localStorage.getItem(SERVICES_CACHE_KEY);
        const cacheTime = localStorage.getItem(SERVICES_CACHE_TIME_KEY);

        // Use cache if still valid
        if (
          cachedServices &&
          cacheTime &&
          Date.now() - Number(cacheTime) < CACHE_DURATION
        ) {
          setServices(JSON.parse(cachedServices));
          return;
        }

        const res = await fetch(`${API_URL}/services`);

        if (!res.ok) throw new Error("Failed to fetch services");

        const data = await res.json();

        if (!Array.isArray(data)) throw new Error("Invalid services format");

        setServices(data);

        // Save to cache
        localStorage.setItem(SERVICES_CACHE_KEY, JSON.stringify(data));
        localStorage.setItem(SERVICES_CACHE_TIME_KEY, Date.now());
      } catch (err) {
        console.error("Service fetch failed:", err);

        // fallback to cache if offline
        const cachedServices = localStorage.getItem(SERVICES_CACHE_KEY);
        if (cachedServices) {
          setServices(JSON.parse(cachedServices));
        } else {
          setServices([]);
        }
      }
    };

    loadServices();
  }, []);

  // Filter services when platform is selected
  const handlePlatformSelect = (platform) => {
    setSelectedPlatform(platform);

    const platformServices = services.filter((service) =>
      service.category.toLowerCase().includes(platform.toLowerCase())
    );

    setFilteredServices(platformServices);
    setForm({ service: "", link: "", quantity: "" });
    setSelectedService(null);
  };

  // Handle service selection
  useEffect(() => {
    if (form.service && filteredServices.length > 0) {
      const service = filteredServices.find((s) => s.id == form.service);
      setSelectedService(service);
    } else {
      setSelectedService(null);
    }
  }, [form.service, filteredServices]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  // PLATFORM LINK CHECK
  if (!validateLinkPlatform(selectedPlatform, form.link)) {
    toast.error(`Please enter a valid ${selectedPlatform} link`);
    return;
  }

  setLoading(true);

  try {
    const res = await fetch(`${API_URL}/order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        service: form.service,
        link: form.link,
        quantity: isCommentService ? getQuantity() : form.quantity,
        comments: isCommentService ? form.quantity : null,
        userId: user.uid,
      }),
    });

    const data = await res.json();

    if (data.order) {
      setForm({ service: "", link: "", quantity: "" });
      setSelectedService(null);
      setFilteredServices([]);
      toast.success("Order placed successfully");
    } else {
      toast.error(data.error || "Order failed");
    }
  } catch (err) {
    toast.error(err.message);
  } finally {
    setLoading(false);
  }
};

  const getPlatforms = () => {
    if (!Array.isArray(services)) return [];

    const platforms = new Set();

    services.forEach((service) => {
      const platform = service?.category?.split(" ")[0]?.toLowerCase();
      if (platform) platforms.add(platform);
    });

    return Array.from(platforms).filter((p) => platformImages[p]);
  };

  const getQuantity = () => {
    if (!selectedService) return 0;

    if (selectedService.name?.toLowerCase().includes("comment")) {
      return form.quantity
        ? form.quantity.split("\n").filter((line) => line.trim() !== "").length
        : 0;
    }

    return Number(form.quantity);
  };

  const validateLinkPlatform = (platform, link) => {
  if (!link) return false;

  const rules = {
    tiktok: ["tiktok.com"],
    instagram: ["instagram.com"],
    facebook: ["facebook.com", "fb.com"],
    youtube: ["youtube.com", "youtu.be"],
    whatsapp: ["whatsapp.com", "chat.whatsapp.com"],
    telegram: ["t.me", "telegram.me"],
    twitter: ["twitter.com", "x.com"],
  };

  const allowed = rules[platform];

  if (!allowed) return true;

  return allowed.some((domain) => link.toLowerCase().includes(domain));
};

 const getServiceUI = () => {
  if (!selectedService || !selectedPlatform) return {};

  const name = selectedService.name.toLowerCase();

  // COMMENTS
  if (name.includes("comment")) {
    return {
      linkLabel: `${selectedPlatform} Post Link`,
      quantityLabel: "Comments (one per line)",
      isComment: true,
    };
  }

  // FOLLOWERS / MEMBERS
  if (
    name.includes("followers") ||
    name.includes("members") ||
    name.includes("subscribers")
  ) {
    return {
      linkLabel: `${selectedPlatform} Profile/Channel Link`,
      quantityLabel: "Quantity",
    };
  }

  // LIKES / VIEWS / SHARES / SAVES / REACTIONS
  if (
    name.includes("likes") ||
    name.includes("views") ||
    name.includes("shares") ||
    name.includes("saves") ||
    name.includes("reactions")
  ) {
    return {
      linkLabel: `${selectedPlatform} Post/Video Link`,
      quantityLabel: "Quantity",
    };
  }

  return {
    linkLabel: `${selectedPlatform} Link`,
    quantityLabel: "Quantity",
  };
};

  const serviceUI = getServiceUI();

  const totalAmount = selectedService
    ? Math.ceil(selectedService.price_per_unit_ngn * getQuantity())
    : 0;

  const isCommentService = selectedService?.name
    ?.toLowerCase()
    .includes("comment");

  if (!services.length) {
    return (
      <div className="flex items-center justify-center min-h-[100vh] md:min-h-[70vh]">
        <Loader className="animate-spin text-[#00786A] rounded-full h-12 w-12" />
      </div>
    );
  }

  return (
    <div className="pt-24 lg:pt-0">
      <div className="max-w-4xl mx-auto">
        <div className="mb-5">
          <h1 className="text-3xl font-bold text-gray-800">Create New Order</h1>
          <p className="text-gray-600 mt-2">
            Boost your social media presence with our premium services
          </p>
        </div>

        {/* Order Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-md shadow-lg border border-gray-100 p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Platform Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Platform
                </label>
                <div className="grid grid-cols-6 gap-3">
                  {getPlatforms().map((platformName) => (
                    <button
                      key={platformName}
                      type="button"
                      onClick={() => handlePlatformSelect(platformName)}
                      className={`md:p-2 p-1 cursor-pointer rounded-md border-2 flex flex-col items-center justify-center gap-1 transition-all ${
                        selectedPlatform === platformName
                          ? "border-[#00786A] bg-emerald-50 text-[#00786A]"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <img
                        src={platformImages[platformName]}
                        alt={platformName}
                        className="w-5 h-5 md:w-8 md:h-8 object-contain"
                      />
                      <span className="text-xs hidden md:block font-medium capitalize">
                        {platformName}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Service Selection (only shows when platform is selected) */}
              {filteredServices.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                    Select Service
                  </label>
                  <select
                    name="service"
                    value={form.service}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#00786A] outline-none focus:border-[#00786A] transition"
                    required
                  >
                    <option value="">Select a service</option>
                    {filteredServices.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} - ₦{s.price_per_1000_ngn} per 1000 (Min:{" "}
                        {s.min}, Max: {s.max})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Link */}
              <div>
                <label className="block text-sm capitalize font-medium text-gray-700 mb-1 ml-1">
                  {serviceUI.linkLabel || "Link"}
                </label>
                <input
                  name="link"
                  value={form.link}
                  onChange={handleChange}
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#00786A] outline-0 focus:border-[#00786A] transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                  {serviceUI.quantityLabel || "Quantity"}
                  {form.quantity.length > 0 && (
                    <span className="text-xs text-gray-500 ml-2">
                      (
                      {isCommentService
                        ? `${
                            form.quantity
                              .split("\n")
                              .filter((line) => line.trim() !== "").length
                          } comments`
                        : `${form.quantity} units`}
                      )
                    </span>
                  )}
                </label>

                {/* Quantity OR Comments */}
                {serviceUI.isComment ? (
                  <textarea
                    name="quantity"
                    value={form.quantity}
                    onChange={handleChange}
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#00786A] outline-0 focus:border-[#00786A] transition"
                    placeholder={`Nice post!
Awesome 🔥
Love this`}
                    required
                  />
                ) : (
                  <input
                    name="quantity"
                    value={form.quantity}
                    onChange={handleChange}
                    type="number"
                    min={selectedService?.min || 1}
                    max={selectedService?.max || 10000}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#00786A] outline-0 focus:border-[#00786A] transition"
                    required
                  />
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !form.service}
                className={`cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed w-full bg-[#00786A] text-white font-semibold py-4 px-4 rounded-md transition ${
                  !form.service
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-[#004D3E]"
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <Loader className="animate-spin -ml-1 mr-3 h-5 w-5" />
                    Placing Order...
                  </span>
                ) : (
                  `Place Order - ₦${totalAmount.toLocaleString("en-NG", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }) || "0.00"}`
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateOrder;
