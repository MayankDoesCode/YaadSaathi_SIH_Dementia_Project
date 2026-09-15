/**
 * SaathiConversation.jsx
 * Elderly-friendly conversation bubble view with large text and voice replay buttons.
 */

import React, { useEffect, useRef } from 'react';
import { Volume2, User, Sparkles } from 'lucide-react';
import { useSaathi } from '../../context/SaathiContext';
import { useI18n } from '../../i18n/I18nContext';
import saathiVoiceService from '../../services/saathiVoiceService';

export default function SaathiConversation() {
  const { messages } = useSaathi();
  const { isHindi } = useI18n();
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleReplaySpeech = (text) => {
    saathiVoiceService.speak(text, isHindi ? 'hi-IN' : 'en-IN');
  };

  return (
    <div className="space-y-4 max-h-[360px] overflow-y-auto pr-2 py-2">
      {messages.map((msg) => {
        const isSaathi = msg.sender === 'saathi';

        return (
          <div
            key={msg.id}
            className={`flex gap-3 text-left ${isSaathi ? 'justify-start' : 'justify-end'}`}
          >
            {isSaathi && (
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#1E56A0] to-[#167A55] text-white flex items-center justify-center text-xl shrink-0 shadow-sm">
                🌸
              </div>
            )}

            <div
              className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-3xl shadow-xs transition-all ${
                isSaathi
                  ? 'bg-white border-2 border-[#DFF3E7] text-[#102A43] rounded-tl-sm'
                  : 'bg-[#1E56A0] text-white border-2 border-[#16427D] rounded-tr-sm'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className={`text-xs font-black uppercase tracking-wider ${isSaathi ? 'text-[#167A55]' : 'text-blue-100'}`}>
                  {isSaathi ? (isHindi ? 'साथी' : 'Saathi') : (isHindi ? 'आप' : 'You')}
                </span>
                <span className={`text-[10px] font-bold ${isSaathi ? 'text-[#5D7184]' : 'text-blue-200'}`}>
                  {msg.timestamp}
                </span>
              </div>

              <p className="text-base sm:text-lg font-bold leading-relaxed whitespace-pre-line">
                {msg.text}
              </p>

              {isSaathi && (
                <div className="mt-2 pt-2 border-t border-[#DFF3E7] flex justify-end">
                  <button
                    onClick={() => handleReplaySpeech(msg.text)}
                    className="tactile-btn px-2.5 py-1 rounded-xl bg-[#EAF7EF] hover:bg-[#DFF3E7] text-[#167A55] text-xs font-black flex items-center gap-1.5 cursor-pointer"
                    aria-label="Re-listen to Saathi's message"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{isHindi ? 'दोबारा सुनें' : 'Listen again'}</span>
                  </button>
                </div>
              )}
            </div>

            {!isSaathi && (
              <div className="w-11 h-11 rounded-2xl bg-slate-200 text-slate-700 flex items-center justify-center text-xl shrink-0">
                👴
              </div>
            )}
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}
