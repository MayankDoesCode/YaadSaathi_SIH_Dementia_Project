/**
 * adaptiveEngine.js - Cognitive Adaptive Difficulty Engine for YaadSaathi
 * 
 * Adjusts game difficulty based on cognitive performance metrics:
 * - Accuracy percentage (0 - 100)
 * - Average response time in seconds
 * - Current difficulty level (1 to 5)
 * 
 * Rules:
 * - If accuracy >= 80% AND averageResponseTime <= 8s -> Increase difficulty by 1 (max 5)
 * - If accuracy < 50% OR averageResponseTime > 15s -> Decrease difficulty by 1 (min 1)
 * - Otherwise -> Keep difficulty unchanged
 */

export const MIN_DIFFICULTY = 1;
export const MAX_DIFFICULTY = 5;

export const DIFFICULTY_LABELS = {
  1: { hi: 'स्तर 1: बहुत सरल (Gentle)', en: 'Level 1: Gentle', pairs: 3 },
  2: { hi: 'स्तर 2: सरल (Easy)', en: 'Level 2: Easy', pairs: 4 },
  3: { hi: 'स्तर 3: संतुलित (Balanced)', en: 'Level 3: Balanced', pairs: 6 },
  4: { hi: 'स्तर 4: मध्यम (Active)', en: 'Level 4: Active', pairs: 8 },
  5: { hi: 'स्तर 5: उन्नत (Challenging)', en: 'Level 5: Advanced', pairs: 10 },
};

/**
 * Calculates the next recommended difficulty level and generates an elderly-friendly explanation.
 * 
 * @param {Object} params
 * @param {number} params.accuracy - Percentage accuracy (0 - 100)
 * @param {number} params.averageResponseTime - Average response time in seconds
 * @param {number} params.currentDifficulty - Current difficulty level (1 - 5)
 * @returns {{ nextDifficulty: number, reason: string, reasonHindi: string, change: 'increased' | 'decreased' | 'unchanged' }}
 */
export function calculateAdaptiveDifficulty({
  accuracy,
  averageResponseTime,
  currentDifficulty = 3,
}) {
  const acc = Number(accuracy) || 0;
  const respTime = Number(averageResponseTime) || 0;
  const curDiff = Math.min(MAX_DIFFICULTY, Math.max(MIN_DIFFICULTY, Number(currentDifficulty) || 3));

  let nextDifficulty = curDiff;
  let reason = '';
  let reasonHindi = '';
  let change = 'unchanged';

  // Rule 1: High accuracy and fast response time -> Level Up
  if (acc >= 80 && respTime <= 8) {
    if (curDiff < MAX_DIFFICULTY) {
      nextDifficulty = curDiff + 1;
      change = 'increased';
      reason = 'Excellent performance. Next activity will be slightly harder.';
      reasonHindi = 'उत्कृष्ट प्रदर्शन! अगली गतिविधि थोड़ी और चुनौतीपूर्ण होगी।';
    } else {
      nextDifficulty = MAX_DIFFICULTY;
      change = 'unchanged';
      reason = 'Excellent performance! You are performing at the highest mastery level.';
      reasonHindi = 'शानदार प्रदर्शन! आप उच्चतम स्तर पर बहुत बढ़िया खेल रहे हैं।';
    }
  }
  // Rule 2: Low accuracy or high response time -> Level Down to reduce cognitive strain
  else if (acc < 50 || respTime > 15) {
    if (curDiff > MIN_DIFFICULTY) {
      nextDifficulty = curDiff - 1;
      change = 'decreased';
      reason = "Let's make the next activity a little easier.";
      reasonHindi = 'कोई बात नहीं! अगली गतिविधि को थोड़ा और आसान बनाते हैं।';
    } else {
      nextDifficulty = MIN_DIFFICULTY;
      change = 'unchanged';
      reason = 'Taking our time at the most gentle level. Relax and enjoy.';
      reasonHindi = 'सबसे सरल और सहज स्तर पर खेलें। आराम से आनंद लें।';
    }
  }
  // Rule 3: Balanced performance -> Maintain Level
  else {
    nextDifficulty = curDiff;
    change = 'unchanged';
    reason = 'Good effort. Continuing at the same comfortable pace.';
    reasonHindi = 'अच्छा प्रयास! इसी आरामदायक गति से खेलना जारी रखें।';
  }

  return {
    nextDifficulty,
    reason,
    reasonHindi,
    change,
  };
}

export default calculateAdaptiveDifficulty;
