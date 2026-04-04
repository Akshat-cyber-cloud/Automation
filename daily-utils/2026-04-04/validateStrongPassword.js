// Strong Password Validator (ES2020+)
/**
 * Checks if a password meets common security requirements:
 * - Minimum 8 characters long
 * - Contains at least one uppercase letter
 * - Contains at least one lowercase letter
 * - Contains at least one digit
 * - Contains at least one special character (e.g., !@#$%^&*)
 *
 * @param {string} password - The password to validate
 * @param {Object} [options] - Optional configuration
 * @param {number} [options.minLength=8] - Minimum required length
 * @param {boolean} [options.requireUppercase=true] - Require at least one uppercase letter
 * @param {boolean} [options.requireLowercase=true] - Require at least one lowercase letter
 * @param {boolean} [options.requireDigit=true] - Require at least one digit
 * @param {boolean} [options.requireSpecialChar=true] - Require at least one special character
 * @param {string} [options.specialChars='!@#$%^&*()_+-=[]{}|;:,.<>?'] - Allowed special characters
 * @returns {boolean} - True if password meets all requirements
 */
function isStrongPassword(password, options = {}) {
  const {
    minLength = 8,
    requireUppercase = true,
    requireLowercase = true,
    requireDigit = true,
    requireSpecialChar = true,
    specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?'
  } = options;

  if (typeof password !== 'string' || password.length === 0) {
    return false;
  }

  if (password.length < minLength) {
    return false;
  }

  const hasUppercase = requireUppercase ? /[A-Z]/.test(password) : true;
  const hasLowercase = requireLowercase ? /[a-z]/.test(password) : true;
  const hasDigit = requireDigit ? /[0-9]/.test(password) : true;
  const hasSpecialChar = requireSpecialChar
    ? new RegExp(`[${specialChars.replace(/[-\/\^$*+?.()|[\]{}]/g, '\\$&')}]`).test(password)
    : true;

  return hasUppercase && hasLowercase && hasDigit && hasSpecialChar;
}

// Example: Check if password meets basic security requirements
// if (!isStrongPassword(userPassword)) {
//   alert('Password must be at least 8 characters with uppercase, lowercase, number, and special character.');
// }

// Example: Customize requirements for a specific use case
// const isSecurePassword = isStrongPassword(password, {
//   minLength: 12,
//   requireSpecialChar: false
// });

// Example: Validate against a custom set of special characters
// const isCustomSecure = isStrongPassword(password, {
//   specialChars: '!@#$%^&*'
// });

// Example: Quick check with default settings
// if (isStrongPassword(password)) {
//   proceedWithRegistration();
// }