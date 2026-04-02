// Returns a human-readable duration string from milliseconds
// Examples: 0 → '0s', 120000 → '2m', 3661000 → '1h 1m 1s'
function formatDuration(ms) {
  if (typeof ms !== 'number' || ms < 0 || !Number.isFinite(ms)) {
    throw new Error('Duration must be a non-negative finite number');
  }

  const units = [
    { max: 2764800000, value: 2764800000, name: 'mo' }, // 32 days
    { max: 604800000, value: 604800000, name: 'w' },   // 7 days
    { max: 86400000, value: 86400000, name: 'd' },     // 1 day
    { max: 3600000, value: 3600000, name: 'h' },       // 1 hour
    { max: 60000, value: 60000, name: 'm' },           // 1 minute
    { max: 1000, value: 1000, name: 's' },             // 1 second
    { value: 1, name: 'ms' }
  ];

  let remaining = ms;
  const parts = [];

  for (const { max, value, name } of units) {
    if (remaining >= (max ?? value)) {
      const count = Math.floor(remaining / value);
      parts.push(`${count}${name}`);
      remaining %= value;
    }
  }

  return parts.length > 0 ? parts.join(' ') : '0ms';
}