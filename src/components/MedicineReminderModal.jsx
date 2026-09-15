import React, { useEffect } from 'react';
import { Pill, CheckCircle2, Clock, Volume2, Sparkles, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useI18n } from '../i18n/I18nContext';
import VoiceButton from './VoiceButton';

export default function MedicineReminderModal() {
  const {
    activeMedicineReminder,
    confirmMedicineTaken,
    snoozeMedicineReminder,
    patient,
  } = useApp();
  const { t, isHindi } = useI18n();

  // Issue 12: Keyboard Escape listener to dismiss / snooze reminder
  useEffect(() => {
    if (!activeMedicineReminder) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        snoozeMedicineReminder(activeMedicineReminder.id);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeMedicineReminder, snoozeMedicineReminder]);

  if (!activeMedicineReminder) return null;

  const med = activeMedicineReminder;
  const patientName = isHindi ? (patient?.nameHindi || 'दामोदर जी') : (patient?.nameEnglish || 'Damodar Ji');

  const speechHindi = `${patientName}, आपकी ${med.name} लेने का समय हो गया है। खुराक: ${med.dosage}। निर्देश: ${med.instructions}। कृपया दवाई लेने के बाद 'मैंने दवाई ले ली' बटन दबाएं।`;
  const speechEnglish = `${patientName}, it is time to take your ${med.name}. Dosage: ${med.dosage}. Instructions: ${med.instructions}. Please press 'I Took My Medicine' after taking it.`;

  return (
    /* Issues 11 & 12: High-contrast backdrop-blur overlay with backdrop click dismissal */
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="medicine-reminder-title"
      onClick={() => snoozeMedicineReminder(med.id)}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[#102A43]/95 backdrop-blur-xl animate-slow-fade text-left select-none"
    >
      {/* Issue 17: Container max-h-[88vh] and pb-8 to prevent button clipping */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl bg-white rounded-[2.5rem] p-5 sm:p-8 pb-8 sm:pb-10 border-4 border-[#167A55] shadow-2xl space-y-5 max-h-[88vh] overflow-y-auto"
      >
        {/* Issue 13: Standard top-right close / dismiss button */}
        <button
          id="close-medicine-modal-btn"
          type="button"
          onClick={() => snoozeMedicineReminder(med.id)}
          aria-label={isHindi ? 'दवाई सूचना बंद करें' : 'Close medicine reminder'}
          title={isHindi ? 'बंद करें (बाद में याद दिलाएं)' : 'Close (Remind later)'}
          className="absolute top-5 right-5 w-10 h-10 rounded-full bg-[#FBFAF4] hover:bg-[#EAF7EF] border border-[#CBD5E1] text-[#5D7184] hover:text-[#102A43] flex items-center justify-center text-xl font-black cursor-pointer transition-colors shadow-xs"
        >
          ✕
        </button>

        {/* Header Ribbon - Issue 15: Vertically aligned header & Issue 14: Standardized VoiceButton */}
        <div className="flex items-start justify-between gap-3 border-b-2 border-[#DFF3E7] pb-4 pr-10">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#EAF7EF] border-2 border-[#167A55] text-[#167A55] flex items-center justify-center text-3xl sm:text-4xl shrink-0 animate-bounce">
              🔔
            </div>
            <div>
              <span className="inline-block px-3.5 py-1 rounded-full bg-[#EAF7EF] text-[#167A55] font-black text-xs uppercase tracking-wider mb-1">
                {t('medicineReminder')}
              </span>
              <h2
                id="medicine-reminder-title"
                className="text-2xl sm:text-3xl font-black text-[#102A43] tracking-tight leading-tight"
              >
                {t('medicineTime')}
              </h2>
            </div>
          </div>

          <div className="pt-1 shrink-0">
            {/* Issue 14: Standardized size="sm" matching header voice button */}
            <VoiceButton
              id="medicine-reminder-voice-btn"
              textHindi={speechHindi}
              textEnglish={speechEnglish}
              size="sm"
              label={t('listen')}
            />
          </div>
        </div>

        {/* Personalized Senior Greeting */}
        <div className="p-4 sm:p-5 rounded-3xl bg-[#EAF7EF] border-2 border-[#167A55]/30">
          <p className="text-xl sm:text-2xl font-black text-[#102A43]">
            "{t('timeToTakeMedicine', { name: patientName })}"
          </p>
          <p className="text-sm sm:text-base font-bold text-[#167A55] mt-1">
            {t('pressWhenTaken')}
          </p>
        </div>

        {/* Medicine Details Card */}
        <div className="p-4 sm:p-5 rounded-3xl bg-[#FBFAF4] border-2 border-[#DFF3E7] space-y-3">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white border-2 border-[#167A55]/20 text-[#167A55] flex items-center justify-center text-3xl shrink-0 shadow-xs">
              💊
            </div>
            <div className="flex-1">
              <span className="text-xs font-bold text-[#5D7184] block">
                {t('medicine')}
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-[#102A43] mt-0.5">
                {med.name}
              </h3>
              <p className="text-base sm:text-lg font-black text-[#167A55] mt-0.5">
                {t('dosage')}: {med.dosage}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-sm font-bold text-[#5D7184]">
            <div className="p-3 rounded-xl bg-white border border-[#E2E8F0]">
              <span className="block text-xs font-bold text-[#5D7184]">
                {t('scheduledTime')}
              </span>
              <span className="text-base sm:text-lg font-black text-[#102A43]">
                ⏰ {med.scheduledTime}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white border border-[#E2E8F0]">
              <span className="block text-xs font-bold text-[#5D7184]">
                {t('instructions')}
              </span>
              <span className="text-sm font-bold text-[#102A43]">
                {med.instructions}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons: "I TOOK MY MEDICINE" & "REMIND ME LATER" */}
        {/* Issue 17: Properly sized buttons that never clip */}
        <div className="space-y-3 pt-1">
          {/* PRIMARY CONFIRMATION BUTTON (Requirement 6) */}
          <button
            id="confirm-medicine-taken-btn"
            onClick={() => confirmMedicineTaken(med.id)}
            aria-label={t('iTookMyMedicine')}
            className="tactile-btn w-full py-4 sm:py-4.5 px-6 rounded-2xl bg-[#167A55] hover:bg-[#115C40] border-3 border-[#0D4E36] text-white font-black text-lg sm:text-xl flex items-center justify-center gap-3 shadow-xl cursor-pointer"
          >
            <CheckCircle2 className="w-7 h-7 stroke-[3]" />
            <span>✅ {t('iTookMyMedicine')}</span>
          </button>

          {/* SNOOZE BUTTON (Requirement 8) */}
          <button
            id="snooze-medicine-btn"
            onClick={() => snoozeMedicineReminder(med.id)}
            aria-label={t('remindMeLater')}
            className="tactile-btn w-full py-3.5 px-6 rounded-2xl bg-white hover:bg-[#FBFAF4] border-2 border-[#CBD5E1] text-[#5D7184] hover:text-[#102A43] font-black text-base sm:text-lg flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <Clock className="w-5 h-5" />
            <span>⏰ {t('remindMeLater')} ({med.reminderIntervalMinutes || 15} mins)</span>
          </button>
        </div>

        {/* Informational Safety Note */}
        <p className="text-xs font-medium text-[#5D7184] text-center pt-1">
          *{t('medicineDisclaimer')}
        </p>
      </div>
    </div>
  );
}
