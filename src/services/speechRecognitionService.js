/**
 * speechRecognitionService.js
 * Browser Web Speech API SpeechRecognition service for YaadSaathi.
 * Supports Hindi (hi-IN) and Indian English (en-IN).
 * Privacy-first: strictly single-turn (no continuous eavesdropping).
 */

class SpeechRecognitionService {
  constructor() {
    this.recognition = null;
    this.isListening = false;
  }

  isSupported() {
    if (typeof window === 'undefined') return false;
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  /**
   * Start listening for a single user utterance.
   * @param {Object} options
   * @param {string} options.lang - 'hi-IN' or 'en-IN'
   * @param {Function} options.onStart - callback when recording starts
   * @param {Function} options.onResult - callback(transcript: string)
   * @param {Function} options.onError - callback(errorMsg: string)
   * @param {Function} options.onEnd - callback when recording stops
   */
  startListening({ lang = 'hi-IN', onStart, onResult, onError, onEnd } = {}) {
    if (!this.isSupported()) {
      if (onError) onError('SPEECH_NOT_SUPPORTED');
      return;
    }

    // Stop any existing session
    this.stopListening();

    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const rec = new SpeechRecognition();
      this.recognition = rec;

      rec.continuous = false;
      rec.interimResults = false;
      rec.maxAlternatives = 1;
      rec.lang = lang.startsWith('en') ? 'en-IN' : 'hi-IN';

      rec.onstart = () => {
        this.isListening = true;
        if (onStart) onStart();
      };

      rec.onresult = (event) => {
        if (event.results && event.results[0] && event.results[0][0]) {
          const transcript = event.results[0][0].transcript.trim();
          if (onResult) onResult(transcript);
        }
      };

      rec.onerror = (event) => {
        console.warn('SpeechRecognition error:', event.error);
        this.isListening = false;
        if (onError) onError(event.error);
      };

      rec.onend = () => {
        this.isListening = false;
        if (onEnd) onEnd();
      };

      rec.start();
    } catch (err) {
      console.warn('Failed to start SpeechRecognition:', err);
      this.isListening = false;
      if (onError) onError('FAILED_TO_START');
    }
  }

  stopListening() {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {
        // Ignore already stopped
      }
      this.recognition = null;
    }
    this.isListening = false;
  }

  abort() {
    if (this.recognition) {
      try {
        this.recognition.abort();
      } catch (e) {}
      this.recognition = null;
    }
    this.isListening = false;
  }
}

const speechRecognitionService = new SpeechRecognitionService();
export default speechRecognitionService;
