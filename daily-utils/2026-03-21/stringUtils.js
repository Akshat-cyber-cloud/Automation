/**
 * Masks part of an email address for privacy.
 * @param {string} email - The email address to mask
 * @param {number} [unmaskedLength=2] - Number of characters to leave unmasked at the start
 * @returns {string} Masked email string (e.g., 'j*****@example.com')
 * @example
 * maskEmail('john.doe@example.com')
 * // => 'jo****@example.com'
 * 
 * maskEmail('jane@company.org', 3)
 * // => 'jan****@company.org'
 */
const maskEmail = (email, unmaskedLength = 2) => {
  if (typeof email !== 'string' || email.length === 0) {
    return '';
  }

  const atIndex = email.indexOf('@');
  if (atIndex === -1) {
    return email;
  }

  const localPart = email.slice(0, atIndex);
  const domain = email.slice(atIndex);

  if (localPart.length <= unmaskedLength) {
    return email;
  }

  const maskedLocal = localPart.slice(0, unmaskedLength) +
    '*'.repeat(Math.max(0, localPart.length - unmaskedLength - 1)) +
    localPart.slice(-1);

  return maskedLocal + domain;
};

/**
 * Truncates a string to a maximum length, adding ellipsis if truncated.
 * @param {string} str - The string to truncate
 * @param {number} maxLength - Maximum length before truncation
 * @param {string} [ellipsis='…'] - String to append when truncated
 * @returns {string} Truncated string with ellipsis if needed
 * @example
 * truncate('Hello world', 8)
 * // => 'Hello…'
 * 
 * truncate('Short', 10)
 * // => 'Short'
 */
const truncate = (str, maxLength, ellipsis = '…') => {
  if (typeof str !== 'string' || maxLength <= 0) {
    return '';
  }
  if (str.length <= maxLength) {
    return str;
  }
  return str.slice(0, maxLength - ellipsis.length) + ellipsis;
};

// Example usage:
// maskEmail('user@example.com')
// maskEmail('admin@site.com', 3)
// truncate('This is a long sentence', 10)
// truncate('Short', 10, '...')