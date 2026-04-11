// Mask sensitive portions of strings (e.g., emails, phone numbers, credit cards)
/**
 * Masks all but the first and last `keep` characters of a string with an asterisk placeholder.
 * @param {string} str - The string to mask.
 * @param {number} [keep=1] - Number of characters to reveal at start and end.
 * @param {string} [maskChar='*'] - Character to use for masking.
 * @returns {string} The masked string.
 * @example
 * maskSensitive('user@example.com', 2, '#') // => 'us###############om'
 */
export function maskSensitive(str, keep = 1, maskChar = '*') {
  if (typeof str !== 'string' || str.length === 0) return str;

  if (keep <= 0) return maskChar.repeat(str.length);

  const keepStart = Math.min(keep, str.length);
  const keepEnd = Math.max(0, str.length - keep);

  if (keepStart >= keepEnd) return str;

  const visibleStart = str.slice(0, keepStart);
  const visibleEnd = str.slice(keepEnd);
  const masked = maskChar.repeat(str.length - keepStart - (str.length - keepEnd));

  return `${visibleStart}${masked}${visibleEnd}`;
}

/**
 * Masks an email by revealing the first character, domain, and TLD while hiding the local part.
 * @param {string} email - The email address to mask.
 * @param {number} [keepLocal=1] - Characters to reveal at the start of the local part.
 * @returns {string} Masked email.
 * @example
 * maskEmail('user@example.com') // => 'u*****@example.com'
 * maskEmail('john.doe@company.org', 2) // => 'jo****@company.org'
 */
export function maskEmail(email, keepLocal = 1) {
  if (typeof email !== 'string' || !email.includes('@')) return email;

  const [localPart, domain] = email.split('@');
  const maskedLocal = maskSensitive(localPart, keepLocal);

  return `${maskedLocal}@${domain}`;
}