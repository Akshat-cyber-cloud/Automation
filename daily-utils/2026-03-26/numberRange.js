/**
 * Clamps a number to ensure it lies within a given range.
 * @param {number} value - The number to clamp.
 * @param {number} min - The minimum allowed value (inclusive).
 * @param {number} max - The maximum allowed value (inclusive).
 * @returns {number} The clamped value, guaranteed to be between min and max.
 * @throws {TypeError} If min > max or any argument is not a finite number.
 *
 * @example
 * clamp(10, 0, 5); // returns 5
 * clamp(-3, 1, 8); // returns 1
 * clamp(4, 4, 4); // returns 4
 */
const clamp = (value, min, max) => {
  if (!Number.isFinite(value) || !Number.isFinite(min) || !Number.isFinite(max)) {
    throw new TypeError('All arguments must be finite numbers.');
  }
  if (min > max) {
    throw new TypeError('Minimum value cannot be greater than maximum value.');
  }
  return Math.min(Math.max(value, min), max);
};

/**
 * Wraps a number around a cyclic range [min, max].
 * @param {number} value - The number to wrap.
 * @param {number} min - The minimum value of the cyclic range (inclusive).
 * @param {number} max - The maximum value of the cyclic range (inclusive).
 * @returns {number} The wrapped value within [min, max].
 * @throws {TypeError} If min > max or any argument is not a finite number.
 *
 * @example
 * wrap(12, 0, 10); // returns 2
 * wrap(-1, 0, 10); // returns 9
 */
const wrap = (value, min, max) => {
  if (!Number.isFinite(value) || !Number.isFinite(min) || !Number.isFinite(max)) {
    throw new TypeError('All arguments must be finite numbers.');
  }
  if (min > max) {
    throw new TypeError('Minimum value cannot be greater than maximum value.');
  }
  const range = max - min + 1;
  const offset = value - min;
  return ((offset % range) + range) % range + min;
};

// Usage examples:
// clamp(10, 0, 5);      // => 5
// clamp(-3, 1, 8);      // => 1
// wrap(12, 0, 10);      // => 2
// wrap(-1, 0, 10);      // => 9