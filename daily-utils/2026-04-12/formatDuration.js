// Formats a duration (in milliseconds) into a human-readable string.
// Examples: 90061000 → '1d 1h 1m 1s', 3723000 → '1h 2m 3s'
function formatDuration(ms) {
  if (typeof ms !== 'number' || ms < 0) {
    throw new Error('Duration must be a non-negative number');
  }

  const units = [
    { name: 'd', ms: 86400000 },
    { name: 'h', ms: 3600000 },
    { name: 'm', ms: 60000 },
    { name: 's', ms: 1000 },
  ];

  const parts = [];
  let remaining = ms;

  for (const unit of units) {
    if (remaining >= unit.ms) {
      const value = Math.floor(remaining / unit.ms);
      parts.push(`${value}${unit.name}`);
      remaining %= unit.ms;
    }
  }

  return parts.length ? parts.join(' ') : '0s';
}