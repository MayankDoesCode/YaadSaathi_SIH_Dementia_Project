/**
 * SaathiButton.jsx
 * Persistent floating action button for Saathi AI Voice Companion.
 * Adheres strictly to Section 1 design requirements.
 */

import React from 'react';
import { Mic, Volume2, Loader2, Sparkles } from 'lucide-react';
import { useSaathi } from '../../context/SaathiContext';
import { useI18n } from '../../i18n/I18nContext';

export default function SaathiButton() {
  const { openSaathi, status, isPanelOpen } = useSaathi();
  const { isHindi } = useI18n();

  if (isPanelOpen) return null; // Hidden while panel is open

  const isListening = status === 'LISTENING';
  const isSpeaking = status === 'SPEAKING';
  const isProcessing = status === 'PROCESSING';

  // Subtitle based on state
  let subLabel = isHindi ? 'बात करें' : 'Talk';
  if (isListening) subLabel = isHindi ? 'सुन रही हूँ...' : 'Listening...';
  if (isProcessing) subLabel = isHindi ? 'समझ रही हूँ...' : 'Thinking...';
  if (isSpeaking) subLabel = isHindi ? 'बोल रही है...' : 'Speaking...';

  return (
    <div className="fixed right-5 bottom-24 xl:bottom-8 z-40 flex flex-col items-center group">
      {/* Floating Button */}
      <button
        id="floating-saathi-btn"
        onClick={openSaathi}
        aria-label={isHindi ? 'साथी वॉयस साथी से बात करें' : 'Talk to Saathi Voice Companion'}
        className={`tactile-btn relative w-18 h-18 sm:w-20 sm:h-20 rounded-full flex flex-col items-center justify-center cursor-pointer transition-all duration-300 shadow-2xl border-4 border-white ${
          isListening
            ? 'bg-gradient-to-tr from-rose-500 to-red-600 ring-8 ring-rose-400/50 scale-105 animate-pulse'
            : isSpeaking
            ? 'bg-gradient-to-tr from-emerald-500 to-teal-600 ring-6 ring-emerald-300/60'
            : 'bg-gradient-to-br from-[#1E56A0] via-[#167A55] to-[#2879D0] ring-4 ring-[#167A55]/30 hover:scale-105 active:scale-95'
        }`}
      >
        {/* Animated Glow Rings when active */}
        {isListening && (
          <span className="absolute -inset-1 rounded-full bg-rose-400 opacity-75 animate-ping" />
        )}

        <div className="relative z-10 flex flex-col items-center text-white">
          {isProcessing ? (
            <Loader2 className="w-8 h-8 animate-spin stroke-[2.5]" />
          ) : isSpeaking ? (
            <Volume2 className="w-8 h-8 animate-pulse stroke-[2.5]" />
          ) : (
            <div className="flex items-center justify-center">
              <span className="text-2xl sm:text-3xl leading-none">🌸</span>
            </div>
          )}
        </div>
      </button>

      {/* Label Badge underneath */}
      <div className="mt-1 px-3 py-0.5 rounded-full bg-[#102A43] text-white shadow-md border border-white/40 flex items-center gap-1.5 pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-[#48BB78] animate-pulse" />
        <span className="text-xs sm:text-sm font-black tracking-wide">
          {isHindi ? 'साथी' : 'Saathi'}
        </span>
        <span className="text-[10px] sm:text-xs text-slate-300 font-bold">
          • {subLabel}
        </span>
      </div>
    </div>
  );
}
