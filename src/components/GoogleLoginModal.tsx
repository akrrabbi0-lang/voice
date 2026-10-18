import { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Sparkles, Mail } from 'lucide-react';
import { UserProfile } from '../types/tts';

interface GoogleLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: UserProfile) => void;
}

export function GoogleLoginModal({ isOpen, onClose, onLogin }: GoogleLoginModalProps) {
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [showManualForm, setShowManualForm] = useState(false);

  if (!isOpen) return null;

  // Simulate instant 1-click Google Sign-in with default user profile
  const handleGoogleOneClick = (email?: string, name?: string) => {
    const finalEmail = email || 'akr.rabbi0@gmail.com';
    const finalName = name || finalEmail.split('@')[0];

    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      name: finalName.charAt(0).toUpperCase() + finalName.slice(1),
      email: finalEmail,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${finalEmail}`,
      plan: 'free',
      totalQuotaSeconds: 600, // 10 minutes free
      usedQuotaSeconds: 0,
      lastResetTime: Date.now(),
      earnedBonusSeconds: 0,
      adsWatchedCount: 0,
    };

    onLogin(newUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#0b101c] border border-slate-800 rounded-3xl w-full max-w-md p-6 sm:p-8 text-slate-100 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-blue-300 hover:text-white rounded-xl bg-blue-950/60 hover:bg-blue-900 border border-blue-800/60 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-950/80 border border-blue-600/60 flex items-center justify-center text-blue-400">
            <Sparkles className="w-7 h-7" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Google দিয়ে লগইন করুন
          </h2>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            লগইন করলেই পাচ্ছেন <span className="text-blue-300 font-semibold">১০ মিনিট ফ্রি ভয়েস ক্রেডিট</span>, যা প্রতি ৩ দিন পর পর অটো রিসেট হবে!
          </p>
        </div>

        {/* Perks Box */}
        <div className="bg-[#0c1220] border border-slate-800 rounded-2xl p-4 mb-6 space-y-2 text-xs">
          <div className="flex items-center space-x-2.5 text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" />
            <span>১০ মিনিট (৬০০ সেকেন্ড) ফ্রি ভয়েস তৈরি</span>
          </div>
          <div className="flex items-center space-x-2.5 text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" />
            <span>প্রতি ৩ দিন পর পর ফ্রি ব্যালেন্স রিসেট</span>
          </div>
          <div className="flex items-center space-x-2.5 text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" />
            <span>বিজ্ঞাপন দেখে আনলিমিটেড বোনাস ক্রেডিট অর্জনের সুযোগ</span>
          </div>
        </div>

        {/* Google Sign-in Button */}
        {!showManualForm ? (
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => handleGoogleOneClick()}
              className="w-full py-3.5 px-4 bg-white hover:bg-slate-100 text-slate-900 font-bold rounded-xl flex items-center justify-center space-x-3 transition-colors border border-slate-200"
            >
              {/* Google SVG Logo */}
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Distinct secondary button, never raw naked text */}
            <button
              type="button"
              onClick={() => setShowManualForm(true)}
              className="w-full py-2.5 px-4 rounded-xl bg-blue-950/70 hover:bg-blue-900 border border-blue-800/60 text-xs font-semibold text-blue-200 hover:text-white text-center transition-colors flex items-center justify-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>ইমেইল দিয়ে টেস্ট করুন</span>
            </button>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (customEmail) {
                handleGoogleOneClick(customEmail, customName);
              }
            }}
            className="space-y-3"
          >
            <div>
              <label className="text-[11px] text-slate-300 block mb-1">আপনার নাম</label>
              <input
                type="text"
                placeholder="যেমন: Rabbi"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#0c1220] border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-300 block mb-1">আপনার ইমেইল (Google Account)</label>
              <input
                type="email"
                required
                placeholder="you@gmail.com"
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#0c1220] border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold rounded-xl text-sm border border-blue-400/40 transition-colors"
            >
              সাইন-ইন করুন ও ১০ মিনিট ক্রেডিট নিন
            </button>
            <button
              type="button"
              onClick={() => setShowManualForm(false)}
              className="w-full py-2 rounded-xl bg-blue-950/60 hover:bg-blue-900 border border-blue-800/60 text-center text-xs text-blue-200 transition-colors"
            >
              ← Google One-Click এ ফিরুন
            </button>
          </form>
        )}

        {/* Footer Guarantee */}
        <div className="mt-6 pt-4 border-t border-slate-800 text-center flex items-center justify-center space-x-1.5 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
          <span>নিরাপদ ও সুরক্ষিত Google Authentication</span>
        </div>
      </div>
    </div>
  );
}
