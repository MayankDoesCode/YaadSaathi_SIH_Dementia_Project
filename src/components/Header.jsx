import React from 'react';
import Logo from './Logo';
import {
  Volume2,
  Settings as SettingsIcon,
  Heart,
  Globe,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useI18n } from '../i18n/I18nContext';
import VoiceButton from './VoiceButton';

export default function Header() {
  const {
    fontScale,
    decreaseFontSize,
    resetFontSize,
    increaseFontSize,
    patient,
    navigateTo,
    currentScreen,
    setSosModalOpen,
    sounds,
  } = useApp();

  const { t, language, toggleLanguage, isHindi } = useI18n();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b-2 border-[#DFF3E7] shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-4 flex-wrap sm:flex-nowrap">
        {/* Left: Brand Logo & Title */}
        <div
          id="header-logo"
          onClick={() => navigateTo('home')}
          className="cursor-pointer shrink-0"
        >
          <Logo size="md" />
        </div>

        {/* Center: Friendly Voice Greeting Pill */}
        <div className="hidden md:flex items-center gap-2">
          <VoiceButton
            id="header-voice-btn"
            textHindi="नमस्ते दामोदर जी! आज हम साथ में कुछ अच्छा और नया करेंगे।"
            textEnglish="Good day Damodar Sharma Ji. Today is a new day to create a new memory."
            size="sm"
            label={t('listen')}
            className="shadow-xs"
          />
          <span className="text-sm font-bold text-[#167A55] bg-[#EAF7EF] px-3 py-1.5 rounded-full border border-[#167A55]/20">
            {t('todayMessage')}
          </span>
        </div>

        {/* Right: Accessibility Controls, Language, Settings & SOS */}
        <div className="flex items-center flex-wrap gap-1.5 sm:gap-2.5 ml-auto">
          {/* Text Size: A- A A+ Stepper */}
          <div
            className="flex items-center bg-[#FBFAF4] border-2 border-[#DFF3E7] rounded-2xl p-1 gap-1"
            role="group"
            aria-label="Font scale adjustment"
          >
            <button
              id="font-scale-decrease-btn"
              onClick={decreaseFontSize}
              className={`tactile-btn px-2.5 sm:px-3 py-1.5 rounded-xl font-black text-sm cursor-pointer transition-colors ${
                fontScale <= 0.90
                  ? 'bg-[#167A55] text-white shadow-xs'
                  : 'bg-white text-[#102A43] hover:bg-[#EAF7EF]'
              }`}
              title="सामान्य से छोटे अक्षर (A- 90%)"
              aria-label="Decrease font size (A-)"
            >
              A-
            </button>
            <button
              id="font-scale-reset-btn"
              onClick={resetFontSize}
              className={`tactile-btn px-2.5 sm:px-3 py-1.5 rounded-xl font-black text-sm cursor-pointer transition-colors ${
                fontScale === 1.00
                  ? 'bg-[#167A55] text-white shadow-xs'
                  : 'bg-white text-[#102A43] hover:bg-[#EAF7EF]'
              }`}
              title="सामान्य अक्षर (A 100%)"
              aria-label="Reset font size to 100% (A)"
            >
              A
            </button>
            <button
              id="font-scale-increase-btn"
              onClick={increaseFontSize}
              className={`tactile-btn px-2.5 sm:px-3 py-1.5 rounded-xl font-black text-sm cursor-pointer transition-colors ${
                fontScale >= 1.15
                  ? 'bg-[#167A55] text-white shadow-xs'
                  : 'bg-white text-[#102A43] hover:bg-[#EAF7EF]'
              }`}
              title="बड़े अक्षर (A+ 115% / 130%)"
              aria-label="Increase font size (A+)"
            >
              A+
            </button>
          </div>

          {/* Language Toggle: 🌐 हिंदी / English */}
          <button
            id="language-toggle-btn"
            onClick={() => {
              sounds.playClickChime();
              toggleLanguage();
            }}
            className="tactile-btn flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-[#FBFAF4] hover:bg-[#EAF7EF] border-2 border-[#DFF3E7] text-[#102A43] font-black text-sm min-h-[46px] cursor-pointer"
            title="भाषा बदलें (Switch Language)"
            aria-label="Switch Language"
          >
            <Globe className="w-4 h-4 text-[#167A55]" />
            <span>{isHindi ? '🌐 English' : '🇮🇳 हिंदी'}</span>
          </button>

          {/* Settings Shortcut */}
          <button
            id="header-settings-btn"
            onClick={() => {
              sounds.playClickChime();
              navigateTo('settings');
            }}
            className={`tactile-btn p-2.5 rounded-2xl border-2 min-h-[46px] cursor-pointer ${
              currentScreen === 'settings'
                ? 'bg-[#167A55] border-[#0D4E36] text-white'
                : 'bg-[#FBFAF4] hover:bg-[#EAF7EF] border-[#DFF3E7] text-[#102A43]'
            }`}
            title={t('settings')}
            aria-label={t('settings')}
          >
            <SettingsIcon className="w-5 h-5" />
          </button>

          {/* SOS Help Button (Visually prominent in Pink/Red) */}
          <button
            id="header-sos-btn"
            onClick={() => {
              sounds.playClickChime();
              setSosModalOpen(true);
            }}
            {/* Issue 1: High-contrast accessible crimson (contrast > 6.5:1 with solid white text) */}
            className="tactile-btn flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-2xl bg-[#9E163B] hover:bg-[#831843] border-2 border-[#650E28] text-white font-black text-sm sm:text-base shadow-sm min-h-[46px] cursor-pointer ring-2 ring-[#B82B53]/40"
            title={t('sos')}
          >
            <Heart className="w-5 h-5 fill-white stroke-none" />
            <span>{t('sos')}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
