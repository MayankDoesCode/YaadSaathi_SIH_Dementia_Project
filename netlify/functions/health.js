/**
 * netlify/functions/health.js
 * Production Netlify Serverless Health Check Function for YaadSaathi.
 * 
 * Exposes:
 * - GET /api/health (via netlify.toml redirect)
 * - GET /.netlify/functions/health
 */

const CORS_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

export async function handler(event, context) {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: CORS_HEADERS,
      body: '',
    };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  return {
    statusCode: 200,
    headers: CORS_HEADERS,
    body: JSON.stringify({
      status: 'ok',
      service: 'YaadSaathi Gemini AI Gateway (Netlify Serverless)',
      timestamp: new Date().toISOString(),
    }),
  };
}
