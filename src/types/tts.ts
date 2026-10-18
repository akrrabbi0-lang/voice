export interface VoiceProfile {
  id: string;
  name: string;
  baseVoice: 'Puck' | 'Charon' | 'Kore' | 'Fenrir' | 'Zephyr';
  gender: 'Male' | 'Female' | 'Neutral';
  age: 'Young Adult' | 'Adult' | 'Middle Aged' | 'Mature' | 'Distinguished';
  accent: string;
  tone: string;
  useCase: string;
  previewText: string;
  avatarColor: string;
  tags: string[];
  isCustom?: boolean;
  pitch?: number;
  rate?: number;
}

export interface AudioSettings {
  stability: number; // 0 - 100
  clarity: number; // 0 - 100
  speed: number; // 0.5 - 2.0
  stylePreset: string;
  customStylePrompt: string;
  model: 'gemini-3.8-flash-lite-tts' | 'gemini-3.8-flash-tts';
}

export interface GenerationHistoryItem {
  id: string;
  text: string;
  voiceId: string;
  voiceName: string;
  baseVoice: string;
  timestamp: number;
  audioData: string; // base64
  mimeType: string;
  durationSeconds: number;
  wordCount: number;
  characterCount: number;
  model: string;
  stylePrompt: string;
  isStarred?: boolean;
}

export interface DialogueLine {
  id: string;
  speakerId: 'A' | 'B';
  speakerName: string;
  text: string;
  style?: string;
}

export interface SpeakerConfig {
  name: string;
  voiceId: string;
  baseVoice: 'Puck' | 'Charon' | 'Kore' | 'Fenrir' | 'Zephyr';
  avatarColor: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  plan: 'free' | 'pro' | 'unlimited';
  totalQuotaSeconds: number; // default 600 (10 mins)
  usedQuotaSeconds: number;
  lastResetTime: number; // timestamp
  earnedBonusSeconds: number;
  adsWatchedCount: number;
}

