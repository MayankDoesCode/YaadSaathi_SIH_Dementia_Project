import React from 'react';
import { RotateCcw } from 'lucide-react';
import { useI18n } from '../../i18n/I18nContext';

/** Shared "Play Again / Other Games" button row shown on every game's result screen. */
export default function GameCompletionActions({ onPlayAgain, onOtherGames, theme }) {
  const { t } = useI18n();

  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <button
        onClick={onPlayAgain}
        className="tactile-btn px-8 py-4 sm:py-5 rounded-2xl text-white font-black text-xl sm:text-2xl flex items-center gap-3 shadow-lg cursor-pointer border-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        style={{ backgroundColor: theme.btnBg, borderColor: theme.btnBorder }}
      >
        <RotateCcw className="w-7 h-7 stroke-[3]" aria-hidden="true" />
        <span>{t('playAgain')}</span>
      </button>

      <button
        onClick={onOtherGames}
        className="tactile-btn px-6 py-4 sm:py-5 rounded-2xl bg-white hover:bg-[#FBFAF4] border-2 border-[#DFF3E7] text-[#102A43] font-black text-xl cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#167A55]"
      >
        {t('otherGames')}
      </button>
    </div>
  );
}
