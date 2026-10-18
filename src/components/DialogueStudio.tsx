import { useState } from 'react';
import { VoiceProfile, DialogueLine, SpeakerConfig } from '../types/tts';
import {
  Users,
  Plus,
  Trash2,
  Play,
  Sparkles,
  ArrowRightLeft,
  Volume2,
  Wand2,
} from 'lucide-react';

interface DialogueStudioProps {
  voices: VoiceProfile[];
  onGenerateDialogue: (lines: DialogueLine[], speakerA: SpeakerConfig, speakerB: SpeakerConfig) => Promise<void>;
  isGenerating: boolean;
}

export function DialogueStudio({ voices, onGenerateDialogue, isGenerating }: DialogueStudioProps) {
  const [speakerA, setSpeakerA] = useState<SpeakerConfig>({
    name: 'Alex',
    voiceId: 'adam',
    baseVoice: 'Puck',
    avatarColor: 'from-blue-600 to-indigo-600',
  });

  const [speakerB, setSpeakerB] = useState<SpeakerConfig>({
    name: 'Sarah',
    voiceId: 'sarah',
    baseVoice: 'Zephyr',
    avatarColor: 'from-emerald-500 to-teal-600',
  });

  const [lines, setLines] = useState<DialogueLine[]>([
    {
      id: 'line-1',
      speakerId: 'A',
      speakerName: 'Alex',
      text: 'Hey Sarah! Welcome back to the podcast. Today we are diving into next-generation AI speech.',
      style: 'Enthusiastic podcast host with warm energy',
    },
    {
      id: 'line-2',
      speakerId: 'B',
      speakerName: 'Sarah',
      text: '|yeah| I have been eagerly looking forward to this! <laugh> The quality nowadays is completely indistinguishable from real humans.',
      style: 'Excited co-host with energetic cadence',
    },
    {
      id: 'line-3',
      speakerId: 'A',
      speakerName: 'Alex',
      text: '|mhm| Exactly. Notice how seamless the conversational pacing and backchanneling feel.',
      style: 'Thoughtful agreement with natural pacing',
    },
    {
      id: 'line-4',
      speakerId: 'B',
      speakerName: 'Sarah',
      text: 'It is mind-blowing! Even Bengali and multilingual scripts sound remarkably authentic.',
      style: 'Bright, cheerful affirmation',
    },
  ]);

  const addLine = (speakerId: 'A' | 'B') => {
    const newLine: DialogueLine = {
      id: `line-${Date.now()}`,
      speakerId,
      speakerName: speakerId === 'A' ? speakerA.name : speakerB.name,
      text: '',
      style: speakerId === 'A' ? 'Natural conversational host' : 'Engaging co-host',
    };
    setLines([...lines, newLine]);
  };

  const updateLineText = (id: string, text: string) => {
    setLines(lines.map((l) => (l.id === id ? { ...l, text } : l)));
  };

  const toggleSpeaker = (id: string) => {
    setLines(
      lines.map((l) => {
        if (l.id === id) {
          const newSpeakerId = l.speakerId === 'A' ? 'B' : 'A';
          return {
            ...l,
            speakerId: newSpeakerId,
            speakerName: newSpeakerId === 'A' ? speakerA.name : speakerB.name,
          };
        }
        return l;
      })
    );
  };

  const deleteLine = (id: string) => {
    if (lines.length <= 1) return;
    setLines(lines.filter((l) => l.id !== id));
  };

  const insertTagIntoLine = (id: string, tag: string) => {
    setLines(
      lines.map((l) => {
        if (l.id === id) {
          return { ...l, text: `${l.text} ${tag} ` };
        }
        return l;
      })
    );
  };

  const loadBanglaDialoguePreset = () => {
    setSpeakerA({
      name: 'তানভীর (Tanvir)',
      voiceId: 'tanvir_bn',
      baseVoice: 'Puck',
      avatarColor: 'from-rose-500 to-amber-500',
    });
    setSpeakerB({
      name: 'নুসরাত (Nusrat)',
      voiceId: 'nusrat_bn',
      baseVoice: 'Kore',
      avatarColor: 'from-pink-500 to-rose-600',
    });
    setLines([
      {
        id: 'bn-1',
        speakerId: 'A',
        speakerName: 'তানভীর (Tanvir)',
        text: 'নুসরাত, আজকের প্রযুক্তি নিয়ে তোমার অভিমত কী?',
        style: 'Friendly conversational Bengali RJ',
      },
      {
        id: 'bn-2',
        speakerId: 'B',
        speakerName: 'নুসরাত (Nusrat)',
        text: '|yeah| সত্যি বলতে, এআই ভয়েস প্রযুক্তির উন্নয়ন দেখে আমি ভীষণ আনন্দিত ও মুগ্ধ!',
        style: 'Sweet, expressive Bengali co-host',
      },
      {
        id: 'bn-3',
        speakerId: 'A',
        speakerName: 'তানভীর (Tanvir)',
        text: '|mhm| একদম ঠিক বলেছ। প্রতিটি সুর আর অনুভূতি এখানে স্পষ্ট প্রকাশ পাচ্ছে।',
        style: 'Warm agreement in Bengali',
      },
    ]);
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Top Banner & Presets */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#101726] border border-slate-800 rounded-2xl p-5">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" />
            <span>Dual-Speaker Dialogue Studio</span>
            <span className="text-xs px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
              gemini-3.8-flash-tts
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Write realistic dialogues, screenplays, and podcasts with natural backchanneling (|yeah|, |mhm|) and vocal bursts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadBanglaDialoguePreset}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-indigo-500 text-xs font-medium transition-colors flex items-center gap-1.5"
          >
            <span>🇧🇩 বাংলা ডায়লগ প্রিসেট</span>
          </button>
        </div>
      </div>

      {/* Speaker Configuration Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Speaker A */}
        <div className="bg-[#101726] border border-blue-900/40 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${speakerA.avatarColor} flex items-center justify-center text-white font-bold text-xs`}>
                A
              </div>
              <div>
                <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Speaker A</span>
                <input
                  type="text"
                  value={speakerA.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setSpeakerA({ ...speakerA, name });
                    setLines(lines.map((l) => (l.speakerId === 'A' ? { ...l, speakerName: name } : l)));
                  }}
                  className="block text-sm font-bold text-white bg-transparent border-b border-transparent hover:border-slate-700 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">Base: {speakerA.baseVoice}</span>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] text-slate-400">Assigned Voice Persona</label>
            <select
              value={speakerA.voiceId}
              onChange={(e) => {
                const voice = voices.find((v) => v.id === e.target.value);
                if (voice) {
                  setSpeakerA({
                    ...speakerA,
                    voiceId: voice.id,
                    baseVoice: voice.baseVoice,
                    avatarColor: voice.avatarColor,
                  });
                }
              }}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              {voices.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} ({v.gender} · {v.accent} · {v.baseVoice})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Speaker B */}
        <div className="bg-[#101726] border border-emerald-900/40 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${speakerB.avatarColor} flex items-center justify-center text-white font-bold text-xs`}>
                B
              </div>
              <div>
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Speaker B</span>
                <input
                  type="text"
                  value={speakerB.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setSpeakerB({ ...speakerB, name });
                    setLines(lines.map((l) => (l.speakerId === 'B' ? { ...l, speakerName: name } : l)));
                  }}
                  className="block text-sm font-bold text-white bg-transparent border-b border-transparent hover:border-slate-700 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">Base: {speakerB.baseVoice}</span>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] text-slate-400">Assigned Voice Persona</label>
            <select
              value={speakerB.voiceId}
              onChange={(e) => {
                const voice = voices.find((v) => v.id === e.target.value);
                if (voice) {
                  setSpeakerB({
                    ...speakerB,
                    voiceId: voice.id,
                    baseVoice: voice.baseVoice,
                    avatarColor: voice.avatarColor,
                  });
                }
              }}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              {voices.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} ({v.gender} · {v.accent} · {v.baseVoice})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Screenplay Turn Editor */}
      <div className="bg-[#101726] border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-semibold text-white">Dialogue Turns</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
              {lines.length} lines
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => addLine('A')}
              className="px-2.5 py-1 rounded-lg bg-blue-600/20 text-blue-300 hover:bg-blue-600 hover:text-white border border-blue-500/30 text-xs font-medium transition-colors flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> + Line ({speakerA.name})
            </button>
            <button
              onClick={() => addLine('B')}
              className="px-2.5 py-1 rounded-lg bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600 hover:text-white border border-emerald-500/30 text-xs font-medium transition-colors flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> + Line ({speakerB.name})
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {lines.map((line, idx) => {
            const isSpeakerA = line.speakerId === 'A';
            const speaker = isSpeakerA ? speakerA : speakerB;

            return (
              <div
                key={line.id}
                className={`p-4 rounded-xl border transition-all ${
                  isSpeakerA
                    ? 'bg-blue-950/20 border-blue-900/40'
                    : 'bg-emerald-950/20 border-emerald-900/40'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded ${
                        isSpeakerA ? 'bg-blue-600 text-white' : 'bg-emerald-600 text-white'
                      }`}
                    >
                      {speaker.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleSpeaker(line.id)}
                      title="Switch Speaker"
                      className="text-slate-400 hover:text-white text-xs flex items-center gap-1 p-1 hover:bg-slate-800 rounded transition-colors"
                    >
                      <ArrowRightLeft className="w-3 h-3" />
                      <span className="text-[10px]">Switch</span>
                    </button>
                  </div>

                  <div className="flex items-center space-x-1">
                    {/* Quick vocal expression injection */}
                    <div className="hidden sm:flex items-center space-x-1 text-[10px]">
                      {['|yeah|', '|mhm|', '<laugh>', '<gasp>', '<breath>'].map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => insertTagIntoLine(line.id, tag)}
                          className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-mono transition-colors"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => deleteLine(line.id)}
                      disabled={lines.length <= 1}
                      className="p-1 text-slate-500 hover:text-rose-400 disabled:opacity-30 transition-colors ml-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <textarea
                  rows={2}
                  value={line.text}
                  onChange={(e) => updateLineText(line.id, e.target.value)}
                  placeholder={`What does ${speaker.name} say?`}
                  className="w-full px-3 py-2 bg-slate-900/80 border border-slate-700/60 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none font-sans"
                />
              </div>
            );
          })}
        </div>

        {/* Generate Button */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={() => onGenerateDialogue(lines, speakerA, speakerB)}
            disabled={isGenerating || lines.every((l) => !l.text.trim())}
            className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-semibold text-sm shadow-xl shadow-indigo-600/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Synthesizing Screenplay Dialogue...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Dual-Speaker Conversation</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
