import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Volume2, Eye, CheckCircle2, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useI18n } from '../i18n/I18nContext';
import { PATTERN_BELLS } from '../data/mockData';
import GameTopBar from '../components/games/GameTopBar';
import AdaptiveDifficultyCard from '../components/games/AdaptiveDifficultyCard';
import GameCompletionActions from '../components/games/GameCompletionActions';
import { DIFFICULTY_LABELS } from '../logic/adaptiveEngine';

const THEME = { bg: '#E6F1FF', border: '#2879D0', text: '#2879D0', btnBg: '#2879D0', btnHover: '#1C60AB', btnBorder: '#154E8D' };

export default function PatternRecognition() {
  const { navigateTo, sounds, voice, cognitiveDifficulty, recordGameResult } = useApp();
  const { t, isHindi } = useI18n();

  const [sequence, setSequence] = useState([]);
  const [playerIndex, setPlayerIndex] = useState(0);
  const [activeBellId, setActiveBellId] = useState(null);
  const [gameState, setGameState] = useState('idle'); // 'idle', 'playing-demo', 'player-turn', 'round-won', 'success'
  const [round, setRound] = useState(1);
  const maxRounds = 4;

  // Telemetry
  const [correctTaps, setCorrectTaps] = useState(0);
  const [totalTaps, setTotalTaps] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [responseTimes, setResponseTimes] = useState([]);
  const [adaptiveResult, setAdaptiveResult] = useState(null);
  const lastTapTimeRef = useRef(null);
  const timerIntervalRef = useRef(null);
  const timeoutsRef = useRef([]);

  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach((tm) => clearTimeout(tm));
    timeoutsRef.current = [];
  };

  useEffect(() => {
    if (isTimerRunning && gameState !== 'success') {
      timerIntervalRef.current = setInterval(() => setTotalSeconds((s) => s + 1), 1000);
    } else {
      clearInterval(timerIntervalRef.current);
    }
    return () => clearInterval(timerIntervalRef.current);
  }, [isTimerRunning, gameState]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const accuracyPercent = totalTaps > 0 ? Math.round((correctTaps / totalTaps) * 100) : 100;
  const avgResponseTime =
    responseTimes.length > 0
      ? (responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length).toFixed(1)
      : '0.0';

  const startNewGame = () => {
    clearAllTimeouts();
    setRound(1);
    setCorrectTaps(0);
    setTotalTaps(0);
    setTotalSeconds(0);
    setIsTimerRunning(false);
    setResponseTimes([]);
    setAdaptiveResult(null);
    lastTapTimeRef.current = null;
    generateNextRound(1);
  };

  const generateNextRound = (currentRound) => {
    clearAllTimeouts();
    setPlayerIndex(0);
    setGameState('playing-demo');

    const stepCount = currentRound + 1;
    const newSeq = [];
    for (let i = 0; i < stepCount; i++) {
      newSeq.push(Math.floor(Math.random() * 4));
    }
    setSequence(newSeq);

    const startTimer = setTimeout(() => playSequenceDemo(newSeq), 700);
    timeoutsRef.current.push(startTimer);
  };

  const playSequenceDemo = (seqToPlay) => {
    setGameState('playing-demo');
    let delay = 300;

    seqToPlay.forEach((bellId, index) => {
      const timer = setTimeout(() => {
        highlightBell(bellId);
        if (index === seqToPlay.length - 1) {
          const endTimer = setTimeout(() => {
            setGameState('player-turn');
            lastTapTimeRef.current = Date.now();
            voice.speak(t('patternTurnSpeech'), t('patternTurnSpeech'));
          }, 800);
          timeoutsRef.current.push(endTimer);
        }
      }, delay);
      timeoutsRef.current.push(timer);
      delay += 950; // Relaxed elderly timing
    });
  };

  const highlightBell = (bellId) => {
    const bell = PATTERN_BELLS[bellId];
    if (bell) {
      sounds.playBellSound(bell.frequency);
      setActiveBellId(bellId);
      const offTimer = setTimeout(() => setActiveBellId(null), 550);
      timeoutsRef.current.push(offTimer);
    }
  };

  const handleBellTap = (bellId) => {
    if (gameState !== 'player-turn') return;

    if (!isTimerRunning) setIsTimerRunning(true);

    const now = Date.now();
    if (lastTapTimeRef.current) {
      const deltaSec = Math.min((now - lastTapTimeRef.current) / 1000, 15);
      setResponseTimes((prev) => [...prev, deltaSec]);
    }
    lastTapTimeRef.current = now;

    highlightBell(bellId);
    setTotalTaps((prev) => prev + 1);

    if (bellId === sequence[playerIndex]) {
      setCorrectTaps((prev) => prev + 1);
      const nextIndex = playerIndex + 1;
      setPlayerIndex(nextIndex);

      if (nextIndex === sequence.length) {
        sounds.playSuccessChime();
        if (round < maxRounds) {
          setGameState('round-won');
          voice.speak(t('patternNextRoundSpeech'), t('patternNextRoundSpeech'));
          const nextRoundTimer = setTimeout(() => {
            const nextRound = round + 1;
            setRound(nextRound);
            generateNextRound(nextRound);
          }, 1500);
          timeoutsRef.current.push(nextRoundTimer);
        } else {
          // Final round won!
          setGameState('success');
          setIsTimerRunning(false);
          confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });

          const finalAccuracy = Math.round(((correctTaps + 1) / (totalTaps + 1)) * 100);
          const finalAvgResp =
            responseTimes.length > 0
              ? Number((responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length).toFixed(1))
              : 2.5;

          const adaptive = recordGameResult({
            game: 'patternRecognition',
            accuracy: finalAccuracy,
            averageResponseTime: finalAvgResp,
            starsEarned: 2,
            scoreUpdater: (prev) => ({ patternStreak: Math.max(prev.patternStreak || 1, maxRounds) }),
          });
          setAdaptiveResult(adaptive);

          voice.speak(
            t('patternCompleteSpeech'),
            t('patternCompleteSpeech')
          );
        }
      }
    } else {
      // Gentle assistance - elder didn't match
      sounds.playEncouragementChime();
      voice.speak(t('patternMistakeSpeech'), t('patternMistakeSpeech'));
      setGameState('playing-demo');
      setPlayerIndex(0);
      const retryTimer = setTimeout(() => playSequenceDemo(sequence), 1200);
      timeoutsRef.current.push(retryTimer);
    }
  };

  const handleListenRules = () => {
    sounds.playClickChime();
    voice.speak(t('patternRulesSpeech'), t('patternRulesSpeech'));
  };

  useEffect(() => {
    startNewGame();
    return () => clearAllTimeouts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6 pb-12 animate-fade-in text-left">
      <GameTopBar
        icon="🔔"
        title={t('patternPageTitle')}
        tagline={t('patternTagline')}
        subtitle={t('patternSubtitle')}
        theme={THEME}
        onBack={() => navigateTo('games')}
        onListenRules={handleListenRules}
        onRestart={startNewGame}
      />

      <div className="flex justify-end -mt-3">
        <span className="px-3.5 py-1 bg-white border-2 border-[#2879D0]/30 rounded-full font-black text-xs sm:text-sm text-[#2879D0]">
          {isHindi ? DIFFICULTY_LABELS[cognitiveDifficulty]?.hi : DIFFICULTY_LABELS[cognitiveDifficulty]?.en}
        </span>
      </div>

      {/* Round & Guidance + Live Telemetry */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-[#DFF3E7] shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xl font-black text-[#102A43]">
            {t('roundLabel')}: <strong className="text-3xl text-[#2879D0]">{round}</strong> / {maxRounds}
          </span>
          <span className="text-base font-bold text-[#5D7184]">{t('patternMelodyCount', { count: sequence.length })}</span>
        </div>

        <div className="flex items-center gap-2" role="status" aria-live="polite">
          {gameState === 'playing-demo' ? (
            <div className="flex items-center gap-2 px-5 py-2.5 bg-[#FFF0D7] border-2 border-[#E98A20] rounded-2xl text-[#102A43] font-black text-base">
              <Eye className="w-5 h-5 text-[#E98A20]" aria-hidden="true" />
              <span>{t('patternWatchListen')}</span>
            </div>
          ) : gameState === 'player-turn' ? (
            <div className="flex items-center gap-2 px-5 py-2.5 bg-[#EAF7EF] border-2 border-[#167A55] rounded-2xl text-[#167A55] font-black text-base">
              <Sparkles className="w-5 h-5 text-[#167A55]" aria-hidden="true" />
              <span>{t('patternYourTurn')}</span>
            </div>
          ) : gameState === 'round-won' ? (
            <div className="flex items-center gap-2 px-5 py-2.5 bg-[#E6F1FF] border-2 border-[#2879D0] rounded-2xl text-[#2879D0] font-black text-base">
              <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
              <span>{t('patternRoundWon')}</span>
            </div>
          ) : (
            <div className="text-base font-bold text-[#5D7184]">{t('readyLabel')}</div>
          )}
        </div>

        {gameState === 'player-turn' && (
          <button
            onClick={() => {
              setGameState('playing-demo');
              setPlayerIndex(0);
              playSequenceDemo(sequence);
            }}
            className="tactile-btn px-4 py-2 bg-[#FBFAF4] hover:bg-[#EAF7EF] border-2 border-[#DFF3E7] rounded-2xl text-[#102A43] font-bold text-sm flex items-center gap-1.5 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            <Volume2 className="w-4 h-4 text-[#E98A20]" aria-hidden="true" />
            <span>{t('patternRepeatAudio')}</span>
          </button>
        )}
      </div>

      {/* Live Stats */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-[#EAF7EF] rounded-3xl p-4 border-2 border-[#167A55]/30 text-center">
          <span className="text-xs sm:text-sm font-bold text-[#5D7184] block">{t('accuracyLabel')}</span>
          <span className="text-2xl sm:text-3xl font-black text-[#167A55] block mt-0.5">{accuracyPercent}%</span>
        </div>
        <div className="bg-white rounded-3xl p-4 border-2 border-[#DFF3E7] text-center">
          <span className="text-xs sm:text-sm font-bold text-[#5D7184] block">{t('totalTimeLabel')}</span>
          <span className="text-2xl sm:text-3xl font-mono font-black text-[#102A43] block mt-0.5">{formatTime(totalSeconds)}</span>
        </div>
        <div className="bg-[#FFF0D7] rounded-3xl p-4 border-2 border-[#E98A20]/30 text-center">
          <span className="text-xs sm:text-sm font-bold text-[#5D7184] block">{t('speedLabel')}</span>
          <span className="text-2xl sm:text-3xl font-mono font-black text-[#E98A20] block mt-0.5">{avgResponseTime}s</span>
        </div>
      </div>

      {/* FINAL WIN CARD */}
      {gameState === 'success' && (
        <div className="bg-[#E6F1FF] border-4 border-[#2879D0] rounded-[2.5rem] p-6 sm:p-10 text-center shadow-xl animate-slow-fade">
          <span className="text-6xl inline-block mb-3" aria-hidden="true">🌟</span>
          <h2 className="text-3xl sm:text-5xl font-black text-[#102A43]">{t('patternCompleteTitle')}</h2>
          <p className="mt-2 text-xl sm:text-2xl font-black text-[#2879D0]">{t('patternCompleteSub')}</p>

          <AdaptiveDifficultyCard adaptiveResult={adaptiveResult} accuracyPercent={accuracyPercent} avgResponseTime={avgResponseTime} />

          <p className="text-sm font-semibold text-[#167A55] mb-6">✓ {t('resultsSavedNote')}</p>

          <div className="mt-2">
            <GameCompletionActions onPlayAgain={startNewGame} onOtherGames={() => navigateTo('games')} theme={THEME} />
          </div>
        </div>
      )}

      {/* 4 Large Sensory Bell Buttons */}
      <div className="grid grid-cols-2 gap-4 sm:gap-8 max-w-xl mx-auto pt-2">
        {PATTERN_BELLS.map((bell) => {
          const isActive = activeBellId === bell.id;
          const bellName = isHindi ? bell.nameHindi : bell.nameEnglish;

          return (
            <button
              key={bell.id}
              onClick={() => handleBellTap(bell.id)}
              disabled={gameState === 'playing-demo'}
              aria-label={bellName}
              className={`tactile-btn relative h-40 sm:h-52 rounded-3xl border-4 flex flex-col items-center justify-center p-4 transition-all duration-200 select-none cursor-pointer focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[#102A43] ${
                isActive ? `${bell.activeColor} scale-105 active-glow z-10` : bell.color
              } ${gameState === 'playing-demo' ? 'cursor-not-allowed opacity-90' : ''}`}
            >
              <span className="text-5xl sm:text-7xl mb-2 filter drop-shadow" aria-hidden="true">{bell.emoji}</span>
              <span className="text-2xl sm:text-3xl font-black tracking-wide">{bellName}</span>

              {isActive && (
                <div className="absolute inset-0 rounded-3xl border-4 border-white animate-ping opacity-60 pointer-events-none" aria-hidden="true" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
