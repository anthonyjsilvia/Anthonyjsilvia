const toggleButton = document.querySelector('#toggle-button');

toggleButton.addEventListener('click', () => {
  const body = document.querySelector('body');
  if (body.classList.contains('dark-mode')) {
    body.classList.remove('dark-mode');
  } else {
    body.classList.add('dark-mode');
  }
});

function setTheme(theme) {
  const body = document.querySelector('body');
  if (theme === 'dark') {
    body.classList.add('dark-mode');
    body.style.setProperty('--background-color', '#1E1E1E');
    body.style.setProperty('--background-color-light', '#2E2E2E');
    body.style.setProperty('--text-color', '#FFFFFF');
    body.style.setProperty('--text-color-light', '#000000');
    body.style.setProperty('--primary-color', '#FFB200');
    body.style.setProperty('--primary-color-dark', '#0059FF');
  } else {
    body.classList.remove('dark-mode');
body.style.setProperty('--background-color', '#F3F3F3');
body.style.setProperty('--background-color-dark', '#1E1E1E');
body.style.setProperty('--text-color', '#000000');
body.style.setProperty('--text-color-light', '#FFFFFF');
body.style.setProperty('--primary-color', '#0059FF');
body.style.setProperty('--primary-color-dark', '#FFB200');
}
}

// Check user preference for dark mode and set it accordingly
const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
if (prefersDarkMode) {
setTheme('dark');
}
