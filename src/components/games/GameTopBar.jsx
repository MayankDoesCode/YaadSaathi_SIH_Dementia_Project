import React from 'react';
import { RotateCcw, Volume2, ArrowLeft } from 'lucide-react';
import { useI18n } from '../../i18n/I18nContext';

/**
 * Shared header for every cognitive game: back button, title banner with
 * theme accent, and the Listen Rules / Restart action row. Centralizing this
 * keeps all four games visually and behaviorally consistent.
 */
export default function GameTopBar({ icon, title, tagline, subtitle, theme, onBack, onListenRules, onRestart }) {
  const { t } = useI18n();

  return (
    <>
      <button
        onClick={onBack}
        className="tactile-btn inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border-2 border-[#DFF3E7] text-[#102A43] font-bold text-base hover:bg-[#EAF7EF] cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#167A55]"
      >
        <ArrowLeft className="w-5 h-5 text-[#167A55]" />
        <span>{t('backToGames')}</span>
      </button>

      <div
        className="rounded-[2.5rem] p-6 sm:p-8 border-3 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
        style={{ backgroundColor: theme.bg, borderColor: `${theme.border}66` }}
      >
        <div>
          <div className="flex items-center gap-2.5 mb-1 flex-wrap">
            <span className="text-4xl" aria-hidden="true">{icon}</span>
            <h1 className="text-3xl sm:text-5xl font-black text-[#102A43]">{title}</h1>
          </div>
          <p className="text-xl sm:text-2xl font-black" style={{ color: theme.text }}>
            "{tagline}"
          </p>
          <p className="text-base sm:text-lg font-bold text-[#5D7184] mt-0.5">{subtitle}</p>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          <button
            onClick={onListenRules}
            className="tactile-btn flex items-center gap-2 px-5 py-3 rounded-2xl bg-white border-2 font-black text-lg min-h-[52px] cursor-pointer shadow-xs focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ borderColor: theme.text, color: theme.text }}
          >
            <Volume2 className="w-6 h-6" aria-hidden="true" />
            <span>🔊 {t('listenRulesBtn')}</span>
          </button>

          <button
            onClick={onRestart}
            className="tactile-btn flex items-center gap-2 px-5 py-3 rounded-2xl border-2 text-white font-black text-lg min-h-[52px] cursor-pointer shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ backgroundColor: theme.btnBg, borderColor: theme.btnBorder }}
          >
            <RotateCcw className="w-6 h-6 stroke-[2.5]" aria-hidden="true" />
            <span>{t('restartGame')}</span>
          </button>
        </div>
      </div>
    </>
  );
}
