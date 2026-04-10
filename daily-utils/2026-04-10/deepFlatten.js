// Recursively flattens nested arrays into a single-level array.
function deepFlatten(arr) {
  return arr.reduce((acc, val) => 
    Array.isArray(val) ? acc.concat(deepFlatten(val)) : acc.concat(val), 
    []
  );
}

// Flattens one level deep (shallow flatten).
function flattenOneLevel(arr) {
  return arr.flat(1);
}

// Flattens an array up to a specified depth.
function flattenToDepth(arr, depth = 1) {
  return arr.flat(depth);
}