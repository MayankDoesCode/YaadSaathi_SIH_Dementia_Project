import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  RotateCcw,
  Sparkles,
  Trophy,
  Clock,
  Target,
  Zap,
  Volume2,
  CheckCircle2,
  HelpCircle,
  Award,
  History,
  ArrowLeft,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MEMORY_CARDS_CATALOG } from '../data/mockData';
import VoiceButton from '../components/VoiceButton';
import { calculateAdaptiveDifficulty, DIFFICULTY_LABELS } from '../logic/adaptiveEngine';

export default function MemoryMatch() {
  const {
    navigateTo,
    sounds,
    voice,
    setGameScores,
    cognitiveDifficulty,
    setCognitiveDifficulty,
  } = useApp();

  // Exactly 6 pairs (12 cards)
  const PAIR_COUNT = 6;

  // Game board states
  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedIds, setMatchedIds] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isWon, setIsWon] = useState(false);

  // Performance telemetry
  const [attempts, setAttempts] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [responseTimes, setResponseTimes] = useState([]); // seconds per tap
  const lastTapTimeRef = useRef(null);
  const timerIntervalRef = useRef(null);

  // Encouraging feedback state after every action
  const [feedback, setFeedback] = useState({
    type: 'neutral', // 'neutral', 'picking', 'matched', 'mismatch', 'won'
    hindi: 'किसी भी कार्ड को छूकर खेल शुरू करें। कोई जल्दबाजी नहीं है!',
    english: 'Tap any card to start the game. Take your time!',
  });

  // Adaptive difficulty recommendation
  const [adaptiveResult, setAdaptiveResult] = useState(null);

  // Past results saved in localStorage
  const [pastGames, setPastGames] = useState(() => {
    try {
      const saved = localStorage.getItem('yaadsaathi_memory_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Timer runner
  useEffect(() => {
    if (isTimerRunning && !isWon) {
      timerIntervalRef.current = setInterval(() => {
        setTotalSeconds((sec) => sec + 1);
      }, 1000);
    } else {
      clearInterval(timerIntervalRef.current);
    }
    return () => clearInterval(timerIntervalRef.current);
  }, [isTimerRunning, isWon]);

  // Format seconds to mm:ss
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Compute metrics
  const matchesCount = matchedIds.length;
  const accuracyPercent = attempts > 0 ? Math.round((matchesCount / attempts) * 100) : 100;
  const avgResponseTime =
    responseTimes.length > 0
      ? (responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length).toFixed(1)
      : '0.0';

  // Initialize and shuffle 6 pairs
  const initializeGame = () => {
    clearInterval(timerIntervalRef.current);

    // Pick exactly 6 pairs
    const selectedCatalog = MEMORY_CARDS_CATALOG.slice(0, PAIR_COUNT);
    const deck = [...selectedCatalog, ...selectedCatalog].map((card, idx) => ({
      ...card,
      uniqueId: `${card.id}-${idx}-${Math.random().toString(36).slice(2, 7)}`,
    }));

    // Fisher-Yates shuffle
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    setCards(deck);
    setFlippedIndices([]);
    setMatchedIds([]);
    setAttempts(0);
    setTotalSeconds(0);
    setIsTimerRunning(false);
    setResponseTimes([]);
    setIsProcessing(false);
    setIsWon(false);
    setAdaptiveResult(null);
    lastTapTimeRef.current = null;

    setFeedback({
      type: 'neutral',
      hindi: 'कार्ड्स छुपा दिए गए हैं। किसी भी कार्ड को छूकर शुरुआत करें!',
      english: 'Cards are hidden. Tap any card to begin!',
    });
  };

  useEffect(() => {
    initializeGame();
    return () => clearInterval(timerIntervalRef.current);
  }, []);

  // Handle Card Tap
  const handleCardTap = (index) => {
    if (isProcessing || flippedIndices.includes(index) || isWon) return;
    const clickedCard = cards[index];
    if (matchedIds.includes(clickedCard.id)) return;

    // Start timer on first tap
    if (!isTimerRunning) {
      setIsTimerRunning(true);
    }

    // Measure response time
    const now = Date.now();
    if (lastTapTimeRef.current) {
      const deltaSec = (now - lastTapTimeRef.current) / 1000;
      const cappedDelta = Math.min(deltaSec, 15);
      setResponseTimes((prev) => [...prev, cappedDelta]);
    }
    lastTapTimeRef.current = now;

    sounds.playClickChime();

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    // Case 1: First card flipped
    if (newFlipped.length === 1) {
      setFeedback({
        type: 'picking',
        hindi: `आपने "${clickedCard.nameHindi}" चुना। अब इसका साथी ढूंढें!`,
        english: `You selected "${clickedCard.nameEnglish}". Now find its matching pair!`,
      });
      voice.speak(
        `${clickedCard.nameHindi}। अब इसका दूसरा कार्ड ढूंढें।`,
        `${clickedCard.nameEnglish}. Now find its matching card.`
      );
      return;
    }

    // Case 2: Second card flipped -> Compare
    if (newFlipped.length === 2) {
      setIsProcessing(true);
      const firstIndex = newFlipped[0];
      const secondIndex = newFlipped[1];
      const firstCard = cards[firstIndex];
      const secondCard = cards[secondIndex];

      setAttempts((prev) => prev + 1);

      if (firstCard.id === secondCard.id) {
        // MATCH FOUND!
        sounds.playSuccessChime();
        const nextMatches = [...matchedIds, firstCard.id];
        setMatchedIds(nextMatches);
        setFlippedIndices([]);
        setIsProcessing(false);

        const isGameComplete = nextMatches.length === PAIR_COUNT;

        if (isGameComplete) {
          // Game Won!
          setIsWon(true);
          setIsTimerRunning(false);

          confetti({
            particleCount: 90,
            spread: 75,
            origin: { y: 0.6 },
          });

          const finalAttempts = attempts + 1;
          const finalAccuracy = Math.round((PAIR_COUNT / finalAttempts) * 100);
          const finalTimeSec = totalSeconds;
          const finalAvgResp =
            responseTimes.length > 0
              ? Number((responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length).toFixed(1))
              : 2.5;

          // Adaptive Difficulty Engine
          const adaptive = calculateAdaptiveDifficulty({
            accuracy: finalAccuracy,
            averageResponseTime: finalAvgResp,
            currentDifficulty: cognitiveDifficulty,
          });
          setAdaptiveResult(adaptive);
          setCognitiveDifficulty(adaptive.nextDifficulty);

          // Save game result to localStorage
          const gameResult = {
            id: `game-${Date.now()}`,
            date: new Date().toLocaleDateString('hi-IN', {
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit',
            }),
            attempts: finalAttempts,
            matches: PAIR_COUNT,
            accuracy: finalAccuracy,
            totalSeconds: finalTimeSec,
            formattedTime: formatTime(finalTimeSec),
            avgResponseTime: String(finalAvgResp),
            difficultyPlayed: cognitiveDifficulty,
            nextDifficulty: adaptive.nextDifficulty,
            adaptiveReason: adaptive.reason,
            adaptiveReasonHindi: adaptive.reasonHindi,
          };

          try {
            const currentHistory = JSON.parse(
              localStorage.getItem('yaadsaathi_memory_history') || '[]'
            );
            const updatedHistory = [gameResult, ...currentHistory.slice(0, 9)];
            localStorage.setItem('yaadsaathi_memory_history', JSON.stringify(updatedHistory));
            setPastGames(updatedHistory);
          } catch (e) {
            console.warn('Could not save game history:', e);
          }

          setGameScores((prev) => ({
            ...prev,
            memoryMatchWins: (prev.memoryMatchWins || 0) + 1,
            totalStars: (prev.totalStars || 20) + 2,
          }));

          setFeedback({
            type: 'won',
            hindi: `अद्भुत! आपने सभी 6 जोड़ियां सफलतापूर्वक ढूंढ ली हैं! बधाई हो!`,
            english: `Wonderful! You successfully matched all 6 pairs! Congratulations!`,
          });

          voice.speak(
            `अद्भुत दामोदर जी! आपने सभी 6 जोड़ियां सफलतापूर्वक पूरी कर ली हैं! बधाई हो!`,
            `Splendid! You have successfully matched all 6 pairs! Congratulations!`
          );
        } else {
          // Individual match
          setFeedback({
            type: 'matched',
            hindi: `वाह! बहुत सुंदर! ${firstCard.nameHindi} की सही जोड़ी मिल गई! 🌟`,
            english: `Splendid! You found the matching pair of ${firstCard.nameEnglish}!`,
          });

          voice.speak(
            `वाह! ${firstCard.nameHindi} की जोड़ी मिल गई!`,
            `Great! You matched ${firstCard.nameEnglish}!`
          );
        }
      } else {
        // MISMATCH -> Gentle feedback, hide after short delay
        sounds.playEncouragementChime();

        setFeedback({
          type: 'mismatch',
          hindi: `कोई बात नहीं! दोनों चित्रों को मन में याद रखें, और फिर प्रयास करें 🌸`,
          english: `No worries! Keep both cards in mind and try again!`,
        });

        setTimeout(() => {
          setFlippedIndices([]);
          setIsProcessing(false);
        }, 1250);
      }
    }
  };

  const handleListenRules = () => {
    sounds.playClickChime();
    voice.speak(
      'इन तस्वीरों में एक जैसी तस्वीर ढूंढिए। किसी भी दो कार्ड्स को छूकर खोलें। अगर दोनों एक जैसे हैं, तो वे खुले रहेंगे। 6 जोड़ियां खोजें।',
      'Find matching pairs in these picture cards. Tap any two cards. If they match, they will stay open. Find all six pairs.'
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

      {/* 1. Header with Pink Theme Accent */}
      <div className="bg-[#FFE8EF] rounded-[2.5rem] p-6 sm:p-8 border-3 border-[#E84D78]/40 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1 flex-wrap">
            <span className="text-4xl">🌸</span>
            <h1 className="text-3xl sm:text-5xl font-black text-[#102A43]">
              स्मृति मिलान खेल
            </h1>
            <span className="px-3.5 py-1 bg-white border-2 border-[#E84D78]/30 rounded-full font-black text-xs sm:text-sm text-[#E84D78]">
              {DIFFICULTY_LABELS[cognitiveDifficulty]?.hi || `स्तर ${cognitiveDifficulty}`}
            </span>
          </div>
          <p className="text-xl sm:text-2xl font-black text-[#E84D78]">
            "इन तस्वीरों में एक जैसी तस्वीर ढूंढिए"
          </p>
          <p className="text-base sm:text-lg font-bold text-[#5D7184] mt-0.5">
            Find matching pairs in these picture cards • Memory & Visual Recall
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          <button
            onClick={handleListenRules}
            className="tactile-btn flex items-center gap-2 px-5 py-3 rounded-2xl bg-white hover:bg-[#FFE8EF] border-2 border-[#E84D78] text-[#E84D78] font-black text-lg min-h-[52px] cursor-pointer shadow-xs"
          >
            <Volume2 className="w-6 h-6 animate-pulse" />
            <span>🔊 नियम सुनें (Listen Rules)</span>
          </button>

          <button
            onClick={initializeGame}
            className="tactile-btn flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#E84D78] hover:bg-[#D43B66] border-2 border-[#B82B53] text-white font-black text-lg min-h-[52px] cursor-pointer shadow-sm"
          >
            <RotateCcw className="w-6 h-6 stroke-[2.5]" />
            <span>नया खेल (Restart)</span>
          </button>
        </div>
      </div>

      {/* 2. Pre-game Clear Instructions Banner */}
      <div className="bg-white border-2 border-[#E84D78]/30 rounded-3xl p-5 sm:p-6 flex items-start gap-4 text-left shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-[#FFE8EF] flex items-center justify-center shrink-0 text-2xl text-[#E84D78]">
          💡
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#102A43]">
            खेलने का सरल तरीका (Simple Rules):
          </h2>
          <p className="text-base sm:text-xl font-bold text-[#5D7184] mt-1">
            1. किसी भी दो कार्ड्स को छूकर खोलें।
          </p>
          <p className="text-base sm:text-xl font-bold text-[#5D7184]">
            2. यदि दोनों चित्र एक जैसे हैं, तो वे खुले रहेंगे और आपको अंक मिलेंगे।
          </p>
          <p className="text-base sm:text-xl font-bold text-[#5D7184]">
            3. यदि वे अलग हैं, तो वे छिप जाएंगे। कोई जल्दबाजी नहीं, शांति से खेलें!
          </p>
        </div>
      </div>

      {/* 3. Live Telemetry Tracker (High contrast pastel cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
        {/* Matches */}
        <div className="bg-[#FFE8EF]/60 rounded-3xl p-4 border-2 border-[#E84D78]/30 text-center">
          <span className="text-xs sm:text-sm font-bold text-[#5D7184] block">
            जोड़ियां (Matches)
          </span>
          <span className="text-3xl sm:text-4xl font-black text-[#E84D78] block mt-0.5">
            {matchesCount} / {PAIR_COUNT}
          </span>
          <span className="text-xs font-bold text-[#E84D78]">सफल मिलान</span>
        </div>

        {/* Attempts */}
        <div className="bg-white rounded-3xl p-4 border-2 border-[#DFF3E7] text-center">
          <span className="text-xs sm:text-sm font-bold text-[#5D7184] block">
            कुल प्रयास (Attempts)
          </span>
          <span className="text-3xl sm:text-4xl font-black text-[#102A43] block mt-0.5">
            {attempts}
          </span>
          <span className="text-xs font-semibold text-[#5D7184]">बार खोले</span>
        </div>

        {/* Accuracy */}
        <div className="bg-[#EAF7EF] rounded-3xl p-4 border-2 border-[#167A55]/30 text-center">
          <span className="text-xs sm:text-sm font-bold text-[#5D7184] block">
            सटीकता (Accuracy)
          </span>
          <span className="text-3xl sm:text-4xl font-black text-[#167A55] block mt-0.5">
            {accuracyPercent}%
          </span>
          <span className="text-xs font-bold text-[#167A55]">शुद्धता दर</span>
        </div>

        {/* Total Time */}
        <div className="bg-white rounded-3xl p-4 border-2 border-[#DFF3E7] text-center">
          <span className="text-xs sm:text-sm font-bold text-[#5D7184] block">
            कुल समय (Time)
          </span>
          <span className="text-3xl sm:text-4xl font-mono font-black text-[#102A43] block mt-0.5">
            {formatTime(totalSeconds)}
          </span>
          <span className="text-xs font-semibold text-[#5D7184]">मिनट : सेकंड</span>
        </div>

        {/* Response Time */}
        <div className="bg-[#FFF0D7] rounded-3xl p-4 border-2 border-[#E98A20]/30 text-center col-span-2 sm:col-span-1">
          <span className="text-xs sm:text-sm font-bold text-[#5D7184] block">
            प्रतिक्रिया गति (Speed)
          </span>
          <span className="text-3xl sm:text-4xl font-mono font-black text-[#E98A20] block mt-0.5">
            {avgResponseTime}s
          </span>
          <span className="text-xs font-bold text-[#E98A20]">औसत प्रति चाल</span>
        </div>
      </div>

      {/* 4. Encouraging Feedback Banner */}
      <div
        className={`p-4 sm:p-6 rounded-3xl border-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm transition-all ${
          feedback.type === 'matched'
            ? 'bg-[#EAF7EF] border-[#167A55] text-[#167A55]'
            : feedback.type === 'mismatch'
            ? 'bg-[#FFF0D7] border-[#E98A20] text-[#102A43]'
            : feedback.type === 'won'
            ? 'bg-[#FFE8EF] border-[#E84D78] text-[#E84D78]'
            : feedback.type === 'picking'
            ? 'bg-[#E6F1FF] border-[#2879D0] text-[#102A43]'
            : 'bg-white border-[#DFF3E7] text-[#102A43]'
        }`}
      >
        <div className="flex items-center gap-3.5">
          <span className="text-4xl">
            {feedback.type === 'matched'
              ? '🌟'
              : feedback.type === 'mismatch'
              ? '🌸'
              : feedback.type === 'won'
              ? '🏆'
              : feedback.type === 'picking'
              ? '🔍'
              : '🌸'}
          </span>
          <div>
            <p className="text-2xl sm:text-3xl font-black leading-snug">
              {feedback.hindi}
            </p>
            <p className="text-base sm:text-lg font-bold opacity-80 mt-0.5">
              {feedback.english}
            </p>
          </div>
        </div>

        <VoiceButton
          textHindi={feedback.hindi}
          textEnglish={feedback.english}
          size="sm"
          label=""
          className="self-end sm:self-center shrink-0"
        />
      </div>

      {/* 5. End Celebration & Final Scorecard Modal */}
      {isWon && (
        <div className="bg-[#FFE8EF] border-4 border-[#E84D78] rounded-[2.5rem] p-6 sm:p-10 text-center shadow-xl animate-slow-fade">
          <div className="inline-block p-4 bg-white rounded-full mb-3 text-5xl sm:text-6xl shadow-sm">
            🏆
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-[#102A43]">
            बधाई हो दामोदर जी! खेल संपन्न हुआ!
          </h2>
          <p className="mt-2 text-xl sm:text-2xl font-black text-[#E84D78]">
            Congratulations! All 6 matching pairs found!
          </p>

          {/* Star Rating */}
          <div className="my-5 flex items-center justify-center gap-3 text-4xl sm:text-5xl text-amber-500">
            <span>⭐</span>
            <span>⭐</span>
            <span>⭐</span>
          </div>

          {/* Final Scorecard Grid */}
          <div className="max-w-xl mx-auto my-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
            <div className="bg-white p-3.5 rounded-2xl border-2 border-[#FFE8EF]">
              <span className="text-xs font-bold text-[#5D7184] block">कुल समय</span>
              <span className="text-2xl font-mono font-black text-[#102A43] block">
                {formatTime(totalSeconds)}
              </span>
            </div>
            <div className="bg-white p-3.5 rounded-2xl border-2 border-[#FFE8EF]">
              <span className="text-xs font-bold text-[#5D7184] block">प्रयास</span>
              <span className="text-2xl font-black text-[#102A43] block">{attempts} बार</span>
            </div>
            <div className="bg-white p-3.5 rounded-2xl border-2 border-[#FFE8EF]">
              <span className="text-xs font-bold text-[#5D7184] block">सटीकता</span>
              <span className="text-2xl font-black text-[#167A55] block">
                {accuracyPercent}%
              </span>
            </div>
            <div className="bg-white p-3.5 rounded-2xl border-2 border-[#FFE8EF]">
              <span className="text-xs font-bold text-[#5D7184] block">औसत गति</span>
              <span className="text-2xl font-mono font-black text-[#E98A20] block">
                {avgResponseTime}s
              </span>
            </div>
          </div>

          {/* Adaptive Difficulty Engine Recommendation Card */}
          {adaptiveResult && (
            <div className="max-w-xl mx-auto my-6 p-5 sm:p-6 rounded-3xl bg-white border-3 border-[#E84D78]/30 shadow-sm text-left">
              <div className="flex items-center justify-between gap-2 flex-wrap pb-3 border-b-2 border-[#FFE8EF]">
                <div className="flex items-center gap-2.5">
                  <span className="text-3xl">🧠</span>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-[#102A43] leading-tight">
                      अनुकूली कठिनाई प्रणाली (Adaptive Engine)
                    </h3>
                    <p className="text-xs text-[#5D7184] font-bold">
                      स्मृति व गति के आधार पर स्वतः समायोजन
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1.5 rounded-xl font-black text-sm border-2 bg-[#FFE8EF] border-[#E84D78] text-[#E84D78]">
                  अगला स्तर: {adaptiveResult.nextDifficulty} / 5
                </span>
              </div>

              <div className="mt-4 space-y-1">
                <p className="text-xl sm:text-2xl font-black text-[#102A43] leading-snug">
                  "{adaptiveResult.reasonHindi}"
                </p>
                <p className="text-base sm:text-lg font-bold text-[#5D7184]">
                  "{adaptiveResult.reason}"
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                <span className="text-xs sm:text-sm font-bold text-[#5D7184]">
                  सटीकता: {accuracyPercent}% • प्रतिक्रिया: {avgResponseTime}s
                </span>
                <VoiceButton
                  textHindi={adaptiveResult.reasonHindi}
                  textEnglish={adaptiveResult.reason}
                  size="sm"
                  label="सिफारिश सुनें"
                />
              </div>
            </div>
          )}

          <p className="text-sm font-semibold text-[#167A55] mb-6">
            ✓ यह परिणाम आपकी प्रगति (localStorage) में सुरक्षित कर लिया गया है।
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={initializeGame}
              className="tactile-btn px-8 py-4 sm:py-5 rounded-2xl bg-[#E84D78] hover:bg-[#D43B66] border-2 border-[#B82B53] text-white font-black text-xl sm:text-2xl flex items-center gap-3 shadow-lg cursor-pointer"
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

      {/* 6. 12 Cards Grid (Pink Theme Card Back with Floral Memory Motif) */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-5 max-w-4xl mx-auto pt-2">
        {cards.map((card, idx) => {
          const isFlipped = flippedIndices.includes(idx);
          const isMatched = matchedIds.includes(card.id);
          const isOpen = isFlipped || isMatched;

          return (
            <div
              key={card.uniqueId}
              onClick={() => handleCardTap(idx)}
              className="h-36 sm:h-44 perspective-1000 cursor-pointer select-none"
              aria-label={isOpen ? card.nameHindi : 'छिपा हुआ कार्ड'}
            >
              <div
                className={`relative w-full h-full duration-300 transform-style-3d rounded-3xl tactile-btn ${
                  isOpen ? 'rotate-y-180' : ''
                }`}
              >
                {/* Back of Card (Face Down) - Warm Rose Pink with Lotus / Leaf Motif */}
                <div
                  className={`absolute inset-0 backface-hidden rounded-3xl border-4 border-[#E84D78] bg-gradient-to-br from-[#E84D78] to-[#C9335E] flex flex-col items-center justify-center shadow-md p-2 hover:brightness-105 ${
                    isProcessing ? 'pointer-events-none' : ''
                  }`}
                >
                  <span className="text-4xl sm:text-5xl opacity-90 drop-shadow">🌸</span>
                  <span className="mt-1 text-sm sm:text-base font-black text-white uppercase tracking-wider">
                    यादसाथी
                  </span>
                  <span className="text-xs font-bold text-pink-100">छूकर खोलें</span>
                </div>

                {/* Front of Card (Face Up / Revealed) - Soft Pastel Ivory/Pink */}
                <div
                  className={`absolute inset-0 backface-hidden rotate-y-180 rounded-3xl border-4 flex flex-col items-center justify-center p-2 sm:p-3 shadow-md ${
                    isMatched
                      ? 'bg-[#EAF7EF] border-[#167A55] text-[#167A55] ring-4 ring-[#DFF3E7]'
                      : 'bg-white border-[#E84D78]/40 text-[#102A43]'
                  }`}
                >
                  <span className="text-5xl sm:text-6xl filter drop-shadow-sm">
                    {card.emoji}
                  </span>
                  <p className="mt-1 text-base sm:text-xl font-black text-center leading-tight">
                    {card.nameHindi}
                  </p>
                  <p className="text-xs sm:text-sm font-bold text-[#5D7184] text-center">
                    {card.nameEnglish}
                  </p>

                  {isMatched && (
                    <div className="absolute top-2 right-2 text-[#167A55] bg-white rounded-full p-1 shadow-sm">
                      <CheckCircle2 className="w-5 h-5 fill-[#DFF3E7]" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 7. Past Game History (Loaded from localStorage) */}
      {pastGames.length > 0 && (
        <div className="mt-8 bg-white rounded-3xl p-5 sm:p-6 border-2 border-[#DFF3E7] shadow-xs">
          <div className="flex items-center gap-2.5 mb-3">
            <History className="w-6 h-6 text-[#E84D78]" />
            <h2 className="text-xl sm:text-2xl font-black text-[#102A43]">
              पिछली खेल प्रगति (Past Game Results):
            </h2>
          </div>

          <div className="space-y-2.5">
            {pastGames.slice(0, 3).map((g) => (
              <div
                key={g.id}
                className="p-3.5 rounded-2xl bg-[#FBFAF4] border border-[#DFF3E7] flex flex-wrap items-center justify-between gap-2 text-sm sm:text-base font-bold text-[#102A43]"
              >
                <span>📅 {g.date}</span>
                <span>⏱️ समय: {g.formattedTime}</span>
                <span>🎯 प्रयास: {g.attempts}</span>
                <span className="text-[#167A55] font-black">
                  📊 सटीकता: {g.accuracy}%
                </span>
                <span className="text-[#E98A20] font-black">⚡ गति: {g.avgResponseTime}s</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

