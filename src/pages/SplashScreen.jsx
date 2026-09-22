import React from 'react';
import Logo from '../components/Logo';
import { Volume2, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function SplashScreen() {
  const { completeSplash, skipSplash, voice, sounds } = useApp();

  const handleListen = () => {
    sounds.playClickChime();
    voice.speak(
      'यादसाथी केयर में आपका स्वागत है। साथ यादों का, हर दिन के लिए। शुरू करने के लिए नीचे दिए गए हरे बटन को दबाएं।',
      'Welcome to YaadSaathi Care. Keeping memories active, lives independent, and families connected. Tap get started to begin.'
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between p-6 sm:p-12 bg-gradient-to-b from-[#FBFAF4] via-[#EAF7EF] to-[#DFF3E7] overflow-y-auto text-center animate-slow-fade select-none">
      {/* Top Skip Intro Bar */}
      <div className="w-full max-w-4xl flex justify-end">
        <button
          onClick={skipSplash}
          className="text-base sm:text-lg font-bold text-[#5D7184] hover:text-[#102A43] underline px-3 py-1 cursor-pointer transition-colors"
        >
          Skip intro (सीधे जाएं) →
        </button>
      </div>

      {/* Center Content */}
      <div className="max-w-2xl mx-auto my-auto flex flex-col items-center space-y-6 sm:space-y-8">
        {/* Animated Brand Logo */}
        <div className="p-4 rounded-3xl bg-white/80 backdrop-blur border-2 border-[#167A55]/20 shadow-lg animate-sway">
          <Logo size="lg" />
        </div>

        {/* Tagline & Purpose */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-5xl font-black text-[#102A43] tracking-tight leading-tight">
            "साथ यादों का, हर दिन के लिए।"
          </h1>
          <p className="text-xl sm:text-2xl font-bold text-[#167A55]">
            "Saath Yaadon Ka, Har Din Ke Liye."
          </p>
          <p className="text-lg sm:text-xl font-medium text-[#5D7184] max-w-xl mx-auto leading-relaxed pt-1">
            Keeping memories active, lives independent, and families connected.
          </p>
        </div>

        {/* Sophisticated Wellness Illustration Graphic */}
        <div className="relative w-72 h-44 sm:w-80 sm:h-48 bg-white/70 backdrop-blur rounded-[2.5rem] border-2 border-[#167A55]/20 flex items-center justify-center shadow-inner overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#DFF3E7]/40 via-white/50 to-[#FFE8EF]/40 pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center justify-center text-center">
            <div className="flex items-center gap-3 text-5xl mb-1">
              <span>🌿</span>
              <span>👴👵</span>
              <span>❤️</span>
            </div>
            <span className="text-sm font-bold text-[#167A55] tracking-wide mt-1">
              सुलभ • व्यक्तिगत • पारिवारिक साथ
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-md pt-2">
          {/* Primary Get Started Button */}
          <button
            onClick={completeSplash}
            className="tactile-btn w-full sm:flex-1 py-4 sm:py-5 px-8 rounded-2xl bg-[#167A55] hover:bg-[#115C40] border-2 border-[#0D4E36] text-white font-black text-xl sm:text-2xl flex items-center justify-center gap-3 shadow-lg cursor-pointer"
          >
            <span>शुरू करें | Get Started</span>
            <ArrowRight className="w-6 h-6 stroke-[3]" />
          </button>

          {/* Secondary Listen Button */}
          <button
            onClick={handleListen}
            className="tactile-btn w-full sm:w-auto py-4 px-6 rounded-2xl bg-white hover:bg-[#FBFAF4] border-2 border-[#167A55] text-[#167A55] font-black text-lg flex items-center justify-center gap-2 shadow cursor-pointer"
          >
            <Volume2 className="w-6 h-6" />
            <span>सुनें | Listen</span>
          </button>
        </div>
      </div>

      {/* Medical Disclaimer & Compliance Tag */}
      <div className="w-full max-w-xl text-xs sm:text-sm font-medium text-[#5D7184] pt-4 border-t border-[#167A55]/15">
        <p>
          स्मृति सहायता व संज्ञानात्मक जुड़ाव मंच • Memory & Cognitive Engagement Platform
        </p>
        <p className="text-[11px] opacity-80 mt-0.5">
          *यह मंच किसी चिकित्सकीय रोग का निदान या उपचार नहीं करता है।
        </p>
      </div>
    </div>
  );
}
