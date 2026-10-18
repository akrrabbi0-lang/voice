import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '25mb' }));

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Curated Voice Profiles
export const VOICE_CATALOG = [
  {
    id: 'nusrat_bn',
    name: 'Nusrat (বাংলা)',
    baseVoice: 'Kore',
    gender: 'Female',
    age: 'Young Adult',
    accent: 'Bengali (Polite & Melodic)',
    tone: 'Sweet & Informative',
    useCase: 'Bengali Podcasts & News',
    previewText: 'সবাইকে অনেক শুভেচ্ছা। মিষ্টি বাতাসে ভেসে আসা কথার প্রতিটি সুর আজ আপনার হৃদয়ে দোলা দেবে।',
    avatarColor: 'from-fuchsia-600 to-pink-500',
    tags: ['বাংলা', 'Podcast', 'Melodic', 'Popular'],
  },
  {
    id: 'tanvir_bn',
    name: 'Tanvir (বাংলা)',
    baseVoice: 'Puck',
    gender: 'Male',
    age: 'Young Adult',
    accent: 'Bengali (Standard Dhakaiya)',
    tone: 'Expressive & Storyteller',
    useCase: 'Bengali Stories & Commercials',
    previewText: 'নমস্কার ও স্বাগতম! আজকের এই সুন্দর সন্ধ্যায় আমরা জানবো প্রযুক্তির এক নতুন দিগন্ত।',
    avatarColor: 'from-rose-600 to-amber-600',
    tags: ['বাংলা', 'Storyteller', 'Bengali', 'Popular'],
  },
  {
    id: 'shreya_bn',
    name: 'Shreya (বাংলা)',
    baseVoice: 'Kore',
    gender: 'Female',
    age: 'Adult',
    accent: 'Bengali (Poetic & Emotional)',
    tone: 'Expressive & Melodic',
    useCase: 'Poetry, Drama & Audiobooks',
    previewText: 'মেঘের ওপারে যে নীল আকাশ, সেখানে ভালোবাসার এক রঙিন পৃথিবী প্রতিদিন নতুন করে জন্ম নেয়।',
    avatarColor: 'from-fuchsia-500 to-purple-600',
    tags: ['বাংলা', 'Poetry', 'Drama'],
  },
  {
    id: 'kabir_bn',
    name: 'Kabir (বাংলা)',
    baseVoice: 'Fenrir',
    gender: 'Male',
    age: 'Mature',
    accent: 'Bengali (Deep Baritone)',
    tone: 'Deep & Authoritative',
    useCase: 'Documentaries & Motivation',
    previewText: 'ইতিহাসের পাতায় অমর হয়ে থাকে সেইসব সাহসী মানুষ, যারা বিপদের মাঝেও মাথা নত করেনি।',
    avatarColor: 'from-amber-600 to-stone-800',
    tags: ['বাংলা', 'Documentary', 'Deep'],
  },
  {
    id: 'mehazabin_bn',
    name: 'Mehazabin (বাংলা)',
    baseVoice: 'Zephyr',
    gender: 'Female',
    age: 'Young Adult',
    accent: 'Bengali (Modern & Upbeat)',
    tone: 'Cheerful & Friendly',
    useCase: 'Reels & Social Media',
    previewText: 'হেই বন্ধুরা! আজকের ভিডিওতে আমি আপনাদের সাথে শেয়ার করবো দারুণ কিছু সিক্রেট টিপস। একদম মিস করবেন না!',
    avatarColor: 'from-teal-400 to-emerald-600',
    tags: ['বাংলা', 'Reels', 'Social Media'],
  },
  {
    id: 'soumya_bn',
    name: 'Soumya (বাংলা)',
    baseVoice: 'Charon',
    gender: 'Male',
    age: 'Middle Aged',
    accent: 'Bengali (Academic & Calm)',
    tone: 'Wise & Articulate',
    useCase: 'Lectures & Scientific Prose',
    previewText: 'মহাবিশ্বের অনন্ত রহস্যের গভীরে প্রবেশ করলে আমরা বুঝতে পারি জ্ঞানই মানুষের আসল শক্তি।',
    avatarColor: 'from-indigo-600 to-blue-800',
    tags: ['বাংলা', 'Academic', 'Calm'],
  },
  {
    id: 'rachel',
    name: 'Rachel',
    baseVoice: 'Kore',
    gender: 'Female',
    age: 'Young Adult',
    accent: 'American (Neutral)',
    tone: 'Calm & Warm',
    useCase: 'Narration & Audiobooks',
    previewText: 'Hello there. The greatest story ever told begins with a single curious thought.',
    avatarColor: 'from-amber-500 to-rose-500',
    tags: ['English', 'Narrative', 'Warm', 'Audiobook'],
  },
  {
    id: 'adam',
    name: 'Adam',
    baseVoice: 'Puck',
    gender: 'Male',
    age: 'Middle Aged',
    accent: 'American (Deep)',
    tone: 'Confident & Authoritative',
    useCase: 'Documentaries & News',
    previewText: 'Deep within the uncharted frontier, human ingenuity found a new language.',
    avatarColor: 'from-blue-600 to-indigo-700',
    tags: ['English', 'Deep', 'Documentary', 'News'],
  },
  {
    id: 'marcus',
    name: 'Marcus',
    baseVoice: 'Fenrir',
    gender: 'Male',
    age: 'Mature',
    accent: 'Cinematic / Resonant',
    tone: 'Epic & Gravelly',
    useCase: 'Movie Trailers & Games',
    previewText: 'In a world divided by shadow, one choice changes everything. Prepare yourself.',
    avatarColor: 'from-violet-600 to-purple-900',
    tags: ['English', 'Cinematic', 'Gravelly', 'Gaming'],
  },
  {
    id: 'sarah',
    name: 'Sarah',
    baseVoice: 'Zephyr',
    gender: 'Female',
    age: 'Young Adult',
    accent: 'American (Bright)',
    tone: 'Dynamic & Friendly',
    useCase: 'Commercials & Social Media',
    previewText: 'Hey everyone! You will not believe what we just built today. Check this out!',
    avatarColor: 'from-emerald-500 to-teal-700',
    tags: ['English', 'Energetic', 'Commercial', 'Friendly'],
  },
  {
    id: 'george',
    name: 'George',
    baseVoice: 'Charon',
    gender: 'Male',
    age: 'Distinguished',
    accent: 'British / Academic',
    tone: 'Sophisticated & Articulate',
    useCase: 'Lectures & Historic Prose',
    previewText: 'Indeed, the architecture of the cosmos is far more elegant than we dared dream.',
    avatarColor: 'from-amber-600 to-stone-700',
    tags: ['English', 'British', 'Academic', 'Polished'],
  },
  {
    id: 'elena',
    name: 'Elena',
    baseVoice: 'Kore',
    gender: 'Female',
    age: 'Adult',
    accent: 'European / Expressive',
    tone: 'Intimate & Poetic',
    useCase: 'Meditation & Poetry',
    previewText: 'Take a deep breath in... and exhale slowly. Let every thought gently drift away.',
    avatarColor: 'from-cyan-500 to-blue-600',
    tags: ['English', 'Meditation', 'Soft', 'Poetry'],
  },
  {
    id: 'dr_aris',
    name: 'Dr. Aris',
    baseVoice: 'Charon',
    gender: 'Male',
    age: 'Distinguished',
    accent: 'Mid-Atlantic',
    tone: 'Scholarly & Precise',
    useCase: 'Science Explanations',
    previewText: 'When quantum entanglement occurs, spatial separation ceases to dictate causal independence.',
    avatarColor: 'from-indigo-500 to-slate-700',
    tags: ['English', 'Science', 'Educational'],
  },
  {
    id: 'maya',
    name: 'Maya',
    baseVoice: 'Zephyr',
    gender: 'Female',
    age: 'Young Adult',
    accent: 'Casual American',
    tone: 'Youthful & Vibrant',
    useCase: 'Animations & Reels',
    previewText: 'Wait, wait! Before you scroll, you have to hear this crazy secret. Are you ready for this?',
    avatarColor: 'from-fuchsia-500 to-purple-600',
    tags: ['English', 'Viral', 'Reels'],
  },
  {
    id: 'liam',
    name: 'Liam',
    baseVoice: 'Puck',
    gender: 'Male',
    age: 'Young Adult',
    accent: 'Irish / Charismatic',
    tone: 'Charming & Adventurous',
    useCase: 'Fiction & Fantasy',
    previewText: 'Across the misty green hills, legends tell of a hidden path where only dreamers dare walk.',
    avatarColor: 'from-emerald-600 to-teal-800',
    tags: ['English', 'Fantasy', 'Storytelling'],
  },
];

// 1. Get available voice catalog
app.get('/api/voices', (req, res) => {
  res.json({ voices: VOICE_CATALOG });
});

// 2. Single speaker TTS generation with automatic language detection
app.post('/api/tts/generate', async (req, res) => {
  try {
    const {
      text,
      gender = 'female', // 'female' or 'male'
      voiceName,
      model = 'gemini-3.8-flash-lite-tts',
    } = req.body;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({ error: 'Text content is required' });
    }

    // Auto-detect language
    const isBengali = /[\u0980-\u09FF]/.test(text);
    const isHindi = /[\u0900-\u097F]/.test(text);
    const isArabic = /[\u0600-\u06FF]/.test(text);
    const isSpanish = /[áéíóúüñ¿¡]/i.test(text);

    let detectedLang = 'English';
    let stylePrompt = 'Natural, crystal-clear, expressive human delivery with authentic pacing';

    if (isBengali) {
      detectedLang = 'Bengali (বাংলা)';
      stylePrompt = 'স্বাভাবিক, মিষ্টি ও জীবন্ত বাংলা উচ্চারণ। আবেগ ও সঠিক সুরের সাথে খাঁটি বাঙালিয়ানায় স্পষ্ট ও নিখুঁত কণ্ঠস্বর। (Natural authentic Bengali native speaker delivery with heartfelt emotional nuance and clear native pronunciation)';
    } else if (isHindi) {
      detectedLang = 'Hindi';
      stylePrompt = 'Natural, expressive native Hindi delivery with clear authentic pronunciation and warmth.';
    } else if (isArabic) {
      detectedLang = 'Arabic';
      stylePrompt = 'Natural, eloquent native Arabic delivery with authentic articulation and rhythm.';
    } else if (isSpanish) {
      detectedLang = 'Spanish';
      stylePrompt = 'Natural, fluent native Spanish delivery with warm expressiveness.';
    }

    const estimatedSecs = Math.max(1, Math.round((text.trim().split(/\s+/).length / 140) * 60));

    // Assign appropriate base prebuilt voice:
    let chosenVoice = voiceName;
    if (!chosenVoice) {
      chosenVoice = gender === 'male' ? 'Puck' : 'Kore';
    }

    const validVoices = ['Puck', 'Charon', 'Kore', 'Fenrir', 'Zephyr'];
    if (!validVoices.includes(chosenVoice)) {
      chosenVoice = gender === 'male' ? 'Puck' : 'Kore';
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        fallback: true,
        text: text.trim(),
        voiceName: chosenVoice,
        detectedLang,
        gender,
        estimatedSeconds: estimatedSecs,
        characterCount: text.length,
        wordCount: text.trim().split(/\s+/).length,
        timestamp: Date.now(),
      });
    }

    const primaryModel = model === 'gemini-3.8-flash-tts' ? 'gemini-3.8-flash-tts' : 'gemini-3.8-flash-lite-tts';
    const backupModel = primaryModel === 'gemini-3.8-flash-lite-tts' ? 'gemini-3.8-flash-tts' : 'gemini-3.8-flash-lite-tts';

    let audioPart: any = null;
    let usedModel = primaryModel;

    // Attempt 1: Primary Model
    try {
      const response = await ai.models.generateContent({
        model: primaryModel,
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: text.trim(),
                speechMetadata: {
                  style: stylePrompt,
                },
              },
            ],
          },
        ],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: chosenVoice },
            },
          },
        },
      });

      const candidate = response.candidates?.[0];
      audioPart = candidate?.content?.parts?.find((p) => p.inlineData?.data);
    } catch (errFirst: any) {
      // Attempt 2: Try alternative TTS model if quota or transient error
      try {
        usedModel = backupModel;
        const responseBackup = await ai.models.generateContent({
          model: backupModel,
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: text.trim(),
                  speechMetadata: {
                    style: stylePrompt,
                  },
                },
              ],
            },
          ],
          config: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: chosenVoice },
              },
            },
          },
        });

        const candidateBackup = responseBackup.candidates?.[0];
        audioPart = candidateBackup?.content?.parts?.find((p) => p.inlineData?.data);
      } catch (errBackup: any) {
        // Return clean fallback
        return res.json({
          fallback: true,
          text: text.trim(),
          voiceName: chosenVoice,
          detectedLang,
          gender,
          estimatedSeconds: estimatedSecs,
          characterCount: text.length,
          wordCount: text.trim().split(/\s+/).length,
          timestamp: Date.now(),
        });
      }
    }

    if (!audioPart || !audioPart.inlineData?.data) {
      return res.json({
        fallback: true,
        text: text.trim(),
        voiceName: chosenVoice,
        detectedLang,
        gender,
        estimatedSeconds: estimatedSecs,
        characterCount: text.length,
        wordCount: text.trim().split(/\s+/).length,
        timestamp: Date.now(),
      });
    }

    const base64Audio = audioPart.inlineData.data;
    const mimeType = audioPart.inlineData.mimeType || 'audio/wav';

    // Approximate duration estimate based on word count
    const words = text.trim().split(/\s+/).length;

    res.json({
      audioData: base64Audio,
      mimeType,
      voiceName: chosenVoice,
      detectedLang,
      gender,
      model: usedModel,
      estimatedSeconds: estimatedSecs,
      characterCount: text.length,
      wordCount: words,
      timestamp: Date.now(),
    });
  } catch (error: any) {
    return res.json({
      fallback: true,
      text: req.body?.text || '',
      gender: req.body?.gender || 'female',
      timestamp: Date.now(),
    });
  }
});

// 3. Multi-speaker dialogue generation (Screenplay mode)
app.post('/api/tts/dialogue', async (req, res) => {
  try {
    const { lines, speakerA, speakerB } = req.body;

    if (!Array.isArray(lines) || lines.length === 0) {
      return res.status(400).json({ error: 'Dialogue lines are required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured.' });
    }

    const sA = speakerA || { name: 'Host', voice: 'Puck' };
    const sB = speakerB || { name: 'Guest', voice: 'Kore' };

    // Format parts for multiSpeaker
    const parts = lines.map((item: { speaker: string; text: string; style?: string }) => ({
      text: `${item.speaker}: ${item.text}`,
      speechMetadata: {
        speaker: item.speaker,
        style: item.style || 'Natural conversational podcast dialogue',
      },
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-tts',
      contents: [
        {
          role: 'user',
          parts,
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          multiSpeakerVoiceConfig: {
            speakerVoiceConfigs: [
              {
                speaker: sA.name,
                voiceConfig: {
                  prebuiltVoiceConfig: { voiceName: sA.voice },
                },
              },
              {
                speaker: sB.name,
                voiceConfig: {
                  prebuiltVoiceConfig: { voiceName: sB.voice },
                },
              },
            ],
          },
        },
      },
    });

    const candidate = response.candidates?.[0];
    const audioPart = candidate?.content?.parts?.find((p) => p.inlineData?.data);

    if (!audioPart || !audioPart.inlineData?.data) {
      return res.status(502).json({ error: 'No dialogue audio returned by model.' });
    }

    res.json({
      audioData: audioPart.inlineData.data,
      mimeType: audioPart.inlineData.mimeType || 'audio/wav',
      model: 'gemini-3.8-flash-tts',
      speakerA: sA,
      speakerB: sB,
      lineCount: lines.length,
      timestamp: Date.now(),
    });
  } catch (error: any) {
    console.error('Dialogue Generation error:', error);
    res.status(500).json({
      error: error?.message || 'Failed to synthesize dialogue',
    });
  }
});

// 4. Script Enhancement & Voice Director Assistant
app.post('/api/tts/enhance-script', async (req, res) => {
  try {
    const { script, mode = 'add_speech_tags', targetLanguage = 'auto' } = req.body;

    if (!script || typeof script !== 'string') {
      return res.status(400).json({ error: 'Script text is required' });
    }

    let instruction = `You are an elite ElevenLabs audio voice director and script doctor.
Your goal is to optimize the provided script for ultra-realistic human text-to-speech synthesis.

Mode: ${mode}
- If 'add_speech_tags': Insert natural breathing pauses with ellipsis '...', strategic pacing, and audio tags where fitting such as <breath>, <laugh>, <gasp>, or backchanneling |yeah|, |mhm|. Keep the core message intact while making it sound remarkably human and alive.
- If 'to_bangla': Translate or adapt the script into natural, fluid, expressive conversational Bengali (বাংলা). Add proper punctuation for natural cadence.
- If 'cinematic': Rewrite in an evocative, deep, cinematic documentary style.
- If 'commercial': Make it punchy, rhythmic, high-converting advertisement copy.
- If 'podcast': Format as a lively, conversational, relatable intro or story.

Return ONLY the final enhanced script text without meta commentary, markdown codeblocks or quotes.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        {
          role: 'user',
          parts: [{ text: `${instruction}\n\nOriginal Text:\n${script}` }],
        },
      ],
    });

    const enhanced = response.text?.trim() || script;
    res.json({ enhancedScript: enhanced });
  } catch (error: any) {
    console.error('Enhance script error:', error);
    res.status(500).json({ error: error?.message || 'Failed to enhance script' });
  }
});

// Vite middleware in dev or static files in production
async function setupVite() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ElevenVoice Studio Server running on port ${PORT}`);
  });
}

setupVite();
