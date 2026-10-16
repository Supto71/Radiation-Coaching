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
const RETRY_DELAY = 5000;   // প্রতিবার ৫ সেকেন্ড wait

/**
 * retryFetch — Backend জাগা পর্যন্ত retry করে
 * @param {string} url
 * @param {RequestInit} options
 * @param {number} maxRetries
 * @returns {Promise<Response>}
 */
export async function retryFetch(url, options = {}, maxRetries = MAX_RETRIES) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(url, options);
      // HTTP response পেলে (যেকোনো status) — সার্ভার জেগেছে
      return res;
    } catch (err) {
      // Network error = সার্ভার এখনো ঘুমাচ্ছে
      if (attempt < maxRetries) {
        await new Promise(r => setTimeout(r, RETRY_DELAY));
      } else {
        throw err;
      }
    }
  }
}
