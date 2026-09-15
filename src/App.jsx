import React from 'react';
import { useApp } from './context/AppContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import QuickSosModal from './components/QuickSosModal';
import SplashScreen from './pages/SplashScreen';
import LanguageSelection from './pages/LanguageSelection';

// Screen imports
import Home from './pages/Home';
import GamesHub from './pages/GamesHub';
import MemoryMatch from './pages/MemoryMatch';
import PatternRecognition from './pages/PatternRecognition';
import WordRecall from './pages/WordRecall';
import PictureRecall from './pages/PictureRecall';
import Reminders from './pages/Reminders';
import MyProgress from './pages/MyProgress';
import FamilyCaregiver from './pages/FamilyCaregiver';
import Settings from './pages/Settings';

import SaathiButton from './components/Saathi/SaathiButton';
import SaathiPanel from './components/Saathi/SaathiPanel';
import MedicineReminderModal from './components/MedicineReminderModal';

export default function App() {
  const {
    currentScreen,
    showSplash,
    showLanguageModal,
  } = useApp();

  // Render active screen
  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <Home />;
      case 'games':
        return <GamesHub />;
      case 'memory-match':
        return <MemoryMatch />;
      case 'pattern-recognition':
        return <PatternRecognition />;
      case 'word-recall':
        return <WordRecall />;
      case 'picture-recall':
        return <PictureRecall />;
      case 'reminders':
        return <Reminders />;
      case 'progress':
        return <MyProgress />;
      case 'family':
        return <FamilyCaregiver />;
      case 'settings':
        return <Settings />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFAF4] text-[#102A43] transition-all duration-150">
      {/* Optional Intro Splash Screen */}
      {showSplash && <SplashScreen />}

      {/* Language Selection Modal */}
      {showLanguageModal && <LanguageSelection />}

      {/* Top Accessible Sticky Header */}
      <Header />

      {/* Main Layout: Desktop Sidebar + Content */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        {/* Left Sidebar (Desktop) & Bottom Navigation Dock (Mobile) */}
        <Sidebar />

        {/* Dynamic Page Container */}
        <main className="flex-1 w-full p-3 sm:p-6 lg:p-8 pb-28 xl:pb-12 max-w-6xl mx-auto">
          {renderScreen()}
        </main>
      </div>

      {/* Universal Footer */}
      <Footer />

      {/* Emergency SOS Modal */}
      <QuickSosModal />

      {/* Saathi Voice-First AI Companion (Floating Button & Conversation Panel) */}
      <SaathiButton />
      <SaathiPanel />

      {/* Active Medicine Scheduled Reminder Modal */}
      <MedicineReminderModal />
    </div>
  );
}

