import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  RotateCcw,
  Sparkles,
  Trophy,
  HelpCircle,
  Eye,
  CheckCircle2,
  Clock,
  ArrowRight,
  ArrowLeft,
  Volume2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import VoiceButton from '../components/VoiceButton';

// Pool of familiar Indian elder cultural items
const ITEM_POOL = [
  { id: 'diya', nameHindi: 'दीपक (दीया)', nameEnglish: 'Diya (Lamp)', emoji: '🪔' },
  { id: 'chai', nameHindi: 'गरम चाय', nameEnglish: 'Hot Tea', emoji: '☕' },
  { id: 'peacock', nameHindi: 'सुंदर मोर', nameEnglish: 'Peacock', emoji: '🦚' },
  { id: 'lotus', nameHindi: 'कमल फूल', nameEnglish: 'Lotus Flower', emoji: '🪷' },
  { id: 'mango', nameHindi: 'मीठा आम', nameEnglish: 'Sweet Mango', emoji: '🥭' },
  { id: 'bell', nameHindi: 'मंदिर घंटी', nameEnglish: 'Temple Bell', emoji: '🔔' },
  { id: 'tulsi', nameHindi: 'तुलसी पौधा', nameEnglish: 'Tulsi Plant', emoji: '🌿' },
  { id: 'sun', nameHindi: 'सुनहरा सूरज', nameEnglish: 'Golden Sun', emoji: '☀️' },
];

export default function PictureRecall() {
  const { navigateTo, sounds, voice, gameScores, setGameScores } = useApp();

  const [round, setRound] = useState(1);
  const maxRounds = 3;

  // States: 'memorize', 'recall', 'feedback', 'won'
  const [phase, setPhase] = useState('memorize');
  const [memorizeItems, setMemorizeItems] = useState([]);
  const [targetItem, setTargetItem] = useState(null);
  const [choices, setChoices] = useState([]);
  const [countdown, setCountdown] = useState(5);
  const [selectedChoiceId, setSelectedChoiceId] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [stars, setStars] = useState(0);

  const timerRef = useRef(null);

  // Setup round
  const startRound = (roundNum) => {
    clearInterval(timerRef.current);
    setSelectedChoiceId(null);
    setIsCorrect(null);
    setCountdown(5);

    // Shuffle item pool and pick 3 to memorize
    const shuffled = [...ITEM_POOL].sort(() => Math.random() - 0.5);
    const toMemorize = shuffled.slice(0, 3);
    setMemorizeItems(toMemorize);

    // Pick 1 item from the memorized set as the target question
    const target = toMemorize[Math.floor(Math.random() * toMemorize.length)];
    setTargetItem(target);

    // Pick 3 distractors from the remaining items
    const remaining = shuffled.slice(3);
    const distractors = remaining.slice(0, 3);

    // Combine target and distractors and shuffle for recall choices
    const recallChoices = [target, ...distractors].sort(() => Math.random() - 0.5);
    setChoices(recallChoices);

    setPhase('memorize');

    // Announce via voice
    voice.speak(
      `इन चित्रों को ध्यान से देखें और याद रखें: ${toMemorize.map((m) => m.nameHindi).join(', ')}।`,
      `Look at these pictures carefully and remember them.`
    );

    // 5-second countdown timer
    let timeLeft = 5;
    timerRef.current = setInterval(() => {
      timeLeft -= 1;
      setCountdown(timeLeft);

      if (timeLeft <= 0) {
        clearInterval(timerRef.current);
        setPhase('recall');
        voice.speak(
          'समय समाप्त! अब बताइए, इनमें से कौन सा चित्र आपने अभी देखा था?',
          'Time is up! Now tell which of these pictures did you see earlier?'
        );
      }
    }, 1000);
  };

  useEffect(() => {
    startRound(1);
    return () => clearInterval(timerRef.current);
  }, []);

  // Senior taps an answer choice
  const handleChoiceSelect = (choice) => {
    if (phase !== 'recall') return;

    setSelectedChoiceId(choice.id);
    const correct = choice.id === targetItem.id;
    setIsCorrect(correct);
    setPhase('feedback');

    if (correct) {
      sounds.playSuccessChime();
      setStars((s) => s + 1);
      voice.speak(
        `बहुत खूब! आपने सही पहचाना: ${choice.nameHindi}!`,
        `Splendid! You correctly recalled ${choice.nameEnglish}!`
      );
    } else {
      sounds.playEncouragementChime();
      voice.speak(
        `कोई बात नहीं! सही चित्र "${targetItem.nameHindi}" था।`,
        `No worries! The correct item was ${targetItem.nameEnglish}.`
      );
    }
  };

  // Next round or completion
  const handleNext = () => {
    sounds.playClickChime();
    if (round < maxRounds) {
      const nextRound = round + 1;
      setRound(nextRound);
      startRound(nextRound);
    } else {
      // Game completed!
      setPhase('won');
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
      setGameScores((prev) => ({
        ...prev,
        pictureRecallStars: (prev.pictureRecallStars || 0) + stars + 1,
      }));
      voice.speak(
        'शानदार! आपने चित्र याद रखने का खेल पूरा कर लिया है! बधाई हो!',
        'Splendid! You completed the picture recall game! Congratulations!'
      );
    }
  };

  const restartGame = () => {
    setRound(1);
    setStars(0);
    startRound(1);
  };

  const handleListenRules = () => {
    sounds.playClickChime();
    voice.speak(
      'चित्र याद खेल: स्क्रीन पर 5 सेकंड के लिए तीन चित्र दिखेंगे। उन्हें ध्यान से देखें। फिर छिपे हुए चित्रों में से सही चित्र को पहचानें।',
      'Picture Recall: Three pictures will appear for 5 seconds. Remember them. Then choose which picture was shown.'
    );
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in text-left">
      {/* Back button to Games Hub */}
      <button
        onClick={() => navigateTo('games')}
        className="tactile-btn inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border-2 border-[#DFF3E7] text-[#102A43] font-bold text-base hover:bg-[#EAF7EF] cursor-pointer"
      >
        <ArrowLeft className="w-5 h-5 text-[#167A55]" />
        <span>सभी खेलों पर वापस जाएं (Back to Games)</span>
      </button>

      {/* 1. Header Banner - Purple Theme */}
      <div className="bg-[#EEE9FF] rounded-[2.5rem] p-6 sm:p-8 border-3 border-[#7658C8]/40 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <span className="text-4xl">🖼️</span>
            <h1 className="text-3xl sm:text-5xl font-black text-[#102A43]">
              चित्र याद खेल
            </h1>
          </div>
          <p className="text-xl sm:text-2xl font-black text-[#7658C8]">
            "कुछ सेकंड में दिखाए गए चित्रों को याद रखें और सही चित्र पहचानें"
          </p>
          <p className="text-base sm:text-lg font-bold text-[#5D7184] mt-0.5">
            Visual Memory Retention • Focus & Attention Training
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          <button
            onClick={handleListenRules}
            className="tactile-btn flex items-center gap-2 px-5 py-3 rounded-2xl bg-white hover:bg-[#EEE9FF] border-2 border-[#7658C8] text-[#7658C8] font-black text-lg min-h-[52px] cursor-pointer shadow-xs"
          >
            <Volume2 className="w-6 h-6 animate-pulse" />
            <span>🔊 नियम सुनें (Listen Rules)</span>
          </button>

          <button
            onClick={restartGame}
            className="tactile-btn flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#7658C8] hover:bg-[#6042B3] border-2 border-[#4A2D99] text-white font-black text-lg min-h-[52px] cursor-pointer shadow-sm"
          >
            <RotateCcw className="w-6 h-6 stroke-[2.5]" />
            <span>नया खेल (Restart)</span>
          </button>
        </div>
      </div>

      {/* 2. Round & Star Bar */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-[#DFF3E7] shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xl font-black text-[#102A43]">
            चक्र (Round): <strong className="text-3xl text-[#7658C8]">{round}</strong> / {maxRounds}
          </span>
          <span className="text-base font-bold text-[#5D7184]">
            (दृष्टि स्मृति अभ्यास / Visual Memory)
          </span>
        </div>

        <div className="flex items-center gap-2 text-[#7658C8] font-black text-xl">
          <span>⭐ अर्जित सितारे: {stars}</span>
        </div>
      </div>

      {/* 3. PHASE 1: MEMORIZE (Show 3 pictures with 5s countdown) */}
      {phase === 'memorize' && (
        <div className="bg-white rounded-[2.5rem] p-6 sm:p-10 border-4 border-[#EEE9FF] shadow-md text-center space-y-6">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#EEE9FF] text-[#7658C8] font-black text-lg border border-[#7658C8]/30">
              <Eye className="w-6 h-6 animate-pulse" />
              <span>इन चित्रों को ध्यान से देखें और याद रखें (Memorize These)</span>
            </span>
            <div className="pt-3 flex items-center justify-center gap-2 text-3xl sm:text-4xl font-mono font-black text-[#E98A20]">
              <Clock className="w-8 h-8" />
              <span>{countdown} सेकंड शेष</span>
            </div>
          </div>

          {/* 3 Large Picture Cards to Memorize */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-2xl mx-auto pt-2">
            {memorizeItems.map((item) => (
              <div
                key={item.id}
                className="tactile-btn p-6 rounded-3xl bg-[#FBFAF4] border-4 border-[#EEE9FF] flex flex-col items-center justify-center gap-2 shadow-xs"
              >
                <span className="text-6xl sm:text-7xl filter drop-shadow">
                  {item.emoji}
                </span>
                <span className="text-2xl sm:text-3xl font-black text-[#102A43]">
                  {item.nameHindi}
                </span>
                <span className="text-sm sm:text-base font-bold text-[#5D7184]">
                  {item.nameEnglish}
                </span>
              </div>
            ))}
          </div>

          <p className="text-base sm:text-lg font-bold text-[#5D7184]">
            चित्र 5 सेकंड बाद स्वतः छिप जाएंगे। शांत मन से ध्यान दें।
          </p>
        </div>
      )}

      {/* 4. PHASE 2 & 3: RECALL & FEEDBACK (Choose which picture was shown) */}
      {(phase === 'recall' || phase === 'feedback') && (
        <div className="bg-white rounded-[2.5rem] p-6 sm:p-10 border-4 border-[#EEE9FF] shadow-md text-center space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-4xl font-black text-[#102A43]">
              इनमें से कौन सा चित्र आपने अभी पहले देखा था?
            </h2>
            <p className="text-base sm:text-xl font-bold text-[#5D7184]">
              Which of these pictures did you see earlier?
            </p>
          </div>

          {/* 4 Large Choice Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto pt-2">
            {choices.map((choice) => {
              const isSelected = selectedChoiceId === choice.id;
              const isTarget = choice.id === targetItem?.id;

              let cardStyle = 'bg-[#FBFAF4] hover:bg-[#EEE9FF] border-[#E2E8F0] text-[#102A43]';

              if (phase === 'feedback') {
                if (isTarget) {
                  cardStyle = 'bg-[#EAF7EF] border-[#167A55] text-[#167A55] ring-4 ring-[#DFF3E7]';
                } else if (isSelected && !isCorrect) {
                  cardStyle = 'bg-[#FFE8EF] border-[#E84D78] text-[#E84D78]';
                }
              }

              return (
                <button
                  key={choice.id}
                  onClick={() => handleChoiceSelect(choice)}
                  disabled={phase === 'feedback'}
                  className={`tactile-btn p-5 sm:p-6 rounded-3xl border-4 flex flex-col items-center justify-center gap-2 transition-all min-h-[160px] cursor-pointer ${cardStyle}`}
                >
                  <span className="text-6xl filter drop-shadow">{choice.emoji}</span>
                  <span className="text-xl sm:text-2xl font-black">{choice.nameHindi}</span>
                  <span className="text-xs sm:text-sm font-bold opacity-80">{choice.nameEnglish}</span>

                  {phase === 'feedback' && isTarget && (
                    <span className="inline-flex items-center gap-1.5 text-[#167A55] font-black text-xs sm:text-sm bg-white px-3 py-1 rounded-full mt-1 shadow-xs">
                      <CheckCircle2 className="w-4 h-4" /> सही चित्र!
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Feedback & Next Button */}
          {phase === 'feedback' && (
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 animate-slow-fade">
              <span className="text-xl sm:text-2xl font-black text-[#102A43]">
                {isCorrect ? '🌟 शाबाश! सही उत्तर!' : '🌸 कोई बात नहीं! अभ्यास से याददाश्त तेज होती है।'}
              </span>

              <button
                onClick={handleNext}
                className="tactile-btn px-8 py-4 rounded-2xl bg-[#7658C8] hover:bg-[#6042B3] border-2 border-[#4A2D99] text-white font-black text-xl flex items-center gap-3 shadow-lg animate-bounce cursor-pointer"
              >
                <span>अगला (Next)</span>
                <ArrowRight className="w-6 h-6 stroke-[3]" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* 5. PHASE 4: GAME WON CELEBRATION */}
      {phase === 'won' && (
        <div className="bg-[#EEE9FF] border-4 border-[#7658C8] rounded-[2.5rem] p-6 sm:p-10 text-center shadow-xl animate-slow-fade">
          <span className="text-6xl inline-block mb-3">🌺</span>
          <h2 className="text-3xl sm:text-5xl font-black text-[#102A43]">
            बहुत खूब दामोदर जी! चक्र पूरा हुआ!
          </h2>
          <p className="mt-2 text-xl sm:text-2xl font-black text-[#7658C8]">
            आपने कुल {stars} सितारे प्राप्त किए!
          </p>

          <div className="my-5 flex items-center justify-center gap-3 text-4xl sm:text-5xl text-amber-500">
            <span>⭐</span>
            <span>⭐</span>
            <span>⭐</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
            <button
              onClick={restartGame}
              className="tactile-btn px-8 py-4 sm:py-5 rounded-2xl bg-[#7658C8] hover:bg-[#6042B3] border-2 border-[#4A2D99] text-white font-black text-xl sm:text-2xl flex items-center gap-3 shadow-lg cursor-pointer"
            >
              <RotateCcw className="w-7 h-7 stroke-[3]" />
              <span>फिर से खेलें (Play Again)</span>
            </button>

            <button
              onClick={() => navigateTo('games')}
              className="tactile-btn px-6 py-4 sm:py-5 rounded-2xl bg-white hover:bg-[#FBFAF4] border-2 border-[#DFF3E7] text-[#102A43] font-black text-xl cursor-pointer"
            >
              अन्य खेल देखें (Other Games)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

