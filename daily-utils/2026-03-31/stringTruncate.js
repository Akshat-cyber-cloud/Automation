// Truncates a string to maxLength characters, appending '…' if truncated.
// Options allow custom ellipsis, omission of trailing space, and word boundary truncation.

/**
 * Truncates a string to a specified length.
 * @param {string} str - The string to truncate.
 * @param {number} maxLength - The maximum length including the ellipsis.
 * @param {Object} [options] - Optional settings.
 * @param {string} [options.ellipsis='…'] - The ellipsis to append when truncating.
 * @param {boolean} [options.preserveWords=false] - If true, truncate at the nearest word boundary.
 * @param {boolean} [options.includeSpace=true] - If true, includes a trailing space before ellipsis when preserving words.
 * @returns {string} The truncated string.
 * @example
 * truncate('Hello world', 8) // => 'Hello…'
 * truncate('Hello world', 10, { preserveWords: true }) // => 'Hello…'
 * truncate('Hello world', 11, { preserveWords: true }) // => 'Hello world'
 */
export function truncate(str, maxLength, options = {}) {
  if (str.length <= maxLength) return str;

  const {
    ellipsis = '…',
    preserveWords = false,
    includeSpace = true,
  } = options;

  if (preserveWords) {
    const words = str.split(/(\s+)/);
    let result = '';
    for (const word of words) {
      if ((result + (includeSpace ? ' ' : '') + word + ellipsis).length > maxLength) {
        break;
      }
      result += (includeSpace && result ? ' ' : '') + word;
    }
    return result + ellipsis;
  }

  return str.slice(0, Math.max(0, maxLength - ellipsis.length)) + ellipsis;
}

/**
 * Truncates a string to a specified number of lines, collapsing extra lines with an ellipsis.
 * @param {string} str - The string to truncate.
 * @param {number} maxLines - The maximum number of lines to keep.
 * @param {Object} [options] - Optional settings.
 * @param {number} [options.lineLength=Infinity] - Maximum characters per line.
 * @param {string} [options.ellipsis='…'] - The ellipsis to append when truncating.
 * @returns {string} The truncated string.
 * @example
 * truncateLines('Line 1\nLine 2\nLine 3', 2) // => 'Line 1\nLine 2…'
 * truncateLines('A very long line', 1, { lineLength: 10 }) // => 'A very long…'
 */
export function truncateLines(str, maxLines, options = {}) {
  if (maxLines <= 0) return '';

  const {
    lineLength = Infinity,
    ellipsis = '…',
  } = options;

  const lines = str.split('\n');
  if (lines.length <= maxLines) return str;

  const resultLines = lines.slice(0, maxLines);
  const lastLine = resultLines[resultLines.length - 1];

  if (lastLine.length > lineLength) {
    resultLines[resultLines.length - 1] = lastLine.slice(0, Math.max(0, lineLength - ellipsis.length)) + ellipsis;
  }

  return resultLines.join('\n') + (lines.length > maxLines ? ellipsis : '');
}