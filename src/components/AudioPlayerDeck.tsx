import { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Download,
  Share2,
  Sparkles,
  Repeat,
  Radio,
} from 'lucide-react';
import { formatTime, downloadAudio, base64ToBlobUrl } from '../utils/audio';
import { AudioVisualizer } from './AudioVisualizer';

interface AudioPlayerDeckProps {
  audioData: string | null; // base64
  mimeType?: string;
  voiceName: string;
  voiceAvatarColor?: string;
  textSnippet: string;
  playbackSpeed: number;
  onSpeedChange: (speed: number) => void;
  onClearAudio?: () => void;
}

export function AudioPlayerDeck({
  audioData,
  mimeType = 'audio/wav',
  voiceName,
  voiceAvatarColor = 'from-indigo-600 to-purple-600',
  textSnippet,
  playbackSpeed,
  onSpeedChange,
}: AudioPlayerDeckProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.9);
  const [isMuted, setIsMuted] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [copied, setCopied] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

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
    audio.volume = isMuted ? 0 : volume;
    audio.loop = isLooping;

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

    // Auto-play when new audio is generated
    audio.play().then(() => {
      setIsPlaying(true);
    }).catch((e) => {
      console.warn('Autoplay prevented or interrupted:', e);
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
    }
  }, [playbackSpeed]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = isLooping;
    }
  }, [isLooping]);

  const togglePlay = () => {
    if (!audioRef.current || !audioData) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(console.error);
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
    const cleanName = `${voiceName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_voice_${Date.now()}`;
    downloadAudio(audioData, cleanName, mimeType);
  };

  const handleShare = () => {
    if (!audioData) return;
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!audioData) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#0d131f]/95 backdrop-blur-xl border-t border-slate-800 shadow-2xl px-4 py-3 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-4 justify-between">
        {/* Left: Voice info & Snippet */}
        <div className="flex items-center space-x-3 w-full md:w-1/4 min-w-0">
          <div
            className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${voiceAvatarColor} flex items-center justify-center text-white font-bold text-sm shadow-md flex-shrink-0 ring-1 ring-white/10`}
          >
            {voiceName.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-white text-xs sm:text-sm truncate">
                {voiceName}
              </span>
              <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-800/40">
                24kHz WAV
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate">
              {textSnippet || 'Voice preview'}
            </p>
          </div>
        </div>

        {/* Center: Playback Controls, Progress & Waveform */}
        <div className="flex-1 w-full max-w-2xl flex flex-col items-center space-y-1.5">
          <div className="w-full flex items-center space-x-3">
            <button
              onClick={() => {
                if (audioRef.current) {
                  audioRef.current.currentTime = 0;
                  setCurrentTime(0);
                }
              }}
              title="Restart"
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={togglePlay}
              className="p-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30 hover:scale-105 active:scale-95 transition-all"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>

            <div className="flex-1 flex flex-col justify-center">
              {/* Scrub line & Waveform preview */}
              <div className="relative w-full flex items-center">
                <input
                  type="range"
                  min="0"
                  max={duration || 1}
                  step="0.05"
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 z-10"
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mt-1">
                <span>{formatTime(currentTime)}</span>
                <span className="text-slate-600">/</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            <button
              onClick={() => setIsLooping(!isLooping)}
              title="Toggle Loop"
              className={`p-1.5 rounded-lg transition-colors ${
                isLooping ? 'text-indigo-400 bg-indigo-950/60' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Repeat className="w-4 h-4" />
            </button>
          </div>

          {/* Dynamic Audio Visualizer Bar */}
          <div className="w-full h-6 overflow-hidden rounded-md opacity-80">
            <AudioVisualizer isPlaying={isPlaying} />
          </div>
        </div>

        {/* Right: Speed, Volume & Actions */}
        <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
          {/* Speed selector */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-[11px]">
            {[0.75, 1.0, 1.25, 1.5].map((speed) => (
              <button
                key={speed}
                onClick={() => onSpeedChange(speed)}
                className={`px-1.5 py-0.5 rounded font-mono transition-colors ${
                  playbackSpeed === speed
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>

          {/* Volume */}
          <div className="flex items-center space-x-1.5 text-slate-400">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-1 hover:text-white transition-colors"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-rose-400" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                setVolume(parseFloat(e.target.value));
                if (isMuted) setIsMuted(false);
              }}
              className="w-16 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>

          {/* Download & Share */}
          <button
            onClick={handleDownload}
            title="Download Master WAV"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600 hover:text-white border border-indigo-500/30 text-xs font-medium transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export WAV</span>
          </button>
        </div>
      </div>
    </div>
  );
}
