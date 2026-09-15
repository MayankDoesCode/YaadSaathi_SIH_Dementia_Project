/**
 * saathiIntentRouter.js
 * Lightweight Intent Router for Saathi voice & natural language comprehension.
 * Accurately parses conversational Hindi (including Romanized Hinglish) and English.
 */

export function routeIntent(rawInput) {
  if (!rawInput || typeof rawInput !== 'string') {
    return { intent: 'UNKNOWN', confidence: 0, entities: {} };
  }

  const text = rawInput.toLowerCase().trim();

  // 1. MEDICAL QUERY / DOSAGE ADVICE GUARDRAIL
  // Strictly prevent pretending to be a medical decision maker
  const medicalPatterns = [
    'kitni leni hai', 'kitni goli', 'kitni dawa', 'dosage', 'dose badha',
    'dawa band', 'stop medicine', 'can i take two', 'prescribe',
    'diagnosis', 'ilaj', 'bimaari', 'treatment', 'cure', 'bimari',
    'side effect', 'bina doctor', 'extra tablet'
  ];
  if (medicalPatterns.some(p => text.includes(p))) {
    return {
      intent: 'MEDICAL_QUERY',
      confidence: 0.98,
      entities: { query: text },
    };
  }

  // 2. MEDICINE CONFIRMATION
  // User explicitly states dose has been taken
  const medConfirmPatterns = [
    'maine dawaai le li', 'maine dawai le li', 'maine davai le li',
    'dawaai le li', 'dawai le li', 'davai le li', 'dawa le li',
    'medicine le li', 'le li dawaai', 'le li dawai', 'le li',
    'dawai kha li', 'dawa kha li', 'goli kha li', 'goli le li',
    'i took my medicine', 'i have taken my medicine', 'took my medicine',
    'medicine taken', 'taken medicine', 'i took medicine', 'done taking medicine',
    'already taken', 'maine le li'
  ];
  if (medConfirmPatterns.some(p => text.includes(p))) {
    return {
      intent: 'MEDICINE_CONFIRM',
      confidence: 0.99,
      entities: {},
    };
  }

  // 3. MEDICINE STATUS / SCHEDULE CHECK
  const medStatusPatterns = [
    'meri dawaai kab', 'meri dawai kab', 'dawaai kab', 'dawai kab',
    'medicine kab', 'dawa kab', 'when is my medicine', 'medicine time',
    'next medicine', 'dawaai ka time', 'dawai ka samay', 'dawa ka samay',
    'medicine reminder', 'konsi dawaai', 'konsi dawai', 'which medicine'
  ];
  if (medStatusPatterns.some(p => text.includes(p))) {
    return {
      intent: 'MEDICINE_STATUS',
      confidence: 0.96,
      entities: {},
    };
  }

  // 4. SNOOZE / REMIND ME LATER
  const remindLaterPatterns = [
    'baad mein yaad', 'baad me yaad', '15 minute baad', '15 min baad',
    'thodi der baad', 'remind me later', 'remind later', 'snooze',
    'baad me batana', 'baad mein batana', 'later', 'thodi der me'
  ];
  if (remindLaterPatterns.some(p => text.includes(p))) {
    return {
      intent: 'MEDICINE_REMIND_LATER',
      confidence: 0.95,
      entities: { minutes: 15 },
    };
  }

  // 5. DAILY BRIEFING / WHAT DO I HAVE TODAY
  const todaysPlanPatterns = [
    'aaj mera kya hai', 'aaj mujhe kya karna hai', 'what do i have today',
    'today schedule', 'aaj ka plan', 'aaj ki dincharya', 'aaj kya karna hai',
    'aaj ka schedule', 'meri dincharya', 'daily briefing', 'aaj kya hai'
  ];
  if (todaysPlanPatterns.some(p => text.includes(p))) {
    return {
      intent: 'TODAYS_PLAN',
      confidence: 0.96,
      entities: {},
    };
  }

  // 6. GAME CONTROL / START GAME
  const gamePatterns = [
    'game start', 'khel shuru', 'game shuru', 'game kholo', 'khel kholo',
    'memory game', 'pattern game', 'word recall', 'picture recall',
    'mujhe game khelna', 'khelna hai', 'start a game', 'play game',
    'play a game', 'start game', 'open games', 'games kholo'
  ];
  if (gamePatterns.some(p => text.includes(p))) {
    let gameType = 'all';
    if (text.includes('memory') || text.includes('याद') || text.includes('पत्ता')) {
      gameType = 'memory-match';
    } else if (text.includes('pattern') || text.includes('पैटर्न')) {
      gameType = 'pattern-recognition';
    } else if (text.includes('word') || text.includes('शब्द')) {
      gameType = 'word-recall';
    } else if (text.includes('picture') || text.includes('तस्वीर')) {
      gameType = 'picture-recall';
    }

    return {
      intent: 'START_GAME',
      confidence: 0.95,
      entities: { gameType },
    };
  }

  // 7. PROGRESS / PERFORMANCE REPORT
  const progressPatterns = [
    'maine aaj kitne game', 'kitne games khele', 'meri progress',
    'how am i doing', 'aaj ka score', 'progress report', 'kitna khela',
    'how many games', 'streak kitni', 'kaisa chal raha', 'progress batao',
    'meri report', 'show progress'
  ];
  if (progressPatterns.some(p => text.includes(p))) {
    return {
      intent: 'PROGRESS_STATUS',
      confidence: 0.95,
      entities: {},
    };
  }

  // 8. SAFECIRCLE / LOCATION STATUS
  const safecirclePatterns = [
    'location share', 'family ko mera location', 'is safecircle on',
    'safecircle', 'safe circle', 'suraksha ghera', 'location status',
    'kahan hoon', 'ghar se kitni door', 'safe zone', 'surakshit'
  ];
  if (safecirclePatterns.some(p => text.includes(p))) {
    return {
      intent: 'SAFECIRCLE_STATUS',
      confidence: 0.94,
      entities: {},
    };
  }

  // 9. FAMILY / CONTACTS
  const familyPatterns = [
    'meri family kaun', 'family dashboard', 'family se contact',
    'priya ko call', 'ravi ko call', 'doctor ko call', 'call priya',
    'call family', 'parivar', 'family', 'beti', 'beta'
  ];
  if (familyPatterns.some(p => text.includes(p))) {
    return {
      intent: 'OPEN_FAMILY',
      confidence: 0.93,
      entities: {},
    };
  }

  // 10. OPEN SETTINGS / FONT SIZE
  const settingsPatterns = [
    'settings kholo', 'open settings', 'akshar bade', 'font bada',
    'akshar chhote', 'font size', 'bhasha badlo', 'change language'
  ];
  if (settingsPatterns.some(p => text.includes(p))) {
    return {
      intent: 'OPEN_SETTINGS',
      confidence: 0.92,
      entities: {},
    };
  }

  // 11. GREETING
  const greetingPatterns = [
    'namaste', 'namaskar', 'pranam', 'hello', 'hi saathi', 'hey saathi',
    'kaise ho', 'kaisi ho', 'good morning', 'good evening', 'shubh prabhat', 'hi'
  ];
  if (greetingPatterns.some(p => text === p || text.startsWith(p + ' '))) {
    return {
      intent: 'GREETING',
      confidence: 0.95,
      entities: {},
    };
  }

  // 12. HELP
  const helpPatterns = [
    'help', 'madad', 'sahayata', 'aap kya kar sakti ho', 'what can you do',
    'guide karo', 'kaise use karein', 'how to use'
  ];
  if (helpPatterns.some(p => text.includes(p))) {
    return {
      intent: 'HELP',
      confidence: 0.90,
      entities: {},
    };
  }

  // Unknown fallback
  return {
    intent: 'UNKNOWN',
    confidence: 0.20,
    entities: { raw: text },
  };
}

export default routeIntent;
