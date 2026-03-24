// Validates if a password meets common security requirements.
// Requires at least 8 characters, one uppercase, one lowercase, one digit, and one special character.

/**
 * Checks if a password is strong based on common security requirements.
 * @param {string} password - The password to validate.
 * @param {Object} [options] - Optional validation rules.
 * @param {number} [options.minLength=8] - Minimum password length.
 * @param {boolean} [options.requireUppercase=true] - Require at least one uppercase letter.
 * @param {boolean} [options.requireLowercase=true] - Require at least one lowercase letter.
 * @param {boolean} [options.requireDigit=true] - Require at least one digit.
 * @param {boolean} [options.requireSpecialChar=true] - Require at least one special character.
 * @returns {boolean} True if the password meets all requirements, false otherwise.
 * @example
 * isStrongPassword('Password123!') // returns true
 * isStrongPassword('weak') // returns false
 */
export function isStrongPassword(password, options = {}) {
  const {
    minLength = 8,
    requireUppercase = true,
    requireLowercase = true,
    requireDigit = true,
    requireSpecialChar = true,
  } = options;

  if (typeof password !== 'string' || password.length < minLength) {
    return false;
  }

  const hasUppercase = requireUppercase ? /[A-Z]/.test(password) : true;
  const hasLowercase = requireLowercase ? /[a-z]/.test(password) : true;
  const hasDigit = requireDigit ? /\d/.test(password) : true;
  const hasSpecialChar = requireSpecialChar ? /[^A-Za-z0-9]/.test(password) : true;

  return hasUppercase && hasLowercase && hasDigit && hasSpecialChar;
}

/**
 * Checks if a password is strong and meets additional entropy requirements.
 * @param {string} password - The password to validate.
 * @param {Object} [options] - Optional entropy and length rules.
 * @param {number} [options.minLength=12] - Minimum password length for entropy check.
 * @param {number} [options.minEntropy=28] - Minimum entropy bits (log2 of character set size ^ length).
 * @returns {boolean} True if the password meets entropy and length requirements, false otherwise.
 * @example
 * isStrongPasswordWithEntropy('SecureP@ssw0rd2024') // returns true
 * isStrongPasswordWithEntropy('12345') // returns false
 */
export function isStrongPasswordWithEntropy(password, options = {}) {
  const { minLength = 12, minEntropy = 28 } = options;

  if (typeof password !== 'string' || password.length < minLength) {
    return false;
  }

  const charClasses = [
    /[A-Z]/.test(password),
    /[a-z]/.test(password),
    /\d/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ].filter(Boolean).length;

  const charSetSize = charClasses * 10 + (4 - charClasses) * 26;
  const entropy = Math.log2(Math.pow(charSetSize, password.length));

  return entropy >= minEntropy;
}