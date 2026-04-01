// Converts various string cases to camelCase
// Supports: kebab-case, snake_case, PascalCase, space case, and Title Case
function toCamelCase(str) {
  if (typeof str !== 'string') return '';
  
  return str
    .replace(/[^a-zA-Z0-9]/g, ' ')
    .split(' ')
    .map((word, i) => {
      if (i === 0) {
        return word.toLowerCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join('');
}

// Converts various string cases to PascalCase (CapitalizedWords)
function toPascalCase(str) {
  if (typeof str !== 'string') return '';
  
  const camel = toCamelCase(str);
  return camel.charAt(0).toUpperCase() + camel.slice(1);
}

// Converts various string cases to kebab-case (lowercase-words-separated)
function toKebabCase(str) {
  if (typeof str !== 'string') return '';
  
  return str
    .replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
}

// Converts various string cases to snake_case (lowercase_words_separated)
function toSnakeCase(str) {
  return toKebabCase(str).replace(/-/g, '_');
}

// Converts various string cases to space case (lowercase words separated)
function toSpaceCase(str) {
  if (typeof str !== 'string') return '';
  
  return str
    .replace(/[A-Z]/g, ' $&')
    .replace(/[^a-zA-Z0-9 ]/g, ' ')
    .trim()
    .toLowerCase();
}