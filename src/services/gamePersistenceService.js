/**
 * gamePersistenceService.js
 * Application-level bridge connecting UI games to domain models and Dexie repositories.
 * Safe, robust error handling to guarantee that database failures never crash gameplay.
 */

import * as cognitiveRepository from '../database/repositories/cognitiveRepository.js';
import { createGameSession, createGameResult } from '../domain/cognitive/gameTypes.js';
import { CognitiveDomain } from '../domain/cognitive/cognitiveTypes.js';
import { DifficultyLevel } from '../domain/cognitive/difficultyTypes.js';

const LOCAL_USER_ID_KEY = 'yaadsaathi_local_user_id';
const DEFAULT_LOCAL_USER_ID = 'local-elder-default';

/**
 * Returns a stable, isolated local user ID without requiring authentication.
 * Defaults to a persistent client-side key for single-elder prototype use.
 * 
 * @returns {string} Isolated local user identifier
 */
export function getOrCreateLocalUserId() {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      let userId = localStorage.getItem(LOCAL_USER_ID_KEY);
      if (!userId) {
        userId = DEFAULT_LOCAL_USER_ID;
        localStorage.setItem(LOCAL_USER_ID_KEY, userId);
      }
      return userId;
    }
  } catch (err) {
    console.warn('[YaadSaathi Persistence] Error accessing localStorage for userId:', err);
  }
  return DEFAULT_LOCAL_USER_ID;
}

/**
 * Starts and persists a new game session in IndexedDB.
 * Safe fallback: Returns a fallback session ID if database persistence encounters an error.
 * 
 * @param {Object} params
 * @param {string} params.gameId - e.g. 'memory-match'
 * @param {number} [params.difficultyLevel=DifficultyLevel.BALANCED]
 * @param {string} [params.userId]
 * @returns {Promise<{ sessionId: number|string, startedAt: string }>}
 */
export async function startGameSession({
  gameId,
  difficultyLevel = DifficultyLevel.BALANCED,
  userId = null,
} = {}) {
  const currentUserId = userId || getOrCreateLocalUserId();
  const startedAt = new Date().toISOString();

  try {
    const sessionData = createGameSession({
      gameId,
      userId: currentUserId,
      difficultyLevel,
    });

    const sessionId = await cognitiveRepository.saveGameSession(sessionData);
    console.log(`[YaadSaathi Persistence] Game Session started with ID: ${sessionId} for game: ${gameId}`);
    return { sessionId, startedAt: sessionData.startedAt || startedAt };
  } catch (error) {
    console.warn('[YaadSaathi Persistence] Failed to persist game session to IndexedDB:', error);
    // Return graceful memory fallback so game never crashes
    return {
      sessionId: `fallback-sess-${Date.now()}`,
      startedAt,
    };
  }
}

/**
 * Persists a completed game result to IndexedDB using domain factories and repositories.
 * 
 * @param {Object} params
 * @param {string} params.gameId
 * @param {number|string} params.sessionId
 * @param {string} [params.userId]
 * @param {number} params.score
 * @param {number} params.accuracy - Percentage (0-100) or decimal (0.0-1.0)
 * @param {number} params.responseTime - Average response time in seconds
 * @param {number} params.attempts
 * @param {number} [params.mistakes=0]
 * @param {number} [params.hintsUsed=0]
 * @param {number} params.difficultyLevel
 * @param {string} [params.cognitiveDomain=CognitiveDomain.MEMORY]
 * @param {string} [params.startedAt]
 * @param {string} [params.completedAt]
 * @param {Object} [params.adaptiveRecommendation=null]
 * @param {Object} [params.metadata={}]
 * @returns {Promise<number|null>} Primary key of persisted result or null on failure
 */
export async function saveGameResult({
  gameId,
  sessionId,
  userId = null,
  score = 0,
  accuracy = 100,
  responseTime = 0,
  attempts = 1,
  mistakes = 0,
  hintsUsed = 0,
  difficultyLevel = DifficultyLevel.BALANCED,
  cognitiveDomain = CognitiveDomain.MEMORY,
  startedAt,
  completedAt = new Date().toISOString(),
  adaptiveRecommendation = null,
  metadata = {},
} = {}) {
  const currentUserId = userId || getOrCreateLocalUserId();

  try {
    const resultEntity = createGameResult({
      gameId,
      sessionId,
      userId: currentUserId,
      score,
      accuracy,
      responseTime,
      attempts,
      mistakes,
      hintsUsed,
      difficultyLevel,
      cognitiveDomain,
      startedAt: startedAt || new Date().toISOString(),
      completedAt,
      adaptiveRecommendation,
      metadata,
    });

    const resultId = await cognitiveRepository.saveGameResult(resultEntity);
    console.log(`[YaadSaathi Persistence] Game Result saved with ID: ${resultId} (linked to session: ${sessionId})`);
    return resultId;
  } catch (error) {
    console.warn('[YaadSaathi Persistence] Failed to persist game result to IndexedDB:', error);
    return null;
  }
}

/**
 * Retrieves persisted game results history for a user.
 * 
 * @param {Object} params
 * @param {string} [params.userId]
 * @param {string} [params.gameId]
 * @param {number} [params.limit=20]
 * @returns {Promise<Array<Object>>}
 */
export async function getGameHistory({
  userId = null,
  gameId = null,
  limit = 20,
} = {}) {
  const currentUserId = userId || getOrCreateLocalUserId();
  try {
    let results = await cognitiveRepository.getGameResults({
      userId: currentUserId,
      limit: limit * 2, // Query slightly broader to allow gameId filtering
    });

    if (gameId) {
      results = results.filter((r) => r.gameId === gameId);
    }

    return results.slice(0, limit);
  } catch (error) {
    console.warn('[YaadSaathi Persistence] Failed to retrieve game history from IndexedDB:', error);
    return [];
  }
}
