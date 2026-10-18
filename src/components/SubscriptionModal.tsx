import { useState } from 'react';
import { X, Check, Zap, Sparkles, ShieldCheck, Crown, CreditCard } from 'lucide-react';
import { UserProfile } from '../types/tts';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onUpgradePlan: (plan: 'pro' | 'unlimited') => void;
  onOpenAdModal: () => void;
}

export function SubscriptionModal({
  isOpen,
  onClose,
  currentUser,
  onUpgradePlan,
  onOpenAdModal,
}: SubscriptionModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<'pro' | 'unlimited'>('pro');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successUpgraded, setSuccessUpgraded] = useState(false);

  if (!isOpen) return null;

  const handleCheckout = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setSuccessUpgraded(true);
      onUpgradePlan(selectedPlan);
      setTimeout(() => {
        setSuccessUpgraded(false);
        onClose();
      }, 1800);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#0b101c] border border-slate-800 rounded-3xl w-full max-w-2xl p-6 sm:p-8 text-slate-100 relative max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-blue-300 hover:text-white rounded-xl bg-blue-950/60 hover:bg-blue-900 border border-blue-800/60 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-xl bg-blue-950/80 text-blue-300 border border-blue-800/60 text-xs font-semibold">
            <Crown className="w-3.5 h-3.5 text-blue-400" />
            <span>প্রিমিয়াম ভয়েস প্যাকেজ</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            আপনার প্ল্যান আপগ্রেড করুন
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
            দৈনিক আরও বেশি এবং বিরতিহীন আনলিমিটেড স্টুডিও কোয়ালিটি ভয়েস তৈরি করতে সাবস্ক্রিপশন প্ল্যান বেছে নিন।
          </p>
        </div>

        {/* Free Plan / Ad Option Card */}
        <div className="mb-6 p-4 rounded-2xl bg-[#0c1220] border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-950/80 border border-blue-800/60 flex items-center justify-center text-blue-300 font-bold text-sm">
              FREE
            </div>
            <div>
              <div className="text-xs font-bold text-white">টাকা ছাড়াই ফ্রি ক্রেডিট চান?</div>
              <div className="text-[11px] text-slate-400">
                বিজ্ঞাপন দেখলেই ফ্রি ব্যালেন্স পাবেন (+২ মিনিট প্রতি বিজ্ঞাপনে)।
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenAdModal();
            }}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-blue-950/80 hover:bg-blue-900 border border-blue-700/60 text-blue-200 hover:text-white font-semibold text-xs transition-colors whitespace-nowrap"
          >
            🎬 বিজ্ঞাপন দেখে ক্রেডিট নিন
          </button>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* Pro Creator Plan */}
          <div
            onClick={() => setSelectedPlan('pro')}
            className={`p-5 rounded-2xl border text-left cursor-pointer transition-all relative ${
              selectedPlan === 'pro'
                ? 'bg-indigo-950/40 border-indigo-500 shadow-xl shadow-indigo-950/50 ring-2 ring-indigo-500/60'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Pro Creator</span>
              <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/30 font-semibold">
                সবচেয়ে জনপ্রিয়
              </span>
            </div>

            <div className="mb-4">
              <div className="text-2xl font-black text-white">৳৯৯০ <span className="text-xs text-slate-400 font-normal">/ মাস ($9)</span></div>
              <div className="text-xs text-slate-400 mt-0.5">৩০০ মিনিট (১৮,০০০ সেকেন্ড) প্রতি মাসে</div>
            </div>

            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center space-x-2">
                <Check className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                <span>৩০০ মিনিট মাসিক ভয়েস ব্যালেন্স</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                <span>সম্পূর্ণ বিজ্ঞাপনমুক্ত অভিজ্ঞতা</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                <span>দ্রুততম হাই-স্পিড টার্বো জেনারেশন</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                <span>24kHz আনকম্প্রেসড WAV ডাউনলোড</span>
              </li>
            </ul>
          </div>

          {/* Unlimited Studio Plan */}
          <div
            onClick={() => setSelectedPlan('unlimited')}
            className={`p-5 rounded-2xl border text-left cursor-pointer transition-all relative ${
              selectedPlan === 'unlimited'
                ? 'bg-purple-950/40 border-purple-500 shadow-xl shadow-purple-950/50 ring-2 ring-purple-500/60'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Unlimited Studio</span>
              <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/30 font-semibold">
                প্রফেশনাল
              </span>
            </div>

            <div className="mb-4">
              <div className="text-2xl font-black text-white">৳১,৯৯০ <span className="text-xs text-slate-400 font-normal">/ মাস ($19)</span></div>
              <div className="text-xs text-slate-400 mt-0.5">সম্পূর্ণ আনলিমিটেড ভয়েস তৈরি</div>
            </div>

            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center space-x-2">
                <Check className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                <span>১০০% আনলিমিটেড মিনিট ও টেক্সট</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                <span>বিজ্ঞাপন ও কোনো লিমিটের ঝামেলা নেই</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                <span>কমার্শিয়াল ও ইউটিউব লাইসেন্স</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                <span>ডেডিকেটেড ক্লাউড ব্যান্ডউইথ ও সাপোর্ট</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Payment Methods Support */}
        <div className="mb-6 p-3.5 rounded-2xl bg-[#0c1220] border border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <CreditCard className="w-4 h-4 text-blue-400" />
            <span>পেমেন্ট মেথড:</span>
          </div>
          <div className="flex items-center space-x-2 font-semibold text-slate-300 text-[11px]">
            <span className="px-2 py-0.5 rounded bg-blue-950/70 text-blue-300 border border-blue-800/60">bKash</span>
            <span className="px-2 py-0.5 rounded bg-blue-950/70 text-blue-300 border border-blue-800/60">Nagad</span>
            <span className="px-2 py-0.5 rounded bg-blue-950/70 text-blue-300 border border-blue-800/60">Cards / GPay</span>
          </div>
        </div>

        {/* Upgrade Action Button - Solid Blue Button */}
        <button
          type="button"
          onClick={handleCheckout}
          disabled={isProcessing}
          className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-sm border border-blue-400/40 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
        >
          {isProcessing ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>আপগ্রেড প্রসেস হচ্ছে...</span>
            </>
          ) : successUpgraded ? (
            <>
              <Check className="w-4 h-4 text-white" />
              <span>সফলভাবে আপগ্রেড হয়েছে!</span>
            </>
          ) : (
            <>
              <Zap className="w-4 h-4" />
              <span>{selectedPlan === 'pro' ? 'Pro Creator প্ল্যানে আপগ্রেড করুন (৳৯৯০)' : 'Unlimited Studio প্ল্যানে আপগ্রেড করুন (৳১,৯৯০)'}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
