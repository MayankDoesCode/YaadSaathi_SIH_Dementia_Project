import React from 'react';
import { useI18n } from '../../i18n/I18nContext';
import VoiceButton from '../VoiceButton';

/**
 * Shared "why the difficulty changed" card shown at the end of every game.
 * Uses deterministic, explainable reasoning from the adaptive engine
 * (no AI claims) — see src/logic/adaptiveEngine.js.
 */
export default function AdaptiveDifficultyCard({ adaptiveResult, accuracyPercent, avgResponseTime }) {
  const { t, isHindi } = useI18n();

  if (!adaptiveResult) return null;

  const reasonText = isHindi ? adaptiveResult.reasonHindi : adaptiveResult.reason;

  return (
    <div className="max-w-xl mx-auto my-6 p-5 sm:p-6 rounded-3xl bg-white border-3 border-[#167A55]/30 shadow-sm text-left">
      <div className="flex items-center justify-between gap-2 flex-wrap pb-3 border-b-2 border-[#EAF7EF]">
        <div className="flex items-center gap-2.5">
          <span className="text-3xl" aria-hidden="true">🧠</span>
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-[#102A43] leading-tight">
              {t('adaptiveEngineTitle')}
            </h3>
            <p className="text-xs text-[#5D7184] font-bold">{t('adaptiveEngineSubtitle')}</p>
          </div>
        </div>
        <span className="px-3 py-1.5 rounded-xl font-black text-sm border-2 bg-[#EAF7EF] border-[#167A55] text-[#167A55]">
          {t('nextLevelLabel', { level: adaptiveResult.nextDifficulty })}
        </span>
      </div>

      <div className="mt-4 space-y-1">
        <p className="text-xl sm:text-2xl font-black text-[#102A43] leading-snug">"{reasonText}"</p>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-3 flex-wrap">
        <span className="text-xs sm:text-sm font-bold text-[#5D7184]">
          {t('accuracyLabel')}: {accuracyPercent}% • {t('speedLabel')}: {avgResponseTime}s
        </span>
        <VoiceButton
          textHindi={adaptiveResult.reasonHindi}
          textEnglish={adaptiveResult.reason}
          size="sm"
          label={t('listenRecommendation')}
        />
      </div>
    </div>
  );
}
