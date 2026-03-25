// Retry an async operation with exponential backoff
// @param {() => Promise<T>} fn - Async function to retry
// @param {Object} [options] - Configuration
// @param {number} [options.maxRetries=3] - Maximum retry attempts
// @param {number} [options.minDelay=100] - Initial delay in ms
// @param {number} [options.maxDelay=5000] - Maximum delay in ms
// @param {number} [options.backoffFactor=2] - Multiplier for delay
// @returns {Promise<T>} - Resolves with fn's result or rejects if max retries exhausted
// @throws {Error} - If fn throws after all retries
const withRetry = async (
  fn,
  {
    maxRetries = 3,
    minDelay = 100,
    maxDelay = 5000,
    backoffFactor = 2,
  } = {}
) => {
  let lastError;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;

      // Do not delay after last attempt
      if (attempt === maxRetries) break;

      const delay = Math.min(
        minDelay * Math.pow(backoffFactor, attempt),
        maxDelay
      );

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
};

export { withRetry };

// Example 1: Basic retry on network request
// await withRetry(async () => {
//   const res = await fetch('https://api.example.com/data');
//   if (!res.ok) throw new Error('Request failed');
//   return res.json();
// });

// Example 2: Custom retry policy
// await withRetry(fetchData, {
//   maxRetries: 5,
//   minDelay: 200,
//   maxDelay: 10000,
// });

// Example 3: Conditional retry with different error handling
// await withRetry(
  async () => {
    const data = await fetchData();
    if (data.status === 'error') throw new Error(data.message);
    return data;
  },
  { maxRetries: 2 }
// );

// Example 4: Using with async iterator (e.g., paginated API)
// for await (const page of paginateWithRetry()) {
//   console.log(page);
// }