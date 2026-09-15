import React, { useState } from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useI18n } from '../i18n/I18nContext';

export default function LanguageSelection() {
  const { setShowLanguageModal, sounds, voice } = useApp();
  const { language, setLanguage } = useI18n();
  const [selected, setSelected] = useState(language || 'hi');

  const handleChoose = (lang) => {
    sounds.playClickChime();
    setSelected(lang);
    if (lang === 'hi') {
      voice.speak('हिन्दी भाषा चुनी गई है।', 'Hindi language selected.');
    } else {
      voice.speak('English language selected.', 'English language selected.');
    }
  };

  const handleContinue = () => {
    sounds.playSuccessChime();
    setLanguage(selected);
    setShowLanguageModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#102A43]/70 backdrop-blur-sm animate-slow-fade select-none">
      <div className="w-full max-w-lg bg-white rounded-[2.5rem] p-6 sm:p-10 border-4 border-[#DFF3E7] shadow-2xl text-center space-y-6">
        <div className="space-y-1">
          <span className="text-4xl">🌐</span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#102A43] pt-2">
            अपनी भाषा चुनें
          </h2>
          <p className="text-xl font-bold text-[#5D7184]">
            Choose your language
          </p>
        </div>

        {/* 2 Large Cards */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          {/* Hindi */}
          <button
            onClick={() => handleChoose('hi')}
            className={`tactile-btn p-6 rounded-3xl border-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
              selected === 'hi'
                ? 'bg-[#EAF7EF] border-[#167A55] ring-4 ring-[#DFF3E7]'
                : 'bg-[#FBFAF4] hover:bg-[#EAF7EF] border-[#E2E8F0]'
            }`}
          >
            <span className="text-5xl">🇮🇳</span>
            <span className="text-2xl font-black text-[#102A43]">हिंदी</span>
            <span className="text-base font-bold text-[#5D7184]">Hindi</span>
            {selected === 'hi' && (
              <CheckCircle2 className="w-6 h-6 text-[#167A55] mt-1 fill-[#DFF3E7]" />
            )}
          </button>

          {/* English */}
          <button
            onClick={() => handleChoose('en')}
            className={`tactile-btn p-6 rounded-3xl border-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
              selected === 'en'
                ? 'bg-[#EAF7EF] border-[#167A55] ring-4 ring-[#DFF3E7]'
                : 'bg-[#FBFAF4] hover:bg-[#EAF7EF] border-[#E2E8F0]'
            }`}
          >
            <span className="text-5xl">🌐</span>
            <span className="text-2xl font-black text-[#102A43]">English</span>
            <span className="text-base font-bold text-[#5D7184]">अंग्रेजी</span>
            {selected === 'en' && (
              <CheckCircle2 className="w-6 h-6 text-[#167A55] mt-1 fill-[#DFF3E7]" />
            )}
          </button>
        </div>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          className="tactile-btn w-full py-4 sm:py-5 rounded-2xl bg-[#167A55] hover:bg-[#115C40] border-2 border-[#0D4E36] text-white font-black text-xl sm:text-2xl flex items-center justify-center gap-2 shadow-lg cursor-pointer"
        >
          <span>आगे बढ़ें | Continue</span>
          <ArrowRight className="w-6 h-6 stroke-[3]" />
        </button>
      </div>
    </div>
  );
}
