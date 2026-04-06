// locale-aware number formatter and parser
/**
 * Formats a number with thousands separators and optional decimal places using browser locale.
 * @param {number} value - The number to format.
 * @param {number} [decimals=2] - Number of decimal places; omit to auto-format.
 * @param {string} [locale] - BCP 47 language tag (e.g., 'en-US', 'de-DE'); defaults to browser locale.
 * @returns {string} The formatted number string.
 * @example
 * formatNumber(1234.567, 1, 'en-US') // => "1,234.6"
 * formatNumber(1234.567) // => "1,234.57" (browser locale applied)
 */
export function formatNumber(value, decimals = 2, locale = undefined) {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    throw new TypeError('value must be a number');
  }
  const fixed = value.toFixed(decimals);
  return new Intl.NumberFormat(locale).format(parseFloat(fixed));
}

/**
 * Parses a locale-formatted number string back to a number.
 * @param {string} str - The formatted number string (e.g., "1,234.56").
 * @param {string} [locale] - BCP 47 language tag; defaults to browser locale.
 * @returns {number} The parsed number.
 * @example
 * parseNumber('1.234,56', 'de-DE') // => 1234.56
 * parseNumber('1,234.56') // => 1234.56 (browser locale applied)
 */
export function parseNumber(str, locale = undefined) {
  if (typeof str !== 'string' || str.trim() === '') {
    throw new TypeError('str must be a non-empty string');
  }
  const decimalSep = (new Intl.NumberFormat(locale).format(1.1)).charAt(1);
  const clean = str
    .replace(new RegExp(`\${decimalSep}`, 'g'), '.')
    .replace(/[^\d.-]/g, '');
  const num = parseFloat(clean);
  if (Number.isNaN(num)) throw new TypeError('invalid number string');
  return num;
}