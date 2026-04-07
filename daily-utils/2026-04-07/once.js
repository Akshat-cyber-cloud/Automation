// Once - Ensures a function is called only once and caches the result
// @param {Function} fn - The function to wrap
// @returns {Function} A wrapped function that executes only once
const once = (fn) => {
  let called = false;
  let result;

  return (...args) => {
    if (!called) {
      called = true;
      result = fn(...args);
    }
    return result;
  };
};

// Memoized version that caches results per argument set
// @param {Function} fn - The function to memoize
// @returns {Function} A memoized function that caches results by arguments
const memoize = (fn) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};

// Throttle function - executes at most once per time interval
// @param {Function} fn - The function to throttle
// @param {number} delay - Time in milliseconds between executions
// @returns {Function} A throttled function
const throttle = (fn, delay) => {
  let lastCall = 0;
  return (...args) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      return fn(...args);
    }
  };
};