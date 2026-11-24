/**
 * useRetryFetch — Render cold-start helper
 *
 * Backend ঘুমালে fetch fail হয়। এই hook প্রতি 5 সেকেন্ডে retry করে
 * যতক্ষণ সফল না হয় বা MAX_RETRIES শেষ না হয়।
 *
 * Usage:
 *   import { retryFetch } from '../utils/retryFetch';
 *   const data = await retryFetch('/api/students/');
 */

const MAX_RETRIES = 20;     // সর্বোচ্চ ২০ বার চেষ্টা (= ১০০ সেকেন্ড)
const RETRY_DELAY = 4000;   // প্রতিবার ৪ সেকেন্ড wait
const RETRYABLE_STATUSES = new Set([502, 503, 504, 520, 521, 522, 523, 524]);

/**
 * retryFetch — Backend জাগা পর্যন্ত retry করে (network error ও 502/503/504-এও)
 * @param {string} url
 * @param {RequestInit} options
 * @param {number} maxRetries
 * @returns {Promise<Response>}
 */
export async function retryFetch(url, options = {}, maxRetries = MAX_RETRIES) {
  const method = (options.method || 'GET').toUpperCase();
  const canRetryStatus = method === 'GET' || method === 'HEAD';

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(url, options);
      if (canRetryStatus && RETRYABLE_STATUSES.has(res.status) && attempt < maxRetries) {
        await new Promise(r => setTimeout(r, RETRY_DELAY));
        continue;
      }
      return res;
    } catch (err) {
      // Network error = সার্ভার এখনো ঘুমাচ্ছে বা কানেকশন টাইমআউট
      if (attempt < maxRetries) {
        await new Promise(r => setTimeout(r, RETRY_DELAY));
      } else {
        throw err;
      }
    }
  }
}
