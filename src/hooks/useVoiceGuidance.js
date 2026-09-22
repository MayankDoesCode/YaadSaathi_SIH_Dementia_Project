import { useState, useEffect, useCallback } from 'react';

/**
 * useVoiceGuidance - Accessible Web Speech API wrapper for elderly dementia users.
 * Supports bilingual speaking (Hindi and Indian English), speech rate adjustment for seniors,
 * and tracks speaking state with pulsing indicator.
 *
 * @param {string} [appLanguage] - The app's currently selected language ('hi' | 'en') from
 *   I18nContext. When provided, this hook's spoken language always stays in sync with it,
 *   so switching the app language also switches what the voice assistant speaks.
 */
export function useVoiceGuidance(appLanguage) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [availableVoices, setAvailableVoices] = useState([]);
  const [currentLanguage, setCurrentLanguage] = useState(appLanguage === 'en' ? 'en' : 'hi'); // 'hi' or 'en'
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  // Keep spoken language in lockstep with the app's selected language.
  useEffect(() => {
    if (appLanguage === 'en' || appLanguage === 'hi') {
      setCurrentLanguage(appLanguage);
    }
  }, [appLanguage]);

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    const updateVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setAvailableVoices(voices);
    };

    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speak = useCallback(
    (textHindi, textEnglish) => {
      if (!voiceEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) {
        return;
      }

      // Stop any ongoing speech
      window.speechSynthesis.cancel();

      // Choose text based on current language or provided fallback
      const textToSpeak = currentLanguage === 'hi' 
        ? (textHindi || textEnglish) 
        : (textEnglish || textHindi);

      if (!textToSpeak) return;

      const utterance = new SpeechSynthesisUtterance(textToSpeak);

      // Elderly-friendly speech pace: slightly slower and reassuring
      utterance.rate = 0.85; 
      utterance.pitch = 1.0;

      // Select matching voice
      if (currentLanguage === 'hi') {
        const hiVoice = availableVoices.find(v => v.lang.includes('hi') || v.name.toLowerCase().includes('hindi'));
        if (hiVoice) {
          utterance.voice = hiVoice;
        } else {
          utterance.lang = 'hi-IN';
        }
      } else {
        const enVoice = availableVoices.find(v => v.lang.includes('en-IN') || v.lang.includes('en'));
        if (enVoice) {
          utterance.voice = enVoice;
        } else {
          utterance.lang = 'en-US';
        }
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    },
    [availableVoices, currentLanguage, voiceEnabled]
  );

  const stopSpeaking = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  const toggleLanguage = useCallback(() => {
    setCurrentLanguage(prev => (prev === 'hi' ? 'en' : 'hi'));
  }, []);

  return {
    speak,
    stopSpeaking,
    isSpeaking,
    currentLanguage,
    setCurrentLanguage,
    toggleLanguage,
    voiceEnabled,
    setVoiceEnabled,
  };
}
