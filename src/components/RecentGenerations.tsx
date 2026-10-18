import { useState } from 'react';
import { Play, Download, Trash2, Clock, Volume2, Star, Check, Copy } from 'lucide-react';
import { GenerationHistoryItem } from '../types/tts';
import { formatTime, downloadAudio } from '../utils/audio';

interface RecentGenerationsProps {
  items: GenerationHistoryItem[];
  onPlayItem: (item: GenerationHistoryItem) => void;
  onDeleteItem: (id: string) => void;
  onClearAll: () => void;
}

export function RecentGenerations({
  items,
  onPlayItem,
  onDeleteItem,
  onClearAll,
}: RecentGenerationsProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (items.length === 0) return null;

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <div className="mt-8 pt-6 border-t border-slate-800 space-y-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-bold text-white">সম্প্রতি তৈরি ভয়েস (Recent Clips)</h3>
          <span className="text-[11px] font-mono bg-blue-950/70 border border-blue-800/60 px-2.5 py-0.5 rounded-lg text-blue-300">
            {items.length} টি অডিও
          </span>
        </div>

        {/* Clear All History Button - Solid distinct button, never naked text */}
        <button
          type="button"
          onClick={onClearAll}
          className="px-3 py-1.5 rounded-lg bg-blue-950/80 hover:bg-rose-950/70 text-blue-200 hover:text-rose-200 border border-blue-800/60 hover:border-rose-700/60 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors self-start sm:self-auto"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>হিস্ট্রি মুছুন</span>
        </button>
      </div>

      {/* List of Clips */}
      <div className="space-y-3">
        {items.slice(0, 6).map((item) => (
          <div
            key={item.id}
            className="p-3.5 sm:p-4 rounded-2xl bg-[#0c1220] border border-slate-800 hover:border-blue-700/60 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5"
          >
            {/* Play Button & Text Snippet */}
            <div className="flex items-start sm:items-center space-x-3 flex-1 min-w-0 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => onPlayItem(item)}
                title="প্লে করুন"
                className="w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white flex items-center justify-center border border-blue-400/40 flex-shrink-0 transition-all active:scale-95"
              >
                <Play className="w-4 h-4 ml-0.5 fill-current" />
              </button>

              <div className="min-w-0 flex-1">
                <div className="flex items-center space-x-2 text-xs flex-wrap gap-y-1">
                  <span className="font-bold text-white truncate">{item.voiceName}</span>
                  <span className="text-[10px] font-mono text-blue-300 bg-blue-950/80 border border-blue-900/60 px-2 py-0.5 rounded-md">
                    {formatTime(item.durationSeconds)}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-xs text-slate-300 truncate mt-1">
                  "{item.text}"
                </p>
              </div>
            </div>

            {/* Action Buttons - Solid, distinct blue buttons with clear gaps */}
            <div className="flex items-center space-x-2 self-end sm:self-center flex-shrink-0">
              {/* Copy Text Button */}
              <button
                type="button"
                onClick={() => handleCopy(item.id, item.text)}
                title="টেক্সট কপি করুন"
                className="px-2.5 py-1.5 rounded-lg bg-blue-950/70 hover:bg-blue-900 text-blue-200 border border-blue-800/60 text-xs font-medium flex items-center space-x-1 transition-colors"
              >
                {copiedId === item.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 text-[11px]">কপি হয়েছে</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span className="text-[11px] hidden sm:inline">কপি</span>
                  </>
                )}
              </button>

              {/* Download WAV Button */}
              <button
                type="button"
                onClick={() => {
                  const fname = `voice_${item.voiceName.toLowerCase()}_${item.id}`;
                  downloadAudio(item.audioData, fname, item.mimeType);
                }}
                title="WAV ডাউনলোড করুন"
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white border border-blue-400/40 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="text-[11px]">ডাউনলোড</span>
              </button>

              {/* Delete Button */}
              <button
                type="button"
                onClick={() => onDeleteItem(item.id)}
                title="মুছুন"
                className="p-1.5 rounded-lg bg-blue-950/60 hover:bg-rose-950/80 text-blue-300 hover:text-rose-300 border border-blue-900/60 hover:border-rose-800/60 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
