import React from 'react';
import {
  ArrowLeft,
  Home,
  ShieldAlert,
  Settings as SettingsIcon,
  Globe,
  Plus,
  Minus,
  Volume2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import VoiceButton from './VoiceButton';

export default function Navbar() {
  const {
    currentScreen,
    navigateTo,
    fontSizeLevel,
    increaseFontSize,
    decreaseFontSize,
    languageMode,
    toggleLanguage,
    setSosModalOpen,
    sounds,
    voice,
  } = useApp();

  const getScreenTitle = () => {
    switch (currentScreen) {
      case 'games':
        return { hi: 'दिमागी खेल', en: 'Brain Games' };
      case 'memory-match':
        return { hi: 'स्मृति मिलान', en: 'Memory Match' };
      case 'pattern-recognition':
        return { hi: 'धुन और रंग', en: 'Pattern Recognition' };
      case 'word-recall':
        return { hi: 'शब्द याद', en: 'Word Recall' };
      case 'picture-recall':
        return { hi: 'चित्र याद', en: 'Picture Recall' };
      case 'reminders':
        return { hi: 'दिनचर्या व दवाइयां', en: 'Daily Routine' };
      case 'progress':
        return { hi: 'मेरी प्रगति', en: 'My Progress' };
      case 'family':
        return { hi: 'परिवार व सहायता', en: 'Family & Care' };
      case 'settings':
        return { hi: 'सुविधा सेटिंग्स', en: 'Accessibility Settings' };
      default:
        return { hi: 'यादसाथी', en: 'YaadSaathi' };
    }
  };

  const title = getScreenTitle();

  return (
    <header className="sticky top-0 z-40 bg-[#FFFFFF]/95 backdrop-blur border-b-2 border-[#D8E2DC] shadow-sm contrast-card">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Brand / Home or Back Button */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {currentScreen !== 'home' ? (
            <button
              onClick={() => navigateTo('home')}
              className="tactile-btn flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#2D6A4F] hover:bg-[#1B4332] border-2 border-[#1B4332] text-white font-black text-lg sm:text-xl shadow cursor-pointer min-h-[52px]"
              aria-label="मुख्य पृष्ठ पर वापस जाएं (Back to Home)"
            >
              <ArrowLeft className="w-6 h-6 stroke-[3]" />
              <span>वापस (Home)</span>
            </button>
          ) : (
            <div
              onClick={() => navigateTo('home')}
              className="flex items-center gap-2.5 cursor-pointer py-1 select-none"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#E8F3ED] border-2 border-[#B7D5C4] flex items-center justify-center text-3xl shadow-sm">
                🌿
              </div>
              <div className="text-left">
                <span className="block text-2xl sm:text-3xl font-black text-[#1B4332] tracking-tight leading-none">
                  यादसाथी
                </span>
                <span className="block text-xs sm:text-sm font-semibold text-[#40916C]">
                  YaadSaathi Care
                </span>
              </div>
            </div>
          )}

          {currentScreen !== 'home' && (
            <div className="hidden lg:block text-left ml-2">
              <h1 className="text-xl font-black text-[#1A2F23] leading-tight">
                {title.hi}
              </h1>
              <p className="text-xs text-[#52796F] font-bold">{title.en}</p>
            </div>
          )}
        </div>

        {/* Right: Accessibility Toolbar (A-, A+, Lang, Voice, Settings, SOS) */}
        <div className="flex items-center flex-wrap gap-1.5 sm:gap-2.5 ml-auto">
          {/* Read Screen Overview Button */}
          <VoiceButton
            textHindi={`आप अभी ${title.hi} पृष्ठ पर हैं।`}
            textEnglish={`You are on the ${title.en} screen.`}
            size="sm"
            label="सुनें"
            className="hidden sm:inline-flex"
          />

          {/* Text Size Scale Toolbar: A- and A+ */}
          <div className="flex items-center bg-[#E8F3ED] border-2 border-[#B7D5C4] rounded-2xl p-1 gap-1">
            <button
              onClick={decreaseFontSize}
              disabled={fontSizeLevel === 0}
              className={`tactile-btn px-2.5 py-1.5 rounded-xl font-black text-sm flex items-center gap-0.5 ${
                fontSizeLevel === 0
                  ? 'opacity-40 cursor-not-allowed bg-transparent border-transparent'
                  : 'bg-white hover:bg-slate-100 border border-[#B7D5C4] text-[#1B4332]'
              }`}
              title="अक्षर छोटे करें (A-)"
              aria-label="अक्षर छोटे करें"
            >
              <Minus className="w-4 h-4" />
              <span>A-</span>
            </button>

            <span className="font-mono text-xs font-black px-1 text-[#2D6A4F]">
              {fontSizeLevel === 0 ? '100%' : fontSizeLevel === 1 ? '115%' : fontSizeLevel === 2 ? '130%' : '145%'}
            </span>

            <button
              onClick={increaseFontSize}
              disabled={fontSizeLevel === 3}
              className={`tactile-btn px-2.5 py-1.5 rounded-xl font-black text-sm flex items-center gap-0.5 ${
                fontSizeLevel === 3
                  ? 'opacity-40 cursor-not-allowed bg-transparent border-transparent'
                  : 'bg-white hover:bg-slate-100 border border-[#B7D5C4] text-[#1B4332]'
              }`}
              title="अक्षर बड़े करें (A+)"
              aria-label="अक्षर बड़े करें"
            >
              <Plus className="w-4 h-4" />
              <span>A+</span>
            </button>
          </div>

          {/* Language Switcher */}
          <button
            onClick={toggleLanguage}
            className="tactile-btn flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white hover:bg-[#E8F3ED] border-2 border-[#B7D5C4] text-[#1B4332] font-black text-sm min-h-[46px]"
            title="भाषा बदलें (Switch Language)"
          >
            <Globe className="w-4 h-4 text-[#2D6A4F]" />
            <span>{languageMode === 'hi' ? '🇮🇳 हिन्दी' : languageMode === 'en' ? '🇬🇧 Eng' : '🌐 द्विभाषी'}</span>
          </button>

          {/* Settings Shortcut */}
          <button
            onClick={() => {
              sounds.playClickChime();
              navigateTo('settings');
            }}
            className={`tactile-btn flex items-center justify-center p-2.5 rounded-2xl border-2 min-h-[46px] ${
              currentScreen === 'settings'
                ? 'bg-[#2D6A4F] border-[#1B4332] text-white'
                : 'bg-white hover:bg-[#E8F3ED] border-[#B7D5C4] text-[#1B4332]'
            }`}
            title="सेटिंग्स (Settings)"
            aria-label="सेटिंग्स खोलें"
          >
            <SettingsIcon className="w-5 h-5" />
          </button>

          {/* Emergency SOS Button */}
          <button
            onClick={() => {
              sounds.playClickChime();
              setSosModalOpen(true);
            }}
            className="tactile-btn flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-2xl bg-rose-600 hover:bg-rose-700 border-2 border-rose-800 text-white font-black text-sm sm:text-base shadow-sm min-h-[46px] animate-pulse"
            title="आपातकालीन सहायता (Emergency SOS)"
          >
            <ShieldAlert className="w-5 h-5 stroke-[2.5]" />
            <span>मदद (SOS)</span>
          </button>
        </div>
      </div>
    </header>
  );
}
