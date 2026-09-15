import React from 'react';
import Logo from './Logo';
import { Heart, ShieldCheck, Wifi } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-12 bg-white border-t-2 border-[#DFF3E7] py-8 px-4 sm:px-8 text-center text-[#5D7184]">
      <div className="max-w-5xl mx-auto flex flex-col items-center space-y-4">
        {/* Brand & Tagline */}
        <Logo size="md" showTagline={true} />

        <p className="text-lg sm:text-xl font-black text-[#102A43]">
          "Technology with a human touch."
        </p>

        {/* SIH 2026 Core Pillars */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm font-bold text-[#167A55]">
          <span>✓ सुलभ (Accessible)</span>
          <span>•</span>
          <span>✓ व्यक्तिगत (Personalized)</span>
          <span>•</span>
          <span>✓ ऑफलाइन समर्थित (Offline-first)</span>
          <span>•</span>
          <span>✓ पारिवारिक जुड़ाव (Caregiver-supported)</span>
          <span>•</span>
          <span>✓ Made for North Eastern India</span>
        </div>

        {/* Offline Status Badge */}
        <div className="pt-2 flex items-center gap-2 text-xs sm:text-sm font-bold px-4 py-1.5 rounded-full bg-[#EAF7EF] border border-[#167A55]/30 text-[#167A55]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#167A55] animate-ping" />
          <span>🟢 Offline Ready • प्रोटोटाइप डेटा स्थानीय रूप से सुरक्षित है</span>
        </div>

        {/* Medical disclaimer note */}
        <p className="text-xs text-[#5D7184] max-w-2xl mx-auto pt-2">
          महत्वपूर्ण सूचना: यादसाथी केयर एक संज्ञानात्मक जुड़ाव और स्मृति-सहायता मंच है। यह किसी भी चिकित्सकीय स्थिति का निदान, उपचार या इलाज नहीं करता है।
        </p>
      </div>
    </footer>
  );
}
