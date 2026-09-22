import React from 'react';
import Logo from './Logo';
import { useI18n } from '../i18n/I18nContext';

export default function Footer() {
  const { isHindi } = useI18n();

  return (
    <footer className="mt-12 bg-white border-t-2 border-[#DFF3E7] py-8 px-4 sm:px-8 text-center text-[#5D7184]">
      <div className="max-w-5xl mx-auto flex flex-col items-center space-y-4">
        {/* Brand & Tagline */}
        <Logo size="md" showTagline={true} />

        <p className="text-lg sm:text-xl font-black text-[#102A43]">
          {isHindi ? '"मानवीय स्पर्श के साथ तकनीक।"' : '"Technology with a human touch."'}
        </p>

        {/* Core Pillars */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm font-bold text-[#167A55]">
          <span>✓ {isHindi ? 'सुलभ' : 'Accessible'}</span>
          <span>•</span>
          <span>✓ {isHindi ? 'व्यक्तिगत' : 'Personalized'}</span>
          <span>•</span>
          <span>✓ {isHindi ? 'ऑफलाइन समर्थित' : 'Offline-first'}</span>
          <span>•</span>
          <span>✓ {isHindi ? 'पारिवारिक जुड़ाव' : 'Caregiver-supported'}</span>
        </div>

        {/* Offline Status Badge */}
        <div className="pt-2 flex items-center gap-2 text-xs sm:text-sm font-bold px-4 py-1.5 rounded-full bg-[#EAF7EF] border border-[#167A55]/30 text-[#167A55]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#167A55] animate-ping" aria-hidden="true" />
          <span>🟢 {isHindi ? 'ऑफलाइन तैयार • डेटा स्थानीय रूप से सुरक्षित है' : 'Offline Ready • Data is stored locally'}</span>
        </div>

        {/* Medical disclaimer note */}
        <p className="text-xs text-[#5D7184] max-w-2xl mx-auto pt-2">
          {isHindi
            ? 'महत्वपूर्ण सूचना: यादसाथी केयर एक संज्ञानात्मक जुड़ाव और स्मृति-सहायता मंच है। यह किसी भी चिकित्सकीय स्थिति का निदान, उपचार या इलाज नहीं करता है।'
            : 'Important: YaadSaathi Care is a cognitive engagement and memory-support platform. It does not diagnose, treat, or cure any medical condition.'}
        </p>
      </div>
    </footer>
  );
}
