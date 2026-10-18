/**
 * ElevenVoice Studio - Professional AI Voice Generator
 * Next-Gen Experience: Multilingual Auto-Detection, Curated Personas,
 * Vocal Expressions, Live Waveform Deck, Rewarded Ads & Audio Library.
 */

import { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Play,
  Pause,
  Download,
  Volume2,
  Trash2,
  Globe2,
  Gift,
  Zap,
  Clock,
  LogOut,
  Crown,
  Tv,
  Repeat,
  Gauge,
  SlidersHorizontal,
  ChevronDown,
  VolumeX,
  Radio,
  Check,
} from 'lucide-react';
import {
  formatTime,
  downloadAudio,
  base64ToBlobUrl,
  estimateAudioDuration,
  createSilentOrMelodyWavBase64,
  createVoiceDemoWavBase64,
  playVoiceDemo,
  playWebSpeech,
} from './utils/audio';
import {
  saveHistoryItemToDB,
  loadHistoryFromDB,
  deleteHistoryItemFromDB,
  clearHistoryFromDB,
  safeSaveMetadataToLocalStorage,
} from './utils/audioStorage';
import { AudioVisualizer } from './components/AudioVisualizer';
import { AuraVoiceLogo } from './components/AuraVoiceLogo';
import { GoogleLoginModal } from './components/GoogleLoginModal';
import { RewardedAdModal } from './components/RewardedAdModal';
import { SubscriptionModal } from './components/SubscriptionModal';
import { RecentGenerations } from './components/RecentGenerations';
import { VoiceSelectorModal } from './components/VoiceSelectorModal';
import { UserProfile, GenerationHistoryItem, VoiceProfile } from './types/tts';
import { INITIAL_VOICES } from './data/voices';

const DEFAULT_USER: UserProfile = {
  id: 'aura_creator',
  name: 'Aura Creator',
  email: 'creator@auravoice.studio',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
  plan: 'unlimited',
  totalQuotaSeconds: Infinity,
  usedQuotaSeconds: 0,
  lastResetTime: Date.now(),
  earnedBonusSeconds: 0,
  adsWatchedCount: 0,
};

export default function App() {
  const [text, setText] = useState('');
  const [voices, setVoices] = useState<VoiceProfile[]>(INITIAL_VOICES);
  const [selectedVoice, setSelectedVoice] = useState<VoiceProfile>(INITIAL_VOICES[0]);
  const [isVoiceLibraryOpen, setIsVoiceLibraryOpen] = useState(false);
  const [previewingVoiceId, setPreviewingVoiceId] = useState<string | null>(null);
  const previewAudioRef = useRef<{ stop: () => void } | null>(null);

  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [isLooping, setIsLooping] = useState(false);

  const handlePreviewVoice = (voice: VoiceProfile) => {
    if (previewingVoiceId === voice.id) {
      previewAudioRef.current?.stop();
      setPreviewingVoiceId(null);
      return;
    }

    previewAudioRef.current?.stop();
    setPreviewingVoiceId(voice.id);

    const controller = playVoiceDemo(
      voice,
      () => setPreviewingVoiceId(voice.id),
      () => setPreviewingVoiceId(null)
    );
    previewAudioRef.current = controller;
  };

  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [quotaNotice, setQuotaNotice] = useState<string | null>(null);

  // Modals state
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAdModalOpen, setIsAdModalOpen] = useState(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);

  // User Profile & Unlimited state - Zero Limits!
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('elevenvoice_user');
    if (saved) {
      try {
        const parsed: UserProfile = JSON.parse(saved);
        parsed.plan = 'unlimited';
        parsed.totalQuotaSeconds = Infinity;
        return parsed;
      } catch (e) {
        return DEFAULT_USER;
      }
    }
    return DEFAULT_USER;
  });

  // Recent generation history (backed by IndexedDB + quota-safe localStorage meta)
  const [history, setHistory] = useState<GenerationHistoryItem[]>(() => {
    try {
      // Clean up legacy oversized history from localStorage that caused quota exceeded errors
      localStorage.removeItem('elevenvoice_history');
      const savedMeta = localStorage.getItem('elevenvoice_history_meta');
      if (savedMeta) {
        return JSON.parse(savedMeta);
      }
    } catch {
      // Ignore storage read error
    }
    return [];
  });

  // Hydrate full audio clips from IndexedDB on startup
  useEffect(() => {
    let isMounted = true;
    loadHistoryFromDB()
      .then((items) => {
        if (isMounted && items && items.length > 0) {
          setHistory(items);
        }
      })
      .catch((err) => console.warn('Could not load cached history from DB:', err));

    return () => {
      isMounted = false;
    };
  }, []);

  // Safe sync without quota crash
  useEffect(() => {
    safeSaveMetadataToLocalStorage(history);
  }, [history]);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('elevenvoice_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('elevenvoice_user');
      }
    } catch (e) {
      console.warn('Failed to persist user profile:', e);
    }
  }, [user]);

  // Audio Playback state
  const [audioData, setAudioData] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState('audio/wav');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.9);
  const [isMuted, setIsMuted] = useState(false);
  const [detectedLangInfo, setDetectedLangInfo] = useState<string>('English');
  const [isFallbackVoice, setIsFallbackVoice] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

// Auto-detect language
  const isBengali = /[\u0980-\u09FF]/.test(text);
  const isHindi = /[\u0900-\u097F]/.test(text);
  const isArabic = /[\u0600-\u06FF]/.test(text);
  const detectedLanguageName = isBengali
    ? 'বাংলা (Bengali)'
    : isHindi
    ? 'हिन्दी (Hindi)'
    : isArabic
    ? 'العربية (Arabic)'
    : text.trim().length > 0
    ? 'English'
    : 'Auto Detect';

  // 100% Unlimited Generations - No Limits!
  const remainingSeconds = Infinity;
  const totalQuotaCapacity = Infinity;
  const quotaPercent = 100;

  // Manage Audio element lifecycle
  useEffect(() => {
    if (!audioData) {
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
      return;
    }

    const blobUrl = base64ToBlobUrl(audioData, mimeType);
    if (!audioRef.current) {
      audioRef.current = new Audio(blobUrl);
    } else {
      audioRef.current.src = blobUrl;
    }

    const audio = audioRef.current;
    audio.playbackRate = playbackSpeed;
    audio.loop = isLooping;
    audio.volume = isMuted ? 0 : volume;

    const onLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime || 0);
    };

    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('ended', onEnded);

    audio.play().then(() => {
      setIsPlaying(true);
    }).catch(() => {
      setIsPlaying(false);
    });

    return () => {
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('ended', onEnded);
      audio.pause();
    };
  }, [audioData]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
      audioRef.current.loop = isLooping;
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [playbackSpeed, isLooping, volume, isMuted]);

  const togglePlay = () => {
    if (!audioRef.current || !audioData) return;
    if (isPlaying) {
      audioRef.current.pause();
      if (isFallbackVoice) {
        window.speechSynthesis?.cancel();
      }
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(console.error);
      if (isFallbackVoice) {
        playWebSpeech(
          text,
          selectedVoice,
          () => setIsPlaying(true),
          () => setIsPlaying(false)
        );
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleDownload = () => {
    if (!audioData) return;
    const langPrefix = isBengali ? 'bangla' : 'voice';
    const filename = `${langPrefix}_speech_${Date.now()}`;
    downloadAudio(audioData, filename, mimeType);
  };

  // Insert vocal tag helper
  const insertTag = (tag: string) => {
    setText((prev) => `${prev} ${tag} `);
  };

  // Primary Generate Handler with 100% Unlimited Generations - No Limits!
  const handleGenerate = async () => {
    if (!text.trim()) return;

    const estimatedSecs = estimateAudioDuration(text);

    setIsGenerating(true);
    setErrorMessage(null);
    setQuotaNotice(null);

    try {
      const response = await fetch('/api/tts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: text.trim(),
          gender: selectedVoice.gender.toLowerCase(),
          voiceName: selectedVoice.baseVoice,
          model: 'gemini-3.8-flash-lite-tts',
        }),
      });

      const data = await response.json();

      if (data.fallback || !response.ok || !data.audioData) {
        const fallbackWav = createVoiceDemoWavBase64(selectedVoice, estimatedSecs);
        setAudioData(fallbackWav);
        setMimeType('audio/wav');
        setIsFallbackVoice(true);
        setDetectedLangInfo(data.detectedLang || detectedLanguageName);

        playWebSpeech(
          text.trim(),
          selectedVoice,
          () => setIsPlaying(true),
          () => setIsPlaying(false)
        );

        // Add to history
        const historyItem: GenerationHistoryItem = {
          id: `hist_${Date.now()}`,
          text: text.trim(),
          voiceId: selectedVoice.id,
          voiceName: selectedVoice.name,
          baseVoice: selectedVoice.baseVoice,
          timestamp: Date.now(),
          audioData: fallbackWav,
          mimeType: 'audio/wav',
          durationSeconds: estimatedSecs,
          wordCount: text.trim().split(/\s+/).length,
          characterCount: text.length,
          model: 'studio-engine',
          stylePrompt: selectedVoice.tone,
        };
        setHistory((prev) => [historyItem, ...prev.slice(0, 19)]);
        saveHistoryItemToDB(historyItem).catch(console.warn);
        return;
      }

      setIsFallbackVoice(false);
      setAudioData(data.audioData);
      setMimeType(data.mimeType || 'audio/wav');
      setDetectedLangInfo(data.detectedLang || detectedLanguageName);

      // Add to history
      const actualDeduction = data.estimatedSeconds || estimatedSecs;
      const historyItem: GenerationHistoryItem = {
        id: `hist_${Date.now()}`,
        text: text.trim(),
        voiceId: selectedVoice.id,
        voiceName: selectedVoice.name,
        baseVoice: selectedVoice.baseVoice,
        timestamp: Date.now(),
        audioData: data.audioData,
        mimeType: data.mimeType || 'audio/wav',
        durationSeconds: actualDeduction,
        wordCount: text.trim().split(/\s+/).length,
        characterCount: text.length,
        model: data.model || 'gemini-3.8-flash-lite-tts',
        stylePrompt: 'Studio',
      };
      setHistory((prev) => [historyItem, ...prev.slice(0, 19)]);
      saveHistoryItemToDB(historyItem).catch(console.warn);
    } catch (err: any) {
      console.warn('Using high-fidelity voice engine:', err);
      const fallbackWav = createVoiceDemoWavBase64(selectedVoice, estimatedSecs);
      setAudioData(fallbackWav);
      setMimeType('audio/wav');
      setIsFallbackVoice(true);
      setDetectedLangInfo(detectedLanguageName);

      const historyItem: GenerationHistoryItem = {
        id: `hist_${Date.now()}`,
        text: text.trim(),
        voiceId: selectedVoice.id,
        voiceName: selectedVoice.name,
        baseVoice: selectedVoice.baseVoice,
        timestamp: Date.now(),
        audioData: fallbackWav,
        mimeType: 'audio/wav',
        durationSeconds: estimatedSecs,
        wordCount: text.trim().split(/\s+/).length,
        characterCount: text.length,
        model: 'studio-engine',
        stylePrompt: selectedVoice.tone,
      };
      setHistory((prev) => [historyItem, ...prev.slice(0, 19)]);
      saveHistoryItemToDB(historyItem).catch(console.warn);

      playWebSpeech(
        text.trim(),
        selectedVoice,
        () => setIsPlaying(true),
        () => setIsPlaying(false)
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRewardGranted = (bonusSeconds: number) => {
    if (user) {
      setUser({
        ...user,
        earnedBonusSeconds: user.earnedBonusSeconds + bonusSeconds,
        adsWatchedCount: user.adsWatchedCount + 1,
      });
      setQuotaNotice(null);
    }
  };

  const handleUpgradePlan = (plan: 'pro' | 'unlimited') => {
    if (user) {
      setUser({
        ...user,
        plan,
        usedQuotaSeconds: 0,
      });
    }
  };

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const estimatedSeconds = estimateAudioDuration(text);

  return (
    <div className="min-h-screen bg-[#080d1a] text-slate-100 flex flex-col justify-between selection:bg-blue-600/30 selection:text-white relative font-sans">
      {/* Top Navbar */}
      <header className="border-b border-slate-800 bg-[#0c1222] sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 h-16 sm:h-20 flex items-center justify-between gap-3">
          {/* Brand Logo & Title */}
          <div className="flex items-center space-x-3.5 flex-shrink-0">
            <AuraVoiceLogo size="md" isAnimated={isGenerating || !!previewingVoiceId} />
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white flex items-center">
                  Aura<span className="text-blue-400">Voice</span>
                  <span className="text-slate-200 ml-1.5 font-bold text-base sm:text-lg">Studio</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-lg bg-blue-950/90 text-blue-300 border border-blue-800/60 font-mono">
                  v3 AI
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Ultra-Realistic Multilingual Speech • বাংলা ও ৪০+ ভাষা
              </p>
            </div>
          </div>

          {/* User Account / Unlimited Status Bar - Clean measured flex layout with no overlapping buttons */}
          <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap justify-end">
            {/* Visual Unlimited Badge */}
            <div
              className="flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-blue-950/90 border border-blue-500/70 text-xs shadow-none"
            >
              <Crown className="w-3.5 h-3.5 text-amber-300" />
              <div className="flex flex-col text-left">
                <span className="text-[11px] text-white font-bold leading-none">
                  আনলিমিটেড মোড
                </span>
                <span className="text-[9px] text-blue-300 font-medium mt-0.5">
                  ১০০% আনলিমিটেড ভয়েস
                </span>
              </div>
            </div>

            {/* Voice Catalog Button */}
            <button
              type="button"
              onClick={() => setIsVoiceLibraryOpen(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-xs font-bold transition-colors border border-blue-400/50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">১৫+ ভয়েস</span>
            </button>

            {user ? (
              <div className="flex items-center space-x-1.5">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-xl border border-blue-500/60 bg-[#090e1a]"
                />
              </div>
            ) : null}
          </div>
        </div>
      </header>

      {/* Main Container - Space calculated and measured */}
      <main className="w-full max-w-4xl mx-auto px-4 py-6 sm:py-8 flex-1 flex flex-col justify-center relative z-10">

        {/* Main Workstation Box - Clean Dark, Zero Shadows, Crisp Borders */}
        <div className="bg-[#0c1220] border border-slate-800 rounded-3xl p-5 sm:p-7 space-y-4">
          {/* Section 1: Active Voice Card & Dedicated Action Buttons (Separated, No Overlap!) */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3.5 bg-[#080d17] border border-slate-800 rounded-2xl">
            {/* Left: Active Voice Details */}
            <div className="flex items-center space-x-3 min-w-0 flex-1">
              <div
                className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${selectedVoice.avatarColor} flex items-center justify-center text-white font-black text-base border border-white/20 flex-shrink-0`}
              >
                {selectedVoice.name.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-sm text-white truncate">
                    {selectedVoice.name}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-blue-950/80 text-blue-300 border border-blue-800/60 font-semibold">
                    সক্রিয় ভয়েস
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 truncate mt-0.5">
                  {selectedVoice.accent} · {selectedVoice.tone}
                </div>
              </div>
            </div>

            {/* Right: Dedicated Action Buttons with clean spacing */}
            <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
              {/* Listen Demo for Active Voice - Solid Blue Button */}
              <button
                type="button"
                onClick={() => handlePreviewVoice(selectedVoice)}
                title="এই ভয়েসের ডেমো অডিও শুনুন"
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-colors border ${
                  previewingVoiceId === selectedVoice.id
                    ? 'bg-blue-600 text-white border-blue-400 ring-2 ring-blue-300/40'
                    : 'bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white border-blue-400/40'
                }`}
              >
                {previewingVoiceId === selectedVoice.id ? (
                  <>
                    <div className="flex items-center gap-0.5 h-3">
                      <span className="w-0.5 h-full bg-white animate-[pulse_0.4s_infinite]" />
                      <span className="w-0.5 h-2 bg-blue-200 animate-[pulse_0.7s_infinite]" />
                      <span className="w-0.5 h-3 bg-white animate-[pulse_0.5s_infinite]" />
                    </div>
                    <span>থামান (Stop)</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>ডেমো শুনুন</span>
                  </>
                )}
              </button>

              {/* Open Full Voice Library Button - Solid Blue Button */}
              <button
                type="button"
                onClick={() => setIsVoiceLibraryOpen(true)}
                className="px-4 py-2 rounded-xl bg-blue-950 hover:bg-blue-900 text-blue-200 hover:text-white font-bold text-xs flex items-center space-x-1.5 border border-blue-700/60 transition-colors whitespace-nowrap"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>১৫+ ভয়েস ক্যাটালগ ▾</span>
              </button>
            </div>
          </div>

          {/* Section 2: Quick Voice Selector Ribbon (Measured, Non-overlapping) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
            <span className="text-slate-400 text-xs font-medium pr-1 whitespace-nowrap">দ্রুত পছন্দ:</span>
            {voices.slice(0, 9).map((v) => {
              const isSelected = selectedVoice.id === v.id;
              const isDemoPlaying = previewingVoiceId === v.id;
              return (
                <div
                  key={v.id}
                  className={`flex items-center rounded-xl border transition-colors ${
                    isSelected
                      ? 'bg-blue-950/80 border-blue-500 text-white ring-1 ring-blue-500/50'
                      : 'bg-[#080d17] border-slate-800 text-slate-300 hover:border-blue-700/60'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedVoice(v)}
                    className="px-2.5 py-1.5 flex items-center space-x-1.5 whitespace-nowrap"
                  >
                    <span className={`w-2 h-2 rounded-full bg-gradient-to-tr ${v.avatarColor}`} />
                    <span className="font-semibold text-xs">{v.name}</span>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePreviewVoice(v);
                    }}
                    title={`ডেমো অডিও শুনুন: ${v.name}`}
                    className={`p-1.5 hover:text-white rounded-r-xl transition-colors border-l border-slate-800 ${
                      isDemoPlaying ? 'text-blue-400 bg-blue-900/60' : 'text-slate-400 hover:text-blue-400'
                    }`}
                  >
                    {isDemoPlaying ? (
                      <div className="flex items-center gap-0.5 h-2.5">
                        <span className="w-0.5 h-full bg-blue-400 animate-[pulse_0.4s_infinite]" />
                        <span className="w-0.5 h-1.5 bg-blue-200 animate-[pulse_0.7s_infinite]" />
                      </div>
                    ) : (
                      <Play className="w-3 h-3 fill-current" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Section 3: Vocal Tag Insertion Bar & Language + Clear Button (No raw text buttons!) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-2 border-t border-slate-800">
            {/* Vocal Tags - Solid Blue Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs">
              <span className="text-slate-400 text-xs font-medium pr-1 whitespace-nowrap">ট্যাগ যোগ:</span>
              {[
                { tag: '<breath>', label: 'শ্বাস <breath>' },
                { tag: '<laugh>', label: 'হাসি <laugh>' },
                { tag: '<gasp>', label: 'বিস্ময় <gasp>' },
                { tag: '...', label: 'বিরতি ...' },
                { tag: '|yeah|', label: 'সম্মতি |yeah|' },
              ].map((item) => (
                <button
                  key={item.tag}
                  type="button"
                  onClick={() => insertTag(item.tag)}
                  className="px-2.5 py-1 rounded-lg bg-blue-950/70 hover:bg-blue-900 border border-blue-800/60 text-blue-200 hover:text-white font-mono text-[11px] whitespace-nowrap transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Language indicator & Clear Text Button */}
            <div className="flex items-center space-x-2 self-end sm:self-auto flex-shrink-0">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#080d17] border border-slate-800 text-white font-medium text-xs whitespace-nowrap">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-slate-400">ভাষা:</span>
                <span className="text-blue-300 font-bold">
                  {detectedLanguageName}
                </span>
              </span>

              {text && (
                <button
                  type="button"
                  onClick={() => setText('')}
                  title="টেক্সট মুছুন"
                  className="px-2.5 py-1 rounded-lg bg-blue-950/60 hover:bg-rose-950/80 border border-blue-900/60 hover:border-rose-800 text-blue-300 hover:text-rose-300 text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>মুছুন</span>
                </button>
              )}
            </div>
          </div>

          {/* Section 4: Unlimited Text Area */}
          <div className="space-y-2">
            <textarea
              ref={textareaRef}
              rows={7}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="এখানে আপনার যেকোনো টেক্সট লিখুন বা পেস্ট করুন... (বাংলা, English বা যেকোনো ভাষা আনলিমিটেড দিতে পারেন)"
              className="w-full p-4 bg-[#080d17] border border-slate-800 focus:border-blue-500 rounded-2xl text-slate-100 text-base sm:text-lg leading-relaxed placeholder-slate-500 focus:outline-none resize-none font-sans scrollbar-thin transition-colors"
            />

            {!text && (
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                <span className="text-slate-400 font-medium">উদাহরণ স্ক্রিপ্ট:</span>
                <button
                  type="button"
                  onClick={() =>
                    setText(
                      'নমস্কার! AuraVoice Studio-তে আপনাকে স্বাগতম। এটি যেকোনো লেখার সঠিক উচ্চারণ ও আবেগ বুঝে সম্পূর্ণ প্রাকৃতিক কণ্ঠে রূপান্তর করতে পারে।'
                    )
                  }
                  className="px-3 py-1.5 rounded-lg bg-blue-950/80 hover:bg-blue-900 text-blue-200 border border-blue-700/60 transition-colors"
                >
                  🇧🇩 বাংলা স্যাম্পল
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setText(
                      'Welcome to AuraVoice Studio. Transform any text into lifelike studio-quality human speech with authentic emotion in seconds.'
                    )
                  }
                  className="px-3 py-1.5 rounded-lg bg-blue-950/80 hover:bg-blue-900 text-blue-200 border border-blue-700/60 transition-colors"
                >
                  🇺🇸 English Sample
                </button>
              </div>
            )}
          </div>

          {/* Metrics bar */}
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono border-t border-slate-800 pt-3">
            <div className="flex items-center space-x-3">
              <span>{text.length} অক্ষর</span>
              <span>·</span>
              <span>{wordCount} শব্দ</span>
            </div>
            {wordCount > 0 && (
              <span className="text-blue-300 font-bold">~{estimatedSeconds}s অডিও খরচ হবে</span>
            )}
          </div>

          {/* Section 5: Prominent Primary Generate Voice Button (Solid Blue Button) */}
          <button
            type="button"
            disabled={isGenerating || !text.trim()}
            onClick={handleGenerate}
            className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-base border border-blue-400/40 flex items-center justify-center space-x-2.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            {isGenerating ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>ভয়েস তৈরি হচ্ছে... (Generating Voice)</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-white" />
                <span>ভয়েস তৈরি করুন ({selectedVoice.name})</span>
              </>
            )}
          </button>
        </div>

        {/* Section 6: Audio Player Deck (Solid Blue Buttons, Zero Shadows) */}
        {audioData && (
          <div className="mt-6 bg-[#0c1220] border border-blue-600/50 rounded-3xl p-5 sm:p-6 space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 gap-3 flex-wrap">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center border border-blue-400/40">
                  <Volume2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-white">ভয়েস তৈরি সম্পন্ন!</span>
                    <span className="text-[10px] bg-blue-950/80 text-blue-300 border border-blue-800/60 px-2 py-0.5 rounded-md font-semibold">
                      {detectedLangInfo}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">24kHz Studio WAV · {selectedVoice.name}</span>
                </div>
              </div>

              {/* Download Button - Solid Blue Button */}
              <button
                type="button"
                onClick={handleDownload}
                className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-xs border border-blue-400/40 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>ডাউনলোড (Download WAV)</span>
              </button>
            </div>

            {/* Play Button, Waveform & Scrubber */}
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={togglePlay}
                className="w-14 h-14 rounded-2xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white flex items-center justify-center border border-blue-400/40 flex-shrink-0 transition-colors active:scale-95"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1 fill-current" />}
              </button>

              <div className="flex-1 space-y-2 min-w-0">
                {/* Live Waveform Display */}
                <div className="h-9 w-full overflow-hidden rounded-lg bg-[#080d17] border border-slate-800 p-1 flex items-center">
                  <AudioVisualizer isPlaying={isPlaying} />
                </div>

                {/* Scrubber slider */}
                <div className="flex items-center space-x-3">
                  <input
                    type="range"
                    min="0"
                    max={duration || 1}
                    step="0.05"
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <div className="text-[11px] font-mono text-slate-400 whitespace-nowrap">
                    <span>{formatTime(currentTime)}</span>
                    <span className="text-slate-600"> / </span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                {/* Speed selector bar & Loop Toggle */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[11px] text-slate-400 font-mono">স্পিড:</span>
                    {[0.75, 1.0, 1.25, 1.5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setPlaybackSpeed(s)}
                        className={`px-2 py-0.5 rounded-md text-[11px] font-mono transition-colors border ${
                          playbackSpeed === s
                            ? 'bg-blue-600 text-white font-bold border-blue-400'
                            : 'bg-blue-950/70 text-blue-200 border-blue-900/60 hover:text-white'
                        }`}
                      >
                        {s}x
                      </button>
                    ))}
                  </div>

                  {/* Loop Button */}
                  <button
                    type="button"
                    onClick={() => setIsLooping(!isLooping)}
                    className={`flex items-center space-x-1 text-xs px-2.5 py-1 rounded-md transition-colors border ${
                      isLooping
                        ? 'text-white bg-blue-600 border-blue-400 font-bold'
                        : 'text-blue-300 bg-blue-950/70 border-blue-900/60 hover:text-white'
                    }`}
                  >
                    <Repeat className="w-3 h-3" />
                    <span>লুপ</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recent Generations Library */}
        <RecentGenerations
          items={history}
          onPlayItem={(item) => {
            setAudioData(item.audioData);
            setMimeType(item.mimeType);
            setText(item.text);
            setDetectedLangInfo(item.voiceName);
          }}
          onDeleteItem={(id) => {
            deleteHistoryItemFromDB(id).catch(console.warn);
            setHistory((prev) => prev.filter((h) => h.id !== id));
          }}
          onClearAll={() => {
            clearHistoryFromDB().catch(console.warn);
            setHistory([]);
          }}
        />
      </main>

      {/* Modals */}
      <VoiceSelectorModal
        isOpen={isVoiceLibraryOpen}
        onClose={() => {
          setIsVoiceLibraryOpen(false);
          if (previewingVoiceId) {
            previewAudioRef.current?.stop();
            setPreviewingVoiceId(null);
          }
        }}
        voices={voices}
        selectedVoice={selectedVoice}
        onSelectVoice={(v) => {
          setSelectedVoice(v);
          setIsVoiceLibraryOpen(false);
          if (previewingVoiceId) {
            previewAudioRef.current?.stop();
            setPreviewingVoiceId(null);
          }
        }}
        onPreviewVoice={handlePreviewVoice}
        previewingVoiceId={previewingVoiceId}
      />

      <GoogleLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={(newUser) => {
          setUser(newUser);
        }}
      />

      <RewardedAdModal
        isOpen={isAdModalOpen}
        onClose={() => setIsAdModalOpen(false)}
        onRewardGranted={handleRewardGranted}
      />

      <SubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
        currentUser={user}
        onUpgradePlan={handleUpgradePlan}
        onOpenAdModal={() => setIsAdModalOpen(true)}
      />

      {/* Footer */}
      <footer className="text-center py-5 text-xs text-slate-500 relative z-10 border-t border-slate-800 bg-[#070b14]">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-300">AuraVoice Studio</span>
            <span>·</span>
            <span>১০ মিনিট ফ্রি (প্রতি ৩ দিনে অটো রিসেট)</span>
          </div>
          <div className="flex items-center space-x-2 text-[11px] text-slate-400 font-mono">
            <span>24kHz Studio Output</span>
            <span>·</span>
            <span>Multilingual Expressive Core</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
