import { GenerationHistoryItem } from '../types/tts';
import {
  Play,
  Download,
  Trash2,
  Star,
  Copy,
  Clock,
  Radio,
  FileAudio,
  Check,
} from 'lucide-react';
import { formatTime, downloadAudio } from '../utils/audio';
import { useState } from 'react';

interface HistoryListProps {
  items: GenerationHistoryItem[];
  onPlayItem: (item: GenerationHistoryItem) => void;
  onDeleteItem: (id: string) => void;
  onClearAll: () => void;
  onToggleStar: (id: string) => void;
  onLoadScript: (text: string) => void;
}

export function HistoryList({
  items,
  onPlayItem,
  onDeleteItem,
  onClearAll,
  onToggleStar,
  onLoadScript,
}: HistoryListProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center bg-[#101726] border border-slate-800 rounded-2xl p-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
          <FileAudio className="w-8 h-8" />
        </div>
        <h3 className="text-base font-bold text-white mb-1">No Generated Audio Yet</h3>
        <p className="text-xs text-slate-400 max-w-sm mx-auto mb-5">
          Generate realistic voice clips in the Speech Studio or Dialogue Studio to build your audio generation library.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4 pb-24">
      <div className="flex items-center justify-between bg-[#101726] border border-slate-800 rounded-2xl p-4">
        <div>
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Radio className="w-4 h-4 text-indigo-400" />
            <span>Generation History & Audio Library</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
              {items.length} clips
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            All synthesized audio clips saved locally with high-fidelity WAV downloads.
          </p>
        </div>

        <button
          onClick={onClearAll}
          className="px-3 py-1.5 rounded-lg bg-rose-950/30 hover:bg-rose-900/40 text-rose-300 border border-rose-800/40 text-xs font-medium transition-colors"
        >
          Clear Library
        </button>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="group bg-[#101726] hover:bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            {/* Left: Play button + Info */}
            <div className="flex items-start space-x-3.5 flex-1 min-w-0">
              <button
                type="button"
                onClick={() => onPlayItem(item)}
                className="w-10 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shadow-md shadow-indigo-600/30 flex-shrink-0 transition-transform active:scale-95 mt-0.5"
              >
                <Play className="w-4 h-4 ml-0.5" />
              </button>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-white">{item.voiceName}</span>
                  <span className="text-[10px] text-slate-500">({item.baseVoice})</span>
                  <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.2 rounded font-mono">
                    {formatTime(item.durationSeconds)}
                  </span>
                  <span className="text-[10px] text-indigo-400 bg-indigo-950/60 px-1.5 py-0.2 rounded">
                    {item.characterCount} chars
                  </span>
                  <span className="text-[10px] text-slate-500 ml-auto flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <p className="text-xs text-slate-300 mt-1 line-clamp-2 font-sans">
                  "{item.text}"
                </p>

                {item.stylePrompt && (
                  <p className="text-[10px] text-slate-500 italic mt-1 truncate">
                    Style: {item.stylePrompt}
                  </p>
                )}
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center space-x-1.5 self-end sm:self-center">
              <button
                onClick={() => onToggleStar(item.id)}
                title={item.isStarred ? 'Remove from favorites' : 'Star favorite'}
                className={`p-2 rounded-lg transition-colors ${
                  item.isStarred ? 'text-amber-400 bg-amber-950/30' : 'text-slate-400 hover:text-amber-400 hover:bg-slate-800'
                }`}
              >
                <Star className={`w-4 h-4 ${item.isStarred ? 'fill-amber-400' : ''}`} />
              </button>

              <button
                onClick={() => handleCopy(item.id, item.text)}
                title="Copy text"
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                {copiedId === item.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>

              <button
                onClick={() => onLoadScript(item.text)}
                title="Load into Studio Editor"
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
              >
                Use Script
              </button>

              <button
                onClick={() => {
                  const fname = `${item.voiceName.toLowerCase()}_${item.id}`;
                  downloadAudio(item.audioData, fname, item.mimeType);
                }}
                title="Download WAV"
                className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
              </button>

              <button
                onClick={() => onDeleteItem(item.id)}
                title="Delete generation"
                className="p-2 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
