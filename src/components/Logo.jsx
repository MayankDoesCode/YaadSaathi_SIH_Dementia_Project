import React from 'react';

/**
 * Logo.jsx - Custom YaadSaathi Care Logo
 * Concept: A green leaf forming the outline of a heart with a warm orange/yellow heart inside,
 * symbolizing: Memory + Care + Family + Growth.
 */
export default function Logo({ size = 'md', showTagline = false, className = '' }) {
  const sizeMap = {
    sm: { icon: 38, title: 'text-xl', subtitle: 'text-[11px]' },
    md: { icon: 50, title: 'text-2xl sm:text-3xl', subtitle: 'text-xs sm:text-sm' },
    lg: { icon: 72, title: 'text-3xl sm:text-5xl', subtitle: 'text-base sm:text-lg' },
  };

  const current = sizeMap[size] || sizeMap.md;

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* SVG Leaf forming Heart with Warm Heart inside */}
      <svg
        width={current.icon}
        height={current.icon}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 drop-shadow-sm transition-transform hover:scale-105 duration-200"
        aria-label="यादसाथी लोगो (YaadSaathi Logo)"
      >
        {/* Outer Leaf-Heart in Deep & Soft Green */}
        <path
          d="M50 88C50 88 16 66 16 38C16 23 27 14 39 14C45.5 14 50 18 50 18C50 18 54.5 14 61 14C73 14 84 23 84 38C84 66 50 88 50 88Z"
          fill="#DFF3E7"
          stroke="#167A55"
          strokeWidth="4.5"
          strokeLinejoin="round"
        />

        {/* Leaf Stem / Vein Detail */}
        <path
          d="M50 82C50 82 48 55 50 24"
          stroke="#167A55"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path
          d="M50 50C42 45 35 44 32 46"
          stroke="#167A55"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M50 38C58 33 65 33 68 35"
          stroke="#167A55"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Inner Warm Heart (Memory & Family Core) in Orange/Yellow */}
        <path
          d="M50 64C50 64 34 51 34 38C34 31 39 26 44 26C47.5 26 50 28.5 50 28.5C50 28.5 52.5 26 56 26C61 26 66 31 66 38C66 51 50 64 50 64Z"
          fill="#FFF0D7"
          stroke="#E98A20"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        {/* Inner glow dot */}
        <circle cx="50" cy="40" r="3" fill="#E98A20" />
      </svg>

      {/* Brand Names & Tagline */}
      <div className="text-left">
        <div className="flex items-baseline gap-2">
          <span className={`font-black text-[#102A43] tracking-tight leading-none ${current.title}`}>
            यादसाथी
          </span>
          <span className="font-bold text-[#167A55] tracking-wide text-xs sm:text-sm">
            Care
          </span>
        </div>
        <span className={`block font-semibold text-[#5D7184] tracking-wide ${current.subtitle}`}>
          YaadSaathi Care
        </span>
        {showTagline && (
          <span className="block text-xs sm:text-sm font-bold text-[#E98A20] mt-0.5">
            "साथ यादों का, हर दिन के लिए।"
          </span>
        )}
      </div>
    </div>
  );
}
