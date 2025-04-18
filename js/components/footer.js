/**
 * Footer Component
 * 
 * Fetches the current year from WorldTimeAPI and injects
 * the footer with dynamic copyright information and NodeDa branding
 */

var placeholderyear = "2025";

document.addEventListener('DOMContentLoaded', () => {
    // Create footer content
    const footer = document.querySelector('footer');
    
    if (footer) {
        // Initially set footer with the placeholder year
        footer.innerHTML = `
            <div class="footer-container">
                <div class="footer-content">
                    <p>&copy; <span id="current-year">${placeholderyear}</span> Anthony Silvia. All Rights Reserved</p>
                    
                    <div class="powered-by" style="display: flex; align-items: center; gap: 6px;">
                        <span>Powered by</span>
                        <a href="https://nodeda.com" target="_blank" style="display: flex; align-items: center;">
                            <img src="https://nodeda.com/logos/NodeDa.white.svg" alt="NodeDa" class="nodeda-logo" id="nodeda-logo" style="height: 1em;">
                        </a>
                    </div>
                    
                    <div class="footer-social">
                        <a href="https://linkedin.com/in/anthonyjsilvia" aria-label="LinkedIn"><i class="fab fa-linkedin"></i></a>
                        <a href="https://www.behance.net/anthonysilvia" aria-label="Behance"><i class="fab fa-behance"></i></a>
                        <a href="https://github.com/anthonyjsilvia" aria-label="GitHub"><i class="fab fa-github"></i></a>
                    </div>
                </div>
            </div>
        `;
        
        // Fetch current year from WorldTimeAPI
        fetchCurrentYear();
        
        // Apply initial theme and logo
        updateLogoForTheme();
        
        // Listen for theme changes
        document.addEventListener('themeChanged', updateLogoForTheme);
        
        // Also listen for system color scheme changes
        if (window.matchMedia) {
            const colorSchemeMedia = window.matchMedia('(prefers-color-scheme: dark)');
            colorSchemeMedia.addEventListener('change', updateLogoForTheme);
        }
    }
    
    // Function to update logo based on current theme
    function updateLogoForTheme() {
        const logo = document.getElementById('nodeda-logo');
        if (!logo) return;
        
        let isDarkMode = false;
        
        // Check for manual theme setting first
        if (document.documentElement.classList.contains('dark-theme')) {
            isDarkMode = true;
        } else if (document.documentElement.classList.contains('light-theme')) {
            isDarkMode = false;
        } else {
            // Then check system preference
            isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        
        // Set the logo source based on theme
        // White logo for dark mode, black logo for light mode
        logo.src = isDarkMode 
            ? 'https://nodeda.com/logos/NodeDa.white.svg' 
            : 'https://nodeda.com/logos/NodeDa.black.svg';
    }
    
    // Function to fetch current year from an internet time source
    function fetchCurrentYear() {
        fetch('https://worldtimeapi.org/api/ip')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Extract year from datetime string (format: 2023-04-14T15:04:05.123456-07:00)
                const year = new Date(data.datetime).getFullYear();
                updateFooterYear(year);
            })
            .catch(error => {
                console.error('Error fetching year from API:', error);
                // Fallback - try another API
                fallbackYearFetch();
            });
    }
    
    // Fallback to another time API if the first one fails
    function fallbackYearFetch() {
        fetch('https://timeapi.io/api/Time/current/zone?timeZone=UTC')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                const year = data.year;
                updateFooterYear(year);
            })
            .catch(error => {
                console.error('Error fetching year from fallback API:', error);
                // Last resort - use server date from response headers
                const year = new Date().getFullYear();
                updateFooterYear(year, true);
            });
    }
    
    // Update the footer with the current year
    function updateFooterYear(year, isFallback = false) {
        const yearElement = document.getElementById('current-year');
        if (yearElement) {
            yearElement.textContent = year;
            
            // Optionally add a note if using fallback
            if (isFallback) {
                yearElement.setAttribute('title', 'Using approximate year, time source unavailable');
            }
        }
    }
});

// Theme switcher code (modified to dispatch an event when theme changes)
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
        
        // Dispatch event for theme change
        document.dispatchEvent(new Event('themeChanged'));
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
            
            // Dispatch event for theme change
            document.dispatchEvent(new Event('themeChanged'));
        }
    });
});