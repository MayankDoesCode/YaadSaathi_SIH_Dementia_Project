/**
 * saathiVoiceService.js
 * Speech synthesis service tailored for Saathi AI Voice Companion.
 * Uses slow, calm, elderly-optimized pace with warm inflection.
 */

class SaathiVoiceService {
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
        console.error('SaathiVoiceService listener error:', err);
      }
    });
  }

  stop() {
    if (this.synth) {
      this.synth.cancel();
    }
    this.isSpeaking = false;
    this.notify();
  }

  /**
   * Speak a Saathi response.
   * @param {string} text - text message
   * @param {string} lang - 'hi-IN' or 'en-IN'
   * @param {Object} options - callbacks
   */
  speak(text, lang = 'hi-IN', options = {}) {
    if (!this.synth || !text) {
      if (options.onEnd) options.onEnd();
      return;
    }

    // Cancel any active utterance first
    this.synth.cancel();
    this.isSpeaking = false;
    this.notify();

    const utterance = new SpeechSynthesisUtterance(text);
    this.currentUtterance = utterance;

    // Senior-friendly calm voice parameters
    utterance.rate = 0.85; // slightly slower for clear comprehension
    utterance.pitch = 1.05; // warm, friendly tone
    utterance.volume = 1.0;

    const normalizedLang = lang.startsWith('en') ? 'en-IN' : 'hi-IN';
    utterance.lang = normalizedLang;

    // Select the best voice
    if (this.voices.length > 0) {
      let matchedVoice = null;
      if (normalizedLang === 'hi-IN') {
        matchedVoice =
          this.voices.find((v) => v.lang === 'hi-IN' || v.lang.startsWith('hi')) ||
          this.voices.find((v) => v.name.toLowerCase().includes('hindi')) ||
          this.voices.find((v) => v.name.toLowerCase().includes('india'));
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
      console.warn('Saathi speech error:', e);
      this.isSpeaking = false;
      this.notify();
      if (options.onError) options.onError(e);
    }
  }
}

const saathiVoiceService = new SaathiVoiceService();
export default saathiVoiceService;
