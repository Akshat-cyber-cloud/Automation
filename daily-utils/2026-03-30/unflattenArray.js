/**
 * Unflattens a flat array of entries into a nested structure using path indices.
 * @param {Array} flatArray - Flat array where each element is an object with { value, path }.
 * @param {string} [pathSeparator='.'] - Separator used in path strings (e.g., '0.1.2').
 * @returns {Array} A nested array structure reconstructed from the path-based entries.
 * @example
 * unflattenArray([
 *   { value: 'a', path: '0' },
 *   { value: 'b', path: '1' },
 *   { value: 'c', path: '1.0' }
 * ]);
 * // => ['a', ['b', 'c']]
 *
 * unflattenArray([
 *   { value: 1, path: '0.0' },
 *   { value: 2, path: '0.1' },
 *   { value: 3, path: '1' }
 * ]);
 * // => [[1, 2], 3]
 */
export function unflattenArray(flatArray, pathSeparator = '.') {
  const root = [];
  const map = new Map();

  for (const entry of flatArray) {
    const path = entry.path.split(pathSeparator).map(Number);
    let current = root;

    for (let i = 0; i < path.length; i++) {
      const idx = path[i];
      if (i === path.length - 1) {
        current[idx] = entry.value;
        break;
      }
      if (!current[idx]) current[idx] = [];
      current = current[idx];
    }
  }

  return root;
}