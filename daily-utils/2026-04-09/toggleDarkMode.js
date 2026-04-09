// Toggles dark/light mode and persists user preference
const toggleDarkMode = () => {
  const html = document.documentElement;
  const isDark = html.classList.toggle('dark-mode');

  // Update preference in localStorage
  localStorage.setItem('darkMode', String(isDark));
  
  // Apply theme immediately
  html.style.colorScheme = isDark ? 'dark' : 'light';
  html.setAttribute('data-theme', isDark ? 'dark' : 'light');
};

// Initialize dark mode based on saved preference
const initDarkMode = () => {
  const saved = localStorage.getItem('darkMode');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (saved === 'true' || (!saved && prefersDark)) {
    document.documentElement.classList.add('dark-mode');
    document.documentElement.setAttribute('data-theme', 'dark');
    document.documentElement.style.colorScheme = 'dark';
  }
};

// Returns current mode state
const getDarkMode = () => {
  return document.documentElement.classList.contains('dark-mode');
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { toggleDarkMode, initDarkMode, getDarkMode };
}