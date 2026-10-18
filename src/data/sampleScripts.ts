export interface SampleScript {
  id: string;
  title: string;
  category: 'English' | 'Bengali (বাংলা)' | 'Dialogue' | 'Creative';
  recommendedVoiceId: string;
  text: string;
}

export const SAMPLE_SCRIPTS: SampleScript[] = [
  {
    id: 'narration-story',
    title: 'The Starlit Horizon',
    category: 'English',
    recommendedVoiceId: 'rachel',
    text: 'The night sky was not empty; it was alive with whispering constellations. <breath> As the ship drifted past the rings of Saturn, Dr. Vance looked out the viewport, feeling the quiet pulse of infinity.',
  },
  {
    id: 'cinematic-epic',
    title: 'Cinematic Movie Trailer',
    category: 'English',
    recommendedVoiceId: 'marcus',
    text: 'Before the empire fell, there was an ancient prophecy. <gasp> A hero forgotten by time, rising from the ashes of forgotten worlds. This summer... survival is only the beginning.',
  },
  {
    id: 'commercial-tech',
    title: 'SaaS Launch Commercial',
    category: 'English',
    recommendedVoiceId: 'sarah',
    text: 'Stop wasting hours on manual editing! <laugh> Meet ElevenVoice Studio. Transform raw text into breathtaking, studio-grade voices in under two seconds. Try it free today.',
  },
  {
    id: 'bangla-story',
    title: 'বৃষ্টিভেজা স্মৃতির গল্প (Rainy Story)',
    category: 'Bengali (বাংলা)',
    recommendedVoiceId: 'tanvir_bn',
    text: 'জানালায় বৃষ্টির অবিরাম শব্দ। <breath> পুরোনো সেই চায়ের কাপ হাতে বসে ভাবছিলাম, জীবন কত দ্রুত বদলে যায়! তবুও কিছু স্মৃতি আকাশের মেঘের মতো চিরসবুজ রয়ে যায়।',
  },
  {
    id: 'bangla-news',
    title: 'বিজ্ঞান ও প্রযুক্তি সংবাদ (Tech News)',
    category: 'Bengali (বাংলা)',
    recommendedVoiceId: 'nusrat_bn',
    text: 'নমস্কার। কৃত্রিম বুদ্ধিমত্তা ও ভয়েস প্রযুক্তির অবিশ্বাস্য অগ্রগতি আজ বিশ্বকে চমকে দিয়েছে। <breath> আজকের বিশেষ পর্বে আমরা দেখবো কীভাবে এআই মানবকণ্ঠের প্রতিটি অনুভূতি জীবন্ত করে তুলছে।',
  },
  {
    id: 'bangla-commercial',
    title: 'ডিজিটাল প্রোডাক্ট প্রমোশন (Promo)',
    category: 'Bengali (বাংলা)',
    recommendedVoiceId: 'tanvir_bn',
    text: 'আপনার কনটেন্ট কি এখনো সাধারণ লাগছে? আর কোনো চিন্তা নেই! <laugh> ইলেভেনভয়েসের সাথে তৈরি করুন একদম ন্যাচারাল বাংলা অডিও ভয়েসওভার। এখনই ভিজিট করুন এবং শুরু করুন!',
  },
  {
    id: 'dialogue-podcast',
    title: 'Podcast Banter (Two Hosts)',
    category: 'Dialogue',
    recommendedVoiceId: 'adam',
    text: 'Alex: Welcome back everyone! Today we have something truly mind-bending.\nSarah: |yeah| I have been waiting all week for this! Are you ready?',
  },
  {
    id: 'meditation-guide',
    title: 'Mindful Breathing Guide',
    category: 'Creative',
    recommendedVoiceId: 'elena',
    text: 'Close your eyes. Gently soften your shoulders. <breath> Inhale peace, exhale tension. Allow yourself this sacred moment of stillness... you are right where you belong.',
  },
];
