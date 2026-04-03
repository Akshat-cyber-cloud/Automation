// Flattens a nested object into a single-level object with dot-notation keys
// @param {Object} obj - The object to flatten
// @param {string} [prefix=''] - Internal prefix for recursion (do not provide)
// @returns {Object} A new flattened object
function deepFlattenObject(obj, prefix = '') {
  if (typeof obj !== 'object' || obj === null) {
    return { [prefix]: obj };
  }

  const result = {};
  const keys = Object.keys(obj);

  for (const key of keys) {
    const newKey = prefix ? `${prefix}.${key}` : key;
    const value = obj[key];

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      Object.assign(result, deepFlattenObject(value, newKey));
    } else {
      result[newKey] = value;
    }
  }

  return result;
}

// Utility to unflatten a dot-notation object back to nested structure
// @param {Object} flatObj - The flattened object with dot-notation keys
// @returns {Object} A new nested object
function deepUnflattenObject(flatObj) {
  const result = {};

  for (const [key, value] of Object.entries(flatObj)) {
    const keys = key.split('.');
    let target = result;

    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i];
      if (!target[k]) target[k] = {};
      target = target[k];
    }

    target[keys[keys.length - 1]] = value;
  }

  return result;
}