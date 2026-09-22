import React from 'react';
import { Sparkles, Trophy, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useI18n } from '../i18n/I18nContext';
import VoiceButton from '../components/VoiceButton';

export default function GamesHub() {
  const { navigateTo, gameScores, sounds } = useApp();
  const { t, isHindi } = useI18n();

  const games = [
    {
      id: 'memory-match',
      title: t('memoryMatch'),
      desc: t('memoryMatchDesc'),
      icon: '🧠',
      tag: isHindi ? 'स्मृति अभ्यास' : 'Memory Practice',
      benefit: isHindi ? 'मस्तिष्क की एकाग्रता और दृश्य याददाश्त बढ़ाता है।' : 'Boosts focus and visual memory retention.',
      bgColor: 'bg-[#FFE8EF]',
      borderColor: 'border-[#E84D78]/40',
      textColor: 'text-[#E84D78]',
      btnBg: 'bg-[#E84D78] hover:bg-[#D43B66]',
      bestScore: `${gameScores.memoryMatchWins || 0} ${t('winsCountLabel')}`,
    },
    {
      id: 'pattern-recognition',
      title: t('patternGame'),
      desc: t('patternGameDesc'),
      icon: '🧩',
      tag: isHindi ? 'क्रम ध्यान अभ्यास' : 'Focus Practice',
      benefit: isHindi ? 'आवाज और रंगों के समन्वय से ध्यान केंद्रित रहता है।' : 'Harmonizes auditory rhythm and visual attention.',
      bgColor: 'bg-[#E6F1FF]',
      borderColor: 'border-[#2879D0]/40',
      textColor: 'text-[#2879D0]',
      btnBg: 'bg-[#2879D0] hover:bg-[#2065B3]',
      bestScore: `${t('roundLabel')} ${gameScores.patternStreak || 0}`,
    },
    {
      id: 'word-recall',
      title: t('wordRecall'),
      desc: t('wordRecallDesc'),
      icon: 'Aa',
      tag: isHindi ? 'भाषा अभ्यास' : 'Language Practice',
      benefit: isHindi ? 'दैनिक वस्तुओं के नाम याद रखने में सहायता करता है।' : 'Aids conversational recall of household words.',
      bgColor: 'bg-[#FFF0D7]',
      borderColor: 'border-[#E98A20]/40',
      textColor: 'text-[#E98A20]',
      btnBg: 'bg-[#E98A20] hover:bg-[#CF7513]',
      bestScore: `${gameScores.wordRecallStars || 0} ${t('starsLabel')}`,
    },
    {
      id: 'picture-recall',
      title: t('pictureRecall'),
      desc: t('pictureRecallDesc'),
      icon: '🖼️',
      tag: isHindi ? 'दृष्टि स्मृति अभ्यास' : 'Visual Practice',
      benefit: isHindi ? 'अल्पकालिक दृष्टि स्मृति को सक्रिय करता है।' : 'Strengthens short-term visual pattern recognition.',
      bgColor: 'bg-[#EEE9FF]',
      borderColor: 'border-[#7658C8]/40',
      textColor: 'text-[#7658C8]',
      btnBg: 'bg-[#7658C8] hover:bg-[#6042B3]',
      bestScore: `${gameScores.pictureRecallStars || 0} ${t('starsLabel')}`,
    },
  ];

  return (
    <div className="space-y-6 pb-12 animate-slow-fade text-left select-none">
      {/* 1. Header Banner */}
      <div className="bg-[#EAF7EF] rounded-[2.5rem] p-6 sm:p-8 border-2 border-[#167A55]/20 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#167A55]/30 text-[#167A55] font-black text-sm mb-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>{t('cognitiveGamesTitle')}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#102A43]">
            {t('games')}
          </h1>
          <p className="mt-1 text-lg sm:text-xl font-bold text-[#167A55]">
            "{t('cognitiveGamesSub')}"
          </p>
        </div>

        <VoiceButton
          id="gameshub-voice-btn"
          textHindi="यहाँ आपके लिए चार रंगीन और सरल खेल हैं: याददाश्त खेल, पैटर्न खेल, शब्द याद करें, और तस्वीर याद करें। जो खेल आपको पसंद हो, उस पर टैप करें।"
          textEnglish="Here are four gentle cognitive games: Memory Match, Pattern Game, Word Recall, and Picture Recall. Tap any game to begin."
          size="lg"
          label={t('listenGameOptions')}
        />
      </div>

      {/* 2. Gentle Reassurance Alert */}
      <div className="bg-white border-2 border-[#DFF3E7] rounded-2xl p-4 sm:p-5 flex items-center gap-3">
        <span className="text-3xl">🌸</span>
        <p className="text-base sm:text-lg font-bold text-[#102A43]">
          {isHindi
            ? 'याद रखें: कोई भी गलत उत्तर नहीं होता! हर कोशिश मन को शांत और सक्रिय बनाती है।'
            : 'Remember: There are no wrong answers! Every playful interaction keeps the mind peaceful and engaged.'}
        </p>
      </div>

      {/* 3. 4 Color-Coded Game Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {games.map((game) => (
          <div
            key={game.id}
            className={`tactile-btn p-6 sm:p-8 rounded-[2.5rem] ${game.bgColor} border-3 ${game.borderColor} flex flex-col justify-between gap-6 shadow-xs card-hover`}
          >
            {/* Top Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-5xl">{game.icon}</span>
                <div>
                  <span className="inline-block px-3 py-0.5 rounded-full bg-white/90 border border-current text-xs font-black uppercase tracking-wider mb-1">
                    {game.tag}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-[#102A43]">
                    {game.title}
                  </h2>
                </div>
              </div>

              <p className="text-base sm:text-lg text-[#5D7184] font-medium">
                {game.desc}
              </p>
              <p className="text-sm text-[#5D7184] font-medium">
                {game.benefit}
              </p>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-white/80 border border-slate-200 font-bold text-sm text-[#102A43]">
                <Trophy className="w-4 h-4 text-amber-500" aria-hidden="true" />
                <span>{game.bestScore}</span>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t-2 border-black/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <VoiceButton
                textHindi={`${game.title}। ${game.desc}।`}
                textEnglish={`${game.title}. ${game.desc}.`}
                size="sm"
                label={t('listen')}
              />

              <button
                onClick={() => {
                  sounds.playClickChime();
                  navigateTo(game.id);
                }}
                className={`tactile-btn px-7 py-3.5 rounded-2xl ${game.btnBg} text-white font-black text-xl flex items-center justify-center gap-2 shadow cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#102A43]`}
              >
                <span>{t('playNow')}</span>
                <ArrowRight className="w-5 h-5 stroke-[3]" aria-hidden="true" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
