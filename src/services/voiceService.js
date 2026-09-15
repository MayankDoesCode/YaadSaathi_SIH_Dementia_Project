/**
 * voiceService.js
 * Browser Speech Synthesis service for YaadSaathi.
 * Supports Hindi (hi-IN) and Indian English (en-IN) with speech pace optimized for seniors.
 */

class VoiceService {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.currentUtterance = null;
    this.isSpeaking = false;
    this.listeners = new Set();
    this.voices = [];

    if (this.synth) {
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  loadVoices() {
    if (!this.synth) return;
    this.voices = this.synth.getVoices() || [];
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach((fn) => {
      try {
        fn(this.isSpeaking);
      } catch (err) {
        console.error('VoiceService listener error:', err);
      }
    });
  }

  /**
   * Speak given text.
   * @param {string} text - text to speak
   * @param {string} lang - 'hi-IN' or 'en-IN'
   * @param {object} options - callbacks { onStart, onEnd, onError }
   */
  speak(text, lang = 'hi-IN', options = {}) {
    if (!this.synth || !text) return;

    // Part 4 requirement: window.speechSynthesis.cancel() before every speech
    this.synth.cancel();
    this.isSpeaking = false;
    this.notify();

    const utterance = new SpeechSynthesisUtterance(text);
    this.currentUtterance = utterance;

    // Part 4 settings: rate: 0.80, pitch: 1, volume: 1
    utterance.rate = 0.80;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    const normalizedLang = lang.startsWith('en') ? 'en-IN' : 'hi-IN';
    utterance.lang = normalizedLang;

    // Find best voice match
    if (this.voices.length > 0) {
      let matchedVoice = null;
      if (normalizedLang === 'hi-IN') {
        matchedVoice =
          this.voices.find((v) => v.lang === 'hi-IN' || v.lang.startsWith('hi')) ||
          this.voices.find((v) => v.name.toLowerCase().includes('hindi'));
      } else {
        matchedVoice =
          this.voices.find((v) => v.lang === 'en-IN') ||
          this.voices.find((v) => v.lang.startsWith('en-') && !v.lang.includes('US')) ||
          this.voices.find((v) => v.lang.startsWith('en'));
      }
      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }
    }

    utterance.onstart = () => {
      this.isSpeaking = true;
      this.notify();
      if (options.onStart) options.onStart();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.currentUtterance = null;
      this.notify();
      if (options.onEnd) options.onEnd();
    };

    utterance.onerror = (err) => {
      this.isSpeaking = false;
      this.currentUtterance = null;
      this.notify();
      if (options.onError) options.onError(err);
    };

    try {
      this.synth.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis speak failed:', e);
      this.isSpeaking = false;
      this.notify();
    }
  }

  stop() {
    if (this.synth) {
      this.synth.cancel();
    }
    this.isSpeaking = false;
    this.currentUtterance = null;
    this.notify();
  }
}

export const voiceService = new VoiceService();
export default voiceService;
