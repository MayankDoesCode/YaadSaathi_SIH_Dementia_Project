import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, ArrowRight, Lightbulb } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useI18n } from '../i18n/I18nContext';
import { WORD_RECALL_QUESTIONS } from '../data/mockData';
import VoiceButton from '../components/VoiceButton';
import GameTopBar from '../components/games/GameTopBar';
import AdaptiveDifficultyCard from '../components/games/AdaptiveDifficultyCard';
import GameCompletionActions from '../components/games/GameCompletionActions';

const THEME = { bg: '#FFF0D7', border: '#E98A20', text: '#E98A20', btnBg: '#E98A20', btnHover: '#C97214', btnBorder: '#A85B0B' };

export default function WordRecall() {
  const { navigateTo, sounds, voice, recordGameResult } = useApp();
  const { t, isHindi } = useI18n();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [stars, setStars] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [correctFirstTry, setCorrectFirstTry] = useState(0);
  const [hasMissedOnThisQuestion, setHasMissedOnThisQuestion] = useState(false);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [responseTimes, setResponseTimes] = useState([]);
  const [adaptiveResult, setAdaptiveResult] = useState(null);

  const questionStartRef = useRef(Date.now());
  const timerIntervalRef = useRef(null);

  const currentQ = WORD_RECALL_QUESTIONS[currentIndex];

  useEffect(() => {
    if (!isFinished) {
      timerIntervalRef.current = setInterval(() => setTotalSeconds((s) => s + 1), 1000);
    } else {
      clearInterval(timerIntervalRef.current);
    }
    return () => clearInterval(timerIntervalRef.current);
  }, [isFinished]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const avgResponseTime =
    responseTimes.length > 0
      ? (responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length).toFixed(1)
      : '0.0';

  const handleSelectOption = (option) => {
    if (isAnswered && isCorrect) return;

    setSelectedOptionId(option.id);
    setIsAnswered(true);

    const deltaSec = Math.min((Date.now() - questionStartRef.current) / 1000, 20);

    if (option.correct) {
      setIsCorrect(true);
      sounds.playSuccessChime();
      setStars((s) => s + 1);
      setResponseTimes((prev) => [...prev, deltaSec]);
      if (!hasMissedOnThisQuestion) {
        setCorrectFirstTry((c) => c + 1);
      }

      voice.speak(
        t('wordCorrectSpeech', { answer: option.textHindi }),
        t('wordCorrectSpeech', { answer: option.textEnglish })
      );
    } else {
      setIsCorrect(false);
      setHasMissedOnThisQuestion(true);
      sounds.playEncouragementChime();
      voice.speak(t('wordIncorrectSpeech'), t('wordIncorrectSpeech'));
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
      setHasMissedOnThisQuestion(false);
      questionStartRef.current = Date.now();
    } else {
      // Completed all questions!
      setIsFinished(true);
      confetti({ particleCount: 85, spread: 75, origin: { y: 0.6 } });

      const finalStars = stars + 1;
      const finalAccuracy = Math.round((correctFirstTry / WORD_RECALL_QUESTIONS.length) * 100);
      const finalAvgResp =
        responseTimes.length > 0
          ? Number((responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length).toFixed(1))
          : 3.0;

      const adaptive = recordGameResult({
        game: 'wordRecall',
        accuracy: finalAccuracy,
        averageResponseTime: finalAvgResp,
        starsEarned: finalStars,
        scoreUpdater: (prev) => ({ wordRecallStars: (prev.wordRecallStars || 0) + finalStars }),
      });
      setAdaptiveResult(adaptive);

      voice.speak(t('wordCompleteSpeech'), t('wordCompleteSpeech'));
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
    setCorrectFirstTry(0);
    setHasMissedOnThisQuestion(false);
    setTotalSeconds(0);
    setResponseTimes([]);
    setAdaptiveResult(null);
    questionStartRef.current = Date.now();
  };

  const handleListenRules = () => {
    sounds.playClickChime();
    voice.speak(t('wordRecallRulesSpeech'), t('wordRecallRulesSpeech'));
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in text-left">
      <GameTopBar
        icon="🥭"
        title={t('wordRecallPageTitle')}
        tagline={t('wordRecallTagline')}
        subtitle={t('wordRecallSubtitle')}
        theme={THEME}
        onBack={() => navigateTo('games')}
        onListenRules={handleListenRules}
        onRestart={restartQuiz}
      />

      {/* Progress & Category Bar */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-[#DFF3E7] shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="px-4 py-1.5 rounded-2xl bg-[#FFF0D7] border border-[#E98A20]/40 text-[#E98A20] font-black text-sm sm:text-base">
            {isHindi ? currentQ?.categoryHindi : currentQ?.categoryEnglish}
          </span>
          <span className="text-lg sm:text-xl font-black text-[#102A43]">
            {t('questionLabel')}: <strong className="text-3xl text-[#E98A20]">{currentIndex + 1}</strong> / {WORD_RECALL_QUESTIONS.length}
          </span>
        </div>

        <div className="flex items-center gap-4 text-[#E98A20] font-black text-lg sm:text-xl">
          <span>⭐ {t('starsLabel')}: {stars}</span>
          <span className="font-mono">⏱️ {formatTime(totalSeconds)}</span>
        </div>
      </div>

      {/* QUIZ FINISHED CELEBRATION */}
      {isFinished ? (
        <div className="bg-[#FFF0D7] border-4 border-[#E98A20] rounded-[2.5rem] p-6 sm:p-10 text-center shadow-xl animate-slow-fade">
          <span className="text-6xl inline-block mb-3" aria-hidden="true">🌺</span>
          <h2 className="text-3xl sm:text-5xl font-black text-[#102A43]">{t('wordCompleteTitle')}</h2>
          <p className="mt-2 text-xl sm:text-2xl font-black text-[#E98A20]">{t('wordCompleteSub', { stars: stars + 1 })}</p>

          <AdaptiveDifficultyCard
            adaptiveResult={adaptiveResult}
            accuracyPercent={Math.round(((correctFirstTry) / WORD_RECALL_QUESTIONS.length) * 100)}
            avgResponseTime={avgResponseTime}
          />

          <p className="text-sm font-semibold text-[#167A55] mb-6">✓ {t('resultsSavedNote')}</p>

          <GameCompletionActions onPlayAgain={restartQuiz} onOtherGames={() => navigateTo('games')} theme={THEME} />
        </div>
      ) : (
        /* CURRENT QUESTION CARD */
        <div className="bg-white rounded-[2.5rem] p-6 sm:p-8 border-3 border-[#FFF0D7] shadow-md space-y-6">
          <div className="p-5 sm:p-6 rounded-3xl bg-[#FFF0D7]/60 border-2 border-[#E98A20]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <span className="text-5xl shrink-0 p-3 bg-white rounded-3xl shadow-xs border border-[#E98A20]/20" aria-hidden="true">
                {currentQ.icon}
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-[#102A43] leading-snug">
                {isHindi ? currentQ.questionHindi : currentQ.questionEnglish}
              </h2>
            </div>

            <VoiceButton
              textHindi={currentQ.audioPromptHindi}
              textEnglish={currentQ.audioPromptEnglish}
              size="lg"
              label={t('wordListenQuestion')}
              className="shrink-0"
            />
          </div>

          {/* Three Large Touch-Target Options */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            {currentQ.options.map((option) => {
              const isSelected = selectedOptionId === option.id;
              let btnClass = 'bg-[#FBFAF4] hover:bg-[#FFF0D7] border-[#E2E8F0] text-[#102A43]';

              if (isSelected) {
                btnClass = option.correct
                  ? 'bg-[#EAF7EF] border-[#167A55] text-[#167A55] ring-4 ring-[#DFF3E7]'
                  : 'bg-[#FFE8EF] border-[#E84D78] text-[#E84D78] ring-4 ring-[#FFE8EF]';
              }

              return (
                <button
                  key={option.id}
                  onClick={() => handleSelectOption(option)}
                  className={`tactile-btn p-5 sm:p-6 rounded-3xl border-4 flex flex-col items-center justify-center text-center gap-3 transition-all min-h-[150px] cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${btnClass}`}
                >
                  <span className="text-5xl sm:text-6xl filter drop-shadow-sm" aria-hidden="true">{option.emoji}</span>
                  <span className="text-2xl sm:text-3xl font-black block leading-tight">
                    {isHindi ? option.textHindi : option.textEnglish}
                  </span>

                  {isSelected && option.correct && (
                    <span className="inline-flex items-center gap-1.5 text-[#167A55] font-black text-sm bg-white px-3 py-1 rounded-full shadow-xs">
                      <CheckCircle2 className="w-4 h-4" aria-hidden="true" /> {t('correctAnswerBadge')}
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
                  voice.speak(`${t('hintLabel')}: ${currentQ.hintHindi}`, `${t('hintLabel')}: ${currentQ.hintEnglish}`);
                }
              }}
              className="tactile-btn px-5 py-3 rounded-2xl bg-[#FFF0D7] hover:bg-[#FFE3B9] border-2 border-[#E98A20] text-[#102A43] font-black text-base flex items-center gap-2 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <Lightbulb className="w-5 h-5 text-[#E98A20]" aria-hidden="true" />
              <span>{showHint ? t('hintHide') : t('hintShow')}</span>
            </button>

            {isAnswered && isCorrect && (
              <button
                onClick={handleNextQuestion}
                className="tactile-btn px-8 py-4 rounded-2xl bg-[#167A55] hover:bg-[#115C40] border-2 border-[#0D4E36] text-white font-black text-xl flex items-center gap-3 shadow-lg cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                <span>{t('nextQuestionBtn')}</span>
                <ArrowRight className="w-6 h-6 stroke-[3]" aria-hidden="true" />
              </button>
            )}
          </div>

          {showHint && (
            <div className="p-5 rounded-3xl bg-[#FFF0D7] border-2 border-[#E98A20] text-[#102A43] animate-slow-fade flex items-center justify-between gap-3">
              <div>
                <p className="text-xl font-black text-[#E98A20]">💡 {t('hintLabel')}:</p>
                <p className="text-lg font-bold mt-1">{isHindi ? currentQ.hintHindi : currentQ.hintEnglish}</p>
              </div>
              <VoiceButton textHindi={currentQ.hintHindi} textEnglish={currentQ.hintEnglish} size="sm" label="" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
