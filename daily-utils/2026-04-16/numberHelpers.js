// Number range helpers: clamp, wrap, remap

/**
 * Constrains a number to be within a specified range [min, max].
 * @param {number} value - The value to clamp.
 * @param {number} min - The minimum allowed value.
 * @param {number} max - The maximum allowed value.
 * @returns {number} The clamped value.
 * @example
 * clamp(15, 10, 20) // 15
 * clamp(5, 10, 20)  // 10
 * clamp(25, 10, 20) // 20
 */
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

/**
 * Wraps a number so it stays within [min, max) by looping around the range.
 * @param {number} value - The value to wrap.
 * @param {number} min - The minimum allowed value (inclusive).
 * @param {number} max - The maximum allowed value (exclusive).
 * @returns {number} The wrapped value.
 * @example
 * wrap(25, 10, 20) // 15
 * wrap(5, 10, 20)  // 15
 * wrap(15, 10, 20) // 15
 */
const wrap = (value, min, max) => {
  const range = max - min;
  const offset = value - min;
  return ((offset % range) + range) % range + min;
};

/**
 * Re-maps a number from one range to another (e.g., 0-100 to 0-1).
 * @param {number} value - The value to re-map.
 * @param {number} inMin - Input range minimum.
 * @param {number} inMax - Input range maximum.
 * @param {number} outMin - Output range minimum.
 * @param {number} outMax - Output range maximum.
 * @returns {number} The re-mapped value.
 * @example
 * remap(50, 0, 100, 0, 1) // 0.5
 * remap(25, 10, 20, 0, 10) // 2.5
 */
const remap = (value, inMin, inMax, outMin, outMax) => {
  const normalized = (value - inMin) / (inMax - inMin);
  return outMin + normalized * (outMax - outMin);
};

// Export for modules or reuse
// export { clamp, wrap, remap };

// Usage examples:
// clamp(15, 10, 20) => 15
// wrap(25, 10, 20) => 15
// remap(50, 0, 100, 0, 1) => 0.5
// remap(15, 10, 20, 0, 10) => 5