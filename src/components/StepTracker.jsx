import React, { useState } from 'react';
import { Plus, RotateCcw, Calendar, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useI18n } from '../i18n/I18nContext';
import VoiceButton from './VoiceButton';

export default function StepTracker() {
  const { stepsToday, stepsGoal, addSteps, resetSteps } = useApp();
  const { t, isHindi } = useI18n();
  const [showWeeklyModal, setShowWeeklyModal] = useState(false);

  const percentage = Math.min(Math.round((stepsToday / stepsGoal) * 100), 100);
  const remaining = Math.max(stepsGoal - stepsToday, 0);

  const weeklySteps = [
    { day: isHindi ? 'सोमवार' : 'Monday', steps: 3200 },
    { day: isHindi ? 'मंगलवार' : 'Tuesday', steps: 4100 },
    { day: isHindi ? 'बुधवार' : 'Wednesday', steps: 2800 },
    { day: isHindi ? 'गुरुवार' : 'Thursday', steps: 3900 },
    { day: isHindi ? 'शुक्रवार' : 'Friday', steps: 4500 },
    { day: isHindi ? 'शनिवार' : 'Saturday', steps: 4800 },
    { day: isHindi ? 'रविवार (आज)' : 'Sunday (Today)', steps: stepsToday },
  ];

  return (
    <section
      id="step-tracker-section"
      className="bg-white rounded-[2.5rem] p-6 sm:p-8 border-3 border-[#DFF3E7] shadow-sm text-left contrast-card space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-[#EAF7EF] border-2 border-[#167A55]/30 text-[#167A55] flex items-center justify-center text-3xl shrink-0">
            🚶
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#EAF7EF] text-[#167A55] font-black text-xs uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('stepsPhysical')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#102A43]">
              {t('stepsTitle')}
            </h2>
          </div>
        </div>

        <VoiceButton
          id="steps-voice-btn"
          textHindi={`आज आपने पांच हजार में से ${stepsToday} कदम पूरे किए हैं। थोड़ा चलना, लंबी उम्र का साथी है।`}
          textEnglish={`You have completed ${stepsToday} out of 5000 steps today. A little walk can brighten your day.`}
          size="md"
          label={isHindi ? 'कदम रिपोर्ट सुनें' : 'Listen Step Report'}
        />
      </div>

      {/* Progress Bar & Big Numbers */}
      <div className="space-y-3">
        <div className="flex items-baseline justify-between flex-wrap gap-2">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl sm:text-5xl font-black text-[#167A55]">
              {stepsToday.toLocaleString('en-IN')}
            </span>
            <span className="text-xl sm:text-2xl font-bold text-[#5D7184]">
              / {stepsGoal.toLocaleString('en-IN')} {isHindi ? 'कदम' : 'Steps'}
            </span>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-[#167A55]">
            {percentage}% {isHindi ? 'पूर्ण' : 'Done'}
          </span>
        </div>

        {/* Large Horizontal Progress Bar */}
        <div className="w-full h-6 bg-[#EAF7EF] rounded-full overflow-hidden border-2 border-[#DFF3E7] p-0.5">
          <div
            className="h-full bg-gradient-to-r from-[#167A55] to-[#2879D0] rounded-full transition-all duration-700"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* 3 Status Columns */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
        <div className="p-4 rounded-2xl bg-[#FBFAF4] border border-[#E2E8F0]">
          <span className="text-xs font-black uppercase text-[#5D7184] block">
            {t('stepsGoal')}
          </span>
          <span className="text-2xl font-black text-[#102A43] block mt-0.5">
            5,000 {isHindi ? 'कदम' : 'Steps'}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[#EAF7EF] border border-[#DFF3E7]">
          <span className="text-xs font-black uppercase text-[#167A55] block">
            {t('stepsCompleted')}
          </span>
          <span className="text-2xl font-black text-[#167A55] block mt-0.5">
            {stepsToday.toLocaleString('en-IN')} {isHindi ? 'कदम' : 'Steps'}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[#FFF0D7] border border-[#E98A20]/30">
          <span className="text-xs font-black uppercase text-[#E98A20] block">
            {t('stepsRemaining')}
          </span>
          <span className="text-2xl font-black text-[#E98A20] block mt-0.5">
            {remaining.toLocaleString('en-IN')} {isHindi ? 'कदम' : 'Steps'}
          </span>
        </div>
      </div>

      {/* Motivational Message */}
      <div className="p-4 rounded-2xl bg-[#E6F1FF] border border-[#2879D0]/30 flex items-center gap-3.5">
        <span className="text-3xl">🌿</span>
        <div>
          <p className="text-lg sm:text-xl font-black text-[#2879D0]">
            "{t('stepsMessage')}"
          </p>
          <p className="text-xs sm:text-sm font-bold text-[#5D7184]">
            {isHindi ? 'नियमित रूप से टहलना हृदय और स्मृति को सक्रिय रखता है।' : 'Regular gentle walking keeps heart and memory refreshed.'}
          </p>
        </div>
      </div>

      {/* Part 19: Action Buttons: +100, +500, Reset, and Weekly */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* +100 Steps */}
          <button
            id="add-100-steps-btn"
            onClick={() => addSteps(100)}
            className="tactile-btn px-4 py-3 rounded-2xl bg-[#EAF7EF] hover:bg-[#DFF3E7] border-2 border-[#167A55] text-[#167A55] font-black text-base flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>{t('add100Steps')}</span>
          </button>

          {/* +500 Steps */}
          <button
            id="add-500-steps-btn"
            onClick={() => addSteps(500)}
            className="tactile-btn px-5 py-3 rounded-2xl bg-[#167A55] hover:bg-[#115C40] border-2 border-[#0D4E36] text-white font-black text-base flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <Plus className="w-5 h-5 stroke-[3]" />
            <span>{t('add500Steps')}</span>
          </button>

          {/* Reset Steps */}
          <button
            id="reset-steps-btn"
            onClick={resetSteps}
            className="tactile-btn px-4 py-3 rounded-2xl bg-white hover:bg-slate-100 border-2 border-[#CBD5E1] text-[#5D7184] hover:text-[#102A43] font-black text-base flex items-center gap-1.5 cursor-pointer"
            title="कदम रीसेट करें"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t('resetSteps')}</span>
          </button>
        </div>

        <button
          id="view-weekly-steps-btn"
          onClick={() => setShowWeeklyModal(true)}
          className="tactile-btn px-4 py-3 rounded-2xl bg-white hover:bg-[#FBFAF4] border-2 border-[#E2E8F0] text-[#102A43] font-black text-sm sm:text-base flex items-center gap-2 cursor-pointer"
        >
          <Calendar className="w-5 h-5 text-[#2879D0]" />
          <span>{t('viewWeekly')}</span>
        </button>
      </div>

      {/* Part 19: Clearly labeled Demo Step Data */}
      <div className="p-2.5 rounded-xl bg-[#FBFAF4] border border-[#DFF3E7] flex items-center gap-2 text-xs font-bold text-[#5D7184]">
        <span className="w-2 h-2 rounded-full bg-[#167A55]" />
        <span>{t('demoStepData')}</span>
      </div>

      {/* Weekly Steps Modal */}
      {showWeeklyModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#102A43]/70 backdrop-blur-sm animate-slow-fade text-left"
        >
          <div className="w-full max-w-lg bg-white rounded-[2.5rem] p-6 sm:p-8 border-4 border-[#DFF3E7] shadow-2xl space-y-4">
            <h3 className="text-2xl font-black text-[#102A43]">
              {t('viewWeekly')}
            </h3>
            <div className="space-y-2 pt-2">
              {weeklySteps.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#FBFAF4] border border-[#E2E8F0] font-bold text-base"
                >
                  <span className="text-[#102A43]">{item.day}</span>
                  <span className="text-[#167A55] font-black">{item.steps.toLocaleString('en-IN')} {isHindi ? 'कदम' : 'Steps'}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowWeeklyModal(false)}
              className="tactile-btn w-full mt-4 py-3.5 rounded-2xl bg-[#167A55] text-white font-black text-lg cursor-pointer"
            >
              {isHindi ? 'ठीक है (बंद करें)' : 'Close'}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
