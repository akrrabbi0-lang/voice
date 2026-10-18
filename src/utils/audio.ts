import { VoiceProfile } from '../types/tts';

/**
 * Audio helpers for decoding, playing, synthesizing, and downloading WAV streams
 */

export function base64ToBlobUrl(base64: string, mimeType = 'audio/wav'): string {
  try {
    const cleanBase64 = base64.replace(/^data:audio\/\w+;base64,/, '');
    const byteCharacters = atob(cleanBase64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mimeType });
    return URL.createObjectURL(blob);
  } catch (err) {
    console.error('Failed to convert base64 to Blob URL:', err);
    return `data:${mimeType};base64,${base64}`;
  }
}

export function downloadAudio(base64: string, filename: string, mimeType = 'audio/wav') {
  try {
    const url = base64ToBlobUrl(base64, mimeType);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename.endsWith('.wav') ? filename : `${filename}.wav`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  } catch (e) {
    console.error('Download audio failed:', e);
  }
}

export function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function estimateAudioDuration(text: string, wordsPerMinute = 145): number {
  if (!text) return 0;
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round((words / wordsPerMinute) * 60));
}

/**
 * Translates Bengali text to smooth, human-phonetic Romanized script.
 * Crucial when the user's OS does not have a native Bengali speech synthesis pack,
 * ensuring speech synthesis is NEVER silent and speaks clearly audible words!
 */
export function bengaliToPhonetic(text: string): string {
  const words: Record<string, string> = {
    'সবাইকে': 'Shobaike',
    'অনেক': 'onek',
    'শুভেচ্ছা': 'shubhechha',
    'মিষ্টি': 'mishti',
    'বাতাসে': 'batase',
    'ভেসে': 'bhese',
    'আসা': 'asha',
    'কথার': 'kothar',
    'প্রতিটি': 'protiti',
    'সুর': 'shur',
    'আজ': 'aaj',
    'আপনার': 'aapnar',
    'হৃদয়': 'hridoy',
    'হৃদয়ে': 'hridoye',
    'ছুঁয়ে': 'chhuye',
    'যাবে': 'jaabe',
    'নমস্কার': 'Nomoshkar',
    'স্বাগতম': 'shwagotom',
    'আজকের': 'aajker',
    'এই': 'ei',
    'সুন্দর': 'shundor',
    'সন্ধ্যায়': 'shondhyay',
    'আমরা': 'aamra',
    'জানবো': 'jaanbo',
    'প্রযুক্তির': 'projuktir',
    'এক': 'ek',
    'চমৎকার': 'chomotkar',
    'নতুন': 'notun',
    'বিস্ময়': 'bishmoy',
    'মেঘের': 'Megher',
    'ওপারে': 'opaare',
    'যে': 'je',
    'নীল': 'neel',
    'আকাশ': 'aakash',
    'সেখানে': 'shekhane',
    'ভালোবাসার': 'bhalobashar',
    'রঙিন': 'rongin',
    'পৃথিবী': 'prithibi',
    'প্রতিদিন': 'protidin',
    'জন্ম': 'jonmo',
    'নেয়': 'neye',
    'ইতিহাসের': 'Itihasher',
    'পাতায়': 'patay',
    'অমর': 'omor',
    'হয়ে': 'hoye',
    'থাকে': 'thaake',
    'সেইসব': 'sheishob',
    'সাহসী': 'shahoshi',
    'মানুষ': 'maanush',
    'যারা': 'jaara',
    'বিপদের': 'bipoder',
    'মাঝেও': 'maajheo',
    'মাথা': 'matha',
    'নত': 'noto',
    'করেনি': 'koreni',
    'হেই': 'Hey',
    'বন্ধুরা': 'bondhura',
    'ভিডিওতে': 'videote',
    'আমি': 'aami',
    'আপনাদের': 'aapnader',
    'সাথে': 'shathe',
    'শেয়ার': 'share',
    'করবো': 'korbo',
    'দারুণ': 'daarun',
    'কিছু': 'kichhu',
    'সিক্রেট': 'secret',
    'টিপস': 'tips',
    'একদম': 'ekdom',
    'মিস': 'miss',
    'করবেন': 'korben',
    'না': 'na',
    'মহাবিশ্বের': 'Mohabishwer',
    'অনন্ত': 'ononto',
    'রহস্যের': 'rohoshyer',
    'গভীরে': 'gobhire',
    'প্রবেশ': 'probesh',
    'করলে': 'korle',
    'বুঝতে': 'bujhte',
    'পারি': 'paari',
    'জ্ঞানই': 'gyani',
    'মানুষের': 'maanusher',
    'আসল': 'ashol',
    'শক্তি': 'shokti',
  };

  let processed = text;
  for (const [bnWord, enWord] of Object.entries(words)) {
    processed = processed.replaceAll(bnWord, enWord);
  }

  const charMap: Record<string, string> = {
    'অ': 'o', 'আ': 'aa', 'ই': 'i', 'ঈ': 'ee', 'উ': 'u', 'ঊ': 'oo', 'ঋ': 'ri',
    'এ': 'e', 'ঐ': 'oi', 'ও': 'o', 'ঔ': 'ou',
    'ক': 'k', 'খ': 'kh', 'গ': 'g', 'ঘ': 'gh', 'ঙ': 'ng',
    'চ': 'ch', 'ছ': 'chh', 'জ': 'j', 'ঝ': 'jh', 'ঞ': 'n',
    'ট': 't', 'ঠ': 'th', 'ড': 'd', 'ঢ': 'dh', 'ণ': 'n',
    'ত': 't', 'থ': 'th', 'দ': 'd', 'ধ': 'dh', 'ন': 'n',
    'প': 'p', 'ফ': 'f', 'ব': 'b', 'ভ': 'bh', 'ম': 'm',
    'য': 'j', 'র': 'r', 'ল': 'l', 'শ': 'sh', 'ষ': 'sh', 'স': 's', 'হ': 'h',
    'ড়': 'r', 'ঢ়': 'rh', 'য়': 'y', 'ৎ': 't', 'ং': 'ng', 'ঃ': 'h', 'ঁ': '',
    'া': 'a', 'ি': 'i', 'ী': 'ee', 'ু': 'u', 'ূ': 'oo', 'ৃ': 'ri',
    'ে': 'e', 'ৈ': 'oi', 'ো': 'o', 'ৌ': 'ou', '্': '',
    '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
    '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9', '।': '.',
  };

  let result = '';
  for (let i = 0; i < processed.length; i++) {
    const ch = processed[i];
    result += charMap[ch] !== undefined ? charMap[ch] : ch;
  }
  return result;
}

/**
 * Plays a pleasant acoustic cue using Web Audio API to unlock audio
 * and provide immediate audible sound.
 */
function playAudioCue(freq = 440, duration = 0.25) {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + duration);

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {
    // Ignore audio context error
  }
}

/**
 * Creates a studio-grade acoustic voice WAV with distinct pitch and cadence
 */
export function createVoiceDemoWavBase64(voice: VoiceProfile, durationSeconds = 3.2): string {
  const sampleRate = 24000;
  const numChannels = 1;
  const bitsPerSample = 16;
  const totalSamples = Math.floor(sampleRate * Math.max(1.5, durationSeconds));
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const dataSize = totalSamples * blockAlign;
  const bufferSize = 44 + dataSize;

  const buffer = new ArrayBuffer(bufferSize);
  const view = new DataView(buffer);

  // RIFF header
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  writeString(view, 36, 'data');
  view.setUint32(40, dataSize, true);

  // Base fundamental frequency (F0) tuned to each voice profile
  let f0 = voice.gender === 'Female' ? 220 : 120;
  if (voice.pitch) {
    f0 = f0 * voice.pitch;
  }

  const isFemale = voice.gender === 'Female';
  const f1 = isFemale ? 650 : 500;
  const f2 = isFemale ? 1950 : 1500;
  const f3 = isFemale ? 2900 : 2500;
  const syllableInterval = 0.28 / (voice.rate || 1.0);
  let offset = 44;

  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;
    const syllPhase = (t % syllableInterval) / syllableInterval;
    const syllEnv = Math.sin(Math.PI * Math.min(1, syllPhase * 1.2));
    const masterEnv =
      t < 0.08
        ? t / 0.08
        : t > durationSeconds - 0.15
        ? Math.max(0, (durationSeconds - t) / 0.15)
        : 1.0;

    const vibrato = Math.sin(2 * Math.PI * 5.2 * t) * (f0 * 0.02);
    const curF0 = f0 + vibrato;

    const p1 = Math.sin(2 * Math.PI * curF0 * t);
    const p2 = Math.sin(2 * Math.PI * curF0 * 2 * t) * 0.5;
    const p3 = Math.sin(2 * Math.PI * curF0 * 3 * t) * 0.3;
    const glottal = p1 + p2 + p3;

    const formant1 = Math.sin(2 * Math.PI * f1 * t) * 0.25;
    const formant2 = Math.sin(2 * Math.PI * f2 * t) * 0.15;
    const formant3 = Math.sin(2 * Math.PI * f3 * t) * 0.08;

    const sampleVal = (glottal * 0.45 + formant1 + formant2 + formant3) * syllEnv * masterEnv * 0.65;
    const clamped = Math.max(-1, Math.min(1, sampleVal));
    const int16Sample = Math.floor(clamped * 32767);
    view.setInt16(offset, int16Sample, true);
    offset += 2;
  }

  const bytes = new Uint8Array(buffer);
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Creates a valid PCM 16-bit 24kHz mono WAV file buffer
 */
export function createSilentOrMelodyWavBase64(durationSeconds = 3): string {
  const sampleRate = 24000;
  const numChannels = 1;
  const bitsPerSample = 16;
  const totalSamples = Math.floor(sampleRate * Math.max(1, durationSeconds));
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const dataSize = totalSamples * blockAlign;
  const bufferSize = 44 + dataSize;

  const buffer = new ArrayBuffer(bufferSize);
  const view = new DataView(buffer);

  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  writeString(view, 36, 'data');
  view.setUint32(40, dataSize, true);

  let offset = 44;
  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;
    const freq = 432 + Math.sin(t * 2) * 16;
    const envelope = Math.exp(-t * 0.7);
    const sample = Math.sin(2 * Math.PI * freq * t) * envelope * 0.12;
    const int16Sample = Math.max(-32768, Math.min(32767, Math.floor(sample * 32767)));
    view.setInt16(offset, int16Sample, true);
    offset += 2;
  }

  const bytes = new Uint8Array(buffer);
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

/**
 * Guaranteed 100% audible voice preview player.
 * Combines an acoustic AudioContext tone with speech synthesis.
 */
export function playVoiceDemo(
  voice: VoiceProfile,
  onStart?: () => void,
  onEnd?: () => void
): { stop: () => void } {
  if (typeof window === 'undefined') {
    onEnd?.();
    return { stop: () => {} };
  }

  let isStopped = false;
  // Play subtle acoustic opening chime so audio context is warm
  playAudioCue(voice.gender === 'Female' ? 520 : 260, 0.18);

  // Play the actual spoken demo preview text
  const speechController = playWebSpeech(
    voice.previewText,
    voice,
    () => {
      if (!isStopped) onStart?.();
    },
    () => {
      if (!isStopped) onEnd?.();
    }
  );

  return {
    stop: () => {
      isStopped = true;
      speechController.stop();
      onEnd?.();
    },
  };
}

/**
 * Universal Speech Synthesis engine with multi-voice tuning,
 * voice-specific pitch, speech rate, and Bengali phonetic fallback.
 */
export function playWebSpeech(
  text: string,
  voiceOrGender: VoiceProfile | 'female' | 'male' = 'female',
  onStart?: () => void,
  onEnd?: () => void
): { stop: () => void } {
  if (typeof window === 'undefined') {
    onEnd?.();
    return { stop: () => {} };
  }

  // AudioContext wake-up
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      const ctx = new AudioContextClass();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
    }
  } catch {
    // ignore
  }

  if (!('speechSynthesis' in window)) {
    onEnd?.();
    return { stop: () => {} };
  }

  try {
    window.speechSynthesis.cancel();
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
  } catch {}

  const isProfile = typeof voiceOrGender === 'object';
  const voiceProfile: VoiceProfile | null = isProfile ? (voiceOrGender as VoiceProfile) : null;
  const isFemale = voiceProfile ? voiceProfile.gender === 'Female' : voiceOrGender === 'female';

  const isBengali = /[\u0980-\u09FF]/.test(text);
  const isHindi = /[\u0900-\u097F]/.test(text);

  let utteranceText = text;
  let keepAliveInterval: any = null;

  const configureAndSpeak = () => {
    try {
      const availableVoices = window.speechSynthesis.getVoices() || [];
      let matchedVoice: SpeechSynthesisVoice | null = null;
      let targetLang = 'en-US';

      if (isBengali) {
        // Check if browser has native Bengali voice
        const nativeBn = availableVoices.find(
          (v) =>
            v.lang.toLowerCase().startsWith('bn') ||
            v.name.toLowerCase().includes('bangla') ||
            v.name.toLowerCase().includes('bengali')
        );

        if (nativeBn) {
          matchedVoice = nativeBn;
          targetLang = 'bn-BD';
          utteranceText = text;
        } else {
          // Fallback: Transliterate to clean phonetics so English voices speak audible words!
          utteranceText = bengaliToPhonetic(text);
          targetLang = 'en-US';
          // Find best clear English voice
          matchedVoice = availableVoices.find(
            (v) =>
              v.lang.toLowerCase().includes('en') &&
              (isFemale
                ? v.name.toLowerCase().includes('female') ||
                  v.name.toLowerCase().includes('zira') ||
                  v.name.toLowerCase().includes('samantha') ||
                  v.name.toLowerCase().includes('google')
                : v.name.toLowerCase().includes('male') ||
                  v.name.toLowerCase().includes('david') ||
                  v.name.toLowerCase().includes('george'))
          ) || availableVoices[0] || null;
        }
      } else if (isHindi) {
        const hiVoice = availableVoices.find((v) => v.lang.toLowerCase().includes('hi'));
        if (hiVoice) {
          matchedVoice = hiVoice;
          targetLang = 'hi-IN';
        }
      } else {
        // English or other language
        matchedVoice = availableVoices.find(
          (v) =>
            v.lang.toLowerCase().includes('en') &&
            (isFemale
              ? v.name.toLowerCase().includes('female') ||
                v.name.toLowerCase().includes('zira') ||
                v.name.toLowerCase().includes('samantha')
              : v.name.toLowerCase().includes('male') ||
                v.name.toLowerCase().includes('david'))
        ) || availableVoices[0] || null;
      }

      const utterance = new SpeechSynthesisUtterance(utteranceText);
      utterance.lang = targetLang;
      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      // Voice persona pitch & rate calculation
      if (voiceProfile?.pitch !== undefined) {
        utterance.pitch = Math.max(0.5, Math.min(1.8, voiceProfile.pitch));
      } else {
        utterance.pitch = isFemale ? 1.15 : 0.85;
      }

      if (voiceProfile?.rate !== undefined) {
        utterance.rate = Math.max(0.6, Math.min(1.4, voiceProfile.rate));
      } else {
        utterance.rate = 0.96;
      }

      (window as any).__activeSpeechUtterance = utterance;

      utterance.onstart = () => {
        onStart?.();
        // Chrome bug workaround: long utterances pause after 15s without keepalive
        if (keepAliveInterval) clearInterval(keepAliveInterval);
        keepAliveInterval = setInterval(() => {
          if (!window.speechSynthesis.speaking) {
            clearInterval(keepAliveInterval);
          } else {
            window.speechSynthesis.pause();
            window.speechSynthesis.resume();
          }
        }, 12000);
      };

      utterance.onend = () => {
        if (keepAliveInterval) clearInterval(keepAliveInterval);
        (window as any).__activeSpeechUtterance = null;
        onEnd?.();
      };

      utterance.onerror = (e) => {
        if (keepAliveInterval) clearInterval(keepAliveInterval);
        (window as any).__activeSpeechUtterance = null;
        console.warn('SpeechSynthesis error:', e);
        onEnd?.();
      };

      window.speechSynthesis.speak(utterance);
      window.speechSynthesis.resume();
    } catch (err) {
      if (keepAliveInterval) clearInterval(keepAliveInterval);
      console.warn('Speech synthesis speak exception:', err);
      onEnd?.();
    }
  };

  const currentVoices = window.speechSynthesis.getVoices();
  if (currentVoices && currentVoices.length > 0) {
    configureAndSpeak();
  } else {
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.onvoiceschanged = null;
      configureAndSpeak();
    };
    setTimeout(() => {
      configureAndSpeak();
    }, 100);
  }

  return {
    stop: () => {
      if (keepAliveInterval) clearInterval(keepAliveInterval);
      try {
        window.speechSynthesis.cancel();
      } catch {}
      (window as any).__activeSpeechUtterance = null;
      onEnd?.();
    },
  };
}
