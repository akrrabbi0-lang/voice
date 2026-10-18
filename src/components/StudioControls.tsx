import { AudioSettings } from '../types/tts';
import { Sliders, Zap, Sparkles, HelpCircle, Gauge } from 'lucide-react';

interface StudioControlsProps {
  settings: AudioSettings;
  onChange: (settings: AudioSettings) => void;
}

export function StudioControls({ settings, onChange }: StudioControlsProps) {
  const updateSetting = <K extends keyof AudioSettings>(key: K, value: AudioSettings[K]) => {
    onChange({
      ...settings,
      [key]: value,
    });
  };

  const stylePresets = [
    { id: 'natural', label: 'Natural & Conversational', prompt: 'Natural conversational human cadence with warm clarity' },
    { id: 'cinematic', label: 'Cinematic & Dramatic', prompt: 'Cinematic, resonant, deep documentary narrator with deliberate emotional pacing' },
    { id: 'energetic', label: 'High-Energy Promo', prompt: 'Enthusiastic, energetic commercial advertisement with punchy cadence' },
    { id: 'storyteller', label: 'Melodic Storyteller', prompt: 'Expressive audiobook storyteller with gentle emotional arcs and pauses' },
    { id: 'whisper', label: 'Intimate & Soft', prompt: 'Soft, intimate, breathy and gentle late-night storytelling delivery' },
    { id: 'news', label: 'Professional Broadcaster', prompt: 'Clear, authoritative, articulate broadcast journalist delivery' },
  ];

  return (
    <div className="bg-[#101726] border border-slate-800 rounded-2xl p-5 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <Sliders className="w-4 h-4 text-indigo-400" />
          <span>Voice Settings</span>
        </h3>
        <span className="text-[11px] text-slate-500 font-medium">Fine-tune delivery</span>
      </div>

      {/* Model Selection */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
          <span>Model Architecture</span>
          <span className="text-[10px] text-indigo-400 font-mono">Gemini 3.8</span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => updateSetting('model', 'gemini-3.8-flash-lite-tts')}
            className={`p-2.5 rounded-xl border text-left transition-all ${
              settings.model === 'gemini-3.8-flash-lite-tts'
                ? 'bg-indigo-950/40 border-indigo-500 text-white shadow-md'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center gap-1.5 font-semibold text-xs text-white">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Flash Lite TTS</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              Ultra-fast generation, optimal for long texts & voiceovers.
            </p>
          </button>

          <button
            type="button"
            onClick={() => updateSetting('model', 'gemini-3.8-flash-tts')}
            className={`p-2.5 rounded-xl border text-left transition-all ${
              settings.model === 'gemini-3.8-flash-tts'
                ? 'bg-purple-950/40 border-purple-500 text-white shadow-md'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center gap-1.5 font-semibold text-xs text-white">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Flash TTS Pro</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              Deep nuance, vocal bursts (&lt;breath&gt;, &lt;laugh&gt;), maximum emotion.
            </p>
          </button>
        </div>
      </div>

      {/* Style Preset */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-slate-300">
          Delivery Persona / Style Preset
        </label>
        <select
          value={settings.stylePreset}
          onChange={(e) => {
            const preset = stylePresets.find((p) => p.id === e.target.value);
            if (preset) {
              onChange({
                ...settings,
                stylePreset: preset.id,
                customStylePrompt: preset.prompt,
              });
            }
          }}
          className="w-full px-3 py-2 bg-slate-900/90 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
        >
          {stylePresets.map((preset) => (
            <option key={preset.id} value={preset.id} className="bg-slate-900 text-white">
              {preset.label}
            </option>
          ))}
        </select>
      </div>

      {/* Custom Style Prompt Directive */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
          <span>Style Prompt Directive</span>
          <span className="text-[10px] text-slate-500">speechMetadata.style</span>
        </label>
        <textarea
          rows={2}
          value={settings.customStylePrompt}
          onChange={(e) => updateSetting('customStylePrompt', e.target.value)}
          placeholder="e.g. Enthusiastic storytelling with dramatic pauses and warm undertones"
          className="w-full px-3 py-2 bg-slate-900/90 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none font-sans"
        />
      </div>

      {/* Stability Slider */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-slate-300 flex items-center gap-1">
            Stability
            <span title="Lower values make the speech more expressive and dramatic. Higher values make it more uniform and stable.">
              <HelpCircle className="w-3 h-3 text-slate-500 cursor-help" />
            </span>
          </span>
          <span className="font-mono text-indigo-400 font-semibold">{settings.stability}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={settings.stability}
          onChange={(e) => updateSetting('stability', Number(e.target.value))}
          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
        />
        <div className="flex justify-between text-[10px] text-slate-500">
          <span>More Variable / Expressive</span>
          <span>More Consistent</span>
        </div>
      </div>

      {/* Clarity + Similarity Enhancement Slider */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-slate-300">Clarity & Nuance</span>
          <span className="font-mono text-indigo-400 font-semibold">{settings.clarity}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={settings.clarity}
          onChange={(e) => updateSetting('clarity', Number(e.target.value))}
          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
        />
        <div className="flex justify-between text-[10px] text-slate-500">
          <span>Soft & Breathy</span>
          <span>High Definition</span>
        </div>
      </div>

      {/* Speed Slider */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-slate-300 flex items-center gap-1">
            <Gauge className="w-3 h-3 text-slate-400" />
            <span>Playback Speed</span>
          </span>
          <span className="font-mono text-indigo-400 font-semibold">{settings.speed.toFixed(2)}x</span>
        </div>
        <input
          type="range"
          min="0.5"
          max="2.0"
          step="0.05"
          value={settings.speed}
          onChange={(e) => updateSetting('speed', parseFloat(e.target.value))}
          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
        />
        <div className="flex justify-between text-[10px] text-slate-500">
          <span>0.5x (Slow)</span>
          <span>1.0x (Normal)</span>
          <span>2.0x (Fast)</span>
        </div>
      </div>
    </div>
  );
}
