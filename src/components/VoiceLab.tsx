import { useState } from 'react';
import { VoiceProfile } from '../types/tts';
import { Sparkles, Plus, Wand2, Volume2, Check, ArrowRight, ShieldCheck } from 'lucide-react';

interface VoiceLabProps {
  onAddCustomVoice: (voice: VoiceProfile) => void;
  onPreviewCustom: (voice: VoiceProfile, testText: string) => Promise<void>;
  isPreviewing: boolean;
}

export function VoiceLab({ onAddCustomVoice, onPreviewCustom, isPreviewing }: VoiceLabProps) {
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Neutral'>('Female');
  const [age, setAge] = useState<VoiceProfile['age']>('Young Adult');
  const [accent, setAccent] = useState('American (Neutral)');
  const [baseVoice, setBaseVoice] = useState<'Puck' | 'Charon' | 'Kore' | 'Fenrir' | 'Zephyr'>('Kore');
  const [tonePrompt, setTonePrompt] = useState('Warm, intimate, breathy and articulate storyteller');
  const [testText, setTestText] = useState(
    'Every great journey begins with a spark of pure imagination. Welcome to the future of synthetic speech.'
  );
  const [createdVoice, setCreatedVoice] = useState<VoiceProfile | null>(null);

  const presets = [
    {
      title: 'Bengali Storyteller (বাংলা)',
      name: 'Joy (বাংলা)',
      gender: 'Male' as const,
      age: 'Young Adult' as const,
      accent: 'Bengali (Dhaka Accent)',
      baseVoice: 'Puck' as const,
      tone: 'Expressive Bangladeshi radio narrator with warm melodic cadence',
      testText: 'নমস্কার! জীবনের প্রতিটি গল্পই এক অপরূপ সুরের মতো। আসুন সেই সুরকে অনুভব করি।',
    },
    {
      title: 'Cinematic Movie Trailer',
      name: 'Vanguard',
      gender: 'Male' as const,
      age: 'Mature' as const,
      accent: 'Cinematic Gravelly',
      baseVoice: 'Fenrir' as const,
      tone: 'Gravelly, deep resonant trailer narrator with ominous slow pacing',
      testText: 'Beyond the horizon of time, only one destiny remains. Prepare for the fallout.',
    },
    {
      title: 'Sweet Bedtime Storyteller',
      name: 'Aria',
      gender: 'Female' as const,
      age: 'Young Adult' as const,
      accent: 'Soft British',
      baseVoice: 'Kore' as const,
      tone: 'Gentle, breathy, soothing whisper bedtime narrator',
      testText: 'The stars are shining bright tonight... close your eyes, and drift into peaceful dreams.',
    },
    {
      title: 'High-Octane Tech Broadcaster',
      name: 'Nova',
      gender: 'Female' as const,
      age: 'Adult' as const,
      accent: 'Mid-Atlantic',
      baseVoice: 'Zephyr' as const,
      tone: 'Rapid-fire, punchy, electric modern YouTube tech reviewer',
      testText: 'You will not believe what just dropped today! Let us jump straight into the teardown.',
    },
  ];

  const applyPreset = (p: typeof presets[0]) => {
    setName(p.name);
    setGender(p.gender);
    setAge(p.age);
    setAccent(p.accent);
    setBaseVoice(p.baseVoice);
    setTonePrompt(p.tone);
    setTestText(p.testText);
  };

  const handleCreate = async () => {
    if (!name.trim()) return;

    const newVoice: VoiceProfile = {
      id: `custom_${Date.now()}`,
      name: name.trim(),
      baseVoice,
      gender,
      age,
      accent,
      tone: tonePrompt,
      useCase: 'Custom Designed Persona',
      previewText: testText,
      avatarColor:
        gender === 'Female'
          ? 'from-pink-500 to-indigo-600'
          : gender === 'Male'
          ? 'from-cyan-600 to-indigo-700'
          : 'from-amber-500 to-purple-600',
      tags: ['Custom', gender, age, accent.split(' ')[0]],
      isCustom: true,
    };

    setCreatedVoice(newVoice);
    onAddCustomVoice(newVoice);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24">
      {/* Banner */}
      <div className="bg-[#101726] border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-purple-600/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>VoiceLab: Voice Design Studio</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                Persona Architect
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Craft bespoke synthetic voice personas by defining acoustic attributes, emotional styles, and acoustic backbones.
            </p>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="mt-4 pt-4 border-t border-slate-800">
          <span className="text-xs font-semibold text-slate-400 block mb-2">
            Quick Persona Starters:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {presets.map((p) => (
              <button
                key={p.title}
                type="button"
                onClick={() => applyPreset(p)}
                className="p-2 bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 rounded-xl text-left transition-all"
              >
                <div className="text-xs font-semibold text-white truncate">{p.title}</div>
                <div className="text-[10px] text-slate-400 mt-0.5 truncate">{p.name} · {p.accent}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Configuration Form */}
      <div className="bg-[#101726] border border-slate-800 rounded-2xl p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Voice Persona Name</label>
            <input
              type="text"
              placeholder="e.g. Liam, Kabir (বাংলা), Scarlett"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Accent & Language Flavor</label>
            <input
              type="text"
              placeholder="e.g. Bengali (Dhaka), British Posh, American Southern"
              value={accent}
              onChange={(e) => setAccent(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value as any)}
              className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Neutral">Neutral</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Age Archetype</label>
            <select
              value={age}
              onChange={(e) => setAge(e.target.value as any)}
              className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="Young Adult">Young Adult (20s)</option>
              <option value="Adult">Adult (30s)</option>
              <option value="Middle Aged">Middle-Aged (40s-50s)</option>
              <option value="Mature">Mature / Resonant (60s+)</option>
              <option value="Distinguished">Distinguished / Academic</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Base Prebuilt Voice Model</label>
            <select
              value={baseVoice}
              onChange={(e) => setBaseVoice(e.target.value as any)}
              className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="Kore">Kore (Warm, Clear, Melodic)</option>
              <option value="Puck">Puck (Deep, Confident, Narrative)</option>
              <option value="Fenrir">Fenrir (Resonant, Gravelly, Cinematic)</option>
              <option value="Zephyr">Zephyr (Bright, Upbeat, Dynamic)</option>
              <option value="Charon">Charon (Distinguished, Scholarly)</option>
            </select>
          </div>
        </div>

        {/* Tone & Style Prompt */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
            <span>Acoustic Persona & Delivery Description</span>
            <span className="text-[10px] text-slate-500">Guides Gemini 3.8 Speech Synthesis</span>
          </label>
          <textarea
            rows={2}
            value={tonePrompt}
            onChange={(e) => setTonePrompt(e.target.value)}
            placeholder="e.g. Enthusiastic storytelling with a warm raspy tone and cheerful intonation"
            className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none font-sans"
          />
        </div>

        {/* Test Phrase */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-300">Sample Preview Script</label>
          <textarea
            rows={2}
            value={testText}
            onChange={(e) => setTestText(e.target.value)}
            placeholder="Text to preview when generating voice sample..."
            className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none font-sans"
          />
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800">
          <button
            type="button"
            disabled={!name.trim() || isPreviewing}
            onClick={() => {
              const tempVoice: VoiceProfile = {
                id: `preview_${Date.now()}`,
                name: name.trim() || 'New Voice',
                baseVoice,
                gender,
                age,
                accent,
                tone: tonePrompt,
                useCase: 'Preview',
                previewText: testText,
                avatarColor: 'from-indigo-600 to-purple-600',
                tags: ['Custom'],
              };
              onPreviewCustom(tempVoice, testText);
            }}
            className="w-full sm:w-auto px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border border-slate-700 transition-colors disabled:opacity-50"
          >
            {isPreviewing ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Generating Preview Sample...</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-indigo-400" />
                <span>Hear Preview Sample</span>
              </>
            )}
          </button>

          <button
            type="button"
            disabled={!name.trim()}
            onClick={handleCreate}
            className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            <span>Save Voice to Studio Library</span>
          </button>
        </div>

        {createdVoice && (
          <div className="p-3 bg-emerald-950/40 border border-emerald-800/40 rounded-xl flex items-center justify-between text-xs text-emerald-400 animate-in fade-in">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Voice <strong>"{createdVoice.name}"</strong> has been successfully added to your library!</span>
            </div>
            <span className="text-[11px] text-emerald-300 font-medium">Ready in Speech Studio</span>
          </div>
        )}
      </div>
    </div>
  );
}
