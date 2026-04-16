// src/pages/ServiceDetail.jsx
import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronLeft, Star, Wrench, Info, ChevronDown, Home,
  Shield, Clock, Award, Sparkles, CheckCircle2, MapPin,
  Tag
} from "lucide-react";
import { useState, useEffect } from "react";
import Cart from "../components/Cart";
import { useApp } from "../AppContext";
import { motion, AnimatePresence } from "framer-motion";

// ---------------------------------------------------
// 🔥 SERVICE DATA - WITH DISCOUNT PRICES
// ---------------------------------------------------
const serviceData = {
  "ac-repair": {
    title: "AC Repair & Service",
    desc: "Expert AC repair with transparent pricing & 30 days service guarantee.",
    rating: "4.8",
    basePrice: "₹499 onwards",
    originalBasePrice: "₹799",
    icon: "❄️",
    discount: "38% OFF",
    issues: [
      { issue: "Cooling Issue", originalPrice: 799, priceOptions: [499, 599, 699] },
      { issue: "Water Leakage / Drain Block", originalPrice: 699, priceOptions: [399, 499, 599] },
      { issue: "Gas Refill (Standard)", originalPrice: 2499, priceOptions: [1799, 1999, 2199] },
      { issue: "Installation (Split AC)", originalPrice: 1999, priceOptions: [1399, 1499, 1599] },
    ]
  },
  "fan-motor": {
    title: "Fan & Motor Services",
    desc: "Repair, installation & servicing of ceiling, wall & exhaust fans.",
    rating: "4.6",
    basePrice: "₹149 onwards",
    originalBasePrice: "₹249",
    icon: "🌀",
    discount: "40% OFF",
    issues: [
      { issue: "Slow Speed", originalPrice: 249, priceOptions: [149, 199, 249] },
      { issue: "Fan Not Starting", originalPrice: 299, priceOptions: [199, 249, 299] },
      { issue: "Noise Issue", originalPrice: 249, priceOptions: [149, 179, 229] },
      { issue: "Wobbling / Vibration", originalPrice: 299, priceOptions: [199, 249, 299] },
    ]
  },
  wiring: {
    title: "Wiring & Switchboards",
    desc: "Complete wiring, rewiring, earthing & switchboard repair.",
    rating: "4.7",
    basePrice: "₹129 onwards",
    originalBasePrice: "₹199",
    icon: "⚡",
    discount: "35% OFF",
    issues: [
      { issue: "Switch Burnt", originalPrice: 199, priceOptions: [129, 179, 229] },
      { issue: "MCB Tripping", originalPrice: 449, priceOptions: [299, 349, 399] },
      { issue: "Short Circuit", originalPrice: 499, priceOptions: [349, 399, 499] },
    ]
  },
  electrical: {
    title: "Electrical Appliances",
    desc: "Servicing & repair of geyser, fridge, washing machine & more.",
    rating: "4.5",
    basePrice: "₹249 onwards",
    originalBasePrice: "₹399",
    icon: "🔌",
    discount: "38% OFF",
    issues: [
      { issue: "Geyser Not Heating", originalPrice: 599, priceOptions: [399, 499, 599] },
      { issue: "Fridge Not Cooling", originalPrice: 899, priceOptions: [599, 699, 899] },
      { issue: "Washing Machine Leakage", originalPrice: 699, priceOptions: [499, 599, 699] },
    ]
  }
};

// ---------------------------------------------------
// 🔥 CATEGORY TREE
// ---------------------------------------------------
const categoryTree = {
  "ac-repair": {
    subcategories: {
      "Split AC": ["Cooling Issue", "Water Leakage / Drain Block", "Gas Refill (Standard)", "Installation (Split AC)"],
      "Window AC": ["Cooling Issue", "Fan not rotating", "Water dripping", "Power not coming"],
      "Inverter AC": ["Low gas / refrigerant", "Inverter not responding", "Power trip issue"],
    }
  },
  "fan-motor": {
    subcategories: {
      "Ceiling Fan": ["Slow Speed", "Fan Not Starting", "Noise Issue", "Wobbling / Vibration"],
      "Wall Fan": ["Slow Speed", "Motor Heating"],
      "Exhaust Fan": ["Not spinning", "Noise from blade"],
    }
  },
  wiring: {
    subcategories: {
      "Switchboard": ["Switch Burnt", "Fuse Problem"],
      "House Wiring": ["Rewiring", "New Circuit", "Earthing Issue"],
      "Short Circuit": ["MCB Tripping", "Power Cut", "Sparking"],
    }
  },
  electrical: {
    subcategories: {
      "Geyser": ["Geyser Not Heating", "Element Failure"],
      "Refrigerator": ["Fridge Not Cooling", "Compressor Fault"],
      "Washing Machine": ["Drum not spinning", "Leakage"],
    }
  }
};

const allServiceKeys = Object.keys(serviceData);
const GENERIC_PRICES = [199, 299, 399];
const GENERIC_ORIGINAL = 399;

// BRAND GRADIENT
const brandGradient = "from-[#1A2A49] to-[#F37021]";
const brandLightGradient = "from-[#1A2A49]/5 to-[#F37021]/5";

function findPriceOptionsFor(issue, categoryKey) {
  const svc = serviceData[categoryKey];
  if (!svc) return GENERIC_PRICES;
  const exact = svc.issues.find(a => a.issue.toLowerCase() === issue.toLowerCase());
  if (exact) return exact.priceOptions;
  return GENERIC_PRICES;
}

function findOriginalPrice(issue, categoryKey) {
  const svc = serviceData[categoryKey];
  if (!svc) return GENERIC_ORIGINAL;
  const exact = svc.issues.find(a => a.issue.toLowerCase() === issue.toLowerCase());
  if (exact) return exact.originalPrice;
  return GENERIC_ORIGINAL;
}

// ========================= COMPONENT START =========================
export default function ServiceDetail() {
  const { category, sub } = useParams();
  const navigate = useNavigate();
  const { user, addToCart } = useApp();

  const defaultCategory = allServiceKeys[0];
  const [currentCategory, setCurrentCategory] = useState(defaultCategory);
  const [currentSubcategory, setCurrentSubcategory] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (category && serviceData[category]) {
      setCurrentCategory(category);
      setCurrentSubcategory(null);
      if (sub) {
        const subList = Object.keys(categoryTree[category]?.subcategories || {});
        const cleaned = subList.find(
          s => s.toLowerCase().replace(/ /g, "-") === sub.toLowerCase()
        );
        if (cleaned) setCurrentSubcategory(cleaned);
      }
    }
  }, [category, sub]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentCategory, currentSubcategory]);

  const currentService = serviceData[currentCategory];
  if (!currentService) {
    return (
      <div className="min-h-screen flex items-center justify-center font-inter">
        <p className="text-gray-500">Service Not Found</p>
      </div>
    );
  }

  const protect = (fn) => {
    if (!user) {
      alert("Please login first!");
      navigate("/login");
      return;
    }
    fn();
  };

  const isSelected = (cat, subcat, issue) =>
    selectedItems.some(s => s.categoryKey === cat && s.subcategory === subcat && s.issue === issue);

  const getSelectedPrice = (cat, subcat, issue) => {
    const item = selectedItems.find(s => s.categoryKey === cat && s.subcategory === subcat && s.issue === issue);
    return item?.price || null;
  };

  const toggleSelectIssue = (cat, subcat, issue, price) => {
    protect(() => {
      setSelectedItems(prev => {
        const exists = prev.find(s => s.categoryKey === cat && s.subcategory === subcat && s.issue === issue);
        if (exists) {
          return prev.filter(s => !(s.categoryKey === cat && s.subcategory === subcat && s.issue === issue));
        }
        const priceToUse = price !== undefined ? price : findPriceOptionsFor(issue, cat)[0];
        return [...prev, { categoryKey: cat, subcategory: subcat, issue, price: priceToUse }];
      });
    });
  };

  const updatePrice = (cat, subcat, issue, newPrice) => {
    protect(() => {
      setSelectedItems(prev => prev.map(s =>
        s.categoryKey === cat && s.subcategory === subcat && s.issue === issue
          ? { ...s, price: newPrice } : s
      ));
    });
  };

  const removeItem = (issue) => {
    setSelectedItems(prev => prev.filter(p => p.issue !== issue));
  };

  const toggleSelectAllSubcategory = (cat, subcat) => {
    protect(() => {
      const issues = categoryTree[cat]?.subcategories[subcat] || [];
      const allChecked = issues.every(iss => isSelected(cat, subcat, iss));
      setSelectedItems(prev => {
        if (allChecked) {
          return prev.filter(p => !(p.categoryKey === cat && p.subcategory === subcat));
        }
        const add = issues
          .filter(iss => !isSelected(cat, subcat, iss))
          .map(iss => ({
            categoryKey: cat,
            subcategory: subcat,
            issue: iss,
            price: findPriceOptionsFor(iss, cat)[0],
          }));
        return [...prev, ...add];
      });
    });
  };

  const labourCharge = selectedItems.length ? 50 : 0;
  const subtotal = selectedItems.reduce((sum, i) => sum + i.price, 0);
  
  // Calculate original subtotal for savings display
  const originalSubtotal = selectedItems.reduce((sum, i) => {
    const origPrice = findOriginalPrice(i.issue, i.categoryKey);
    return sum + origPrice;
  }, 0);
  const savings = originalSubtotal - subtotal;
  
  const discount = selectedItems.length >= 3 ? subtotal * 0.15 : selectedItems.length === 2 ? subtotal * 0.1 : 0;
  const finalTotal = subtotal + labourCharge - discount;

  const handleCategoryChange = (key) => {
    setCurrentCategory(key);
    setCurrentSubcategory(null);
    navigate(`/services/${key}`);
  };

  const handleSubcategoryClick = (subcat) => {
    setCurrentSubcategory(subcat);
    navigate(`/services/${currentCategory}/${subcat.toLowerCase().replace(/ /g, "-")}`);
  };

  const handleBack = () => {
    if (currentSubcategory) {
      setCurrentSubcategory(null);
      navigate(`/services/${currentCategory}`);
    } else {
      navigate("/");
      setTimeout(() => {
        document.getElementById("our-services")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8FAFC] to-[#F1F5F9] font-inter">
      
      {/* ====== PREMIUM HEADER ====== */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={handleBack} className="flex items-center gap-1.5 text-gray-700 hover:text-[#1A2A49] transition">
            <ChevronLeft size={20} /> <span className="text-sm font-medium">Back</span>
          </button>
          
          <div className="flex items-center gap-2">
            <span className="text-2xl">{currentService.icon}</span>
            <h2 className="font-bold text-[#1A2A49] text-base sm:text-lg font-poppins">{currentService.title}</h2>
          </div>
          
          <button onClick={() => navigate("/")} className="flex items-center gap-1.5 text-gray-700 hover:text-[#1A2A49] transition">
            <Home size={18} /> <span className="text-sm font-medium hidden sm:inline">Home</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 lg:py-8">
        
        {/* ====== SERVICE BANNER - WITH DISCOUNT BADGE ====== */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`bg-gradient-to-r ${brandGradient} rounded-2xl p-5 sm:p-6 mb-6 text-white shadow-xl relative overflow-hidden`}
        >
          {/* Discount Badge */}
          <div className="absolute -top-1 -right-1 sm:top-2 sm:right-2 bg-white text-[#F37021] px-3 sm:px-4 py-1 sm:py-1.5 rounded-full shadow-lg transform rotate-12 sm:rotate-0">
            <span className="font-bold text-xs sm:text-sm flex items-center gap-1">
              <Tag size={14} /> {currentService.discount}
            </span>
          </div>
          
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">{currentService.icon}</span>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold font-poppins">{currentService.title}</h1>
              <div className="flex items-center gap-3 mt-1">
                <span className="flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded-full text-xs">
                  <Star size={12} className="fill-yellow-400 text-yellow-400" /> {currentService.rating}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm line-through text-white/60">{currentService.originalBasePrice}</span>
                  <span className="text-sm font-bold">{currentService.basePrice}</span>
                </div>
              </div>
            </div>
          </div>
          <p className="text-white/90 text-sm">{currentService.desc}</p>
          
          {/* Savings Badge */}
          <div className="mt-3 inline-block bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
            <span className="text-xs text-white">💰 Save up to {currentService.discount}</span>
          </div>
        </motion.div>

        {/* ====== CATEGORY PILLS ====== */}
        <div className="flex flex-wrap gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {allServiceKeys.map(key => (
            <motion.button
              key={key}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleCategoryChange(key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all shadow-sm ${
                currentCategory === key
                  ? `bg-gradient-to-r ${brandGradient} text-white shadow-md`
                  : "bg-white text-gray-700 border border-gray-200 hover:border-[#F37021]/50"
              }`}
            >
              <span>{serviceData[key].icon}</span>
              <span className="hidden sm:inline">{serviceData[key].title}</span>
              <span className="sm:hidden">{serviceData[key].title.split(" ")[0]}</span>
            </motion.button>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* ====== LEFT PANEL ====== */}
          <div className="lg:col-span-2 space-y-5">
            
            {/* Subcategory Cards */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5"
            >
              <h3 className="font-semibold text-[#1A2A49] mb-4 flex items-center gap-2 font-poppins">
                <Sparkles size={18} className="text-[#F37021]" />
                Choose Subcategory
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {Object.keys(categoryTree[currentCategory]?.subcategories || {}).map(subcat => (
                  <motion.div
                    key={subcat}
                    whileHover={{ y: -3 }}
                    onClick={() => handleSubcategoryClick(subcat)}
                    className={`cursor-pointer rounded-xl p-4 transition-all ${
                      currentSubcategory === subcat
                        ? `bg-gradient-to-r ${brandGradient} text-white shadow-md`
                        : "bg-gray-50 hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    <p className={`font-semibold ${currentSubcategory === subcat ? "text-white" : "text-[#1A2A49]"}`}>
                      {subcat}
                    </p>
                    <p className={`text-xs mt-1 ${currentSubcategory === subcat ? "text-white/80" : "text-gray-500"}`}>
                      {categoryTree[currentCategory].subcategories[subcat].length} issues
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Issues Section */}
            {currentSubcategory && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-[#1A2A49] font-poppins">
                    Issues for {currentSubcategory}
                  </h3>
                  <button
                    onClick={() => toggleSelectAllSubcategory(currentCategory, currentSubcategory)}
                    className="text-sm text-[#F37021] font-medium hover:underline"
                  >
                    {categoryTree[currentCategory].subcategories[currentSubcategory].every(
                      iss => isSelected(currentCategory, currentSubcategory, iss)
                    ) ? "Deselect All" : "Select All"}
                  </button>
                </div>

                <div className="space-y-2">
                  {categoryTree[currentCategory].subcategories[currentSubcategory].map((issueName, idx) => {
                    const priceOptions = findPriceOptionsFor(issueName, currentCategory);
                    const originalPrice = findOriginalPrice(issueName, currentCategory);
                    const key = `${currentCategory}-${currentSubcategory}-${idx}`;
                    
                    return (
                      <motion.div
                        key={key}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.03 }}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition"
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            className="w-5 h-5 accent-[#F37021] rounded"
                            checked={isSelected(currentCategory, currentSubcategory, issueName)}
                            onChange={() => toggleSelectIssue(currentCategory, currentSubcategory, issueName)}
                          />
                          <span className="text-gray-800 font-medium">{issueName}</span>
                        </div>
                        
                        <div className="relative flex items-center gap-2">
                          {/* Original Price (Strikethrough) */}
                          <span className="text-xs text-gray-400 line-through">₹{originalPrice}</span>
                          
                          <button
                            onClick={() => protect(() => setOpenDropdown(openDropdown === key ? null : key))}
                            className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-semibold text-green-600"
                          >
                            ₹{getSelectedPrice(currentCategory, currentSubcategory, issueName) || priceOptions[0]}
                            <ChevronDown size={14} className={openDropdown === key ? "rotate-180" : ""} />
                          </button>
                          
                          <AnimatePresence>
                            {openDropdown === key && (
                              <motion.div
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                              >
                                {priceOptions.map((p, i) => (
                                  <div
                                    key={i}
                                    onClick={() => {
                                      updatePrice(currentCategory, currentSubcategory, issueName, p);
                                      setOpenDropdown(null);
                                    }}
                                    className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer text-green-600 font-medium"
                                  >
                                    ₹{p}
                                  </div>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Not Sure Button */}
            <div className={`bg-gradient-to-r ${brandLightGradient} rounded-2xl p-5 text-center border border-[#F37021]/20`}>
              <p className="text-gray-700 text-sm mb-3">❓ Not sure what's wrong?</p>
              <button
                onClick={() => protect(() => {
                  setSelectedItems(prev => [...prev, {
                    categoryKey: currentCategory,
                    subcategory: currentSubcategory || "General",
                    issue: "Engineer Visit for Diagnosis",
                    price: 49
                  }]);
                  setCartOpen(true);
                })}
                className="bg-[#1A2A49] text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-[#223a61] transition shadow-md"
              >
                Request Engineer Visit - ₹49
              </button>
            </div>
          </div>

          {/* ====== RIGHT PANEL - SELECTION SUMMARY ====== */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5"
              >
                <h3 className="font-bold text-[#1A2A49] mb-4 flex items-center gap-2 font-poppins">
                  <CheckCircle2 size={18} className="text-[#F37021]" />
                  Your Selection
                </h3>

                {selectedItems.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-6">No items selected yet</p>
                ) : (
                  <div className="space-y-3 mb-4 max-h-80 overflow-y-auto">
                    {selectedItems.map((item, i) => (
                      <div key={i} className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-800">{item.issue}</p>
                          <p className="text-xs text-gray-500">{item.subcategory}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-green-600">₹{item.price}</span>
                          <button onClick={() => removeItem(item.issue)} className="text-red-500 text-xs">✕</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {selectedItems.length > 0 && (
                  <>
                    <div className="border-t pt-4 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="text-gray-400 line-through">₹{originalSubtotal}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Discounted</span>
                        <span className="text-green-600 font-medium">₹{subtotal}</span>
                      </div>
                      {savings > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>You Save</span>
                          <span>₹{savings}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600">Labour</span>
                        <span>₹{labourCharge}</span>
                      </div>
                      {discount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Bulk Discount</span>
                          <span>-₹{Math.round(discount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-bold text-[#1A2A49] text-base pt-2 border-t">
                        <span>Total</span>
                        <span className="text-green-600">₹{finalTotal}</span>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="relative">
                        <MapPin size={16} className="absolute left-3 top-3 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Enter service address"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F37021] bg-gray-50"
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => protect(() => {
                        if (!address) return alert("Please enter address!");
                        addToCart(selectedItems);
                        navigate(`/request/${currentCategory}`, { state: { selectedItems, finalTotal, address } });
                      })}
                      className="w-full mt-4 py-3 bg-gradient-to-r from-[#F37021] to-[#FF8C42] text-white rounded-xl font-semibold hover:shadow-lg transition"
                    >
                      Proceed to Book →
                    </button>
                  </>
                )}
              </motion.div>

              {/* Trust Badges */}
              <div className="mt-4 grid grid-cols-3 gap-2">
                <div className="bg-white rounded-xl p-2 text-center shadow-sm border border-gray-100">
                  <Shield size={16} className="text-[#F37021] mx-auto mb-1" />
                  <p className="text-[10px] font-medium text-[#1A2A49]">30-Day Warranty</p>
                </div>
                <div className="bg-white rounded-xl p-2 text-center shadow-sm border border-gray-100">
                  <Award size={16} className="text-[#F37021] mx-auto mb-1" />
                  <p className="text-[10px] font-medium text-[#1A2A49]">Verified Experts</p>
                </div>
                <div className="bg-white rounded-xl p-2 text-center shadow-sm border border-gray-100">
                  <Clock size={16} className="text-[#F37021] mx-auto mb-1" />
                  <p className="text-[10px] font-medium text-[#1A2A49]">Same Day Service</p>
                </div>
              </div>
              
              {/* Savings Highlight */}
              {savings > 0 && (
                <div className="mt-3 bg-green-50 border border-green-200 rounded-xl p-3 text-center">
                  <p className="text-green-700 text-sm font-medium flex items-center justify-center gap-1">
                    <Tag size={14} />
                    You're saving ₹{savings} on this order!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Important Info */}
        <div className="mt-8 bg-gradient-to-r from-[#1A2A49]/5 to-[#F37021]/5 rounded-2xl p-5 border border-[#F37021]/20">
          <div className="flex items-start gap-3">
            <Info size={20} className="text-[#F37021] mt-0.5" />
            <div>
              <h3 className="font-semibold text-[#1A2A49] mb-2">Important Information</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Labour charges of ₹50 are mandatory</li>
                <li>• Spare parts extra (if required)</li>
                <li>• 30-day service warranty included</li>
                <li>• Cancellation after engineer arrival → ₹99 fee</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Summary (Mobile) */}
      {selectedItems.length > 0 && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">{selectedItems.length} items</p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 line-through">₹{originalSubtotal}</span>
                <span className="font-bold text-green-600">₹{finalTotal}</span>
              </div>
            </div>
            <button
              onClick={() => setCartOpen(true)}
              className="px-6 py-2.5 bg-[#F37021] text-white rounded-full font-semibold"
            >
              View Cart →
            </button>
          </div>
        </div>
      )}

      {/* Cart Popup */}
      <Cart
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={selectedItems}
        labourCharge={labourCharge}
        discount={discount}
        finalTotal={finalTotal}
        onRemove={removeItem}
        onProceed={() => protect(() => {
          if (!address) return alert("Please enter address!");
          addToCart(selectedItems);
          navigate(`/request/${currentCategory}`, { state: { selectedItems, finalTotal, address } });
        })}
      />
    </div>
  )
}