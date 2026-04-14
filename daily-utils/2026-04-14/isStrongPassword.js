/**
 * Validates if a password meets minimum strength requirements.
 * @param {string} password - The password string to validate.
 * @param {Object} [options] - Optional configuration.
 * @param {number} [options.minLength=8] - Minimum password length.
 * @param {boolean} [options.requireUppercase=true] - Require at least one uppercase letter.
 * @param {boolean} [options.requireLowercase=true] - Require at least one lowercase letter.
 * @param {boolean} [options.requireNumber=true] - Require at least one digit.
 * @param {boolean} [options.requireSpecial=true] - Require at least one special character.
 * @returns {boolean} True if the password meets all requirements, false otherwise.
 * @example
 * isStrongPassword('Password123!') // returns true
 * isStrongPassword('weak', { minLength: 8 }) // returns false
 */
export function isStrongPassword(password, options = {}) {
  const {
    minLength = 8,
    requireUppercase = true,
    requireLowercase = true,
    requireNumber = true,
    requireSpecial = true,
  } = options;

  if (typeof password !== 'string' || password.length < minLength) {
    return false;
  }

  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (requireUppercase && !hasUppercase) return false;
  if (requireLowercase && !hasLowercase) return false;
  if (requireNumber && !hasNumber) return false;
  if (requireSpecial && !hasSpecial) return false;

  return true;
}