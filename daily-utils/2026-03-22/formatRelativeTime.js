// Formats a date into a human-readable relative time string
// Examples: 'just now', '5 minutes ago', 'in 2 hours', 'yesterday', '2 weeks ago'
function formatRelativeTime(date, now = new Date()) {
  const seconds = Math.floor((now - new Date(date)) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 0) {
    return 'in ' + formatRelativeTime(Math.abs(seconds), false);
  }

  if (seconds < 10) return 'just now';
  if (seconds < 60) return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  if (days === 1) return 'yesterday';
  if (days < 7) return `${days} day${days !== 1 ? 's' : ''} ago`;
  if (weeks < 4) return `${weeks} week${weeks !== 1 ? 's' : ''} ago`;
  if (months < 12) return `${months} month${months !== 1 ? 's' : ''} ago`;
  return `${years} year${years !== 1 ? 's' : ''} ago`;
}

// Shorthand for future dates
function formatRelativeTimeFuture(date, now = new Date()) {
  const seconds = Math.floor((new Date(date) - now) / 1000);
  if (seconds < 0) return formatRelativeTime(date, now);
  if (seconds < 60) return `in ${seconds} second${seconds !== 1 ? 's' : ''}`;
  if (seconds < 3600) return `in ${Math.floor(seconds / 60)} minute${Math.floor(seconds / 60) !== 1 ? 's' : ''}`;
  return `in ${Math.floor(seconds / 3600)} hour${Math.floor(seconds / 3600) !== 1 ? 's' : ''}`;
}

// Unified API for both past and future
function relativeTime(date, options = {}) {
  const { now = new Date(), future = false } = options;
  const targetDate = new Date(date);
  
  if (future) {
    return formatRelativeTimeFuture(targetDate, now);
  }
  return formatRelativeTime(targetDate, now);
}