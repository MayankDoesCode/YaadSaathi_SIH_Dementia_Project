import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, X, Sparkles, Navigation, CheckCircle2, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useI18n } from '../i18n/I18nContext';
import voiceService from '../services/voiceService';

export default function VoiceAssistantModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isSupported, setIsSupported] = useState(true);

  const { navigateTo, increaseFontSize, decreaseFontSize, resetFontSize, setSosModalOpen, sounds } = useApp();
  const { t, isHindi, language } = useI18n();

  const recognitionRef = useRef(null);

  useEffect(() => {
    // Check SpeechRecognition support safely
    const SpeechRecognition =
      typeof window !== 'undefined'
        ? window.SpeechRecognition || window.webkitSpeechRecognition
        : null;

    if (!SpeechRecognition) {
      setIsSupported(false);
    }
  }, []);

  const handleOpen = () => {
    sounds.playClickChime();
    setIsOpen(true);
    setTranscript('');
    setFeedback('');
  };

  const handleClose = () => {
    sounds.playClickChime();
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (e) {}
    }
    setIsListening(false);
    setIsOpen(false);
  };

  const handleListenGreeting = () => {
    const greeting = isHindi
      ? 'नमस्ते! मैं YaadSaathi हूँ। मैं आपकी कैसे मदद कर सकता हूँ?'
      : 'Hello! I am YaadSaathi. How can I help you today?';
    voiceService.speak(greeting, isHindi ? 'hi-IN' : 'en-IN');
  };

  // Process Recognized Voice Commands
  const executeCommand = (text) => {
    const cleanText = text.toLowerCase().trim();

    // Hindi Commands
    if (cleanText.includes('घर खोलो') || cleanText.includes('घर') || cleanText.includes('होम') || cleanText.includes('open home') || cleanText.includes('home')) {
      navigateTo('home');
      const response = isHindi ? 'घर का पृष्ठ खोला जा रहा है।' : 'Opening Home page.';
      setFeedback(response);
      voiceService.speak(response, isHindi ? 'hi-IN' : 'en-IN');
      setTimeout(handleClose, 1500);
      return;
    }

    if (cleanText.includes('खेल खोलो') || cleanText.includes('खेल') || cleanText.includes('गेम') || cleanText.includes('open games') || cleanText.includes('games')) {
      navigateTo('games');
      const response = isHindi ? 'खेल का पृष्ठ खोला जा रहा है।' : 'Opening Games page.';
      setFeedback(response);
      voiceService.speak(response, isHindi ? 'hi-IN' : 'en-IN');
      setTimeout(handleClose, 1500);
      return;
    }

    if (
      cleanText.includes('मेरी यादें दिखाओ') ||
      cleanText.includes('यादें') ||
      cleanText.includes('दिनचर्या') ||
      cleanText.includes('रिमाइंडर') ||
      cleanText.includes('show my reminders') ||
      cleanText.includes('reminders')
    ) {
      navigateTo('reminders');
      const response = isHindi ? 'दिनचर्या और यादें खोली जा रही हैं।' : 'Opening your reminders.';
      setFeedback(response);
      voiceService.speak(response, isHindi ? 'hi-IN' : 'en-IN');
      setTimeout(handleClose, 1500);
      return;
    }

    if (
      cleanText.includes('प्रगति दिखाओ') ||
      cleanText.includes('प्रगति') ||
      cleanText.includes('स्कोर') ||
      cleanText.includes('show progress') ||
      cleanText.includes('progress')
    ) {
      navigateTo('progress');
      const response = isHindi ? 'आपकी प्रगति रिपोर्ट खोली जा रही है।' : 'Opening your progress report.';
      setFeedback(response);
      voiceService.speak(response, isHindi ? 'hi-IN' : 'en-IN');
      setTimeout(handleClose, 1500);
      return;
    }

    if (cleanText.includes('परिवार खोलो') || cleanText.includes('परिवार') || cleanText.includes('फैमिली') || cleanText.includes('open family') || cleanText.includes('family')) {
      navigateTo('family');
      const response = isHindi ? 'परिवार पृष्ठ खोला जा रहा है।' : 'Opening Family page.';
      setFeedback(response);
      voiceService.speak(response, isHindi ? 'hi-IN' : 'en-IN');
      setTimeout(handleClose, 1500);
      return;
    }

    if (cleanText.includes('सेटिंग खोलो') || cleanText.includes('सेटिंग्स') || cleanText.includes('सेटिंग') || cleanText.includes('open settings') || cleanText.includes('settings')) {
      navigateTo('settings');
      const response = isHindi ? 'सेटिंग्स खोली जा रही हैं।' : 'Opening Settings.';
      setFeedback(response);
      voiceService.speak(response, isHindi ? 'hi-IN' : 'en-IN');
      setTimeout(handleClose, 1500);
      return;
    }

    if (
      cleanText.includes('आवाज़ बढ़ाओ') ||
      cleanText.includes('अक्षर बढ़ाओ') ||
      cleanText.includes('बड़ा करो') ||
      cleanText.includes('increase text size') ||
      cleanText.includes('increase font') ||
      cleanText.includes('bigger text')
    ) {
      increaseFontSize();
      const response = isHindi ? 'अक्षरों का आकार बढ़ा दिया गया है।' : 'Font size increased.';
      setFeedback(response);
      voiceService.speak(response, isHindi ? 'hi-IN' : 'en-IN');
      return;
    }

    if (
      cleanText.includes('अक्षर घटाओ') ||
      cleanText.includes('छोटा करो') ||
      cleanText.includes('decrease text size') ||
      cleanText.includes('decrease font')
    ) {
      decreaseFontSize();
      const response = isHindi ? 'अक्षरों का आकार घटा दिया गया है।' : 'Font size decreased.';
      setFeedback(response);
      voiceService.speak(response, isHindi ? 'hi-IN' : 'en-IN');
      return;
    }

    if (cleanText.includes('मदद') || cleanText.includes('sos') || cleanText.includes('help')) {
      setSosModalOpen(true);
      const response = isHindi ? 'आपातकालीन सहायता खोली जा रही है।' : 'Opening Emergency SOS.';
      setFeedback(response);
      voiceService.speak(response, isHindi ? 'hi-IN' : 'en-IN');
      setTimeout(handleClose, 1200);
      return;
    }

    // Unrecognized command fallback
    const fallbackMsg = isHindi
      ? 'माफ़ कीजिए, मुझे यह समझ नहीं आया। आप बोल सकते हैं: "घर खोलो", "खेल खोलो", "प्रगति दिखाओ", या "आवाज़ बढ़ाओ"'
      : 'Sorry, I did not catch that. Try saying: "Open home", "Open games", "Show progress", or "Increase text size"';
    setFeedback(fallbackMsg);
    voiceService.speak(fallbackMsg, isHindi ? 'hi-IN' : 'en-IN');
  };

  // Start Speech Recognition
  const startListening = () => {
    const SpeechRecognition =
      typeof window !== 'undefined'
        ? window.SpeechRecognition || window.webkitSpeechRecognition
        : null;

    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    try {
      voiceService.stop(); // Stop any voice output before listening
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;

      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = isHindi ? 'hi-IN' : 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
        setTranscript('');
        setFeedback('');
        sounds.playClickChime();
      };

      recognition.onresult = (event) => {
        const spoken = event.results[0][0].transcript;
        setTranscript(spoken);
        setIsListening(false);
        executeCommand(spoken);
      };

      recognition.onerror = (event) => {
        setIsListening(false);
        if (event.error !== 'no-speech') {
          setFeedback(isHindi ? 'ध्वनि सुनने में त्रुटि हुई।' : 'Speech recognition error.');
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.warn('Speech recognition error:', err);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    setIsListening(false);
  };

  return (
    <>
      {/* Floating Bottom-Right Voice Assistant Button */}
      <button
        id="floating-voice-assistant-btn"
        onClick={handleOpen}
        aria-label="वॉयस सहायक (Voice Assistant)"
        className="fixed right-5 bottom-24 xl:bottom-8 z-40 w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-gradient-to-br from-[#167A55] to-[#2879D0] text-white shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer border-3 border-white ring-4 ring-[#167A55]/30 group"
      >
        <span className="text-3xl sm:text-4xl group-hover:scale-110 transition-transform">🎙️</span>
        <span className="sr-only">वॉयस सहायक खोलें</span>
      </button>

      {/* Voice Assistant Modal Popup */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#102A43]/70 backdrop-blur-sm animate-slow-fade text-left"
        >
          <div className="w-full max-w-lg bg-white rounded-[2.5rem] p-6 sm:p-8 border-4 border-[#DFF3E7] shadow-2xl space-y-5 relative">
            {/* Header */}
            <div className="flex items-center justify-between gap-3 border-b-2 border-[#DFF3E7] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#EAF7EF] border-2 border-[#167A55]/30 flex items-center justify-center text-3xl shrink-0">
                  🎙️
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#102A43]">
                    {t('voiceAssistant')}
                  </h2>
                  <p className="text-xs sm:text-sm font-bold text-[#167A55]">
                    AI Voice Guidance & Navigation
                  </p>
                </div>
              </div>

              <button
                id="voice-assistant-close-btn"
                onClick={handleClose}
                className="p-2 rounded-xl bg-[#FBFAF4] hover:bg-slate-100 text-[#5D7184] hover:text-[#102A43] cursor-pointer"
                title={t('voiceClose')}
              >
                <X className="w-6 h-6 stroke-[2.5]" />
              </button>
            </div>

            {/* Reassuring Greeting Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#EAF7EF] border-2 border-[#167A55]/30 flex items-start gap-3">
              <Sparkles className="w-6 h-6 text-[#167A55] shrink-0 mt-1" />
              <div>
                <p className="text-lg sm:text-xl font-black text-[#102A43] leading-snug">
                  "{t('voiceGreeting')}"
                </p>
                <p className="text-sm font-bold text-[#5D7184] mt-1">
                  {isHindi ? 'आप बोलकर कोई भी पेज खोल सकते हैं।' : 'You can speak commands to navigate anywhere.'}
                </p>
              </div>
            </div>

            {/* Fallback Warning if browser lacks SpeechRecognition */}
            {!isSupported && (
              <div className="p-4 rounded-2xl bg-[#FFF0D7] border-2 border-[#E98A20]/40 flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-[#E98A20] shrink-0 mt-0.5" />
                <p className="text-sm font-bold text-[#A85A00]">
                  {t('voiceNotSupported')}
                </p>
              </div>
            )}

            {/* Recognized speech status / Feedback */}
            <div className="min-h-[60px] p-4 rounded-2xl bg-[#FBFAF4] border-2 border-[#E2E8F0] flex flex-col justify-center">
              {isListening ? (
                <div className="flex items-center gap-2 text-[#167A55] font-black text-lg animate-pulse">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#167A55] animate-ping" />
                  <span>{t('voiceListening')}</span>
                </div>
              ) : transcript ? (
                <div>
                  <span className="text-xs font-black uppercase text-[#5D7184] block">
                    {t('youSaid')}
                  </span>
                  <span className="text-xl font-black text-[#102A43]">"{transcript}"</span>
                </div>
              ) : (
                <p className="text-xs sm:text-sm font-bold text-[#5D7184]">
                  {t('voicePromptExample')}
                </p>
              )}

              {feedback && (
                <p className="text-base font-black text-[#167A55] mt-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>{feedback}</span>
                </p>
              )}
            </div>

            {/* Action Buttons: 🎙️ बोलें & 🔊 सुनें */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <button
                id="voice-assistant-speak-btn"
                disabled={!isSupported}
                onClick={isListening ? stopListening : startListening}
                className={`tactile-btn p-4 rounded-2xl font-black text-lg flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  isListening
                    ? 'bg-[#E84D78] text-white border-2 border-[#B82B53] animate-pulse'
                    : 'bg-[#167A55] hover:bg-[#115C40] text-white border-2 border-[#0D4E36] disabled:opacity-50'
                }`}
              >
                {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                <span>{isListening ? (isHindi ? 'रुकें' : 'Stop') : `🎙️ ${t('voiceSpeak')}`}</span>
              </button>

              <button
                id="voice-assistant-listen-btn"
                onClick={handleListenGreeting}
                className="tactile-btn p-4 rounded-2xl bg-white hover:bg-[#FBFAF4] border-2 border-[#DFF3E7] text-[#167A55] font-black text-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <Volume2 className="w-6 h-6" />
                <span>🔊 {t('voiceListen')}</span>
              </button>
            </div>

            {/* Quick Clickable Suggestions for seniors */}
            <div className="pt-2">
              <span className="text-xs font-black uppercase text-[#5D7184] block mb-2">
                {isHindi ? 'या सीधे बटन दबाकर आज़माएँ:' : 'Or tap a command directly:'}
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  { text: isHindi ? 'खेल खोलो' : 'Open games', cmd: 'खेल खोलो' },
                  { text: isHindi ? 'मेरी यादें दिखाओ' : 'Show reminders', cmd: 'मेरी यादें दिखाओ' },
                  { text: isHindi ? 'प्रगति दिखाओ' : 'Show progress', cmd: 'प्रगति दिखाओ' },
                  { text: isHindi ? 'आवाज़ बढ़ाओ' : 'Increase text', cmd: 'आवाज़ बढ़ाओ' },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => executeCommand(item.cmd)}
                    className="px-3 py-1.5 rounded-xl bg-[#FBFAF4] hover:bg-[#EAF7EF] border border-[#DFF3E7] text-xs sm:text-sm font-bold text-[#102A43] cursor-pointer"
                  >
                    👉 "{item.text}"
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
