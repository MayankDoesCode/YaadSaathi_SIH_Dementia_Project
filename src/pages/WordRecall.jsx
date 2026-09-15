import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  RotateCcw,
  Sparkles,
  HelpCircle,
  Trophy,
  CheckCircle2,
  Volume2,
  ArrowRight,
  Lightbulb,
  Heart,
  ArrowLeft,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { WORD_RECALL_QUESTIONS } from '../data/mockData';
import VoiceButton from '../components/VoiceButton';

export default function WordRecall() {
  const { navigateTo, sounds, voice, gameScores, setGameScores } = useApp();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [stars, setStars] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentQ = WORD_RECALL_QUESTIONS[currentIndex];

  const handleSelectOption = (option) => {
    if (isAnswered && isCorrect) return;

    setSelectedOptionId(option.id);
    setIsAnswered(true);

    if (option.correct) {
      setIsCorrect(true);
      sounds.playSuccessChime();
      setStars((s) => s + 1);

      voice.speak(
        `अति उत्तम! सही उत्तर है: ${option.textHindi}!`,
        `Splendid! The correct answer is: ${option.textEnglish}!`
      );
    } else {
      setIsCorrect(false);
      sounds.playEncouragementChime();
      voice.speak(
        'कोई बात नहीं! संकेत देखें और एक बार पुनः प्रयास करें।',
        'No worries! Take a look at the hint and try again.'
      );
    }
  };

  const handleNextQuestion = () => {
    sounds.playClickChime();
    if (currentIndex + 1 < WORD_RECALL_QUESTIONS.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOptionId(null);
      setIsAnswered(false);
      setIsCorrect(null);
      setShowHint(false);
    } else {
      // Completed all questions!
      setIsFinished(true);
      confetti({
        particleCount: 85,
        spread: 75,
        origin: { y: 0.6 },
      });
      setGameScores((prev) => ({
        ...prev,
        wordRecallStars: (prev.wordRecallStars || 0) + stars + 1,
      }));
      voice.speak(
        'बहुत सुंदर! आपने सभी शब्द पहेलियां बहुत अच्छे से हल कीं! आपका मस्तिष्क बहुत तेज है!',
        'Beautiful! You solved all the word puzzles delightfully! Great job!'
      );
    }
  };

  const restartQuiz = () => {
    setCurrentIndex(0);
    setSelectedOptionId(null);
    setIsAnswered(false);
    setIsCorrect(null);
    setShowHint(false);
    setStars(0);
    setIsFinished(false);
  };

  const handleListenRules = () => {
    sounds.playClickChime();
    voice.speak(
      'शब्द और वस्तु याद खेल: प्रश्न को ध्यान से पढ़ें या सुनें। नीचे दिए गए तीन विकल्पों में से सही विकल्प को छुएं।',
      'Word Recall: Read or listen to the question. Tap the correct answer among the three choices.'
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

      {/* Header Banner - Orange Theme */}
      <div className="bg-[#FFF0D7] rounded-[2.5rem] p-6 sm:p-8 border-3 border-[#E98A20]/40 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <span className="text-4xl">🥭</span>
            <h1 className="text-3xl sm:text-5xl font-black text-[#102A43]">
              शब्द और वस्तु याद
            </h1>
          </div>
          <p className="text-xl sm:text-2xl font-black text-[#E98A20]">
            "दैनिक जीवन की वस्तुओं और रिश्तों से जुड़े आसान सवाल"
          </p>
          <p className="text-base sm:text-lg font-bold text-[#5D7184] mt-0.5">
            Everyday Object & Word Association • Language & Semantic Memory
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          <button
            onClick={handleListenRules}
            className="tactile-btn flex items-center gap-2 px-5 py-3 rounded-2xl bg-white hover:bg-[#FFF0D7] border-2 border-[#E98A20] text-[#E98A20] font-black text-lg min-h-[52px] cursor-pointer shadow-xs"
          >
            <Volume2 className="w-6 h-6 animate-pulse" />
            <span>🔊 नियम सुनें (Listen Rules)</span>
          </button>

          <button
            onClick={restartQuiz}
            className="tactile-btn flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#E98A20] hover:bg-[#C97214] border-2 border-[#A85B0B] text-white font-black text-lg min-h-[52px] cursor-pointer shadow-sm"
          >
            <RotateCcw className="w-6 h-6 stroke-[2.5]" />
            <span>शुरू से खेलें (Restart)</span>
          </button>
        </div>
      </div>

      {/* Progress & Category Bar */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-[#DFF3E7] shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="px-4 py-1.5 rounded-2xl bg-[#FFF0D7] border border-[#E98A20]/40 text-[#E98A20] font-black text-sm sm:text-base">
            {currentQ?.categoryHindi}
          </span>
          <span className="text-lg sm:text-xl font-black text-[#102A43]">
            प्रश्न: <strong className="text-3xl text-[#E98A20]">{currentIndex + 1}</strong> / {WORD_RECALL_QUESTIONS.length}
          </span>
        </div>

        <div className="flex items-center gap-2 text-[#E98A20] font-black text-lg sm:text-xl">
          <span>⭐ सितारे (Stars): {stars}</span>
        </div>
      </div>

      {/* QUIZ FINISHED CELEBRATION */}
      {isFinished ? (
        <div className="bg-[#FFF0D7] border-4 border-[#E98A20] rounded-[2.5rem] p-6 sm:p-10 text-center shadow-xl animate-slow-fade">
          <span className="text-6xl inline-block mb-3">🌺</span>
          <h2 className="text-3xl sm:text-5xl font-black text-[#102A43]">
            शानदार! सभी उत्तर सफलतापूर्वक पूरे हुए!
          </h2>
          <p className="mt-2 text-xl sm:text-2xl font-black text-[#E98A20]">
            आपने कुल {stars} सितारे अर्जित किए!
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={restartQuiz}
              className="tactile-btn px-8 py-4 sm:py-5 rounded-2xl bg-[#E98A20] hover:bg-[#C97214] border-2 border-[#A85B0B] text-white font-black text-xl sm:text-2xl flex items-center gap-3 shadow-lg cursor-pointer"
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
      ) : (
        /* CURRENT QUESTION CARD */
        <div className="bg-white rounded-[2.5rem] p-6 sm:p-8 border-3 border-[#FFF0D7] shadow-md space-y-6">
          {/* Question Text with Voice Read Button */}
          <div className="p-5 sm:p-6 rounded-3xl bg-[#FFF0D7]/60 border-2 border-[#E98A20]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <span className="text-5xl shrink-0 p-3 bg-white rounded-3xl shadow-xs border border-[#E98A20]/20">
                {currentQ.icon}
              </span>
              <div>
                <h2 className="text-2xl sm:text-4xl font-black text-[#102A43] leading-snug">
                  {currentQ.questionHindi}
                </h2>
                <p className="text-base sm:text-xl font-bold text-[#5D7184] mt-1">
                  {currentQ.questionEnglish}
                </p>
              </div>
            </div>

            <VoiceButton
              textHindi={currentQ.audioPromptHindi}
              textEnglish={currentQ.audioPromptEnglish}
              size="lg"
              label="प्रश्न सुनें"
              className="shrink-0"
            />
          </div>

          {/* Three Large Touch-Target Options */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            {currentQ.options.map((option) => {
              const isSelected = selectedOptionId === option.id;
              let btnClass = 'bg-[#FBFAF4] hover:bg-[#FFF0D7] border-[#E2E8F0] text-[#102A43]';

              if (isSelected) {
                if (option.correct) {
                  btnClass = 'bg-[#EAF7EF] border-[#167A55] text-[#167A55] ring-4 ring-[#DFF3E7]';
                } else {
                  btnClass = 'bg-[#FFE8EF] border-[#E84D78] text-[#E84D78] ring-4 ring-[#FFE8EF]';
                }
              }

              return (
                <button
                  key={option.id}
                  onClick={() => handleSelectOption(option)}
                  className={`tactile-btn p-5 sm:p-6 rounded-3xl border-4 flex flex-col items-center justify-center text-center gap-3 transition-all min-h-[150px] cursor-pointer ${btnClass}`}
                >
                  <span className="text-5xl sm:text-6xl filter drop-shadow-sm">{option.emoji}</span>
                  <div>
                    <span className="text-2xl sm:text-3xl font-black block leading-tight">
                      {option.textHindi}
                    </span>
                    <span className="text-sm sm:text-base font-bold text-[#5D7184] block mt-0.5">
                      {option.textEnglish}
                    </span>
                  </div>

                  {isSelected && option.correct && (
                    <span className="inline-flex items-center gap-1.5 text-[#167A55] font-black text-sm bg-white px-3 py-1 rounded-full shadow-xs">
                      <CheckCircle2 className="w-4 h-4" /> सही उत्तर!
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Hint Section */}
          <div className="flex items-center justify-between flex-wrap gap-3 pt-2">
            <button
              onClick={() => {
                setShowHint(!showHint);
                sounds.playClickChime();
                if (!showHint) {
                  voice.speak(`संकेत: ${currentQ.hintHindi}`, `Hint: ${currentQ.hintEnglish}`);
                }
              }}
              className="tactile-btn px-5 py-3 rounded-2xl bg-[#FFF0D7] hover:bg-[#FFE3B9] border-2 border-[#E98A20] text-[#102A43] font-black text-base flex items-center gap-2 cursor-pointer"
            >
              <Lightbulb className="w-5 h-5 text-[#E98A20]" />
              <span>{showHint ? 'संकेत छिपाएं' : 'मदद / संकेत देखें (Hint)'}</span>
            </button>

            {/* Next Button */}
            {isAnswered && isCorrect && (
              <button
                onClick={handleNextQuestion}
                className="tactile-btn px-8 py-4 rounded-2xl bg-[#167A55] hover:bg-[#115C40] border-2 border-[#0D4E36] text-white font-black text-xl flex items-center gap-3 shadow-lg animate-bounce cursor-pointer"
              >
                <span>अगला प्रश्न (Next)</span>
                <ArrowRight className="w-6 h-6 stroke-[3]" />
              </button>
            )}
          </div>

          {/* Hint Display Card */}
          {showHint && (
            <div className="p-5 rounded-3xl bg-[#FFF0D7] border-2 border-[#E98A20] text-[#102A43] animate-slow-fade flex items-center justify-between gap-3">
              <div>
                <p className="text-xl font-black text-[#E98A20]">💡 संकेत (Hint):</p>
                <p className="text-lg font-bold mt-1">{currentQ.hintHindi}</p>
                <p className="text-sm text-[#5D7184] font-semibold">{currentQ.hintEnglish}</p>
              </div>
              <VoiceButton
                textHindi={currentQ.hintHindi}
                textEnglish={currentQ.hintEnglish}
                size="sm"
                label=""
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

