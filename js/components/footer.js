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
                <div class="footer-content" style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                    <!-- Left: Copyright -->
                    <div class="footer-copyright">
                        <p style="margin: 0;">&copy; <span id="current-year">${placeholderyear}</span> Anthony Silvia. All Rights Reserved</p>
                    </div>
                    
                    <!-- Center: Social Links -->
                    <div class="footer-social" style="display: flex; gap: 15px; justify-content: center;">
                        <a href="https://linkedin.com/in/anthonyjsilvia" aria-label="LinkedIn"><i class="fab fa-linkedin"></i></a>
                        <a href="https://github.com/anthonyjsilvia" aria-label="GitHub"><i class="fab fa-github"></i></a>
                    </div>
                    
                    <!-- Right: Powered by -->
                    <div class="powered-by" style="display: flex; align-items: center; gap: 6px;">
                        <span>Hosted on</span>
                        <a href="https://nodeda.com" target="_blank" style="display: flex; align-items: center;">
                            <img src="https://nodeda.com/logos/NodeDa.cloud.white.svg" alt="NodeDa" class="nodeda-logo" id="nodeda-logo" style="height: 1.5em;">
                        </a>
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
            ? 'https://nodeda.com/logos/NodeDa.cloud.white.svg' 
            : 'https://nodeda.com/logos/NodeDa.cloud.black.svg';
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