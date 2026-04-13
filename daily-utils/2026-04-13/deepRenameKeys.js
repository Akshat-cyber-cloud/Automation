// Recursively renames object keys using a mapping function
// Supports plain objects, arrays, and primitive values
function deepRenameKeys(obj, mapFn) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => deepRenameKeys(item, mapFn));
  }

  const result = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const newKey = mapFn(key);
      result[newKey] = deepRenameKeys(obj[key], mapFn);
    }
  }
  return result;
}

// Utility to convert snake_case to camelCase
function snakeToCamel(str) {
  return str.replace(/[_-]([a-z])/g, (_, letter) => letter.toUpperCase());
}

// Utility to convert camelCase to snake_case
function camelToSnake(str) {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}