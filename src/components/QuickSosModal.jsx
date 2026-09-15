import React, { useState } from 'react';
import { PhoneCall, Heart, X, Home, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import VoiceButton from './VoiceButton';

export default function QuickSosModal() {
  const { sosModalOpen, setSosModalOpen, patient, sounds, voice } = useApp();
  const [callInitiated, setCallInitiated] = useState(null);

  if (!sosModalOpen) return null;

  const handleConfirmCall = (contactName, phone) => {
    sounds.playSuccessChime();
    setCallInitiated(contactName);
    voice.speak(
      `${contactName} को तुरंत कॉल मिलाई जा रही है। कृपया शांत रहें, परिवार को सूचित किया जा रहा है।`,
      `Calling ${contactName}. Help is on the way. Please stay calm.`
    );
  };

  const handleClose = () => {
    sounds.playClickChime();
    setCallInitiated(null);
    setSosModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#102A43]/75 backdrop-blur-sm animate-slow-fade select-none">
      <div
        className="relative w-full max-w-xl bg-white rounded-[2.5rem] p-6 sm:p-8 shadow-2xl border-4 border-[#FFE8EF] text-left max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b-2 border-[#FFE8EF]">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-[#FFE8EF] text-[#E84D78] flex items-center justify-center text-3xl shrink-0">
              ❤️
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#E84D78]">
                मदद और परिवार को कॉल (SOS)
              </h2>
              <p className="text-base font-bold text-[#5D7184]">
                Emergency Assistance & Family Call
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-3 rounded-2xl bg-[#FBFAF4] hover:bg-[#FFE8EF] text-[#5D7184] hover:text-[#E84D78] cursor-pointer"
            aria-label="बंद करें"
          >
            <X className="w-7 h-7" />
          </button>
        </div>

        {/* Call Toast Notice when simulated */}
        {callInitiated ? (
          <div className="mt-5 p-6 rounded-3xl bg-[#EAF7EF] border-3 border-[#167A55] text-center space-y-3 animate-slow-fade">
            <div className="w-16 h-16 rounded-full bg-[#167A55] text-white flex items-center justify-center mx-auto text-3xl animate-bounce">
              📞
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-[#167A55]">
              {callInitiated} से संपर्क हो रहा है...
            </h3>
            <p className="text-base sm:text-lg font-bold text-[#102A43]">
              सिम्युलेटेड कॉल सक्रिय है। आपकी बेटी प्रिया को आपका संदेश प्राप्त हो गया है।
            </p>
            <button
              onClick={() => setCallInitiated(null)}
              className="tactile-btn mt-2 px-6 py-2.5 rounded-2xl bg-[#167A55] text-white font-bold text-base cursor-pointer"
            >
              कॉल समाप्त करें (End Simulation)
            </button>
          </div>
        ) : (
          /* Confirmation Question */
          <div className="mt-5 p-5 rounded-3xl bg-[#FFE8EF]/60 border-2 border-[#E84D78]/30 space-y-3 text-center">
            <h3 className="text-2xl sm:text-3xl font-black text-[#102A43]">
              "क्या आपको किसी सहायता की आवश्यकता है?"
            </h3>
            <p className="text-base sm:text-lg font-bold text-[#5D7184]">
              "Do you want to contact your family right now?"
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => handleConfirmCall('बेटी प्रिया', patient.emergencyContact.phone)}
                className="tactile-btn flex-1 py-4 px-4 rounded-2xl bg-[#E84D78] hover:bg-[#D43B66] text-white font-black text-xl flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <PhoneCall className="w-6 h-6" />
                <span>हाँ, परिवार को कॉल करें</span>
              </button>

              <button
                onClick={handleClose}
                className="tactile-btn py-4 px-6 rounded-2xl bg-white hover:bg-[#FBFAF4] border-2 border-[#E2E8F0] text-[#102A43] font-bold text-lg cursor-pointer"
              >
                नहीं (Cancel)
              </button>
            </div>
          </div>
        )}

        {/* Home Address Card for Disorientation Protection */}
        <div className="mt-5 p-4 sm:p-5 rounded-2xl bg-[#FBFAF4] border-2 border-[#DFF3E7]">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 text-[#167A55] font-black text-lg">
              <Home className="w-5 h-5 text-[#167A55]" />
              <span>मेरा घर का पता (My Home Address):</span>
            </div>
            <VoiceButton
              textHindi={`आपका घर का पता है: ${patient.homeAddressHindi}।`}
              textEnglish={`Your home address is: ${patient.homeAddressEnglish}.`}
              size="sm"
              label=""
            />
          </div>
          <p className="mt-1 text-xl font-black text-[#102A43]">
            {patient.homeAddressHindi}
          </p>
          <p className="text-xs text-[#5D7184] font-medium">
            {patient.homeAddressEnglish}
          </p>
        </div>

        {/* Registered Emergency Numbers */}
        <div className="mt-5 space-y-3">
          <h4 className="text-lg font-black text-[#102A43]">
            सीधे डायल करने के लिए संपर्क (Direct Dial):
          </h4>

          {/* Daughter */}
          <button
            onClick={() => handleConfirmCall('प्रिया शर्मा (बेटी)', patient.emergencyContact.phone)}
            className="tactile-btn w-full p-4 rounded-2xl bg-[#FFE8EF] hover:bg-[#FFD1DE] border-2 border-[#E84D78]/40 flex items-center justify-between text-left cursor-pointer"
          >
            <div>
              <p className="text-xl font-black text-[#E84D78]">
                प्रिया शर्मा (सुपुत्री / Daughter)
              </p>
              <p className="text-sm font-bold text-[#102A43]">
                {patient.emergencyContact.phone}
              </p>
            </div>
            <span className="px-4 py-2 bg-[#E84D78] text-white rounded-xl font-black text-base flex items-center gap-1.5">
              <PhoneCall className="w-4 h-4" /> कॉल करें
            </span>
          </button>

          {/* Doctor */}
          <button
            onClick={() => handleConfirmCall(patient.doctorContact.name, patient.doctorContact.phone)}
            className="tactile-btn w-full p-4 rounded-2xl bg-[#EAF7EF] hover:bg-[#DFF3E7] border-2 border-[#167A55]/30 flex items-center justify-between text-left cursor-pointer"
          >
            <div>
              <p className="text-lg font-black text-[#167A55]">
                {patient.doctorContact.name}
              </p>
              <p className="text-sm font-bold text-[#102A43]">
                {patient.doctorContact.clinic} ({patient.doctorContact.phone})
              </p>
            </div>
            <span className="px-4 py-2 bg-[#167A55] text-white rounded-xl font-black text-base flex items-center gap-1.5">
              <PhoneCall className="w-4 h-4" /> कॉल करें
            </span>
          </button>

          {/* Ambulance 108 */}
          <button
            onClick={() => handleConfirmCall('राष्ट्रीय एम्बुलेंस 108', '108')}
            className="tactile-btn w-full p-4 rounded-2xl bg-[#FFE8EF] hover:bg-[#FFD1DE] border-2 border-[#E84D78]/40 flex items-center justify-between text-left cursor-pointer"
          >
            <div>
              <p className="text-lg font-black text-[#E84D78]">
                राष्ट्रीय एम्बुलेंस सेवा (Ambulance 108)
              </p>
              <p className="text-sm font-bold text-[#5D7184]">
                डायल 108 (24x7 आपातकालीन सेवा)
              </p>
            </div>
            <span className="px-4 py-2 bg-[#E84D78] text-white rounded-xl font-black text-base flex items-center gap-1.5">
              108 डायल
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
