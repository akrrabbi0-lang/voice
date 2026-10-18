import { useState } from 'react';
import { VoiceProfile } from '../types/tts';
import { Search, X, Play, Pause, Check, Volume2, Sparkles, Filter, Radio, Music } from 'lucide-react';
import { AuraVoiceLogo } from './AuraVoiceLogo';

interface VoiceSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  voices: VoiceProfile[];
  selectedVoice: VoiceProfile;
  onSelectVoice: (voice: VoiceProfile) => void;
  onPreviewVoice: (voice: VoiceProfile) => void;
  previewingVoiceId: string | null;
}

export function VoiceSelectorModal({
  isOpen,
  onClose,
  voices,
  selectedVoice,
  onSelectVoice,
  onPreviewVoice,
  previewingVoiceId,
}: VoiceSelectorModalProps) {
  const [search, setSearch] = useState('');
  const [filterTag, setFilterTag] = useState<string>('All');

  if (!isOpen) return null;

  const categories = [
    { id: 'All', label: 'সবগুলো (All)' },
    { id: 'বাংলা', label: '🇧🇩 বাংলা (Bengali)' },
    { id: 'English', label: '🇺🇸 English' },
    { id: 'Female', label: '👩 নারী কণ্ঠ' },
    { id: 'Male', label: '👨 পুরুষ কণ্ঠ' },
    { id: 'Popular', label: '🔥 জনপ্রিয়' },
  ];

  const filteredVoices = voices.filter((v) => {
    const matchesSearch =
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.accent.toLowerCase().includes(search.toLowerCase()) ||
      v.tone.toLowerCase().includes(search.toLowerCase()) ||
      v.useCase.toLowerCase().includes(search.toLowerCase()) ||
      v.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));

    if (!matchesSearch) return false;

    if (filterTag === 'All') return true;
    if (filterTag === 'বাংলা') return v.tags.includes('বাংলা') || v.accent.includes('বাংলা') || v.name.includes('বাংলা');
    if (filterTag === 'English') return v.tags.includes('English') || !v.tags.includes('বাংলা');
    if (filterTag === 'Female') return v.gender === 'Female';
    if (filterTag === 'Male') return v.gender === 'Male';
    if (filterTag === 'Popular') return v.tags.includes('Popular');

    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#0b101c] border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[88vh] flex flex-col overflow-hidden text-slate-100">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-[#0e1526]">
          <div className="flex items-center space-x-3">
            <AuraVoiceLogo size="md" isAnimated={!!previewingVoiceId} />
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-1.5">
                  <span>AuraVoice</span>
                  <span className="text-blue-400">ভয়েস লাইব্রেরি</span>
                </h2>
                <span className="text-[11px] px-2.5 py-0.5 rounded-lg bg-blue-950/80 text-blue-300 border border-blue-800/60 font-semibold font-mono">
                  {voices.length}টি ভয়েস
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                যেকোনো ভয়েসের অডিও প্রিভিউ শুনতে <strong className="text-blue-300 font-semibold">'▶ ডেমো শুনুন'</strong> বাটনে চাপ দিন।
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-blue-300 hover:text-white bg-blue-950/60 hover:bg-blue-900/80 border border-blue-800/60 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Categories Bar */}
        <div className="p-4 border-b border-slate-800 bg-[#090e1a] space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-blue-400" />
            <input
              type="text"
              placeholder="ভয়েসের নাম, ভাষা বা ক্যাটাগরি খুঁজুন (যেমন: নুসরাত, আরজে, Adam, Story)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#0c1220] border border-slate-800 focus:border-blue-500 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
            <span className="text-slate-400 flex items-center gap-1 pr-1 font-medium whitespace-nowrap text-xs">
              <Filter className="w-3 h-3 text-blue-400" /> ফিল্টার:
            </span>
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setFilterTag(cat.id)}
                className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-colors border ${
                  filterTag === cat.id
                    ? 'bg-blue-600 text-white border-blue-400 font-bold'
                    : 'bg-blue-950/60 border-blue-900/60 text-blue-200 hover:text-white hover:bg-blue-900/60'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Voices Grid */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-3.5 bg-[#080d17]">
          {filteredVoices.map((voice) => {
            const isSelected = selectedVoice.id === voice.id;
            const isPreviewing = previewingVoiceId === voice.id;

            return (
              <div
                key={voice.id}
                className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#0f172a] border-blue-500 ring-1 ring-blue-500/60'
                    : 'bg-[#0c1220] border-slate-800 hover:border-blue-700/60'
                }`}
              >
                <div>
                  {/* Top Bar: Avatar, Name, Accent & Demo Button */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center space-x-3 min-w-0">
                      <div
                        className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${voice.avatarColor} flex items-center justify-center text-white font-extrabold text-base flex-shrink-0 border border-white/20`}
                      >
                        {voice.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-white text-sm truncate">
                            {voice.name}
                          </span>
                          {isSelected && (
                            <span className="flex items-center text-[10px] bg-blue-600 text-white font-semibold px-2 py-0.5 rounded-md border border-blue-400/40 whitespace-nowrap">
                              <Check className="w-3 h-3 mr-1" /> নির্বাচিত
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5 truncate">
                          {voice.accent} · <span className="text-blue-300">{voice.tone}</span>
                        </div>
                      </div>
                    </div>

                    {/* Instant Demo Play / Stop Button */}
                    <button
                      type="button"
                      onClick={() => onPreviewVoice(voice)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors flex-shrink-0 border ${
                        isPreviewing
                          ? 'bg-blue-600 text-white border-blue-400 ring-2 ring-blue-300/40'
                          : 'bg-blue-950/80 hover:bg-blue-600 text-blue-200 hover:text-white border-blue-700/60'
                      }`}
                    >
                      {isPreviewing ? (
                        <>
                          <div className="flex items-center gap-0.5 h-3">
                            <span className="w-0.5 h-full bg-white animate-[pulse_0.4s_infinite]" />
                            <span className="w-0.5 h-2 bg-blue-200 animate-[pulse_0.7s_infinite]" />
                            <span className="w-0.5 h-3 bg-white animate-[pulse_0.5s_infinite]" />
                          </div>
                          <span>থামান</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>ডেমো শুনুন</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Preview Quote Text */}
                  <div className="mt-3 text-xs text-slate-300 italic bg-[#070b14] p-2.5 rounded-xl border border-slate-800 leading-relaxed font-sans">
                    "{voice.previewText}"
                  </div>
                </div>

                {/* Bottom Card Footer: Tags & Selection Trigger */}
                <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 overflow-hidden">
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-blue-950/80 text-blue-300 border border-blue-900/60 font-medium truncate max-w-[140px]">
                      {voice.useCase}
                    </span>
                    {voice.tags.slice(0, 2).map((t) => (
                      <span key={t} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800 font-mono">
                        {t}
                      </span>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onSelectVoice(voice);
                      onClose();
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors border ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-400'
                        : 'bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white border-blue-400/40'
                    }`}
                  >
                    {isSelected ? '✓ সক্রিয় আছে' : 'ব্যবহার করুন'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#090e1a] flex items-center justify-between text-xs text-slate-300">
          <span className="flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
            <span>লাইভ স্টুডিও ডেমো অডিও টেস্ট</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-colors border border-blue-400/40"
          >
            বন্ধ করুন (Close)
          </button>
        </div>
      </div>
    </div>
  );
}
