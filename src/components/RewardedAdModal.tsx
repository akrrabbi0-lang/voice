import { useState, useEffect } from 'react';
import { X, Play, Sparkles, CheckCircle2, Gift, Tv, Volume2 } from 'lucide-react';

interface RewardedAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRewardGranted: (bonusSeconds: number) => void;
}

export function RewardedAdModal({ isOpen, onClose, onRewardGranted }: RewardedAdModalProps) {
  const [isPlayingAd, setIsPlayingAd] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(10);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setIsPlayingAd(false);
      setSecondsLeft(10);
      setIsCompleted(false);
      return;
    }
  }, [isOpen]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlayingAd && secondsLeft > 0) {
      timer = setTimeout(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (isPlayingAd && secondsLeft === 0) {
      setIsPlayingAd(false);
      setIsCompleted(true);
    }
    return () => clearTimeout(timer);
  }, [isPlayingAd, secondsLeft]);

  if (!isOpen) return null;

  const startAd = () => {
    setIsPlayingAd(true);
    setSecondsLeft(10);
    setIsCompleted(false);
  };

  const claimReward = () => {
    onRewardGranted(120); // +2 minutes (120 seconds)
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#0b101c] border border-slate-800 rounded-3xl w-full max-w-md p-6 sm:p-7 text-slate-100 relative overflow-hidden">
        {!isPlayingAd && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-blue-300 hover:text-white rounded-xl bg-blue-950/60 hover:bg-blue-900 border border-blue-800/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {!isPlayingAd && !isCompleted ? (
          /* Step 1: Pre-Ad Invitation */
          <div className="space-y-5 text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-950/80 border border-blue-700/60 flex items-center justify-center text-blue-400">
              <Gift className="w-7 h-7" />
            </div>

            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-lg bg-blue-950/80 text-blue-300 border border-blue-800/60">
                বিজ্ঞাপন দেখে ফ্রি ক্রেডিট
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-2">
                ১০ সেকেন্ডের বিজ্ঞাপন দেখুন
              </h2>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                একটি ছোট স্পন্সর বিজ্ঞাপন দেখলেই সাথে সাথে পেয়ে যাবেন <span className="text-blue-300 font-bold">+২ মিনিট (১২০ সেকেন্ড)</span> ফ্রি ভয়েস ব্যালেন্স!
              </p>
            </div>

            <div className="bg-[#0c1220] border border-slate-800 rounded-2xl p-4 text-xs text-slate-300 space-y-2 text-left">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>প্রতিদিন আনলিমিটেড বার বিজ্ঞাপন দেখে ক্রেডিট নেওয়া যাবে</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>কোনো সাবস্ক্রিপশন ফি ছাড়াই ফ্রি ভয়েস ব্যবহার করুন</span>
              </div>
            </div>

            <button
              type="button"
              onClick={startAd}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold rounded-xl text-sm border border-blue-400/40 flex items-center justify-center space-x-2 transition-colors"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>বিজ্ঞাপন প্লে করুন (+২ মিনিট ক্রেডিট)</span>
            </button>
          </div>
        ) : isPlayingAd ? (
          /* Step 2: Live Ad Playing with Countdown */
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 font-medium text-blue-400">
                <Tv className="w-4 h-4" />
                <span>স্পন্সর বিজ্ঞাপন চলছে...</span>
              </span>
              <span className="font-mono bg-blue-950/80 px-2.5 py-1 rounded-lg border border-blue-800/60 text-white font-bold">
                {secondsLeft}s
              </span>
            </div>

            {/* Simulated High-Quality Sponsor Ad Banner */}
            <div className="relative rounded-2xl overflow-hidden aspect-video bg-[#0c1220] border border-slate-800 flex flex-col items-center justify-center p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 mb-3 animate-pulse">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-white text-base">
                AuraVoice Studio Cloud
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">
                Ultra-fast neural text to speech engine powered by Google Gemini AI.
              </p>
              <div className="mt-3 px-3 py-1 rounded-lg bg-blue-950/80 text-[11px] text-blue-300 border border-blue-800/60 font-medium">
                Official Technology Sponsor
              </div>

              {/* Countdown Progress Bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-slate-800">
                <div
                  className="h-full bg-blue-500 transition-all duration-1000 ease-linear"
                  style={{ width: `${((10 - secondsLeft) / 10) * 100}%` }}
                />
              </div>
            </div>

            <p className="text-[11px] text-slate-400 text-center">
              বিজ্ঞাপনটি শেষ হওয়া পর্যন্ত অপেক্ষা করুন, ক্রেডিট স্বয়ংক্রিয়ভাবে আনলক হবে।
            </p>
          </div>
        ) : (
          /* Step 3: Success Claim Screen */
          <div className="space-y-5 text-center animate-in zoom-in-95 duration-150">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-950/80 border border-blue-600/60 flex items-center justify-center text-blue-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-lg bg-blue-950/80 text-blue-300 border border-blue-800/60">
                অভিনন্দন!
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-2">
                +২ মিনিট ফ্রি ক্রেডিট যোগ হয়েছে!
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                আপনার অ্যাকাউন্টে অতিরিক্ত ১২০ সেকেন্ড ভয়েস ব্যালেন্স যোগ করা হয়েছে।
              </p>
            </div>

            <button
              type="button"
              onClick={claimReward}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold rounded-xl text-sm border border-blue-400/40 transition-colors"
            >
              ক্রেডিট গ্রহণ করুন (Claim Credits)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
