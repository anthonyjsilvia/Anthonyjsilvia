/**
 * Footer Component
 * 
 * Fetches the current year from WorldTimeAPI and injects
 * the footer with dynamic copyright information and NodeDa branding
 */

document.addEventListener('DOMContentLoaded', () => {
    // Create footer content
    const footer = document.querySelector('footer');
    
    if (footer) {
        // Initially set footer with loading indicator
        footer.innerHTML = `
            <div class="footer-container">
                <div class="footer-content">
                    <p>&copy; <span id="current-year">Loading...</span> Anthony Silvia. All Rights Reserved</p>
                    
                    <div class="powered-by">
                        Powered by
                        <a href="https://nodeda.com" target="_blank">
                            <img src="https://nodeda.com/logos/NodeDa.white.svg" alt="NodeDa" class="nodeda-logo dark-mode-logo">
                            <img src="https://nodeda.com/logos/NodeDa.black.svg" alt="NodeDa" class="nodeda-logo light-mode-logo">
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
        
        // Check color scheme on load
        checkColorScheme();
        
        // Listen for color scheme changes
        if (window.matchMedia) {
            const colorSchemeMedia = window.matchMedia('(prefers-color-scheme: light)');
            colorSchemeMedia.addEventListener('change', checkColorScheme);
        }
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
    
    // Check system color scheme and update logo visibility
    function checkColorScheme() {
        const isLightMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
        
        // Get logo elements
        const darkLogo = document.querySelector('.dark-mode-logo');
        const lightLogo = document.querySelector('.light-mode-logo');
        
        if (darkLogo && lightLogo) {
            // Show/hide logos based on color scheme
            darkLogo.style.display = isLightMode ? 'none' : 'inline-block';
            lightLogo.style.display = isLightMode ? 'inline-block' : 'none';
        }
    }
});