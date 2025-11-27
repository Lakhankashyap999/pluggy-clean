// src/pages/ServiceDetail.jsx
import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Star,
  Wrench,
  Info,
  ChevronDown
} from "lucide-react";

import { useState, useEffect } from "react";
import Cart from "../components/Cart";
import { useApp } from "../AppContext";

// ---------------------------------------------------
// 🔥 FULL SERVICE DATA (LONG ISSUE LIST INCLUDED)
// ---------------------------------------------------
const serviceData = {
  "ac-repair": {
    title: "AC Repair & Service",
    desc: "Expert AC repair with transparent pricing & 30 days service guarantee.",
    rating: "4.8",
    basePrice: "₹499 onwards",
    issues: [
      { issue: "Cooling Issue", priceOptions: [499, 599, 699] },
      { issue: "Water Leakage / Drain Block", priceOptions: [399, 499, 599] },
      { issue: "Low Cooling / Uneven Cooling", priceOptions: [499, 599, 699] },
      { issue: "Gas Refill (Standard)", priceOptions: [1799, 1999, 2199] },
      { issue: "Indoor Unit Noise", priceOptions: [499, 599, 799] },
      { issue: "Outdoor Unit Noise", priceOptions: [699, 899, 1099] },
      { issue: "Bad Smell Issue", priceOptions: [299, 349, 399] },
      { issue: "Fan Motor Fault", priceOptions: [999, 1199, 1399] },
      { issue: "Remote Not Working", priceOptions: [299, 349, 399] },
      { issue: "PCB Repair", priceOptions: [1499, 1799, 2199] },
      { issue: "AC Not Turning On", priceOptions: [499, 599, 699] },
      { issue: "Installation (Split AC)", priceOptions: [1399, 1499, 1599] },
      { issue: "Uninstallation (Split AC)", priceOptions: [699, 799, 899] }
    ]
  },

  "fan-motor": {
    title: "Fan & Motor Services",
    desc: "Repair, installation & servicing of ceiling, wall & exhaust fans.",
    rating: "4.6",
    basePrice: "₹149 onwards",
    issues: [
      { issue: "Slow Speed", priceOptions: [149, 199, 249] },
      { issue: "Fan Not Starting", priceOptions: [199, 249, 299] },
      { issue: "Noise Issue", priceOptions: [149, 179, 229] },
      { issue: "Wobbling / Vibration", priceOptions: [199, 249, 299] },
      { issue: "Blade Replacement", priceOptions: [249, 349, 399] },
      { issue: "Capacitor Replacement", priceOptions: [199, 249, 299] },
      { issue: "Motor Heating", priceOptions: [299, 349, 399] }
    ]
  },

  wiring: {
    title: "Wiring & Switchboards",
    desc: "Complete wiring, rewiring, earthing & switchboard repair.",
    rating: "4.7",
    basePrice: "₹129 onwards",
    issues: [
      { issue: "Switch Burnt", priceOptions: [129, 179, 229] },
      { issue: "Loose Connection", priceOptions: [149, 199, 249] },
      { issue: "MCB Tripping", priceOptions: [299, 349, 399] },
      { issue: "Short Circuit", priceOptions: [349, 399, 499] },
      { issue: "Plug Point Not Working", priceOptions: [149, 199, 249] },
      { issue: "Fuse Problem", priceOptions: [129, 169, 199] }
    ]
  },

  electrical: {
    title: "Electrical Appliances",
    desc: "Servicing & repair of geyser, fridge, washing machine & more.",
    rating: "4.5",
    basePrice: "₹249 onwards",
    issues: [
      { issue: "Geyser Not Heating", priceOptions: [399, 499, 599] },
      { issue: "Geyser Leakage", priceOptions: [349, 449, 549] },
      { issue: "Fridge Not Cooling", priceOptions: [599, 699, 899] },
      { issue: "Fridge Overcooling", priceOptions: [499, 599, 699] },
      { issue: "Washing Machine Drum Jam", priceOptions: [599, 699, 899] },
      { issue: "Washing Machine Leakage", priceOptions: [499, 599, 699] }
    ]
  }
};

// ---------------------------------------------------
// 🔥 CATEGORY TREE (Subcategory → Issue List)
// ---------------------------------------------------
const categoryTree = {
  "ac-repair": {
    subcategories: {
      "Split AC": [
        "Cooling Issue",
        "Low Cooling / Uneven Cooling",
        "Water Leakage / Drain Block",
        "Gas Refill (Standard)",
        "Indoor Unit Noise",
        "Remote Not Working",
        "PCB Repair",
        "Installation (Split AC)",
        "Uninstallation (Split AC)"
      ],
      "Window AC": [
        "Cooling Issue",
        "Fan not rotating",
        "Water dripping",
        "Thermostat issue",
        "Power not coming"
      ],
      "Inverter AC": [
        "Low gas / refrigerant",
        "Inverter not responding",
        "Display not showing",
        "Power trip issue"
      ]
    }
  },

  "fan-motor": {
    subcategories: {
      "Ceiling Fan": [
        "Slow Speed",
        "Fan Not Starting",
        "Noise Issue",
        "Wobbling / Vibration",
        "Capacitor Replacement"
      ],
      "Wall Fan": [
        "Slow Speed",
        "Blade Replacement",
        "Motor Heating"
      ],
      "Exhaust Fan": [
        "Not spinning",
        "Low suction",
        "Noise from blade"
      ]
    }
  },

  wiring: {
    subcategories: {
      "Switchboard": [
        "Switch Burnt",
        "Loose Connection",
        "Fuse Problem"
      ],
      "House Wiring": [
        "Rewiring",
        "New Circuit",
        "Earthing Issue"
      ],
      "Short Circuit": [
        "MCB Tripping",
        "Power Cut",
        "Sparking"
      ]
    }
  },

  electrical: {
    subcategories: {
      "Geyser": [
        "Geyser Not Heating",
        "Geyser Leakage",
        "Element Failure"
      ],
      "Refrigerator": [
        "Fridge Not Cooling",
        "Fridge Overcooling",
        "Compressor Fault"
      ],
      "Washing Machine": [
        "Drum not spinning",
        "Not Draining",
        "Leakage"
      ]
    }
  }
};

// fallback
const GENERIC_PRICES = [199, 299, 399];

// ---------------------------------------------------
// PRICE RESOLVER
// ---------------------------------------------------
function findPriceOptionsFor(issue, categoryKey) {
  const svc = serviceData[categoryKey];
  if (!svc) return GENERIC_PRICES;

  const exact = svc.issues.find(a => a.issue.toLowerCase() === issue.toLowerCase());
  if (exact) return exact.priceOptions;

  return GENERIC_PRICES;
}

// ---------------------------------------------------
// URL → CATEGORY / SUBCATEGORY MAPPER
// ---------------------------------------------------
function mapRouteToCategorySub(routeId) {
  const id = routeId.toLowerCase();

  if (id.includes("ac")) return { category: "ac-repair" };
  if (id.includes("fan")) return { category: "fan-motor" };
  if (id.includes("wiring")) return { category: "wiring" };
  if (id.includes("geyser") || id.includes("fridge")) return { category: "electrical" };

  return null;
}
// ========================= COMPONENT START =========================

export default function ServiceDetail() {
  const { category, sub } = useParams();  // ⭐ Format A params
  const navigate = useNavigate();
  const { user, addToCart } = useApp();

  const allServiceKeys = Object.keys(serviceData);
  const defaultCategory = allServiceKeys[0]; // fallback → ac-repair

  const [currentCategory, setCurrentCategory] = useState(defaultCategory);
  const [currentSubcategory, setCurrentSubcategory] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [address, setAddress] = useState("");

  // ⭐ FULL ROUTE LOGIC (Format A)
  useEffect(() => {
    if (category) {
      // direct category match
      if (serviceData[category]) {
        setCurrentCategory(category);
        setCurrentSubcategory(null);

        if (sub) {
          const subList = Object.keys(categoryTree[category]?.subcategories || {});
          const cleaned = subList.find(
            s => s.toLowerCase().replace(/ /g, "-") === sub.toLowerCase()
          );
          if (cleaned) {
            setCurrentSubcategory(cleaned);
          }
        }
        return;
      }

      // fallback mapping
      const mapped = mapRouteToCategorySub(category);
      if (mapped?.category) {
        setCurrentCategory(mapped.category);
        setCurrentSubcategory(null);
        return;
      }
    }

    // fallback: default
    setCurrentCategory(defaultCategory);
    setCurrentSubcategory(null);
  }, [category, sub]);

  // scroll to top on change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentCategory, currentSubcategory]);

  // if category invalid
  const currentService = serviceData[currentCategory];
  if (!currentService) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Service Not Found</p>
      </div>
    );
  }

  // Login blocker
  const protect = (fn) => {
    if (!user) {
      alert("Please login first!");
      navigate("/login");
      return;
    }
    fn();
  };
  // ------------------- Selection Helpers -------------------
  const isSelected = (cat, subcat, issue) =>
    selectedItems.some(
      s =>
        s.categoryKey === cat &&
        s.subcategory === subcat &&
        s.issue === issue
    );

  const getSelectedPrice = (cat, subcat, issue) => {
    const item = selectedItems.find(
      s =>
        s.categoryKey === cat &&
        s.subcategory === subcat &&
        s.issue === issue
    );
    return item?.price || null;
  };

  const toggleSelectIssue = (cat, subcat, issue, price) => {
    protect(() => {
      setSelectedItems(prev => {
        const exists = prev.find(
          s =>
            s.categoryKey === cat &&
            s.subcategory === subcat &&
            s.issue === issue
        );

        if (exists) {
          // remove
          return prev.filter(
            s =>
              !(
                s.categoryKey === cat &&
                s.subcategory === subcat &&
                s.issue === issue
              )
          );
        }

        // add new
        const priceToUse =
          price !== undefined
            ? price
            : findPriceOptionsFor(issue, cat)[0] || GENERIC_PRICES[0];

        return [
          ...prev,
          {
            categoryKey: cat,
            subcategory: subcat,
            issue,
            price: priceToUse,
          },
        ];
      });
    });
  };

  const updatePrice = (cat, subcat, issue, newPrice) => {
    protect(() => {
      setSelectedItems(prev =>
        prev.map(s =>
          s.categoryKey === cat &&
          s.subcategory === subcat &&
          s.issue === issue
            ? { ...s, price: newPrice }
            : s
        )
      );
    });
  };

  const removeItem = issue => {
    setSelectedItems(prev => prev.filter(p => p.issue !== issue));
  };

  const toggleSelectAllSubcategory = (cat, subcat) => {
    protect(() => {
      const issues = categoryTree[cat]?.subcategories[subcat] || [];
      const allChecked = issues.every(iss =>
        isSelected(cat, subcat, iss)
      );

      setSelectedItems(prev => {
        if (allChecked) {
          // unselect all
          return prev.filter(
            p =>
              !(
                p.categoryKey === cat &&
                p.subcategory === subcat
              )
          );
        }

        // add all
        const add = issues
          .filter(iss => !isSelected(cat, subcat, iss))
          .map(iss => ({
            categoryKey: cat,
            subcategory: subcat,
            issue: iss,
            price:
              findPriceOptionsFor(iss, cat)[0] || GENERIC_PRICES[0],
          }));

        return [...prev, ...add];
      });
    });
  };

  // ------------------- Pricing Logic -------------------
  const labourCharge = selectedItems.length ? 50 : 0;

  const subtotal = selectedItems.reduce((sum, i) => sum + i.price, 0);

  const discount =
    selectedItems.length >= 3
      ? subtotal * 0.15
      : selectedItems.length === 2
      ? subtotal * 0.1
      : 0;

  const finalTotal = subtotal + labourCharge - discount;

  // ------------------- Issues Table Renderer -------------------
  const renderIssuesTable = (cat, subcat) => {
    const issues = categoryTree[cat]?.subcategories[subcat] || [];

    return (
      <table className="w-full text-sm border-separate border-spacing-y-2">
        <thead>
          <tr className="text-gray-600 text-left">
            <th>Select</th>
            <th>Issue</th>
            <th>Charges</th>
          </tr>
        </thead>

        <tbody>
          {issues.map((issueName, idx) => {
            const priceOptions = findPriceOptionsFor(issueName, cat);
            const key = `${cat}-${subcat}-${idx}`;

            return (
              <tr key={key} className="bg-gray-50 hover:bg-gray-100">
                {/* Checkbox */}
                <td className="px-3 py-2">
                  <input
                    type="checkbox"
                    className="accent-[#1A2A49]"
                    checked={isSelected(cat, subcat, issueName)}
                    onChange={() =>
                      toggleSelectIssue(cat, subcat, issueName)
                    }
                  />
                </td>

                {/* Issue Name */}
                <td className="px-3 py-2 font-medium">
                  {issueName}
                </td>

                {/* Price Dropdown */}
                <td className="px-3 py-2 relative">
                  <div
                    className="cursor-pointer flex items-center"
                    onClick={() =>
                      protect(() =>
                        setOpenDropdown(openDropdown === key ? null : key)
                      )
                    }
                  >
                    ₹
                    {getSelectedPrice(cat, subcat, issueName) ||
                      priceOptions[0]}
                    <ChevronDown
                      size={14}
                      className={`ml-2 transition-transform ${
                        openDropdown === key ? "rotate-180" : ""
                      }`}
                    />
                  </div>

                  {openDropdown === key && (
                    <div className="absolute right-0 z-50 bg-white border shadow rounded-lg">
                      {priceOptions.map((p, i) => (
                        <div
                          key={i}
                          onClick={() =>
                            updatePrice(cat, subcat, issueName, p)
                          }
                          className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                        >
                          ₹{p}
                        </div>
                      ))}
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };
  return (
    <div className="min-h-screen bg-gray-50 pb-32">

      {/* ================= HEADER ================= */}
      <div className="bg-white border-b sticky top-0 z-20 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">

          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-700 hover:text-[#1A2A49]"
          >
            <ChevronLeft size={20} /> Back
          </button>

          {/* Page Title */}
          <h2 className="font-bold text-[#1A2A49]">
            {currentService.title}
          </h2>

          {/* Home */}
          <button
            onClick={() => navigate("/")}
            className="text-sm text-[#1A2A49] hover:underline"
          >
            Home
          </button>
        </div>
      </div>

      {/* ================= MAIN GRID ================= */}
      <div className="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-10">

        {/* ================= LEFT SIDE SUMMARY ================= */}
        <div className="bg-white shadow rounded-xl border p-6">

          {/* Title */}
          <h1 className="text-2xl font-bold text-[#1A2A49]">
            {currentService.title}
          </h1>
          <p className="text-gray-600 mt-2">{currentService.desc}</p>

          {/* Rating + Price */}
          <div className="flex items-center gap-4 mt-4">
            <span className="flex items-center gap-1 text-yellow-500">
              <Star size={18} /> {currentService.rating}
            </span>

            <span className="text-lg font-bold text-[#1A2A49]">
              {selectedItems.length
                ? `₹${finalTotal}`
                : currentService.basePrice}
            </span>
          </div>

          {/* ================= SELECTED ITEMS SECTION ================= */}
          {selectedItems.length > 0 && (
            <div className="mt-6 border-t pt-4">
              <h3 className="font-semibold text-[#1A2A49] mb-2">
                Your Selected Items
              </h3>

              <ul className="space-y-2 text-sm">
                {selectedItems.map((it, i) => (
                  <li
                    key={i}
                    className="bg-gray-50 rounded-lg px-3 py-2 flex justify-between items-center"
                  >
                    <div>
                      <div className="font-medium text-gray-800">
                        {it.issue}
                      </div>
                      <div className="text-xs text-gray-500">
                        {serviceData[it.categoryKey]?.title} • {it.subcategory}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-medium">₹{it.price}</span>

                      <button
                        onClick={() => removeItem(it.issue)}
                        className="text-red-500 text-xs hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Address + Checkout */}
              <div className="mt-4">
                <input
                  className="w-full border rounded-lg px-3 py-2 text-sm mb-3 focus:ring-[#1A2A49] focus:ring-2"
                  placeholder="Enter service address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />

                <div className="flex justify-between items-center text-sm">
                  <div className="text-gray-700">
                    Labour: ₹{labourCharge} • Discount: ₹{Math.round(discount)}
                  </div>

                  <button
                    onClick={() =>
                      protect(() => {
                        if (!address) return alert("Please enter address!");

                        addToCart(selectedItems);
                        navigate(`/request/${currentCategory}`, {
                          state: { selectedItems, finalTotal, address }
                        });
                      })
                    }
                    className="px-6 py-2 bg-[#1A2A49] text-white rounded-lg hover:bg-[#223a61]"
                  >
                    Proceed →
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* ================= RIGHT SIDE — CATEGORIES / SUBCATEGORY / ISSUES ================= */}
        <div className="bg-white shadow rounded-xl border p-6">

          {/* Heading */}
          <h3 className="font-semibold text-[#1A2A49] mb-4 flex items-center gap-2">
            <Wrench size={18} /> Services & Issues
          </h3>

          {/* CATEGORY PILLS */}
          <div className="flex flex-wrap gap-2 mb-5">
            {allServiceKeys.map(key => (
              <button
                key={key}
                onClick={() => {
                  navigate(`/services/${key}`);
                  setCurrentSubcategory(null);
                }}
                className={`px-3 py-2 rounded-full text-sm border ${
                  currentCategory === key
                    ? "bg-[#1A2A49] text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {serviceData[key].title}
              </button>
            ))}
          </div>

          {/* SUBCATEGORY CARDS */}
          <div>
            <div className="text-sm text-gray-600 mb-2">
              Choose a subcategory
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.keys(categoryTree[currentCategory]?.subcategories || {}).map(subcat => (
                <div
                  key={subcat}
                  onClick={() => setCurrentSubcategory(subcat)}
                  className={`cursor-pointer border rounded-lg p-3 ${
                    currentSubcategory === subcat
                      ? "bg-[#eef2ff] border-[#c7d2fe]"
                      : "bg-white hover:bg-gray-50"
                  }`}
                >
                  <div className="font-semibold text-gray-800 text-sm">{subcat}</div>
                  <div className="text-xs text-gray-500">
                    {categoryTree[currentCategory].subcategories[subcat].length} issues
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ISSUES TABLE */}
          <div className="mt-6">
            {currentSubcategory ? (
              <>
                <div className="flex justify-between mb-2">
                  <div className="text-sm text-gray-600">
                    Issues for <b>{currentSubcategory}</b>
                  </div>

                  <button
                    onClick={() =>
                      toggleSelectAllSubcategory(currentCategory, currentSubcategory)
                    }
                    className="text-sm text-[#1A2A49] hover:underline"
                  >
                    {categoryTree[currentCategory].subcategories[currentSubcategory].every(
                      iss => isSelected(currentCategory, currentSubcategory, iss)
                    )
                      ? "Unselect All"
                      : "Select All"}
                  </button>
                </div>

                {renderIssuesTable(currentCategory, currentSubcategory)}
              </>
            ) : (
              <div className="text-sm text-gray-500">
                Select a subcategory to view issues.
              </div>
            )}
          </div>

          {/* NOT SURE BUTTON */}
          <div className="mt-6 bg-[#f9fafb] border rounded-lg p-4 text-center">
            <p className="text-gray-700 text-sm mb-2">
              ❓ Not sure what's wrong? Book inspection for ₹49
            </p>

            <button
              onClick={() =>
                protect(() => {
                  setSelectedItems(prev => [
                    ...prev,
                    {
                      categoryKey: currentCategory,
                      subcategory: currentSubcategory || "General",
                      issue: "Engineer Visit for Diagnosis",
                      price: 49
                    }
                  ]);
                  setCartOpen(true);
                })
              }
              className="bg-[#1A2A49] text-white px-5 py-2 rounded-lg hover:bg-[#223a61]"
            >
              Request Engineer Visit
            </button>
          </div>
        </div>
      </div>

      {/* ================= INFO SECTION ================= */}
      <div className="max-w-6xl mx-auto px-4 mb-10">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 flex gap-3">
          <Info size={20} className="text-blue-600 mt-1" />

          <div>
            <h3 className="font-semibold text-[#1A2A49] mb-2">Important Information</h3>
            <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
              <li>Labour charges of ₹50 are mandatory.</li>
              <li>Spare parts extra (if required).</li>
              <li>30-day service warranty included.</li>
              <li>Cancellation after engineer arrival → ₹99 fee.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ================= BOTTOM SUMMARY ================= */}
      {selectedItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-30">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <span className="text-sm">
              {selectedItems.length} selected • Total: ₹{finalTotal}
            </span>

            <button
              onClick={() => setCartOpen(true)}
              className="px-6 py-2 bg-[#1A2A49] text-white rounded-lg hover:bg-[#223a61]"
            >
              View Cart →
            </button>
          </div>
        </div>
      )}

      {/* ================= CART POPUP ================= */}
      <Cart
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={selectedItems}
        labourCharge={labourCharge}
        discount={discount}
        finalTotal={finalTotal}
        onRemove={removeItem}
        onProceed={() =>
          protect(() => {
            if (!address) return alert("Please enter address!");

            addToCart(selectedItems);
            navigate(`/request/${currentCategory}`, {
              state: { selectedItems, finalTotal, address }
            });
          })
        }
      />

    </div>
  );
}
