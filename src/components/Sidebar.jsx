import React from 'react';
import {
  Home,
  Gamepad2,
  CalendarCheck,
  TrendingUp,
  Heart,
  Settings as SettingsIcon,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useI18n } from '../i18n/I18nContext';

export default function Sidebar() {
  const { currentScreen, navigateTo } = useApp();
  const { t, isHindi } = useI18n();

  const navItems = [
    { id: 'home', labelKey: 'home', subHindi: 'मुख्य पृष्ठ', subEnglish: 'Main Page', icon: Home, color: 'text-[#167A55]' },
    {
      id: 'games',
      labelKey: 'games',
      subHindi: 'स्मृति खेल',
      subEnglish: 'Cognitive',
      icon: Gamepad2,
      color: 'text-[#2879D0]',
      activeMatches: ['games', 'memory-match', 'pattern-recognition', 'word-recall', 'picture-recall'],
    },
    { id: 'reminders', labelKey: 'myDay', subHindi: 'मेरी यादें', subEnglish: 'Routine', icon: CalendarCheck, color: 'text-[#E98A20]' },
    { id: 'progress', labelKey: 'progress', subHindi: 'प्रगति स्कोर', subEnglish: 'Scores', icon: TrendingUp, color: 'text-[#167A55]' },
    { id: 'family', labelKey: 'family', subHindi: 'केयरगिवर', subEnglish: 'Caregiver', icon: Heart, color: 'text-[#E84D78]' },
    { id: 'settings', labelKey: 'settings', subHindi: 'प्राथमिकताएं', subEnglish: 'Preferences', icon: SettingsIcon, color: 'text-[#7658C8]' },
  ];

  const isItemActive = (item) => {
    if (item.activeMatches) {
      return item.activeMatches.includes(currentScreen);
    }
    return currentScreen === item.id;
  };

  return (
    <>
      {/* Desktop Left Sidebar (Visible on xl screens) */}
      <aside className="hidden xl:flex flex-col w-64 bg-white border-r-2 border-[#DFF3E7] p-4 shrink-0 shadow-xs min-h-[calc(100vh-68px)]">
        <nav aria-label="मुख्य नेविगेशन" className="space-y-2.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isItemActive(item);

            return (
              /* Issue 7: High-contrast active state and aria-current="page" */
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                onClick={() => navigateTo(item.id)}
                aria-current={active ? 'page' : undefined}
                className={`tactile-btn w-full p-3.5 rounded-2xl flex items-center gap-3.5 text-left font-black text-lg transition-all cursor-pointer ${
                  active
                    ? 'bg-[#167A55] text-white shadow-md border-2 border-[#0D4E36] ring-2 ring-[#167A55]/30'
                    : 'bg-[#FBFAF4] hover:bg-[#EAF7EF] border border-[#E2E8F0] text-[#102A43]'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    active ? 'bg-white text-[#167A55]' : 'bg-white ' + item.color
                  }`}
                >
                  <Icon className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <span className="block text-lg leading-tight">{t(item.labelKey)}</span>
                  <span className={`block text-xs font-semibold ${active ? 'text-emerald-100' : 'text-[#5D7184]'}`}>
                    {isHindi ? item.subHindi : item.subEnglish}
                  </span>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Supportive Elderly Helpline Box in Sidebar */}
        <div className="mt-auto p-4 rounded-2xl bg-[#FFE8EF] border border-[#E84D78]/30 text-left">
          {/* Issue 2: High-contrast accessible deep rose (5.8:1 on #FFE8EF) */}
          <p className="text-xs font-bold text-[#9B1D48]">
            {isHindi ? 'पारिवारिक सहायता' : 'Caregiver Contact'}
          </p>
          <p className="text-sm font-bold text-[#102A43] mt-1">
            {isHindi ? 'रवि / प्रिया शर्मा (केयरगिवर)' : 'Ravi / Priya Sharma (Caregiver)'}
          </p>
          {/* Issue 3: High-contrast slate (8.0:1 on #FFE8EF) */}
          <p className="text-xs font-semibold text-[#334155] mt-0.5">
            +91 98765 43210
          </p>
        </div>
      </aside>

      {/* Mobile & Tablet Bottom Navigation Dock */}
      <nav
        aria-label="Mobile Navigation"
        className="xl:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur border-t-2 border-[#DFF3E7] shadow-xl py-2 px-2"
      >
        <div className="max-w-md mx-auto flex items-center justify-between gap-1">
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const active = isItemActive(item);

            return (
              <button
                key={item.id}
                id={`mobile-nav-${item.id}`}
                onClick={() => navigateTo(item.id)}
                aria-current={active ? 'page' : undefined}
                className={`tactile-btn flex-1 py-2 px-1 rounded-2xl flex flex-col items-center justify-center gap-0.5 cursor-pointer transition-all ${
                  active
                    ? 'bg-[#167A55] text-white font-black'
                    : 'text-[#5D7184] hover:bg-[#EAF7EF]'
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs font-black">{t(item.labelKey)}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
