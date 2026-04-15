// Returns a promise that rejects if the given promise doesn't settle within the specified timeout.
// If the timeout is reached, the returned promise is rejected with a 'TimeoutError'.
const withTimeout = (promise, ms) => {
  let timeoutId;
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error('TimeoutError'));
    }, ms);
  });

  return Promise.race([promise, timeoutPromise]).finally(() => {
    clearTimeout(timeoutId);
  });
};

// Returns a function that wraps async functions with a timeout.
// Useful for creating reusable timeout-aware utilities.
const withTimeoutFn = (ms) => (promise) => withTimeout(promise, ms);

// Throws a custom TimeoutError for easier error handling.
class TimeoutError extends Error {
  constructor(message = 'Operation timed out.') {
    super(message);
    this.name = 'TimeoutError';
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TimeoutError);
    }
  }
}

// Override the default timeout rejection to use TimeoutError.
const withStrictTimeout = (promise, ms) => {
  return withTimeout(promise, ms).catch((err) => {
    if (err.message === 'TimeoutError') {
      throw new TimeoutError(err.message);
    }
    throw err;
  });
};