import React, { useState } from 'react';
import {
  CalendarCheck,
  CheckCircle2,
  Circle,
  Plus,
  Pill,
  Droplets,
  Sun,
  Coffee,
  Clock,
  Volume2,
  X,
  PhoneCall,
  AlertTriangle,
  History,
  Sparkles,
  Edit2,
  Trash2,
  Play,
  RotateCcw,
  ShieldCheck,
  Info,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useI18n } from '../i18n/I18nContext';
import VoiceButton from '../components/VoiceButton';

export default function Reminders() {
  const {
    reminders,
    toggleReminder,
    sounds,
    voice,
    medicines,
    medicineHistory,
    confirmMedicineTaken,
    snoozeMedicineReminder,
    addMedicine,
    updateMedicine,
    deleteMedicine,
    simulateTriggerReminder,
    simulateSnooze15,
    simulateEscalate60,
    navigateTo,
  } = useApp();

  const { t, isHindi } = useI18n();

  // Primary Tab: 'routine', 'medicines', 'history'
  const [mainTab, setMainTab] = useState('medicines');

  // Routine Reminders Filter
  const [activeFilter, setActiveFilter] = useState('all');
  const [addRoutineModalOpen, setAddRoutineModalOpen] = useState(false);

  // New Routine Form State
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('10:00 AM');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState('medicine');

  // Add / Edit Medicine Modal State
  const [medicineModalOpen, setMedicineModalOpen] = useState(false);
  const [editingMedId, setEditingMedId] = useState(null);
  const [medName, setMedName] = useState('');
  const [medDosage, setMedDosage] = useState('1 tablet');
  const [medTime, setMedTime] = useState('08:00');
  const [medFrequency, setMedFrequency] = useState('Daily');
  const [medInstructions, setMedInstructions] = useState('');
  const [medInterval, setMedInterval] = useState(15);
  const [medEscalation, setMedEscalation] = useState(60);

  // Filtered Routine reminders
  const filteredReminders = reminders.filter((rem) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'morning') return rem.period === 'morning';
    if (activeFilter === 'afternoon') return rem.period === 'afternoon';
    if (activeFilter === 'evening') return rem.period === 'evening' || rem.period === 'night';
    return true;
  });
  const completedRoutineCount = reminders.filter((r) => r.completed).length;

  // Medicine Metrics
  const totalMeds = medicines.length;
  const takenMeds = medicines.filter((m) => m.status === 'TAKEN').length;
  const pendingMeds = medicines.filter((m) => m.status === 'REMINDER_PENDING').length;
  const alertMeds = medicines.filter((m) => m.status === 'NOT_CONFIRMED').length;

  // Adherence Calculation (Requirement 13: Confirmed doses / scheduled doses * 100)
  const totalScheduledDoses = medicines.length + medicineHistory.length;
  const totalConfirmedDoses = takenMeds + medicineHistory.filter((h) => h.status === 'TAKEN').length;
  const adherenceRate = totalScheduledDoses > 0
    ? Math.round((totalConfirmedDoses / totalScheduledDoses) * 100)
    : 100;

  const handleOpenAddMedicine = () => {
    sounds.playClickChime();
    setEditingMedId(null);
    setMedName('');
    setMedDosage('1 tablet');
    setMedTime('08:00');
    setMedFrequency('Daily');
    setMedInstructions('After breakfast with water');
    setMedInterval(15);
    setMedEscalation(60);
    setMedicineModalOpen(true);
  };

  const handleOpenEditMedicine = (med) => {
    sounds.playClickChime();
    setEditingMedId(med.id);
    setMedName(med.name);
    setMedDosage(med.dosage);
    setMedTime(med.scheduledTime);
    setMedFrequency(med.frequency);
    setMedInstructions(med.instructions);
    setMedInterval(med.reminderIntervalMinutes || 15);
    setMedEscalation(med.escalationAfterMinutes || 60);
    setMedicineModalOpen(true);
  };

  const handleSaveMedicine = (e) => {
    e.preventDefault();
    if (!medName.trim()) return;

    if (editingMedId) {
      updateMedicine(editingMedId, {
        name: medName,
        dosage: medDosage,
        scheduledTime: medTime,
        frequency: medFrequency,
        instructions: medInstructions,
        reminderIntervalMinutes: Number(medInterval),
        escalationAfterMinutes: Number(medEscalation),
      });
    } else {
      addMedicine({
        name: medName,
        dosage: medDosage,
        scheduledTime: medTime,
        frequency: medFrequency,
        instructions: medInstructions,
        reminderIntervalMinutes: Number(medInterval),
        escalationAfterMinutes: Number(medEscalation),
      });
    }
    setMedicineModalOpen(false);
  };

  const handleAddRoutine = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    sounds.playSuccessChime();
    const newItem = {
      id: `custom-${Date.now()}`,
      time: newTime || '10:00 AM',
      period: 'morning',
      titleHindi: newTitle,
      titleEnglish: newTitle,
      descriptionHindi: newDesc || 'समय पर ध्यान रखें।',
      descriptionEnglish: newDesc || 'Take on time.',
      category: newCategory,
      completed: false,
    };
    reminders.push(newItem);
    setAddRoutineModalOpen(false);
    setNewTitle('');
    setNewDesc('');
    voice.speak('नई दिनचर्या सफलतापूर्वक जोड़ दी गई है।', 'New routine added successfully.');
  };

  const getCategoryIcon = (cat) => {
    switch (cat) {
      case 'water':
        return <Droplets className="w-8 h-8 text-[#2879D0]" />;
      case 'wellness':
        return <Sun className="w-8 h-8 text-[#E98A20]" />;
      case 'activity':
        return <Coffee className="w-8 h-8 text-[#E98A20]" />;
      case 'family':
        return <PhoneCall className="w-8 h-8 text-[#E84D78]" />;
      default:
        return <Pill className="w-8 h-8 text-[#167A55]" />;
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in text-left">
      {/* 1. Top Banner */}
      <div className="bg-[#EAF7EF] rounded-[2.5rem] p-6 sm:p-8 border-3 border-[#167A55]/30 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#167A55]/30 text-[#167A55] font-black text-sm mb-2">
            <CalendarCheck className="w-4 h-4 text-[#167A55]" />
            <span>{isHindi ? 'दवाइयाँ व दिनचर्या • Daily Schedule' : 'Medicines & Daily Routine'}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-[#102A43]">
            {t('reminders')}
          </h1>
          <p className="mt-1 text-xl sm:text-2xl font-black text-[#167A55]">
            {takenMeds} / {totalMeds} {isHindi ? 'दवाइयों की पुष्टि हुई' : 'medicines confirmed'} ({adherenceRate}% {t('medicationAdherence')})
          </p>
          <p className="text-base sm:text-lg font-bold text-[#5D7184]">
            {t('remindersSub')}
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          <VoiceButton
            id="reminders-header-voice-btn"
            textHindi={`आज आपके पास कुल ${totalMeds} दवाइयाँ निर्धारित हैं, जिनमें से ${takenMeds} की पुष्टि हो चुकी है।`}
            textEnglish={`You have ${totalMeds} scheduled medicines today. ${takenMeds} are confirmed taken.`}
            size="lg"
            label={t('listenReminders')}
          />

          <button
            id="open-add-medicine-header-btn"
            onClick={handleOpenAddMedicine}
            className="tactile-btn flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#167A55] hover:bg-[#115C40] border-2 border-[#0D4E36] text-white font-black text-lg sm:text-xl min-h-[52px] shadow-md cursor-pointer"
          >
            <Plus className="w-6 h-6 stroke-[3]" />
            <span>+ {t('addMedicine')}</span>
          </button>
        </div>
      </div>

      {/* Safety Reassurance Note (Requirement 21) */}
      <div className="p-4 sm:p-5 rounded-3xl bg-[#FBFAF4] border-2 border-[#DFF3E7] flex items-start gap-3.5">
        <Info className="w-6 h-6 text-[#167A55] shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm font-semibold text-[#5D7184] leading-relaxed">
          <strong className="text-[#102A43] font-black block text-sm sm:text-base">
            {isHindi ? 'महत्वपूर्ण सूचना (User Confirmation Notice):' : 'Important Notice:'}
          </strong>
          {t('medicineDisclaimer')}
        </div>
      </div>

      {/* 2. Main Navigation Tabs */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
        <button
          id="tab-medicines-btn"
          onClick={() => {
            sounds.playClickChime();
            setMainTab('medicines');
          }}
          className={`tactile-btn px-6 py-3 rounded-2xl font-black text-base sm:text-lg flex items-center gap-2 shrink-0 cursor-pointer ${
            mainTab === 'medicines'
              ? 'bg-[#167A55] border-2 border-[#0D4E36] text-white shadow-sm'
              : 'bg-white hover:bg-[#EAF7EF] border-2 border-[#DFF3E7] text-[#102A43]'
          }`}
        >
          <Pill className="w-5 h-5" />
          <span>💊 {t('todaysMedicines')} ({totalMeds})</span>
        </button>

        <button
          id="tab-history-btn"
          onClick={() => {
            sounds.playClickChime();
            setMainTab('history');
          }}
          className={`tactile-btn px-6 py-3 rounded-2xl font-black text-base sm:text-lg flex items-center gap-2 shrink-0 cursor-pointer ${
            mainTab === 'history'
              ? 'bg-[#167A55] border-2 border-[#0D4E36] text-white shadow-sm'
              : 'bg-white hover:bg-[#EAF7EF] border-2 border-[#DFF3E7] text-[#102A43]'
          }`}
        >
          <History className="w-5 h-5" />
          <span>📜 {t('medicineHistory')}</span>
        </button>

        <button
          id="tab-routine-btn"
          onClick={() => {
            sounds.playClickChime();
            setMainTab('routine');
          }}
          className={`tactile-btn px-6 py-3 rounded-2xl font-black text-base sm:text-lg flex items-center gap-2 shrink-0 cursor-pointer ${
            mainTab === 'routine'
              ? 'bg-[#167A55] border-2 border-[#0D4E36] text-white shadow-sm'
              : 'bg-white hover:bg-[#EAF7EF] border-2 border-[#DFF3E7] text-[#102A43]'
          }`}
        >
          <CalendarCheck className="w-5 h-5" />
          <span>📋 {isHindi ? 'दैनिक दिनचर्या (Routine)' : 'Daily Routine'} ({reminders.length})</span>
        </button>
      </div>

      {/* ================================================================= */}
      {/* VIEW 1: TODAY'S MEDICINES (Requirements 1, 3, 5, 6, 7, 8, 11)   */}
      {/* ================================================================= */}
      {mainTab === 'medicines' && (
        <div className="space-y-6">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-white border-2 border-[#DFF3E7]">
              <span className="text-xs font-black uppercase text-[#5D7184] block">
                {t('scheduledTime')}
              </span>
              <span className="text-2xl font-black text-[#102A43]">
                {totalMeds} {isHindi ? 'दवाइयाँ' : 'Scheduled'}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#EAF7EF] border-2 border-[#167A55]/30">
              <span className="text-xs font-black uppercase text-[#167A55] block">
                {t('medicineConfirmed')}
              </span>
              <span className="text-2xl font-black text-[#167A55]">
                {takenMeds} {isHindi ? 'पुष्ट' : 'Taken'}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#FFF0D7] border-2 border-[#E98A20]/30">
              <span className="text-xs font-black uppercase text-[#E98A20] block">
                {t('statusReminderPending')}
              </span>
              <span className="text-2xl font-black text-[#E98A20]">
                {pendingMeds} {isHindi ? 'लंबित' : 'Pending'}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#FFE8EF] border-2 border-[#E84D78]/30">
              <span className="text-xs font-black uppercase text-[#E84D78] block">
                {t('notConfirmed')}
              </span>
              <span className="text-2xl font-black text-[#E84D78]">
                {alertMeds} {isHindi ? 'अलर्ट' : 'Alert'}
              </span>
            </div>
          </div>

          {/* List of Medicine Cards (Requirement 3) */}
          <div className="space-y-4">
            {medicines.map((med) => {
              const isTaken = med.status === 'TAKEN';
              const isPending = med.status === 'REMINDER_PENDING';
              const isAlert = med.status === 'NOT_CONFIRMED';
              const isScheduled = med.status === 'SCHEDULED';

              return (
                <div
                  key={med.id}
                  id={`medicine-card-${med.id}`}
                  className={`tactile-btn p-5 sm:p-7 rounded-[2.5rem] border-3 transition-all flex flex-col md:flex-row md:items-center justify-between gap-5 ${
                    isTaken
                      ? 'bg-[#EAF7EF]/80 border-[#167A55]/40'
                      : isPending
                      ? 'bg-gradient-to-r from-[#FFF0D7] to-white border-[#E98A20] shadow-sm animate-pulse ring-4 ring-[#FFF0D7]'
                      : isAlert
                      ? 'bg-[#FFE8EF] border-[#E84D78] shadow-md'
                      : 'bg-white border-[#DFF3E7] shadow-xs'
                  }`}
                >
                  {/* Left: Icon & Details */}
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-16 h-16 rounded-2xl border-2 flex items-center justify-center text-3xl shrink-0 shadow-xs ${
                        isTaken
                          ? 'bg-[#167A55] text-white border-[#0D4E36]'
                          : isPending
                          ? 'bg-[#E98A20] text-white border-[#C77212]'
                          : isAlert
                          ? 'bg-[#E84D78] text-white border-[#B82B53]'
                          : 'bg-[#EAF7EF] text-[#167A55] border-[#167A55]/30'
                      }`}
                    >
                      💊
                    </div>

                    <div className="space-y-1">
                      {/* Status Badge (Requirement 11, 12) */}
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="px-3 py-0.5 rounded-full font-mono font-black text-xs sm:text-sm bg-white border border-[#DFF3E7] text-[#102A43]">
                          ⏰ {med.scheduledTime}
                        </span>

                        {isTaken && (
                          <span className="px-3 py-0.5 rounded-full bg-[#167A55] text-white font-black text-xs sm:text-sm flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>{t('medicineConfirmed')} ({med.confirmedAt})</span>
                          </span>
                        )}

                        {isPending && (
                          <span className="px-3 py-0.5 rounded-full bg-[#E98A20] text-white font-black text-xs sm:text-sm flex items-center gap-1 animate-bounce">
                            <Clock className="w-4 h-4" />
                            <span>{t('statusReminderPending')} ({med.reminderIntervalMinutes}m)</span>
                          </span>
                        )}

                        {isAlert && (
                          <span className="px-3 py-0.5 rounded-full bg-[#E84D78] text-white font-black text-xs sm:text-sm flex items-center gap-1">
                            <AlertTriangle className="w-4 h-4" />
                            <span>{t('notConfirmed')} • {t('caregiverAlertSent')}</span>
                          </span>
                        )}

                        {isScheduled && (
                          <span className="px-3 py-0.5 rounded-full bg-slate-100 text-[#5D7184] font-black text-xs sm:text-sm">
                            ⚪ {t('statusScheduled')}
                          </span>
                        )}
                      </div>

                      {/* Medicine Name (Requirement 3) */}
                      <h3 className="text-2xl sm:text-3xl font-black text-[#102A43] leading-tight">
                        {med.name}
                      </h3>

                      <p className="text-base sm:text-lg font-black text-[#167A55]">
                        {t('dosage')}: {med.dosage} • {med.frequency}
                      </p>

                      <p className="text-sm sm:text-base font-bold text-[#5D7184]">
                        {t('instructions')}: {med.instructions}
                      </p>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0 self-stretch md:self-center">
                    {/* Voice audio guidance for this medicine */}
                    <VoiceButton
                      id={`voice-med-${med.id}`}
                      textHindi={`${med.name}। खुराक: ${med.dosage}। समय: ${med.scheduledTime}। निर्देश: ${med.instructions}।`}
                      textEnglish={`${med.name}. Dosage: ${med.dosage}. Scheduled time: ${med.scheduledTime}. Instructions: ${med.instructions}.`}
                      size="sm"
                      label={t('listen')}
                    />

                    {/* Requirement 6: "I TOOK MY MEDICINE" button */}
                    {!isTaken ? (
                      <button
                        id={`take-medicine-btn-${med.id}`}
                        onClick={() => confirmMedicineTaken(med.id)}
                        aria-label={t('iTookMyMedicine')}
                        className="tactile-btn px-6 py-3.5 rounded-2xl bg-[#167A55] hover:bg-[#115C40] border-2 border-[#0D4E36] text-white font-black text-base sm:text-lg flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                      >
                        <CheckCircle2 className="w-5 h-5 stroke-[3]" />
                        <span>{t('iTookMyMedicine')}</span>
                      </button>
                    ) : (
                      <div className="px-4 py-2.5 rounded-2xl bg-white border-2 border-[#167A55] text-[#167A55] font-black text-sm flex items-center justify-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{t('medicineConfirmed')}</span>
                      </div>
                    )}

                    {/* Edit / Delete Options */}
                    <div className="flex items-center gap-1.5 self-end sm:self-center">
                      <button
                        onClick={() => handleOpenEditMedicine(med)}
                        className="p-2.5 rounded-xl bg-white hover:bg-[#FBFAF4] border border-[#DFF3E7] text-[#5D7184] hover:text-[#102A43] cursor-pointer"
                        title={t('editMedicine')}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          if (window.confirm(isHindi ? 'क्या आप इस दवाई को हटाना चाहते हैं?' : 'Delete this medicine?')) {
                            deleteMedicine(med.id);
                          }
                        }}
                        className="p-2.5 rounded-xl bg-white hover:bg-rose-50 border border-[#DFF3E7] text-[#5D7184] hover:text-rose-600 cursor-pointer"
                        title={t('deleteMedicine')}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ============================================================= */}
          {/* Requirement 15: PROTOTYPE DEV & DEMO SIMULATION CONTROLS      */}
          {/* ============================================================= */}
          <div className="p-5 rounded-3xl bg-[#FFF0D7] border-2 border-[#E98A20]/40 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 text-[#E98A20]">
                <Sparkles className="w-5 h-5" />
                <h4 className="font-black text-base text-[#102A43]">
                  ⚡ {t('demoControls')}
                </h4>
              </div>
              <span className="text-xs font-bold text-[#A85A00]">
                {isHindi ? 'परीक्षण हेतु तत्काल रिमाइंडर व एस्केलेशन सिमुलेट करें' : 'Simulate reminders and caregiver alerts immediately'}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {medicines.slice(0, 1).map((m) => (
                <React.Fragment key={m.id}>
                  <button
                    id="demo-trigger-now-btn"
                    onClick={() => simulateTriggerReminder(m.id)}
                    className="tactile-btn px-4 py-2.5 rounded-xl bg-white hover:bg-[#FBFAF4] border-2 border-[#E98A20] text-[#102A43] font-black text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Play className="w-4 h-4 text-[#E98A20] fill-[#E98A20]" />
                    <span>{t('triggerNow')}</span>
                  </button>

                  <button
                    id="demo-snooze-15-btn"
                    onClick={() => simulateSnooze15(m.id)}
                    className="tactile-btn px-4 py-2.5 rounded-xl bg-white hover:bg-[#FBFAF4] border-2 border-[#E98A20] text-[#102A43] font-black text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Clock className="w-4 h-4 text-[#E98A20]" />
                    <span>{t('snooze15')}</span>
                  </button>

                  <button
                    id="demo-escalate-60-btn"
                    onClick={() => simulateEscalate60(m.id)}
                    className="tactile-btn px-4 py-2.5 rounded-xl bg-[#FFE8EF] hover:bg-[#FFD9E4] border-2 border-[#E84D78] text-[#E84D78] font-black text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    <span>{t('escalate60')}</span>
                  </button>

                  <button
                    id="demo-confirm-taken-btn"
                    onClick={() => confirmMedicineTaken(m.id)}
                    className="tactile-btn px-4 py-2.5 rounded-xl bg-[#EAF7EF] hover:bg-[#DFF3E7] border-2 border-[#167A55] text-[#167A55] font-black text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{t('markTakenSim')}</span>
                  </button>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* VIEW 2: MEDICINE HISTORY (Requirement 13)                         */}
      {/* ================================================================= */}
      {mainTab === 'history' && (
        <div className="space-y-6">
          {/* Adherence Rate Metric Card */}
          <div className="bg-white rounded-[2.5rem] p-6 sm:p-8 border-2 border-[#DFF3E7] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-black uppercase text-[#5D7184] block mb-1">
                {t('medicationAdherence')}
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-[#167A55]">
                {adherenceRate}%
              </h2>
              <p className="text-sm sm:text-base font-bold text-[#5D7184] mt-1">
                {totalConfirmedDoses} / {totalScheduledDoses} {isHindi ? 'खुराक समय पर पुष्ट की गईं' : 'doses confirmed on time'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#EAF7EF] border border-[#167A55]/30 text-xs sm:text-sm font-semibold text-[#167A55] max-w-md">
              *{t('medicineDisclaimer')}
            </div>
          </div>

          {/* History List */}
          <div className="bg-white rounded-[2.5rem] p-6 sm:p-8 border-2 border-[#DFF3E7] shadow-xs space-y-4">
            <h3 className="text-2xl font-black text-[#102A43]">
              {t('medicineHistory')}
            </h3>

            {medicineHistory.length === 0 ? (
              <p className="text-base font-bold text-[#5D7184] py-4">
                {isHindi ? 'अभी कोई पिछला इतिहास दर्ज नहीं है।' : 'No past medicine records yet.'}
              </p>
            ) : (
              <div className="space-y-3">
                {medicineHistory.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-[#FBFAF4] border border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-bold text-base"
                  >
                    <div>
                      <span className="text-xs font-mono font-bold text-[#5D7184] block">
                        📅 {item.date} • ⏰ {item.scheduledTime}
                      </span>
                      <span className="text-lg font-black text-[#102A43] block mt-0.5">
                        {item.medicineName} ({item.dosage})
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {item.status === 'TAKEN' ? (
                        <span className="px-3 py-1 rounded-xl bg-[#EAF7EF] text-[#167A55] font-black text-sm flex items-center gap-1 border border-[#167A55]/30">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{t('statusTaken')} ({item.confirmedAt})</span>
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-xl bg-[#FFE8EF] text-[#E84D78] font-black text-sm flex items-center gap-1 border border-[#E84D78]/30">
                          <AlertTriangle className="w-4 h-4" />
                          <span>{t('statusNotConfirmed')}</span>
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* VIEW 3: DAILY ROUTINE REMINDERS (Original Feature)                */}
      {/* ================================================================= */}
      {mainTab === 'routine' && (
        <div className="space-y-6">
          {/* Filter Tabs */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
              <button
                onClick={() => {
                  sounds.playClickChime();
                  setActiveFilter('all');
                }}
                className={`tactile-btn px-5 py-2.5 rounded-2xl font-black text-base sm:text-lg shrink-0 cursor-pointer ${
                  activeFilter === 'all'
                    ? 'bg-[#167A55] border-2 border-[#0D4E36] text-white'
                    : 'bg-white hover:bg-[#EAF7EF] border-2 border-[#DFF3E7] text-[#102A43]'
                }`}
              >
                {isHindi ? 'सब देखें (All)' : 'All'}
              </button>
              <button
                onClick={() => {
                  sounds.playClickChime();
                  setActiveFilter('morning');
                }}
                className={`tactile-btn px-5 py-2.5 rounded-2xl font-black text-base sm:text-lg shrink-0 cursor-pointer ${
                  activeFilter === 'morning'
                    ? 'bg-[#167A55] border-2 border-[#0D4E36] text-white'
                    : 'bg-white hover:bg-[#EAF7EF] border-2 border-[#DFF3E7] text-[#102A43]'
                }`}
              >
                🌅 {isHindi ? 'सुबह (Morning)' : 'Morning'}
              </button>
              <button
                onClick={() => {
                  sounds.playClickChime();
                  setActiveFilter('afternoon');
                }}
                className={`tactile-btn px-5 py-2.5 rounded-2xl font-black text-base sm:text-lg shrink-0 cursor-pointer ${
                  activeFilter === 'afternoon'
                    ? 'bg-[#167A55] border-2 border-[#0D4E36] text-white'
                    : 'bg-white hover:bg-[#EAF7EF] border-2 border-[#DFF3E7] text-[#102A43]'
                }`}
              >
                ☀️ {isHindi ? 'दोपहर (Afternoon)' : 'Afternoon'}
              </button>
              <button
                onClick={() => {
                  sounds.playClickChime();
                  setActiveFilter('evening');
                }}
                className={`tactile-btn px-5 py-2.5 rounded-2xl font-black text-base sm:text-lg shrink-0 cursor-pointer ${
                  activeFilter === 'evening'
                    ? 'bg-[#167A55] border-2 border-[#0D4E36] text-white'
                    : 'bg-white hover:bg-[#EAF7EF] border-2 border-[#DFF3E7] text-[#102A43]'
                }`}
              >
                🌙 {isHindi ? 'शाम / रात (Night)' : 'Evening / Night'}
              </button>
            </div>

            <button
              onClick={() => {
                sounds.playClickChime();
                setAddRoutineModalOpen(true);
              }}
              className="tactile-btn px-4 py-2.5 rounded-2xl bg-[#EAF7EF] hover:bg-[#DFF3E7] border border-[#167A55]/30 text-[#167A55] font-black text-base cursor-pointer"
            >
              + {isHindi ? 'कार्य जोड़ें' : 'Add Routine'}
            </button>
          </div>

          {/* Routine Reminders List */}
          <div className="space-y-4">
            {filteredReminders.map((item) => (
              <div
                key={item.id}
                className={`tactile-btn p-5 sm:p-6 rounded-3xl border-3 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  item.completed
                    ? 'bg-[#EAF7EF]/80 border-[#167A55]/40 opacity-90'
                    : 'bg-white border-[#DFF3E7] shadow-xs'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#FBFAF4] border-2 border-[#DFF3E7] flex items-center justify-center shrink-0 shadow-xs">
                    {getCategoryIcon(item.category)}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-3 py-0.5 rounded-xl bg-[#FBFAF4] border border-[#DFF3E7] font-mono font-black text-sm sm:text-base text-[#102A43] flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-[#167A55]" />
                        {item.time}
                      </span>
                      {item.completed && (
                        <span className="px-3 py-0.5 rounded-xl bg-[#DFF3E7] text-[#167A55] font-black text-xs sm:text-sm">
                          ✓ {t('completed')}
                        </span>
                      )}
                    </div>

                    <h2
                      className={`text-2xl sm:text-3xl font-black ${
                        item.completed ? 'line-through text-[#5D7184]' : 'text-[#102A43]'
                      }`}
                    >
                      {isHindi ? item.titleHindi : item.titleEnglish}
                    </h2>
                    <p className="text-base sm:text-lg font-bold text-[#5D7184] mt-1">
                      {isHindi ? item.descriptionHindi : item.descriptionEnglish}
                    </p>
                  </div>
                </div>

                <div className="flex items-center flex-wrap sm:flex-nowrap gap-3 shrink-0 self-end md:self-center">
                  <VoiceButton
                    textHindi={`${item.time} पर: ${item.titleHindi}। ${item.descriptionHindi}`}
                    textEnglish={`At ${item.time}: ${item.titleEnglish}. ${item.descriptionEnglish}`}
                    size="md"
                    label={t('listen')}
                  />

                  <button
                    onClick={() => {
                      sounds.playSuccessChime();
                      toggleReminder(item.id);
                    }}
                    className={`tactile-btn px-6 py-3.5 rounded-2xl font-black text-lg sm:text-xl flex items-center gap-2.5 cursor-pointer min-h-[52px] ${
                      item.completed
                        ? 'bg-[#167A55] border-2 border-[#0D4E36] text-white'
                        : 'bg-[#DFF3E7] hover:bg-[#C2E9D4] border-2 border-[#167A55] text-[#167A55]'
                    }`}
                  >
                    {item.completed ? (
                      <>
                        <CheckCircle2 className="w-6 h-6 stroke-[3]" />
                        <span>{t('completed')}</span>
                      </>
                    ) : (
                      <>
                        <Circle className="w-6 h-6 stroke-[2.5]" />
                        <span>{t('markDone')}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL: ADD / EDIT MEDICINE (Requirement 4)                         */}
      {/* ================================================================= */}
      {medicineModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#102A43]/70 backdrop-blur-sm animate-slow-fade text-left"
        >
          <div className="relative w-full max-w-lg bg-white rounded-[2.5rem] p-6 sm:p-8 border-4 border-[#DFF3E7] shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b-2 border-[#DFF3E7]">
              <div className="flex items-center gap-2.5">
                <span className="text-3xl">💊</span>
                <h3 className="text-2xl font-black text-[#102A43]">
                  {editingMedId ? t('editMedicine') : t('addMedicine')}
                </h3>
              </div>
              <button
                onClick={() => setMedicineModalOpen(false)}
                className="p-2 rounded-xl bg-[#FBFAF4] hover:bg-slate-100 text-[#5D7184] cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSaveMedicine} className="space-y-3.5">
              <div>
                <label className="block text-sm font-black text-[#102A43] mb-1">
                  {t('medicine')} Name:
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Blood Pressure Medicine / Telma 40"
                  value={medName}
                  onChange={(e) => setMedName(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-[#DFF3E7] text-base font-bold focus:border-[#167A55] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-black text-[#102A43] mb-1">
                    {t('dosage')}:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 1 tablet / 1 spoon"
                    value={medDosage}
                    onChange={(e) => setMedDosage(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border-2 border-[#DFF3E7] text-base font-bold focus:border-[#167A55] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-black text-[#102A43] mb-1">
                    {t('scheduledTime')} (HH:mm):
                  </label>
                  <input
                    type="time"
                    required
                    value={medTime}
                    onChange={(e) => setMedTime(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border-2 border-[#DFF3E7] text-base font-bold focus:border-[#167A55] focus:outline-none bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-black text-[#102A43] mb-1">
                    {t('frequency')}:
                  </label>
                  <select
                    value={medFrequency}
                    onChange={(e) => setMedFrequency(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border-2 border-[#DFF3E7] text-base font-bold focus:border-[#167A55] focus:outline-none bg-white"
                  >
                    <option value="Daily">Daily (दैनिक)</option>
                    <option value="Morning & Night">Morning & Night (सुबह-शाम)</option>
                    <option value="Alternate Days">Alternate Days (एक दिन छोड़)</option>
                    <option value="As Needed">As Needed (आवश्यकतानुसार)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-black text-[#102A43] mb-1">
                    {t('reminderInterval')} (mins):
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="60"
                    value={medInterval}
                    onChange={(e) => setMedInterval(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border-2 border-[#DFF3E7] text-base font-bold focus:border-[#167A55] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-black text-[#102A43] mb-1">
                  {t('escalationTime')} (minutes before Caregiver alert):
                </label>
                <input
                  type="number"
                  min="15"
                  max="180"
                  value={medEscalation}
                  onChange={(e) => setMedEscalation(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-[#DFF3E7] text-base font-bold focus:border-[#167A55] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-black text-[#102A43] mb-1">
                  {t('instructions')}:
                </label>
                <input
                  type="text"
                  placeholder="e.g. After breakfast with warm water"
                  value={medInstructions}
                  onChange={(e) => setMedInstructions(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-[#DFF3E7] text-base font-bold focus:border-[#167A55] focus:outline-none"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  className="tactile-btn flex-1 py-4 rounded-2xl bg-[#167A55] hover:bg-[#115C40] border-2 border-[#0D4E36] text-white font-black text-lg cursor-pointer"
                >
                  {isHindi ? 'सुरक्षित करें (Save)' : 'Save Medicine'}
                </button>
                <button
                  type="button"
                  onClick={() => setMedicineModalOpen(false)}
                  className="tactile-btn px-6 py-4 rounded-2xl bg-[#FBFAF4] hover:bg-slate-100 border-2 border-[#DFF3E7] text-[#102A43] font-bold text-base cursor-pointer"
                >
                  {isHindi ? 'रद्द करें' : 'Cancel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL: ADD ROUTINE REMINDER                                       */}
      {/* ================================================================= */}
      {addRoutineModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#102A43]/70 backdrop-blur-sm animate-slow-fade text-left"
        >
          <div className="relative w-full max-w-lg bg-white rounded-[2.5rem] p-6 sm:p-8 border-4 border-[#DFF3E7] shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b-2 border-[#DFF3E7]">
              <h3 className="text-2xl font-black text-[#102A43]">
                {isHindi ? 'नई दिनचर्या जोड़ें' : 'Add Routine Reminder'}
              </h3>
              <button
                onClick={() => setAddRoutineModalOpen(false)}
                className="p-2 rounded-xl bg-[#FBFAF4] hover:bg-slate-100 text-[#5D7184] cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleAddRoutine} className="space-y-4">
              <div>
                <label className="block text-sm font-black text-[#102A43] mb-1">
                  {isHindi ? 'कार्य का नाम:' : 'Title:'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Evening walk / Ginger tea"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-[#DFF3E7] text-base font-bold focus:border-[#167A55] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-black text-[#102A43] mb-1">
                  {isHindi ? 'समय:' : 'Time:'}
                </label>
                <input
                  type="text"
                  placeholder="e.g. 05:00 PM"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-[#DFF3E7] text-base font-bold focus:border-[#167A55] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-black text-[#102A43] mb-1">
                  {isHindi ? 'श्रेणी:' : 'Category:'}
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-[#DFF3E7] text-base font-bold focus:border-[#167A55] focus:outline-none bg-white"
                >
                  <option value="wellness">☀️ {isHindi ? 'स्वास्थ्य / सैर (Walk)' : 'Wellness / Walk'}</option>
                  <option value="water">💧 {isHindi ? 'पानी (Water)' : 'Water'}</option>
                  <option value="activity">☕ {isHindi ? 'चाय / नाश्ता (Tea)' : 'Tea / Snack'}</option>
                  <option value="family">❤️ {isHindi ? 'परिवार (Call)' : 'Family'}</option>
                </select>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  className="tactile-btn flex-1 py-4 rounded-2xl bg-[#167A55] hover:bg-[#115C40] border-2 border-[#0D4E36] text-white font-black text-lg cursor-pointer"
                >
                  {isHindi ? 'सुरक्षित करें' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={() => setAddRoutineModalOpen(false)}
                  className="tactile-btn px-6 py-4 rounded-2xl bg-[#FBFAF4] hover:bg-slate-100 border-2 border-[#DFF3E7] text-[#102A43] font-bold text-base cursor-pointer"
                >
                  {isHindi ? 'रद्द करें' : 'Cancel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
