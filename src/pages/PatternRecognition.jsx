import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  RotateCcw,
  Volume2,
  Trophy,
  Play,
  Sparkles,
  HelpCircle,
  Eye,
  CheckCircle2,
  ArrowLeft,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PATTERN_BELLS } from '../data/mockData';
import VoiceButton from '../components/VoiceButton';

export default function PatternRecognition() {
  const { navigateTo, sounds, voice, gameScores, setGameScores } = useApp();

  const [sequence, setSequence] = useState([]);
  const [playerIndex, setPlayerIndex] = useState(0);
  const [activeBellId, setActiveBellId] = useState(null);
  const [gameState, setGameState] = useState('idle'); // 'idle', 'playing-demo', 'player-turn', 'success', 'round-won'
  const [round, setRound] = useState(1);
  const maxRounds = 4;

  const timeoutsRef = useRef([]);

  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach((t) => clearTimeout(t));
    timeoutsRef.current = [];
  };

  // Start new game
  const startNewGame = () => {
    clearAllTimeouts();
    setRound(1);
    generateNextRound(1);
  };

  // Generate sequence for given round (e.g. round 1 = 2 steps, round 2 = 3 steps)
  const generateNextRound = (currentRound) => {
    clearAllTimeouts();
    setPlayerIndex(0);
    setGameState('playing-demo');

    // Number of steps: round 1 has 2 steps, round 2 has 3 steps, round 3 has 4 steps
    const stepCount = currentRound + 1;
    const newSeq = [];
    for (let i = 0; i < stepCount; i++) {
      newSeq.push(Math.floor(Math.random() * 4));
    }
    setSequence(newSeq);

    // Play demo after a short moment
    const startTimer = setTimeout(() => {
      playSequenceDemo(newSeq);
    }, 700);
    timeoutsRef.current.push(startTimer);
  };

  // Playback sequence to senior
  const playSequenceDemo = (seqToPlay) => {
    setGameState('playing-demo');
    let delay = 300;

    seqToPlay.forEach((bellId, index) => {
      const timer = setTimeout(() => {
        highlightBell(bellId);
        if (index === seqToPlay.length - 1) {
          // Finished playing sequence
          const endTimer = setTimeout(() => {
            setGameState('player-turn');
            voice.speak(
              'अब आपकी बारी है। उसी क्रम में रंगीन घंटियों को दबाएं।',
              'Now your turn. Tap the colored bells in the same order.'
            );
          }, 800);
          timeoutsRef.current.push(endTimer);
        }
      }, delay);
      timeoutsRef.current.push(timer);
      delay += 950; // Relaxed elderly timing
    });
  };

  // Highlight and ring a bell
  const highlightBell = (bellId) => {
    const bell = PATTERN_BELLS[bellId];
    if (bell) {
      sounds.playBellSound(bell.frequency);
      setActiveBellId(bellId);
      const offTimer = setTimeout(() => {
        setActiveBellId(null);
      }, 550);
      timeoutsRef.current.push(offTimer);
    }
  };

  // Senior taps a bell
  const handleBellTap = (bellId) => {
    if (gameState !== 'player-turn') return;

    highlightBell(bellId);

    // Check if correct
    if (bellId === sequence[playerIndex]) {
      const nextIndex = playerIndex + 1;
      setPlayerIndex(nextIndex);

      if (nextIndex === sequence.length) {
        // Round completed successfully!
        sounds.playSuccessChime();
        if (round < maxRounds) {
          setGameState('round-won');
          voice.speak('बहुत बढ़िया! अगला चक्र शुरू हो रहा है।', 'Very good! Moving to the next round.');
          const nextRoundTimer = setTimeout(() => {
            const nextRound = round + 1;
            setRound(nextRound);
            generateNextRound(nextRound);
          }, 1500);
          timeoutsRef.current.push(nextRoundTimer);
        } else {
          // Final game won!
          setGameState('success');
          confetti({
            particleCount: 90,
            spread: 80,
            origin: { y: 0.6 },
          });
          setGameScores((prev) => ({
            ...prev,
            patternStreak: Math.max(prev.patternStreak || 1, maxRounds),
          }));
          voice.speak(
            'अद्भुत! आपने सभी चक्र सफलतापूर्वक याद रखे! शाबाश!',
            'Wonderful! You recalled all musical sequences perfectly! Well done!'
          );
        }
      }
    } else {
      // Gentle assistance - elder didn't match
      sounds.playEncouragementChime();
      voice.speak(
        'कोई बात नहीं! चलिए फिर से धुन सुनते हैं।',
        'No problem! Let us listen to the tune once again.'
      );
      setGameState('playing-demo');
      setPlayerIndex(0);
      const retryTimer = setTimeout(() => {
        playSequenceDemo(sequence);
      }, 1200);
      timeoutsRef.current.push(retryTimer);
    }
  };

  const handleListenRules = () => {
    sounds.playClickChime();
    voice.speak(
      'धुन और रंग पहचान खेल: पहले घंटियों की रोशनी और धुन को ध्यान से देखें। फिर उसी क्रम में रंगीन घंटियों को छुएं।',
      'Pattern Recognition: First watch the colored bells light up and hear the melody. Then tap the bells in the exact same sequence.'
    );
  };

  useEffect(() => {
    startNewGame();
    return () => clearAllTimeouts();
  }, []);

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

      {/* Header Banner - Blue Theme */}
      <div className="bg-[#E6F1FF] rounded-[2.5rem] p-6 sm:p-8 border-3 border-[#2879D0]/40 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <span className="text-4xl">🔔</span>
            <h1 className="text-3xl sm:text-5xl font-black text-[#102A43]">
              धुन और रंग पहचान
            </h1>
          </div>
          <p className="text-xl sm:text-2xl font-black text-[#2879D0]">
            "रंगीन घंटियों की धुन देखें और उसी क्रम में दोहराएं"
          </p>
          <p className="text-base sm:text-lg font-bold text-[#5D7184] mt-0.5">
            Musical Pattern Recognition • Sensory & Auditory Memory
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          <button
            onClick={handleListenRules}
            className="tactile-btn flex items-center gap-2 px-5 py-3 rounded-2xl bg-white hover:bg-[#E6F1FF] border-2 border-[#2879D0] text-[#2879D0] font-black text-lg min-h-[52px] cursor-pointer shadow-xs"
          >
            <Volume2 className="w-6 h-6 animate-pulse" />
            <span>🔊 नियम सुनें (Listen Rules)</span>
          </button>

          <button
            onClick={startNewGame}
            className="tactile-btn flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#2879D0] hover:bg-[#1C60AB] border-2 border-[#154E8D] text-white font-black text-lg min-h-[52px] cursor-pointer shadow-sm"
          >
            <RotateCcw className="w-6 h-6 stroke-[2.5]" />
            <span>नया खेल (Restart)</span>
          </button>
        </div>
      </div>

      {/* Round & Guidance Alert */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-[#DFF3E7] shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xl font-black text-[#102A43]">
            चक्र (Round): <strong className="text-3xl text-[#2879D0]">{round}</strong> / {maxRounds}
          </span>
          <span className="text-base font-bold text-[#5D7184]">
            ({sequence.length} सुरों की धुन)
          </span>
        </div>

        {/* State Indicator */}
        <div className="flex items-center gap-2">
          {gameState === 'playing-demo' ? (
            <div className="flex items-center gap-2 px-5 py-2.5 bg-[#FFF0D7] border-2 border-[#E98A20] rounded-2xl text-[#102A43] font-black text-base animate-pulse">
              <Eye className="w-5 h-5 text-[#E98A20]" />
              <span>ध्यान से देखें और सुनें... (Watch & Listen)</span>
            </div>
          ) : gameState === 'player-turn' ? (
            <div className="flex items-center gap-2 px-5 py-2.5 bg-[#EAF7EF] border-2 border-[#167A55] rounded-2xl text-[#167A55] font-black text-base animate-bounce">
              <Sparkles className="w-5 h-5 text-[#167A55]" />
              <span>अब आपकी बारी! घंटियों को छुएं (Your Turn!)</span>
            </div>
          ) : gameState === 'round-won' ? (
            <div className="flex items-center gap-2 px-5 py-2.5 bg-[#E6F1FF] border-2 border-[#2879D0] rounded-2xl text-[#2879D0] font-black text-base">
              <CheckCircle2 className="w-5 h-5" />
              <span>शाबाश! सही उत्तर!</span>
            </div>
          ) : (
            <div className="text-base font-bold text-[#5D7184]">तैयार हैं</div>
          )}
        </div>

        {/* Re-listen button */}
        {gameState === 'player-turn' && (
          <button
            onClick={() => {
              setGameState('playing-demo');
              setPlayerIndex(0);
              playSequenceDemo(sequence);
            }}
            className="tactile-btn px-4 py-2 bg-[#FBFAF4] hover:bg-[#EAF7EF] border-2 border-[#DFF3E7] rounded-2xl text-[#102A43] font-bold text-sm flex items-center gap-1.5 cursor-pointer"
          >
            <Volume2 className="w-4 h-4 text-[#E98A20]" />
            <span>धुन फिर से सुनें (Repeat Audio)</span>
          </button>
        )}
      </div>

      {/* FINAL WIN CARD */}
      {gameState === 'success' && (
        <div className="bg-[#E6F1FF] border-4 border-[#2879D0] rounded-[2.5rem] p-6 sm:p-10 text-center shadow-xl animate-slow-fade">
          <span className="text-6xl inline-block mb-3">🌟</span>
          <h2 className="text-3xl sm:text-5xl font-black text-[#102A43]">
            लाजवाब! आपने सभी धुनें पहचान लीं!
          </h2>
          <p className="mt-2 text-xl sm:text-2xl font-black text-[#2879D0]">
            Outstanding! Your pattern memory is very sharp!
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={startNewGame}
              className="tactile-btn px-8 py-4 sm:py-5 rounded-2xl bg-[#2879D0] hover:bg-[#1C60AB] border-2 border-[#154E8D] text-white font-black text-xl sm:text-2xl flex items-center gap-3 shadow-lg cursor-pointer"
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

      {/* 4 Large Sensory Bell Buttons */}
      <div className="grid grid-cols-2 gap-4 sm:gap-8 max-w-xl mx-auto pt-2">
        {PATTERN_BELLS.map((bell) => {
          const isActive = activeBellId === bell.id;

          return (
            <button
              key={bell.id}
              onClick={() => handleBellTap(bell.id)}
              disabled={gameState === 'playing-demo'}
              className={`tactile-btn relative h-40 sm:h-52 rounded-3xl border-4 flex flex-col items-center justify-center p-4 transition-all duration-200 select-none cursor-pointer ${
                isActive ? `${bell.activeColor} scale-105 active-glow z-10` : bell.color
              } ${gameState === 'playing-demo' ? 'cursor-not-allowed opacity-90' : ''}`}
            >
              <span className="text-5xl sm:text-7xl mb-2 filter drop-shadow">
                {bell.emoji}
              </span>
              <span className="text-2xl sm:text-3xl font-black tracking-wide">
                {bell.nameHindi}
              </span>
              <span className="text-sm sm:text-base font-bold opacity-90">
                {bell.nameEnglish}
              </span>

              {isActive && (
                <div className="absolute inset-0 rounded-3xl border-4 border-white animate-ping opacity-60 pointer-events-none" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

