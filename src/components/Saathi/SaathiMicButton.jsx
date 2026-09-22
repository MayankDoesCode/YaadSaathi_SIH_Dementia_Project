/**
 * SaathiMicButton.jsx
 * Large, elderly-friendly central microphone button with clear animated states.
 */

import React from 'react';
import { Mic, MicOff, Volume2, Loader2, AlertCircle } from 'lucide-react';
import { useSaathi } from '../../context/SaathiContext';
import { useI18n } from '../../i18n/I18nContext';

export default function SaathiMicButton({ className = '' }) {
  const { status, startListening, stopListening } = useSaathi();
  const { isHindi } = useI18n();

  const isListening = status === 'LISTENING';
  const isProcessing = status === 'PROCESSING';
  const isSpeaking = status === 'SPEAKING';
  const isError = status === 'ERROR';

  const handleClick = () => {
    if (isListening) {
      stopListening();
    } else if (!isProcessing) {
      startListening();
    }
  };

  // State text label
  let statusText = isHindi ? 'साथी से बात करें' : 'Talk to Saathi';
  let badgeColor = 'bg-blue-100 text-blue-800 border-blue-200';

  if (isListening) {
    statusText = isHindi ? 'सुन रही हूँ... (रोकने के लिए छुएं)' : 'Listening... (Tap to stop)';
    badgeColor = 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse';
  } else if (isProcessing) {
    statusText = isHindi ? 'समझ रही हूँ...' : 'Understanding...';
    badgeColor = 'bg-amber-100 text-amber-800 border-amber-300';
  } else if (isSpeaking) {
    statusText = isHindi ? 'साथी बोल रही है...' : 'Saathi is speaking...';
    badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-300';
  } else if (isError) {
    statusText = isHindi ? 'मैं समझ नहीं पायी। दोबारा बोलिए।' : 'Could not understand. Please speak again.';
    badgeColor = 'bg-rose-100 text-rose-800 border-rose-300';
  }

  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      {/* State Status Badge */}
      <div
        className={`px-4 py-1.5 rounded-full border text-sm sm:text-base font-black flex items-center gap-2 transition-all ${badgeColor}`}
        aria-live="polite"
      >
        {isListening && <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />}
        {isProcessing && <Loader2 className="w-4 h-4 animate-spin text-amber-600" />}
        {isSpeaking && <Volume2 className="w-4 h-4 animate-bounce text-emerald-600" />}
        {isError && <AlertCircle className="w-4 h-4 text-rose-600" />}
        <span>{statusText}</span>
      </div>

      {/* Main Touch-Friendly Button */}
      <button
        id="saathi-mic-action-btn"
        onClick={handleClick}
        disabled={isProcessing}
        aria-label={isListening ? (isHindi ? 'सुनना बंद करें' : 'Stop listening') : (isHindi ? 'बोलने के लिए छुएं' : 'Tap to speak')}
        className={`relative w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 shadow-xl border-4 ${
          isListening
            ? 'bg-gradient-to-tr from-rose-500 to-red-600 text-white border-white ring-8 ring-rose-300 scale-105 animate-pulse'
            : isSpeaking
            ? 'bg-gradient-to-tr from-emerald-500 to-teal-600 text-white border-white ring-6 ring-emerald-200'
            : 'bg-gradient-to-tr from-[#1E56A0] to-[#167A55] text-white border-white hover:scale-105 active:scale-95 ring-6 ring-blue-100'
        }`}
      >
        {isListening ? (
          <MicOff className="w-10 h-10 sm:w-12 sm:h-12 stroke-[2.5]" />
        ) : isSpeaking ? (
          <Volume2 className="w-10 h-10 sm:w-12 sm:h-12 stroke-[2.5] animate-pulse" />
        ) : isProcessing ? (
          <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 stroke-[2.5] animate-spin" />
        ) : (
          <Mic className="w-10 h-10 sm:w-12 sm:h-12 stroke-[2.5]" />
        )}
      </button>

      {/* Senior Help Text */}
      <span className="text-xs sm:text-sm font-bold text-[#5D7184]">
        {isListening
          ? (isHindi ? 'अपनी बात बोलिए...' : 'Please speak clearly...')
          : (isHindi ? '👆 बोलने के लिए बटन छुएं' : '👆 Tap button to speak')}
      </span>
    </div>
  );
}
