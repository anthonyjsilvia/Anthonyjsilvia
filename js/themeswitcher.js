document.addEventListener('DOMContentLoaded', () => {
    // Check for saved theme preference or use OS preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Set the theme based on saved preference or OS preference
    if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark-theme');
    } else if (savedTheme === 'light') {
        document.documentElement.classList.add('light-theme');
    } else if (prefersDark) {
        document.documentElement.setAttribute('data-prefers-dark', 'true');
    }
    
    // Create and add theme switcher button to the DOM if it doesn't exist
    if (!document.querySelector('.theme-switcher')) {
        const themeSwitcher = document.createElement('div');
        themeSwitcher.className = 'theme-switcher';
        
        const themeBtn = document.createElement('button');
        themeBtn.className = 'theme-btn';
        themeBtn.setAttribute('aria-label', 'Toggle dark/light mode');
        
        // Set icon based on current theme
        updateThemeIcon(themeBtn);
        
        themeBtn.addEventListener('click', toggleTheme);
        themeSwitcher.appendChild(themeBtn);
        document.body.appendChild(themeSwitcher);
    }
    
    // Handle theme toggle
    function toggleTheme() {
        if (document.documentElement.classList.contains('dark-theme')) {
            // Switch to light mode
            document.documentElement.classList.remove('dark-theme');
            document.documentElement.classList.add('light-theme');
            localStorage.setItem('theme', 'light');
        } else if (document.documentElement.classList.contains('light-theme')) {
            // Switch to system preference
            document.documentElement.classList.remove('light-theme');
            localStorage.removeItem('theme');
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                document.documentElement.setAttribute('data-prefers-dark', 'true');
            } else {
                document.documentElement.removeAttribute('data-prefers-dark');
            }
        } else {
            // Switch to dark mode
            document.documentElement.classList.add('dark-theme');
            document.documentElement.removeAttribute('data-prefers-dark');
            localStorage.setItem('theme', 'dark');
        }
        
        // Update the theme icon
        updateThemeIcon(document.querySelector('.theme-btn'));
    }
    
    // Update the theme icon based on current theme
    function updateThemeIcon(button) {
        if (document.documentElement.classList.contains('dark-theme')) {
            button.innerHTML = '<i class="fas fa-sun"></i>'; // Use sun icon for dark mode
        } else if (document.documentElement.classList.contains('light-theme')) {
            button.innerHTML = '<i class="fas fa-moon"></i>'; // Use moon icon for light mode
        } else {
            // System preference
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                button.innerHTML = '<i class="fas fa-sun"></i>';
            } else {
                button.innerHTML = '<i class="fas fa-moon"></i>';
            }
        }
    }
    
    // Listen for OS theme preference changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('theme')) {
            if (e.matches) {
                document.documentElement.setAttribute('data-prefers-dark', 'true');
            } else {
                document.documentElement.removeAttribute('data-prefers-dark');
            }
            updateThemeIcon(document.querySelector('.theme-btn'));
        }
    });
});