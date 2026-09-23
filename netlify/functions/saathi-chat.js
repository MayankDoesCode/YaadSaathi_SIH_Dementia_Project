/**
 * netlify/functions/saathi-chat.js
 * Production Netlify Serverless Function for YaadSaathi Gemini AI Gateway.
 * 
 * Replaces the local Node/Vite development server in production on Netlify.
 * Exposes:
 * - POST /api/saathi/chat (via netlify.toml redirect from /api/saathi/chat -> /.netlify/functions/saathi-chat)
 * - POST /.netlify/functions/saathi-chat
 * 
 * SECURITY:
 * - GEMINI_API_KEY is read strictly from server environment (process.env.GEMINI_API_KEY).
 * - Never exposes API keys or internal credentials to the browser client.
 */

import { handleGeminiChatRequest } from '../../server/geminiService.js';

const CORS_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
};

/**
 * Netlify Function handler for Saathi AI Chat.
 * 
 * @param {Object} event - Netlify Lambda event
 * @param {Object} context - Netlify Lambda context
 * @returns {Promise<{ statusCode: number, headers: Object, body: string }>}
 */
export async function handler(event, context) {
  // 1. Handle CORS Preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: CORS_HEADERS,
      body: '',
    };
  }

  // 2. Health check on GET
  if (event.httpMethod === 'GET') {
    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        status: 'ok',
        service: 'YaadSaathi Gemini AI Gateway (Netlify Serverless Function)',
        timestamp: new Date().toISOString(),
      }),
    };
  }

  // 3. Reject non-POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        error: 'Method Not Allowed. Expected POST.',
        code: 'METHOD_NOT_ALLOWED',
      }),
    };
  }

  // 4. Parse JSON Payload
  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch (parseErr) {
    return {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        error: 'Invalid JSON payload received in request body.',
        code: 'INVALID_JSON',
        originalError: parseErr.message,
      }),
    };
  }

  // 5. Validate messages structure
  if (!payload || (payload.messages && !Array.isArray(payload.messages))) {
    return {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        error: 'Invalid request: messages must be an array.',
        code: 'INVALID_MESSAGES_FORMAT',
      }),
    };
  }

  // 6. Process Chat Request via Gemini Service
  try {
    const result = await handleGeminiChatRequest(payload);

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify(result),
    };
  } catch (err) {
    const status = err.status || 500;
    return {
      statusCode: status,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        error: err.message || 'Error processing AI chat request.',
        code: err.code || 'AI_PROXY_ERROR',
        originalError: err.originalError || null,
      }),
    };
  }
}
