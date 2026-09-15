import React from 'react';
import {
  TrendingUp,
  Award,
  CalendarCheck,
  Flame,
  Heart,
  Smile,
  CheckCircle2,
  Gamepad2,
  Clock,
  Sparkles,
  ArrowRight,
  Target,
  Zap,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useI18n } from '../i18n/I18nContext';
import VoiceButton from '../components/VoiceButton';

export default function MyProgress() {
  const { patient, gameScores, reminders, navigateTo, sounds, voice } = useApp();
  const { t, isHindi } = useI18n();

  // Past memory match games from localStorage
  let memoryHistory = [];
  try {
    memoryHistory = JSON.parse(localStorage.getItem('yaadsaathi_memory_history') || '[]');
  } catch {
    memoryHistory = [];
  }

  // Weekly activity days
  const weeklyData = [
    { day: isHindi ? 'सोम' : 'Mon', completed: true, score: 82 },
    { day: isHindi ? 'मंगल' : 'Tue', completed: true, score: 75 },
    { day: isHindi ? 'बुध' : 'Wed', completed: true, score: 88 },
    { day: isHindi ? 'गुरु' : 'Thu', completed: true, score: 79 },
    { day: isHindi ? 'शुक्र' : 'Fri', completed: true, score: 85 },
    { day: isHindi ? 'शनि' : 'Sat', completed: false, score: 0 },
    { day: isHindi ? 'रवि' : 'Sun', completed: false, score: 0 },
  ];

  return (
    <div className="space-y-6 pb-12 animate-fade-in text-left">
      {/* 1. Header Banner */}
      <div className="bg-[#EAF7EF] rounded-[2.5rem] p-6 sm:p-8 border-3 border-[#167A55]/30 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#167A55]/30 text-[#167A55] font-black text-sm mb-1">
            <Sparkles className="w-4 h-4 text-[#E98A20]" />
            <span>{isHindi ? 'दैनिक स्वास्थ्य व स्मृति प्रगति' : 'Daily Cognitive Health & Progress'}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-[#102A43]">
            {t('progressTitle')}
          </h1>
          <p className="text-xl sm:text-2xl font-black text-[#167A55]">
            {isHindi ? `${patient.nameHindi || 'दामोदर जी'} - आपका नियमित अभ्यास मस्तिष्क को सक्रिय और शांत रखता है।` : `${patient.nameEnglish || 'Damodar Ji'} - Your playful practice keeps memory bright.`}
          </p>
          <p className="text-base sm:text-lg font-bold text-[#5D7184]">
            {t('progressSub')}
          </p>
        </div>

        <VoiceButton
          id="myprogress-header-voice-btn"
          textHindi="दामोदर जी, आपकी आज की प्रगति रिपोर्ट: आपने कुल 12 खेल खेले हैं, औसत सटीकता 78 प्रतिशत है, और लगातार 5 दिन का स्ट्रीक बना हुआ है। स्मृति स्तर 85 प्रतिशत है। बहुत बढ़िया!"
          textEnglish="Damodar Ji, your progress report: 12 games played, 78 percent average accuracy, 8.5 seconds average response time, and a 5-day active streak. Memory level is at 85 percent."
          size="lg"
          label={t('listenProgress')}
        />
      </div>

      {/* 2. Exactly 4 Key Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Games Played */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-[#DFF3E7] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-black text-[#5D7184]">{t('gamesPlayed')}</span>
            <div className="w-12 h-12 rounded-2xl bg-[#E6F1FF] text-[#2879D0] flex items-center justify-center">
              <Gamepad2 className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-3xl sm:text-4xl font-black text-[#102A43]">
              12
            </span>
            <span className="text-base font-bold text-[#5D7184] ml-1.5">{t('successfulSessions')}</span>
          </div>
          <p className="text-xs sm:text-sm font-bold text-[#167A55] mt-1">
            ✓ {isHindi ? 'सक्रिय खेल सत्र' : 'Active Sessions'}
          </p>
        </div>

        {/* Metric 2: Average Accuracy */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-[#DFF3E7] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-black text-[#5D7184]">{isHindi ? 'औसत सटीकता' : 'Avg Accuracy'}</span>
            <div className="w-12 h-12 rounded-2xl bg-[#EAF7EF] text-[#167A55] flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-3xl sm:text-4xl font-black text-[#167A55]">
              78%
            </span>
            <span className="text-base font-bold text-[#5D7184] ml-1.5">{isHindi ? 'शुद्धता' : 'Precision'}</span>
          </div>
          <p className="text-xs sm:text-sm font-bold text-[#167A55] mt-1">
            ✓ {isHindi ? 'उत्कृष्ट प्रदर्शन' : 'Great Performance'}
          </p>
        </div>

        {/* Metric 3: Average Response Time */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-[#DFF3E7] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-black text-[#5D7184]">{isHindi ? 'औसत गति' : 'Avg Response'}</span>
            <div className="w-12 h-12 rounded-2xl bg-[#FFF0D7] text-[#E98A20] flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-3xl sm:text-4xl font-mono font-black text-[#E98A20]">
              8.5s
            </span>
            <span className="text-base font-bold text-[#5D7184] ml-1.5">{isHindi ? 'सेकंड' : 'sec'}</span>
          </div>
          <p className="text-xs sm:text-sm font-bold text-[#E98A20] mt-1">
            ✓ {isHindi ? 'आरामदेह गति' : 'Relaxed Pace'}
          </p>
        </div>

        {/* Metric 4: Daily Streak */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-[#DFF3E7] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-black text-[#5D7184]">{t('dailyStreak')}</span>
            <div className="w-12 h-12 rounded-2xl bg-[#FFE8EF] text-[#E84D78] flex items-center justify-center">
              <Flame className="w-6 h-6 fill-[#E84D78]" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-3xl sm:text-4xl font-black text-[#E84D78]">
              5 {isHindi ? 'दिन' : 'Days'}
            </span>
            <span className="text-base font-bold text-[#5D7184] ml-1.5">{t('activeDays')}</span>
          </div>
          <p className="text-xs sm:text-sm font-bold text-[#E84D78] mt-1">
            ✓ {isHindi ? 'लगातार स्ट्रीक' : 'Consistent Streak'}
          </p>
        </div>
      </div>

      {/* 3. Cognitive Skill Progress Bars */}
      <div className="bg-white rounded-[2.5rem] p-6 sm:p-8 border-2 border-[#DFF3E7] shadow-xs space-y-6">
        <div>
          <h2 className="text-2xl sm:text-4xl font-black text-[#102A43]">
            {isHindi ? 'संज्ञानात्मक कौशल स्तर' : 'Cognitive Skill Domains'}
          </h2>
          <p className="text-base sm:text-xl font-bold text-[#5D7184] mt-1">
            {isHindi ? 'स्मृति, ध्यान, भाषा और पहचान के 4 मुख्य संज्ञानात्मक क्षेत्र' : 'Memory, Attention, Language, and Visual Recall Domains'}
          </p>
        </div>

        <div className="space-y-6">
          {/* 1. Memory: 85% */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-lg sm:text-xl font-black text-[#102A43]">
              <span className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-[#E84D78]" />
                <span>{isHindi ? 'स्मृति क्षमता (Memory) • 🌸 Memory Match' : 'Memory Retention • Memory Match'}</span>
              </span>
              <span className="text-[#E84D78] font-black">85%</span>
            </div>
            <div className="w-full h-5 bg-[#FFE8EF] rounded-full overflow-hidden border border-[#E84D78]/30">
              <div
                className="h-full bg-gradient-to-r from-[#E84D78] to-[#FF7597] rounded-full transition-all duration-500"
                style={{ width: '85%' }}
              />
            </div>
          </div>

          {/* 2. Attention: 72% */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-lg sm:text-xl font-black text-[#102A43]">
              <span className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-[#2879D0]" />
                <span>{isHindi ? 'एकाग्रता व ध्यान (Attention) • 🔔 Pattern Melody' : 'Focus & Attention • Pattern Melody'}</span>
              </span>
              <span className="text-[#2879D0] font-black">72%</span>
            </div>
            <div className="w-full h-5 bg-[#E6F1FF] rounded-full overflow-hidden border border-[#2879D0]/30">
              <div
                className="h-full bg-gradient-to-r from-[#2879D0] to-[#5CA2EC] rounded-full transition-all duration-500"
                style={{ width: '72%' }}
              />
            </div>
          </div>

          {/* 3. Language: 68% */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-lg sm:text-xl font-black text-[#102A43]">
              <span className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-[#E98A20]" />
                <span>{isHindi ? 'भाषा व शब्द ज्ञान (Language) • 🥭 Word Recall' : 'Language & Recall • Word Recall'}</span>
              </span>
              <span className="text-[#E98A20] font-black">68%</span>
            </div>
            <div className="w-full h-5 bg-[#FFF0D7] rounded-full overflow-hidden border border-[#E98A20]/30">
              <div
                className="h-full bg-gradient-to-r from-[#E98A20] to-[#FFB259] rounded-full transition-all duration-500"
                style={{ width: '68%' }}
              />
            </div>
          </div>

          {/* 4. Recognition: 65% */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-lg sm:text-xl font-black text-[#102A43]">
              <span className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-[#7658C8]" />
                <span>{isHindi ? 'दृश्य पहचान (Recognition) • 🖼️ Picture Recall' : 'Visual Recognition • Picture Recall'}</span>
              </span>
              <span className="text-[#7658C8] font-black">65%</span>
            </div>
            <div className="w-full h-5 bg-[#EEE9FF] rounded-full overflow-hidden border border-[#7658C8]/30">
              <div
                className="h-full bg-gradient-to-r from-[#7658C8] to-[#9E83E4] rounded-full transition-all duration-500"
                style={{ width: '65%' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Weekly Activity Visual Chart */}
      <div className="bg-white rounded-[2.5rem] p-6 sm:p-8 border-2 border-[#DFF3E7] shadow-xs space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#102A43]">
              {isHindi ? 'साप्ताहिक गतिविधि चार्ट' : 'Weekly Activity'}
            </h2>
            <p className="text-base font-bold text-[#5D7184]">
              {isHindi ? 'हर दिन का अभ्यास और नियमितता' : 'Everyday activity & consistency'}
            </p>
          </div>
          <span className="px-4 py-1.5 rounded-full bg-[#EAF7EF] text-[#167A55] font-black text-sm border border-[#167A55]/30">
            5/7 {isHindi ? 'दिन सक्रिय' : 'Days Active'}
          </span>
        </div>

        <div className="grid grid-cols-7 gap-2 pt-4">
          {weeklyData.map((w, idx) => (
            <div
              key={idx}
              className={`p-3 sm:p-4 rounded-2xl flex flex-col items-center justify-between gap-2 border-2 ${
                w.completed
                  ? 'bg-[#EAF7EF] border-[#167A55]/30 text-[#167A55]'
                  : 'bg-[#FBFAF4] border-[#E2E8F0] text-[#5D7184]'
              }`}
            >
              <span className="text-xs sm:text-sm font-black text-center">{w.day}</span>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm ${
                  w.completed ? 'bg-[#167A55] text-white' : 'bg-slate-200 text-slate-500'
                }`}
              >
                {w.completed ? '✓' : '-'}
              </div>
              <span className="text-xs font-bold">
                {w.completed ? `${w.score}%` : (isHindi ? 'आगामी' : 'Upcoming')}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Encouraging Motivation Banner with Call-to-Play */}
      <div className="bg-[#EAF7EF] border-3 border-[#167A55]/30 rounded-[2.5rem] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white border-2 border-[#167A55]/30 flex items-center justify-center text-3xl shadow-xs shrink-0">
            🌸
          </div>
          <div>
            <h3 className="text-2xl sm:text-3xl font-black text-[#102A43]">
              {isHindi ? 'आज का दिमागी खेल खेलने का समय!' : 'Time for a cognitive activity!'}
            </h3>
            <p className="text-base sm:text-lg font-bold text-[#167A55] mt-0.5">
              {isHindi ? 'रोजाना 10 मिनट खेलना याददाश्त को जीवंत और तरोताजा बनाए रखता है।' : '10 minutes of playful memory games keep the mind refreshed.'}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            sounds.playClickChime();
            navigateTo('games');
          }}
          className="tactile-btn px-8 py-4 rounded-2xl bg-[#167A55] hover:bg-[#115C40] border-2 border-[#0D4E36] text-white font-black text-xl flex items-center gap-2 shrink-0 shadow-md cursor-pointer"
        >
          <span>{isHindi ? 'खेल शुरू करें' : 'Play Games'}</span>
          <ArrowRight className="w-6 h-6 stroke-[3]" />
        </button>
      </div>
    </div>
  );
}
