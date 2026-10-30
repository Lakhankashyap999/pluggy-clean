// src/components/PaymentPopup.jsx
import { useState, useEffect, useRef } from "react";
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

// High-precision Inline SVG Brand Icons (100% reliable, never break or 404)
function UpiBrandLogo({ id, size = "md" }) {
  const cls = size === "lg" ? "w-12 h-12" : "w-11 h-11";

  if (id === "gpay") {
    return (
      <div
        className={`${cls} rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center p-1.5`}
      >
        <svg viewBox="0 0 48 48" className="w-full h-full">
          <path
            fill="#EA4335"
            d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
          />
          <path
            fill="#4285F4"
            d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
          />
          <path
            fill="#FBBC05"
            d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
          />
          <path
            fill="#34A853"
            d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
          />
        </svg>
      </div>
    );
  }

  if (id === "phonepe") {
    return (
      <div
        className={`${cls} rounded-2xl bg-[#5F259F] shadow-sm flex items-center justify-center`}
      >
        <svg viewBox="0 0 48 48" className="w-7 h-7">
          <text
            x="50%"
            y="56%"
             dominantBaseline="middle"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="28"
            fontWeight="800"
            fontFamily="sans-serif"
          >
            पे
          </text>
        </svg>
      </div>
    );
  }

  if (id === "paytm") {
    return (
      <div
        className={`${cls} rounded-2xl bg-white border border-sky-200 shadow-sm flex items-center justify-center px-1`}
      >
        <div className="flex items-center font-extrabold tracking-tighter text-[12px] leading-none">
          <span className="text-[#002970]">Pay</span>
          <span className="text-[#00BAF2]">tm</span>
        </div>
      </div>
    );
  }

  // Amazon Pay
  return (
    <div
      className={`${cls} rounded-2xl bg-[#232F3E] shadow-sm flex flex-col items-center justify-center px-1`}
    >
      <span className="text-white font-extrabold text-[10px] tracking-tight leading-none">
        amazon
      </span>
      <span className="text-[#FF9900] font-extrabold text-[10px] leading-none mt-0.5">
        pay  smile
      </span>
    </div>
  );
}

const upiApps = [
  { id: "gpay", name: "Google Pay", handle: "@okaxis", color: "#1A73E8" },
  { id: "phonepe", name: "PhonePe", handle: "@ybl", color: "#5F259F" },
  { id: "paytm", name: "Paytm UPI", handle: "@paytm", color: "#00BAF2" },
  { id: "amazonpay", name: "Amazon Pay", handle: "@apl", color: "#FF9900" },
];

export default function PaymentPopup({
  open,
  onClose,
  amount,
  onSuccess,
  title = "Complete Escrow Payment",
}) {
  const [step, setStep] = useState("method"); // method, upi, card, processing, success
  const [selectedMethod, setSelectedMethod] = useState("UPI");
  const [selectedChannel, setSelectedChannel] = useState("Google Pay");
  const [selectedUpiApp, setSelectedUpiApp] = useState(null);
  const [upiId, setUpiId] = useState("lakhan@okaxis");
  const [timeLeft, setTimeLeft] = useState(600);
  const [processingStep, setProcessingStep] = useState(0);
  const [transactionId, setTransactionId] = useState("");
  const [copied, setCopied] = useState(false);
  const committedRef = useRef(false);
  const onSuccessRef = useRef(onSuccess);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onSuccessRef.current = onSuccess;
    onCloseRef.current = onClose;
  }, [onSuccess, onClose]);

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
      committedRef.current = false;
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
          }, 300);
        }
      }, 380);
      return () => clearInterval(interval);
    }
  }, [step]);

  // Auto-commit booking once payment reaches "success" (stable dependency array so 1s timer never cancels it)
  useEffect(() => {
    if (step === "success" && transactionId && !committedRef.current) {
      const timer = setTimeout(() => {
        if (!committedRef.current) {
          committedRef.current = true;
          const meta = {
            transactionId,
            paymentMethod: selectedMethod || "UPI",
            paymentChannel: selectedChannel || "Google Pay",
            amount: Number(amount || 0),
            paidAt: new Date().toISOString(),
          };
          setStep("method");
          if (onSuccessRef.current) {
            onSuccessRef.current(transactionId, meta);
          }
          if (onCloseRef.current) {
            onCloseRef.current();
          }
        }
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [step, transactionId, selectedMethod, selectedChannel, amount]);

  if (!open) return null;

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");
  const progressPercent = (timeLeft / 600) * 100;

  const triggerPaymentFlow = (methodName, channelName) => {
    committedRef.current = false;
    setSelectedMethod(methodName);
    setSelectedChannel(channelName);
    setProcessingStep(0);
    setStep("processing");
  };

  const handleSuccess = () => {
    if (committedRef.current) return;
    committedRef.current = true;
    const meta = {
      transactionId,
      paymentMethod: selectedMethod || "UPI",
      paymentChannel: selectedChannel || "Google Pay",
      amount: Number(amount || 0),
      paidAt: new Date().toISOString(),
    };
    setStep("method");
    if (onSuccessRef.current) {
      onSuccessRef.current(transactionId, meta);
    }
    if (onCloseRef.current) {
      onCloseRef.current();
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
        onClick={
          step === "processing" || step === "success" ? undefined : onClose
        }
      />

      <motion.div
        initial={{ y: "100%", opacity: 0.6 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ type: "spring", damping: 24, stiffness: 280 }}
        className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[92vh] overflow-hidden flex flex-col border border-slate-200"
      >
        {/* Header */}
        <div className="sticky top-0 bg-[#1A2A49] text-white px-5 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            {step !== "method" &&
              step !== "processing" &&
              step !== "success" && (
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
              <h2 className="text-base font-extrabold">
                {step === "method" && title}
                {step === "upi" && (selectedUpiApp?.name || "UPI Gateway")}
                {step === "card" && "Card Checkout"}
                {step === "processing" && "Recording SQL Transaction"}
                {step === "success" && "Escrow Payment Recorded"}
              </h2>
              <p className="text-[11px] text-blue-200 flex items-center gap-1 mt-0.5">
                <Database size={11} className="text-[#F37021]" /> Pluggy SQL
                Escrow Gateway
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
                <motion.div
                  initial={{ scale: 0.96, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-gradient-to-br from-[#1A2A49] to-[#223a61] rounded-2xl p-4 text-white shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-blue-200">
                        Total Payable Amount
                      </p>
                      <p className="text-3xl font-extrabold mt-0.5">
                        ₹{amount}
                      </p>
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
                </motion.div>

                {/* 1-CLICK INSTANT DEMO PAY BUTTON */}
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="bg-orange-50/80 border-2 border-[#F37021]/30 rounded-2xl p-3.5"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#F37021] flex items-center gap-1">
                      <Zap size={13} /> 1-Click Instant UPI Escrow Pay
                    </span>
                    <span className="text-[10px] font-bold bg-white text-[#1A2A49] px-2 py-0.5 rounded-md border border-orange-200">
                      Fastest
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      triggerPaymentFlow("UPI", "Pluggy Instant UPI QR")
                    }
                    className="w-full py-3 bg-[#F37021] hover:bg-[#e06318] text-white rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition active:scale-[0.98]"
                  >
                    <QrCode size={16} /> Instant Pay ₹{amount} (UPI Escrow)
                  </button>
                </motion.div>

                {/* UPI Apps Grid with Crisp Inline SVG Icons */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                    Pay via UPI Apps
                  </p>
                  <div className="grid grid-cols-4 gap-2.5">
                    {upiApps.map((app, idx) => (
                      <motion.button
                        key={app.id}
                        type="button"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        whileHover={{ y: -3, scale: 1.03 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => {
                          setSelectedUpiApp(app);
                          setSelectedMethod("UPI");
                          setSelectedChannel(app.name);
                          setUpiId(`lakhan${app.handle}`);
                          setStep("upi");
                        }}
                        className="flex flex-col items-center gap-2 p-2.5 rounded-2xl bg-slate-50 hover:bg-orange-50/60 transition border border-slate-200 hover:border-[#F37021] shadow-xs"
                      >
                        <UpiBrandLogo id={app.id} />
                        <span className="text-[11px] font-extrabold text-[#1A2A49] whitespace-nowrap">
                          {app.name.split(" ")[0]}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Other Payment Methods */}
                <div className="space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Cards, Netbanking & Pay After Service
                  </p>

                  <motion.button
                    whileHover={{ x: 3 }}
                    whileTap={{ scale: 0.99 }}
                    type="button"
                    onClick={() => {
                      setSelectedMethod("CARD");
                      setSelectedChannel("Visa / Mastercard");
                      setStep("card");
                    }}
                    className="w-full flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 hover:border-[#1A2A49] hover:bg-slate-50 transition text-left"
                  >
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
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
                  </motion.button>

                  <motion.button
                    whileHover={{ x: 3 }}
                    whileTap={{ scale: 0.99 }}
                    type="button"
                    onClick={() =>
                      triggerPaymentFlow(
                        "NETBANKING",
                        "HDFC / SBI Netbanking"
                      )
                    }
                    className="w-full flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 hover:border-[#1A2A49] hover:bg-slate-50 transition text-left"
                  >
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
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
                  </motion.button>

                  <motion.button
                    whileHover={{ x: 3 }}
                    whileTap={{ scale: 0.99 }}
                    type="button"
                    onClick={() =>
                      triggerPaymentFlow(
                        "PAY_AFTER_SERVICE",
                        "Pay on Happy-PIN Completion"
                      )
                    }
                    className="w-full flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 hover:border-[#F37021] hover:bg-orange-50/30 transition text-left"
                  >
                    <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
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
                  </motion.button>
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
                <div className="flex items-center gap-3.5 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <UpiBrandLogo id={selectedUpiApp?.id || "gpay"} size="lg" />
                  <div>
                    <p className="text-sm font-extrabold text-[#1A2A49]">
                      {selectedUpiApp?.name || "Google Pay"}
                    </p>
                    <p className="text-xs text-slate-500">
                      Escrow-linked UPI Collect & Intent
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-slate-500">Amount to Pay</p>
                  <p className="text-3xl font-extrabold text-[#1A2A49]">
                    ₹{amount}
                  </p>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 block">
                    Enter UPI ID
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
                  className="w-full py-3.5 rounded-xl font-bold text-white bg-[#1A2A49] hover:bg-[#223a61] transition shadow-md text-sm active:scale-95"
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
                    transition={{
                      duration: 0.9,
                      repeat: Infinity,
                      ease: "linear",
                    }}
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
                      <Receipt size={13} className="text-[#F37021]" /> SQL
                      Transaction ID
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
