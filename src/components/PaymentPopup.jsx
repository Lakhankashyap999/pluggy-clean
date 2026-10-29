// src/components/PaymentPopup.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Timer,
  Smartphone,
  CreditCard,
  Building,
  Wallet,
  CheckCircle2,
  ChevronLeft,
  Shield,
  Copy,
  Check,
  QrCode,
  Database,
  Zap,
  Receipt,
} from "lucide-react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import successAnim from "../assets/success.lottie";

const upiApps = [
  {
    id: "gpay",
    name: "Google Pay",
    icon: "https://upload.wikimedia.org/wikipedia/commons/7/7a/GPay_Logo.png",
    color: "#1A73E8",
  },
  {
    id: "phonepe",
    name: "PhonePe",
    icon: "https://upload.wikimedia.org/wikipedia/commons/5/5b/PhonePe_Logo.png",
    color: "#6739B7",
  },
  {
    id: "paytm",
    name: "Paytm",
    icon: "https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo.png",
    color: "#00BAF2",
  },
  {
    id: "amazonpay",
    name: "Amazon Pay",
    icon: "https://upload.wikimedia.org/wikipedia/commons/1/1f/Amazon_Pay_logo.svg",
    color: "#FF9900",
  },
];

export default function PaymentPopup({ open, onClose, amount, onSuccess, title = "Complete Escrow Payment" }) {
  const [step, setStep] = useState("method"); // method, upi, card, processing, success
  const [selectedMethod, setSelectedMethod] = useState("UPI");
  const [selectedChannel, setSelectedChannel] = useState("Google Pay");
  const [selectedUpiApp, setSelectedUpiApp] = useState(null);
  const [upiId, setUpiId] = useState("lakhan@okaxis");
  const [timeLeft, setTimeLeft] = useState(600);
  const [processingStep, setProcessingStep] = useState(0);
  const [transactionId, setTransactionId] = useState("");
  const [copied, setCopied] = useState(false);

  const [cardForm, setCardForm] = useState({
    number: "4242 4242 4242 8890",
    expiry: "09/28",
    cvv: "888",
    name: "Lakhan Kashyap",
  });

  const generateTransactionId = () => {
    const date = new Date();
    const yy = date.getFullYear().toString().slice(-2);
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const seq = String(Math.floor(Math.random() * 8999) + 1000);
    return `PLG${yy}${mm}${dd}${seq}`;
  };

  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setStep("method");
        setSelectedMethod("UPI");
        setSelectedChannel("Google Pay");
        setSelectedUpiApp(null);
        setProcessingStep(0);
        setTimeLeft(600);
      }, 250);
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [open]);

  useEffect(() => {
    if (step === "processing") {
      const steps = [0, 1, 2];
      let current = 0;
      const interval = setInterval(() => {
        if (current < steps.length - 1) {
          current++;
          setProcessingStep(current);
        } else {
          clearInterval(interval);
          setTimeout(() => {
            const txId = generateTransactionId();
            setTransactionId(txId);
            setStep("success");
          }, 500);
        }
      }, 650);
      return () => clearInterval(interval);
    }
  }, [step]);

  if (!open) return null;

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");
  const progressPercent = (timeLeft / 600) * 100;

  const triggerPaymentFlow = (methodName, channelName) => {
    setSelectedMethod(methodName);
    setSelectedChannel(channelName);
    setProcessingStep(0);
    setStep("processing");
  };

  const handleSuccess = () => {
    const meta = {
      transactionId,
      paymentMethod: selectedMethod || "UPI",
      paymentChannel: selectedChannel || "Google Pay",
      amount: Number(amount || 0),
      paidAt: new Date().toISOString(),
    };
    setStep("method");
    onClose();
    if (onSuccess) {
      onSuccess(transactionId, meta);
    }
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) return parts.join(" ");
    return value;
  };

  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) return v.slice(0, 2) + "/" + v.slice(2, 4);
    return v;
  };

  const copyTransactionId = () => {
    navigator.clipboard?.writeText(transactionId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center font-inter">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/55 backdrop-blur-sm"
        onClick={step === "processing" || step === "success" ? undefined : onClose}
      />

      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[92vh] overflow-hidden flex flex-col border border-slate-200"
      >
        {/* Header */}
        <div className="sticky top-0 bg-[#1A2A49] text-white px-5 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            {step !== "method" && step !== "processing" && step !== "success" && (
              <button
                onClick={() => {
                  setStep("method");
                  setSelectedUpiApp(null);
                }}
                className="p-1.5 hover:bg-white/10 rounded-full transition"
              >
                <ChevronLeft size={20} />
              </button>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold">
                  {step === "method" && title}
                  {step === "upi" && (selectedUpiApp?.name || "UPI Gateway")}
                  {step === "card" && "Card Checkout"}
                  {step === "processing" && "Recording SQL Transaction"}
                  {step === "success" && "Escrow Payment Recorded"}
                </h2>
              </div>
              <p className="text-[11px] text-blue-200 flex items-center gap-1 mt-0.5">
                <Database size={11} className="text-[#F37021]" /> Pluggy SQL Escrow Gateway
              </p>
            </div>
          </div>
          {step === "method" && (
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-white/10 rounded-full transition"
            >
              <X size={20} className="text-blue-200" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {/* ====== STEP 1: METHOD SELECTION ====== */}
            {step === "method" && (
              <motion.div
                key="method"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                className="p-5 space-y-5"
              >
                {/* Timer Bar */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-slate-600 flex items-center gap-1 font-medium">
                      <Timer size={14} className="text-[#F37021]" />
                      Session active for
                    </span>
                    <span className="font-mono font-bold text-[#1A2A49]">
                      {minutes}:{seconds}
                    </span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-[#F37021] to-[#FF8C42]"
                      initial={{ width: "100%" }}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: 1, ease: "linear" }}
                    />
                  </div>
                </div>

                {/* Amount + Escrow Breakdown Card */}
                <div className="bg-gradient-to-br from-[#1A2A49] to-[#223a61] rounded-2xl p-4 text-white shadow-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-blue-200">Total Payable Amount</p>
                      <p className="text-3xl font-extrabold mt-0.5">₹{amount}</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-bold">
                        <Shield size={11} /> 100% Escrow Safe
                      </span>
                      <p className="text-[10px] text-blue-200 mt-1">
                        Released on Happy-PIN
                      </p>
                    </div>
                  </div>
                </div>

                {/* 1-CLICK INSTANT DEMO PAY BUTTON */}
                <div className="bg-orange-50/80 border-2 border-[#F37021]/30 rounded-2xl p-3.5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#F37021] flex items-center gap-1">
                      <Zap size={13} /> 1-Click Instant Demo Payment
                    </span>
                    <span className="text-[10px] font-bold bg-white text-[#1A2A49] px-2 py-0.5 rounded-md border border-orange-200">
                      Recommended for Testing
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => triggerPaymentFlow("UPI", "Pluggy Instant UPI QR")}
                    className="w-full py-3 bg-[#F37021] hover:bg-[#e06318] text-white rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition active:scale-[0.99]"
                  >
                    <QrCode size={16} /> Instant Demo Pay ₹{amount} (UPI Escrow)
                  </button>
                </div>

                {/* UPI Apps Grid */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                    Or Pay via UPI Apps
                  </p>
                  <div className="grid grid-cols-4 gap-2.5">
                    {upiApps.map((app) => (
                      <button
                        key={app.id}
                        type="button"
                        onClick={() => {
                          setSelectedUpiApp(app);
                          setSelectedMethod("UPI");
                          setSelectedChannel(app.name);
                          setStep("upi");
                        }}
                        className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-slate-50 hover:bg-orange-50/50 transition border border-slate-200 hover:border-[#F37021]"
                      >
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm p-1.5">
                          <img
                            src={app.icon}
                            alt={app.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <span className="text-[11px] font-bold text-[#1A2A49]">
                          {app.name.split(" ")[0]}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Other Payment Methods */}
                <div className="space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Cards, Netbanking & Pay After Service
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedMethod("CARD");
                      setSelectedChannel("Visa / Mastercard");
                      setStep("card");
                    }}
                    className="w-full flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 hover:border-[#1A2A49] hover:bg-slate-50 transition text-left"
                  >
                    <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                      <CreditCard size={18} className="text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs sm:text-sm font-bold text-[#1A2A49]">
                        Credit / Debit Card
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Visa, Mastercard, RuPay supported
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => triggerPaymentFlow("NETBANKING", "HDFC / SBI Netbanking")}
                    className="w-full flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 hover:border-[#1A2A49] hover:bg-slate-50 transition text-left"
                  >
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                      <Building size={18} className="text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs sm:text-sm font-bold text-[#1A2A49]">
                        Netbanking (All Indian Banks)
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Instant SQL settlement confirmation
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      triggerPaymentFlow("PAY_AFTER_SERVICE", "Pay on Happy-PIN Completion")
                    }
                    className="w-full flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 hover:border-[#F37021] hover:bg-orange-50/30 transition text-left"
                  >
                    <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                      <Wallet size={18} className="text-[#F37021]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs sm:text-sm font-bold text-[#1A2A49]">
                        Pay After Repair (Cash / UPI on Happy PIN)
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Book now for ₹0 upfront; pay engineer after completion
                      </p>
                    </div>
                  </button>
                </div>
              </motion.div>
            )}

            {/* ====== STEP: UPI INPUT ====== */}
            {step === "upi" && (
              <motion.div
                key="upi"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                className="p-5 space-y-5"
              >
                <div className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <img
                    src={selectedUpiApp?.icon}
                    alt={selectedUpiApp?.name}
                    className="w-10 h-10 object-contain"
                  />
                  <div>
                    <p className="text-sm font-bold text-[#1A2A49]">
                      {selectedUpiApp?.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      Escrow-linked UPI Collect & Intent
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-slate-500">Amount to Pay</p>
                  <p className="text-3xl font-extrabold text-[#1A2A49]">₹{amount}</p>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 block">
                    Enter UPI ID (Auto-filled for Demo)
                  </label>
                  <div className="relative">
                    <Smartphone
                      size={18}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="text"
                      placeholder="username@okaxis"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full pl-10 pr-4 py-3.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F37021] text-sm font-semibold text-[#1A2A49]"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    triggerPaymentFlow(
                      "UPI",
                      `${selectedUpiApp?.name || "UPI"} (${upiId || "demo@upi"})`
                    )
                  }
                  className="w-full py-3.5 rounded-xl font-bold text-white bg-[#1A2A49] hover:bg-[#223a61] transition shadow-md text-sm"
                >
                  Verify & Pay ₹{amount}
                </button>
              </motion.div>
            )}

            {/* ====== STEP: CARD PAYMENT ====== */}
            {step === "card" && (
              <motion.div
                key="card"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                className="p-5 space-y-4"
              >
                <div className="bg-gradient-to-r from-[#1A2A49] to-[#223a61] rounded-2xl p-4 text-white">
                  <p className="text-[10px] uppercase tracking-wider text-blue-200 mb-2">
                    PLUGGY ESCROW CARD VAULT
                  </p>
                  <p className="font-mono text-base font-bold mb-3">
                    {cardForm.number || "4242 •••• •••• 8890"}
                  </p>
                  <div className="flex justify-between text-xs text-blue-100">
                    <span>{cardForm.name || "LAKHAN KASHYAP"}</span>
                    <span>{cardForm.expiry || "09/28"}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 mb-1 block">
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={cardForm.number}
                      onChange={(e) =>
                        setCardForm({
                          ...cardForm,
                          number: formatCardNumber(e.target.value),
                        })
                      }
                      maxLength={19}
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-[#1A2A49]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-700 mb-1 block">
                        Expiry
                      </label>
                      <input
                        type="text"
                        value={cardForm.expiry}
                        onChange={(e) =>
                          setCardForm({
                            ...cardForm,
                            expiry: formatExpiry(e.target.value),
                          })
                        }
                        maxLength={5}
                        className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-[#1A2A49]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 mb-1 block">
                        CVV
                      </label>
                      <input
                        type="password"
                        value={cardForm.cvv}
                        onChange={(e) =>
                          setCardForm({
                            ...cardForm,
                            cvv: e.target.value.slice(0, 3),
                          })
                        }
                        maxLength={3}
                        className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-[#1A2A49]"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    triggerPaymentFlow(
                      "CARD",
                      `Card ending ${String(cardForm.number).slice(-4) || "8890"}`
                    )
                  }
                  className="w-full py-3.5 rounded-xl font-bold text-white bg-[#1A2A49] hover:bg-[#223a61] transition shadow-md text-sm"
                >
                  Pay ₹{amount} Securely
                </button>
              </motion.div>
            )}

            {/* ====== STEP: PROCESSING ====== */}
            {step === "processing" && (
              <motion.div
                key="processing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-8 flex flex-col items-center text-center"
              >
                <div className="relative w-20 h-20 mb-5">
                  <motion.div
                    className="absolute inset-0 border-4 border-[#F37021] border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
                  />
                </div>

                <h3 className="text-lg font-extrabold text-[#1A2A49] mb-1">
                  {processingStep === 0 && "Verifying Payment Channel..."}
                  {processingStep === 1 && "Locking Funds in Pluggy Escrow..."}
                  {processingStep === 2 && "Writing SQL Transaction Record..."}
                </h3>
                <p className="text-slate-500 text-xs">
                  Syncing across Customer, Admin & Engineer portals
                </p>
              </motion.div>
            )}

            {/* ====== STEP: SUCCESS ====== */}
            {step === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="p-6 flex flex-col items-center text-center"
              >
                <div className="w-28 h-28 mb-2">
                  <DotLottieReact src={successAnim} loop={false} autoplay />
                </div>

                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold mb-2 border border-emerald-200">
                  <CheckCircle2 size={14} /> Recorded in SQL Ledger
                </span>

                <h3 className="text-xl font-extrabold text-[#1A2A49]">
                  Payment Confirmed: ₹{amount}
                </h3>
                <p className="text-xs text-slate-500 mt-1 mb-4">
                  Method: <strong>{selectedMethod}</strong> ({selectedChannel})
                </p>

                {/* Official Receipt Box */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 w-full mb-5 text-left space-y-2 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500 flex items-center gap-1 font-medium">
                      <Receipt size={13} className="text-[#F37021]" /> SQL Transaction ID
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-extrabold text-[#1A2A49]">
                        {transactionId}
                      </span>
                      <button
                        type="button"
                        onClick={copyTransactionId}
                        className="p-1 hover:bg-slate-200 rounded"
                      >
                        {copied ? (
                          <Check size={14} className="text-emerald-600" />
                        ) : (
                          <Copy size={14} className="text-slate-500" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Escrow Status</span>
                    <span className="font-bold text-emerald-700">
                      Protected Until Happy-PIN
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Timestamp</span>
                    <span className="font-semibold text-slate-700">
                      {new Date().toLocaleTimeString()}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSuccess}
                  className="w-full py-3.5 bg-[#1A2A49] hover:bg-[#223a61] text-white rounded-xl font-extrabold text-sm transition shadow-md"
                >
                  Continue & View Live Order →
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
