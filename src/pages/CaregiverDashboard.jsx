import React, { useState } from 'react';
import {
  UserCheck,
  Activity,
  Heart,
  TrendingUp,
  ShieldCheck,
  Pill,
  Clock,
  PhoneCall,
  MapPin,
  Mic,
  Smile,
  AlertCircle,
  Save,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import VoiceButton from '../components/VoiceButton';

export default function CaregiverDashboard() {
  const {
    patient,
    setPatient,
    reminders,
    todayMood,
    caregiverMetrics,
    sounds,
    voice,
  } = useApp();

  const [voiceRecordSimulated, setVoiceRecordSimulated] = useState(false);
  const [recordedMessage, setRecordedMessage] = useState(
    'पिताजी, शाम 5 बजे अपनी अदरक वाली चाय पीना मत भूलिएगा! - आपकी बेटी प्रिया'
  );
  const [recordFeedback, setRecordFeedback] = useState('');

  const completedReminders = reminders.filter((r) => r.completed).length;
  const adherencePercent = Math.round((completedReminders / reminders.length) * 100);

  const handleSimulateRecord = () => {
    sounds.playClickChime();
    setVoiceRecordSimulated(true);
    setRecordFeedback('आवाज रिकॉर्ड हो रही है... (Recording simulated...)');

    setTimeout(() => {
      setRecordFeedback('पारिवारिक आवाज संदेश सफलतापूर्वक सहेजा गया! (Voice note saved!)');
      sounds.playSuccessChime();
      voice.speak(
        'पारिवारिक आवाज संदेश रिकॉर्ड कर लिया गया है। यह रिमाइंडर के समय दामोदर जी को सुनाया जाएगा।',
        'Voice reminder recorded successfully.'
      );
    }, 1800);
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in text-left">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-teal-100 via-cyan-50 to-teal-100 rounded-3xl p-6 sm:p-8 border-4 border-teal-300 shadow-md contrast-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-200 border border-teal-400 text-teal-950 font-extrabold text-sm mb-2">
            <UserCheck className="w-4 h-4" />
            <span>देखभालकर्ता नियंत्रण कक्ष / Caregiver Portal</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
            देखभालकर्ता डैशबोर्ड (Caregiver Telemetry)
          </h1>
          <p className="mt-1 text-base sm:text-lg font-bold text-teal-950">
            रोगी: {patient.nameHindi} ({patient.age} वर्ष) • स्थिति: {patient.condition}
          </p>
        </div>

        <VoiceButton
          textHindi="यह देखभालकर्ता डैशबोर्ड है। यहाँ आप दामोदर जी की दवा अनुपालन दर, दिमागी खेल प्रगति और आपातकालीन संपर्क देख सकते हैं।"
          textEnglish="This is the Caregiver Dashboard. Monitor medicine adherence, game progress, and emergency safety."
          size="lg"
          label="विवरण सुनें"
        />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Medicine Adherence */}
        <div className="bg-white rounded-3xl p-5 border-2 border-emerald-300 shadow-sm contrast-card">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-500">दवा अनुपालन दर</span>
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
              <Pill className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black text-emerald-700">
              {adherencePercent}%
            </span>
            <span className="text-xs font-bold text-emerald-600">आज (Today)</span>
          </div>
          <p className="text-xs text-slate-600 font-medium mt-1">
            {completedReminders} में से {reminders.length} दवाइयां समय पर ली गईं।
          </p>
        </div>

        {/* 2. Cognitive Engagement */}
        <div className="bg-white rounded-3xl p-5 border-2 border-amber-300 shadow-sm contrast-card">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-500">संज्ञानात्मक जुड़ाव</span>
            <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black text-amber-700">92%</span>
            <span className="text-xs font-bold text-emerald-600">↑ +12% सुधार</span>
          </div>
          <p className="text-xs text-slate-600 font-medium mt-1">
            प्रतिदिन औसतन 28 मिनट सक्रिय दिमागी कसरत।
          </p>
        </div>

        {/* 3. Patient Mood Today */}
        <div className="bg-white rounded-3xl p-5 border-2 border-sky-300 shadow-sm contrast-card">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-500">आज का भावनात्मक स्तर</span>
            <div className="p-2 rounded-xl bg-sky-100 text-sky-800">
              <Smile className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-sky-900">
              {todayMood === 'happy' ? '😊 शांत व प्रसन्न' : todayMood === 'okay' ? '😐 सामान्य' : '😟 ध्यान अपेक्षित'}
            </span>
          </div>
          <p className="text-xs text-slate-600 font-medium mt-1">
            मरीज द्वारा सुबह 9:15 बजे दर्ज किया गया।
          </p>
        </div>

        {/* 4. Safe Zone Status */}
        <div className="bg-white rounded-3xl p-5 border-2 border-teal-300 shadow-sm contrast-card">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-500">जियो-फेंस सुरक्षा स्थिति</span>
            <div className="p-2 rounded-xl bg-teal-100 text-teal-800">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-emerald-700 font-black text-xl">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
            <span>सुरक्षित क्षेत्र (घर पर)</span>
          </div>
          <p className="text-xs text-slate-600 font-medium mt-1">
            {caregiverMetrics.geoStatus.location}
          </p>
        </div>
      </div>

      {/* Weekly Activity Chart Simulation */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-slate-200 shadow-md contrast-card space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-2xl font-black text-slate-900">
              साप्ताहिक दिमागी कसरत ग्राफ (Weekly Cognitive Performance)
            </h2>
            <p className="text-sm font-semibold text-slate-500">
              स्मृति खेल, पैटर्न पहचान और शब्द जुड़ाव का दैनिक स्कोर
            </p>
          </div>
          <span className="px-3.5 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 font-black text-sm">
            औसत स्कोर: 89 / 100
          </span>
        </div>

        {/* Visual Bar Graph */}
        <div className="pt-4 grid grid-cols-7 gap-2 sm:gap-4 items-end h-48 sm:h-60 border-b-2 border-slate-200 pb-2">
          {caregiverMetrics.weeklyEngagement.map((day, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end">
              <span className="text-xs font-black text-teal-800 hidden sm:inline">
                {day.score}%
              </span>
              <div
                style={{ height: `${day.score}%` }}
                className={`w-full rounded-2xl transition-all duration-500 ${
                  day.dayEnglish.includes('Today')
                    ? 'bg-gradient-to-t from-teal-600 to-emerald-400 ring-4 ring-emerald-300'
                    : 'bg-gradient-to-t from-teal-400 to-cyan-300 hover:brightness-110'
                }`}
                title={`${day.dayHindi}: ${day.score}% (${day.minutes} mins)`}
              />
              <span className="text-xs sm:text-sm font-black text-slate-700">
                {day.dayHindi}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Memory Match Cognitive Telemetry Log (From localStorage) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-amber-200 shadow-md contrast-card space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🪔</span>
            <div>
              <h2 className="text-2xl font-black text-slate-900">
                स्मृति मिलान खेल टेलीमेट्री (Memory Match Telemetry Log)
              </h2>
              <p className="text-sm font-semibold text-slate-500">
                प्रयास, सटीकता, कुल समय और प्रतिक्रिया गति का लाइव रिकॉर्ड
              </p>
            </div>
          </div>
          <span className="px-3.5 py-1.5 rounded-xl bg-amber-100 text-amber-900 font-bold text-sm">
            लोकल डेटाबेस (localStorage)
          </span>
        </div>

        {(() => {
          let history = [];
          try {
            history = JSON.parse(localStorage.getItem('yaadsaathi_memory_history') || '[]');
          } catch {
            history = [];
          }

          if (history.length === 0) {
            return (
              <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200 text-amber-900 text-base font-bold">
                अभी तक कोई सत्र पूरा नहीं हुआ है। जब दामोदर जी स्मृति मिलान खेल खेलेंगे, उनका डेटा यहाँ स्वतः प्रदर्शित होगा।
              </div>
            );
          }

          return (
            <div className="space-y-3">
              {history.slice(0, 4).map((record) => (
                <div
                  key={record.id}
                  className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-200 flex flex-wrap items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black">
                      ✓
                    </div>
                    <div>
                      <p className="text-base font-black text-slate-900">
                        6 जोड़ियां सफल (6 Pairs Matched)
                      </p>
                      <p className="text-xs font-semibold text-slate-500">
                        तारीख: {record.date}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm font-bold flex-wrap">
                    <span className="px-3 py-1 bg-amber-100 rounded-lg text-amber-900">
                      प्रयास: {record.attempts}
                    </span>
                    <span className="px-3 py-1 bg-emerald-100 rounded-lg text-emerald-900">
                      सटीकता: {record.accuracy}%
                    </span>
                    <span className="px-3 py-1 bg-indigo-100 rounded-lg text-indigo-900 font-mono">
                      समय: {record.formattedTime}
                    </span>
                    <span className="px-3 py-1 bg-purple-100 rounded-lg text-purple-900 font-mono">
                      प्रतिक्रिया: {record.avgResponseTime}s
                    </span>
                  </div>
                </div>
              ))}
            </div>
          );
        })()}
      </div>

      {/* Voice Prompt Recording Tool for Family Members */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-100 rounded-3xl p-6 sm:p-8 border-4 border-amber-300 shadow-md contrast-card space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center">
            <Mic className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900">
              पारिवारिक आवाज में व्यक्तिगत रिमाइंडर (Personalized Voice Guidance)
            </h2>
            <p className="text-sm font-semibold text-slate-700">
              डिमेशिया रोगियों को अपनों (बेटी/बेटे) की जानी-पहचानी आवाज में निर्देश मिलने पर भ्रम कम होता है।
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <textarea
            rows="3"
            value={recordedMessage}
            onChange={(e) => setRecordedMessage(e.target.value)}
            className="w-full p-4 rounded-2xl border-2 border-amber-300 text-lg font-bold text-slate-800 bg-white focus:outline-none focus:border-amber-500"
          />

          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={handleSimulateRecord}
              className="tactile-btn px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 border-2 border-amber-700 text-white font-black text-lg flex items-center gap-2 cursor-pointer shadow"
            >
              <Mic className="w-5 h-5" />
              <span>आवाज संदेश रिकॉर्ड व सहेजें (Record Voice)</span>
            </button>

            {recordFeedback && (
              <span className="text-emerald-800 font-extrabold text-sm flex items-center gap-1.5 bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-300 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                {recordFeedback}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Emergency Contacts Management */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-slate-200 shadow-md contrast-card space-y-4">
        <h2 className="text-2xl font-black text-slate-900">
          पंजीकृत आपातकालीन संपर्क (Registered Contacts)
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {caregiverMetrics.emergencyContacts.map((contact, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-200 flex items-center justify-between"
            >
              <div>
                <p className="text-lg font-black text-slate-900">{contact.name}</p>
                <p className="text-xs font-bold text-slate-500">{contact.role}</p>
                <p className="text-base font-mono font-bold text-teal-700 mt-1">
                  {contact.phone}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-teal-100 text-teal-800">
                <PhoneCall className="w-5 h-5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
