import { Mic, Users, Sparkles, FolderClock, Radio, Volume2 } from 'lucide-react';
import { AuraVoiceLogo } from './AuraVoiceLogo';

interface HeaderProps {
  activeTab: 'tts' | 'dialogue' | 'voicelab' | 'history';
  onTabChange: (tab: 'tts' | 'dialogue' | 'voicelab' | 'history') => void;
  historyCount: number;
}

export function Header({ activeTab, onTabChange, historyCount }: HeaderProps) {
  return (
    <header className="border-b border-slate-800/80 bg-[#0c111c]/90 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <AuraVoiceLogo size="md" />
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-tight text-white flex items-center">
                  Aura<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">Voice</span>
                  <span className="text-slate-200 ml-1 font-bold">Studio</span>
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  v3 AI
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Ultra-Realistic Speech Synthesis & Voice Lab
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center space-x-1 sm:space-x-2 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => onTabChange('tts')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'tts'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Mic className="w-4 h-4" />
              <span>Speech Studio</span>
            </button>

            <button
              onClick={() => onTabChange('dialogue')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'dialogue'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Dialogue</span>
            </button>

            <button
              onClick={() => onTabChange('voicelab')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'voicelab'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>VoiceLab</span>
            </button>

            <button
              onClick={() => onTabChange('history')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'history'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <FolderClock className="w-4 h-4" />
              <span className="hidden md:inline">Library</span>
              {historyCount > 0 && (
                <span className="px-1.5 py-0.2 bg-slate-800 text-slate-300 text-[11px] rounded-full border border-slate-700">
                  {historyCount}
                </span>
              )}
            </button>
          </nav>

          {/* Right Status Indicator */}
          <div className="hidden lg:flex items-center space-x-3 text-xs text-slate-400">
            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-emerald-950/40 border border-emerald-800/40 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="font-medium">24kHz Hi-Fi Engine</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
