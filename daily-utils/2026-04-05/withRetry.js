// Exponential backoff retry utility
/**
 * Retries an async function with exponential backoff and optional jitter.
 * @param {() => Promise<T>} fn - Async function to retry
 * @param {number} [maxAttempts=3] - Maximum retry attempts
 * @param {number} [baseDelay=100] - Base delay in ms (exponential base)
 * @param {number} [maxDelay=5000] - Maximum delay in ms
 * @param {number} [jitter=0.1] - Jitter factor (0-1)
 * @returns {Promise<T>} Result of successful execution
 * @throws {Error} If all attempts fail
 * @example
 * const fetchWithRetry = withRetry(fetch, 5, 200);
 * fetchWithRetry('https://api.example.com').then(console.log);
 */
export async function withRetry(fn, maxAttempts = 3, baseDelay = 100, maxDelay = 5000, jitter = 0.1) {
  let attempts = 0;
  let lastError;

  while (attempts < maxAttempts) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      attempts++;

      if (attempts >= maxAttempts) break;

      // Calculate exponential backoff with jitter
      const delay = Math.min(
        Math.pow(baseDelay, attempts) * (1 + Math.random() * jitter),
        maxDelay
      );

      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw new Error(`All ${maxAttempts} attempts failed: ${lastError.message}`);
}

/**
 * Creates a retryable wrapper for an async function.
 * @param {number} maxAttempts - Maximum retry attempts
 * @param {number} baseDelay - Base delay in ms
 * @param {number} maxDelay - Maximum delay in ms
 * @param {number} jitter - Jitter factor (0-1)
 * @returns {(fn: () => Promise<T>) => (() => Promise<T>)} Retry wrapper
 */
export function createRetry(maxAttempts = 3, baseDelay = 100, maxDelay = 5000, jitter = 0.1) {
  return (fn) => () => withRetry(fn, maxAttempts, baseDelay, maxDelay, jitter);
}