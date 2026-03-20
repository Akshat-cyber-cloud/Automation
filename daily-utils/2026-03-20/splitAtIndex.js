// Splits an array into two parts at a given index.
// Returns an array containing [leftPart, rightPart].
// If index is out of bounds, returns the original array as both parts.
function splitAtIndex(arr, index) {
  if (!Array.isArray(arr)) {
    throw new TypeError('First argument must be an array.');
  }
  if (typeof index !== 'number' || !Number.isInteger(index) || index < 0) {
    throw new TypeError('Second argument must be a non-negative integer.');
  }
  const leftPart = arr.slice(0, index);
  const rightPart = arr.slice(index);
  return [leftPart, rightPart];
}

// Splits an array at every occurrence of a delimiter value.
// Returns an array of subarrays split at each delimiter.
function splitAtDelimiter(arr, delimiter) {
  if (!Array.isArray(arr)) {
    throw new TypeError('First argument must be an array.');
  }
  if (delimiter === undefined) {
    throw new TypeError('Second argument (delimiter) is required.');
  }

  const result = [];
  let currentChunk = [];

  for (const item of arr) {
    if (item === delimiter) {
      result.push(currentChunk);
      currentChunk = [];
    } else {
      currentChunk.push(item);
    }
  }

  result.push(currentChunk);
  return result;
}