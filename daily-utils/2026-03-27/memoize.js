/**
 * Creates a memoized version of a function that caches its results based on input arguments.
 * Supports both primitive and object/array keys via JSON serialization.
 *
 * @template T
 * @param {function(...*): T} fn - The function to memoize.
 * @param {function(...*): string} [keyFn=(...args) => JSON.stringify(args)] - Optional key generator.
 * @returns {function(...*): T} A memoized version of the input function.
 *
 * @example
 * const slowAdd = (a, b) => {
 *   console.log('Computing...');
 *   return a + b;
 * };
 * const memoizedAdd = memoize(slowAdd);
 * console.log(memoizedAdd(2, 3)); // Computes and logs
 * console.log(memoizedAdd(2, 3)); // Returns cached result, no log
 */
function memoize(fn, keyFn = (...args) => JSON.stringify(args)) {
  const cache = new Map();
  
  return (...args) => {
    const key = keyFn(...args);
    if (cache.has(key)) return cache.get(key);
    
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

/**
 * Memoizes a function with a custom cache key strategy for object inputs.
 *
 * @template T
 * @param {function(...*): T} fn - The function to memoize.
 * @param {function(...*): string} keyFn - Custom key generator.
 * @returns {function(...*): T} A memoized version of the input function.
 *
 * @example
 * const deepEquals = (a, b) => a.x === b.x;
 * const memoizedDeep = memoizeWith(
 *   (obj) => `${obj.x}_${obj.y}`,
 *   (obj) => obj
 * );
 */
function memoizeWith(keyFn, fn) {
  const cache = new Map();
  
  return (...args) => {
    const key = keyFn(...args);
    if (cache.has(key)) return cache.get(key);
    
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}