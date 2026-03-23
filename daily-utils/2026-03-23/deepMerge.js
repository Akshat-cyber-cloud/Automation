// Deeply merges multiple objects into a single new object
// Skips non-enumerable, symbol, and prototype properties
function deepMerge(...sources) {
  const target = Object.create(null);
  for (const source of sources) {
    if (source == null) continue;
    const keys = Reflect.ownKeys(source);
    for (const key of keys) {
      const desc = Object.getOwnPropertyDescriptor(source, key);
      if (desc == null || !desc.enumerable) continue;
      const value = source[key];
      if (value != null && typeof value === 'object' && !Array.isArray(value)) {
        if (!Object.prototype.hasOwnProperty.call(target, key)) {
          Object.defineProperty(target, key, {
            value: deepMerge(Object.create(null), value),
            enumerable: true,
            configurable: true,
            writable: true,
          });
        } else {
          Object.defineProperty(target, key, {
            value: deepMerge(target[key], value),
            enumerable: true,
            configurable: true,
            writable: true,
          });
        }
      } else {
        Object.defineProperty(target, key, {
          value,
          enumerable: true,
          configurable: true,
          writable: true,
        });
      }
    }
  }
  return target;
}

/**
 * @param {...Object} sources - Objects to merge (later objects override earlier ones)
 * @returns {Object} A new deeply merged object without mutating inputs
 * @example
 * const base = { a: 1, b: { x: 2 } };
 * const update = { b: { y: 3 }, c: 4 };
 * const merged = deepMerge(base, update);
 * // => { a: 1, b: { x: 2, y: 3 }, c: 4 }
 * // base remains { a: 1, b: { x: 2 } }
 */

// Example 1: Merge two objects
// const merged = deepMerge({ a: 1 }, { b: 2 });

// Example 2: Nested objects are merged recursively
// const merged = deepMerge({ a: { x: 1 } }, { a: { y: 2 } });

// Example 3: Later objects override earlier ones at all levels
// const merged = deepMerge({ a: { x: 1 } }, { a: 2 });

// Example 4: Handles null/undefined sources safely
// const merged = deepMerge({ a: 1 }, null, { b: 2 }, undefined);