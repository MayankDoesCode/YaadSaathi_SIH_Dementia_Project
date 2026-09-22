import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';
import voiceService from '../services/voiceService';
import { useSoundEffects } from '../hooks/useSoundEffects';

export default function VoiceButton({
  text,
  textHindi,
  textEnglish,
  size = 'md', // 'sm', 'md', 'lg'
  label,
  className = '',
  id,
}) {
  const { isHindi } = useI18n();
  const sounds = useSoundEffects();
  const [isSpeakingThis, setIsSpeakingThis] = useState(false);

  useEffect(() => {
    const unsubscribe = voiceService.subscribe((speaking) => {
      if (!speaking) {
        setIsSpeakingThis(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleClick = (e) => {
    e.stopPropagation();

    // If this button is already speaking, stop it
    if (isSpeakingThis) {
      voiceService.stop();
      setIsSpeakingThis(false);
      return;
    }

    // Determine speech text based on current language
    const speechText =
      (isHindi ? (textHindi || text || textEnglish) : (textEnglish || text || textHindi)) ||
      label;

    if (!speechText) return;

    sounds.playClickChime();
    setIsSpeakingThis(true);

    const speechLang = isHindi ? 'hi-IN' : 'en-IN';

    voiceService.speak(speechText, speechLang, {
      onStart: () => setIsSpeakingThis(true),
      onEnd: () => setIsSpeakingThis(false),
      onError: () => setIsSpeakingThis(false),
    });
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm gap-1.5 min-h-[44px]',
    md: 'px-4 py-2.5 text-base gap-2 min-h-[52px]',
    lg: 'px-6 py-3.5 text-lg sm:text-xl gap-2.5 min-h-[60px]',
  };

  // Determine button display text:
  // When speaking: "🔊 बोल रहा हूँ..." / "🔊 Speaking..."
  // When idle: specified label or default "🔊 सुनें" / "🔊 Listen"
  const defaultLabel = isHindi ? 'सुनें' : 'Listen';
  const speakingLabel = isHindi ? 'बोल रहा हूँ...' : 'Speaking...';
  const displayLabel = isSpeakingThis ? speakingLabel : (label || defaultLabel);

  return (
    <button
      id={id}
      onClick={handleClick}
      type="button"
      aria-label={isSpeakingThis ? (isHindi ? 'आवाज़ रोकें' : 'Stop speaking') : (isHindi ? 'बोलकर सुनाएं' : 'Listen audio guidance')}
      className={`tactile-btn inline-flex items-center justify-center font-black rounded-2xl transition-all cursor-pointer select-none ${
        isSpeakingThis
          ? 'bg-[#E8F3ED] border-2 border-[#167A55] text-[#167A55] ring-4 ring-[#DFF3E7] animate-pulse'
          : 'bg-[#EAF7EF] hover:bg-[#DFF3E7] border-2 border-[#167A55]/30 text-[#167A55]'
      } ${sizeClasses[size] || sizeClasses.md} ${className}`}
    >
      {isSpeakingThis ? (
        <VolumeX className="w-5 h-5 sm:w-6 sm:h-6 shrink-0 text-[#167A55] animate-bounce" />
      ) : (
        <Volume2 className="w-5 h-5 sm:w-6 sm:h-6 shrink-0 text-[#167A55]" />
      )}
      <span>{displayLabel}</span>
    </button>
  );
}
