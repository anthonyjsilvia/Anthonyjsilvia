document.addEventListener('DOMContentLoaded', () => {
    // Set initial theme based on saved preference or OS preference
    const savedTheme = localStorage.getItem('theme');
    const savedTransparency = localStorage.getItem('transparency') === 'false' ? false : true;
    const savedReducedMotion = localStorage.getItem('reducedMotion') === 'true' ? true : false;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark-theme');
    } else if (savedTheme === 'light') {
        document.documentElement.classList.add('light-theme');
    } else if (prefersDark) {
        document.documentElement.setAttribute('data-prefers-dark', 'true');
    }

    // Set initial transparency state
    if (!savedTransparency) {
        document.documentElement.classList.add('no-transparency');
    }

    // Set initial reduced motion state
    if (savedReducedMotion) {
        document.documentElement.classList.add('reduced-motion');
    }

    // Create theme modal
    const themeModal = document.createElement('div');
    themeModal.className = 'theme-modal';
    themeModal.setAttribute('role', 'dialog');
    themeModal.setAttribute('aria-labelledby', 'theme-modal-title');
    themeModal.setAttribute('aria-modal', 'true');
    themeModal.innerHTML = `
        <div class="theme-modal-content">
            <div class="theme-modal-header">
                <h3 id="theme-modal-title">Theme Preferences</h3>
                <button class="theme-modal-close" aria-label="Close theme preferences">&times;</button>
            </div>
            <div class="theme-options">
                <label for="theme-select" class="visually-hidden">Select theme preference</label>
                <select id="theme-select" class="theme-select" aria-label="Select theme preference">
                    <option value="system">Match System</option>
                    <option value="light">Light Mode</option>
                    <option value="dark">Dark Mode</option>
                </select>
            </div>
            <div class="accessibility-toggles">
                <div class="transparency-toggle">
                    <label class="toggle-label">
                        <input type="checkbox" id="transparency-toggle" ${savedTransparency ? 'checked' : ''}>
                        <span class="toggle-text">Enable Transparency</span>
                    </label>
                </div>
                <div class="motion-toggle">
                    <label class="toggle-label">
                        <input type="checkbox" id="motion-toggle" ${savedReducedMotion ? 'checked' : ''}>
                        <span class="toggle-text">Reduce Animations</span>
                    </label>
                </div>
            </div>
            <div class="theme-description" aria-live="polite"></div>
        </div>
    `;
    document.body.appendChild(themeModal);

    // Create accessibility button if it doesn't exist
    if (!document.querySelector('.theme-switcher')) {
        const themeSwitcher = document.createElement('div');
        themeSwitcher.className = 'theme-switcher';
        
        const themeBtn = document.createElement('button');
        themeBtn.className = 'theme-btn';
        themeBtn.setAttribute('aria-label', 'Accessibility Settings');
        themeBtn.setAttribute('aria-expanded', 'false');
        themeBtn.setAttribute('aria-controls', 'theme-modal');
        themeBtn.innerHTML = '<i class="fas fa-universal-access" aria-hidden="true"></i>';
        
        themeSwitcher.appendChild(themeBtn);
        document.body.appendChild(themeSwitcher);
    }

    // Create back to top button if it doesn't exist
    if (!document.querySelector('.back-to-top')) {
        const backToTop = document.createElement('div');
        backToTop.className = 'back-to-top';
        backToTop.innerHTML = `
            <button class="back-to-top-btn" aria-label="Back to top">
                <i class="fas fa-arrow-up" aria-hidden="true"></i>
            </button>
        `;
        document.body.appendChild(backToTop);

        // Handle back to top button visibility
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            const backToTopElement = document.querySelector('.back-to-top');
            
            if (window.scrollY > 300) {
                backToTopElement.classList.add('visible');
            } else {
                backToTopElement.classList.remove('visible');
            }
            
            // Hide button after scrolling stops
            scrollTimeout = setTimeout(() => {
                if (window.scrollY <= 300) {
                    backToTopElement.classList.remove('visible');
                }
            }, 1000);
        });

        // Handle back to top button click
        const backToTopBtn = backToTop.querySelector('.back-to-top-btn');
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: document.documentElement.classList.contains('reduced-motion') ? 'auto' : 'smooth'
            });
            // Focus the first focusable element after scrolling
            setTimeout(() => {
                const firstFocusable = document.querySelector('header a, header button');
                if (firstFocusable) {
                    firstFocusable.focus();
                }
            }, 1000);
        });
    }

    // Get elements
    const themeBtn = document.querySelector('.theme-btn');
    const modalClose = document.querySelector('.theme-modal-close');
    const themeSelect = document.querySelector('.theme-select');
    const themeDescription = document.querySelector('.theme-description');
    const transparencyToggle = document.querySelector('#transparency-toggle');
    const motionToggle = document.querySelector('#motion-toggle');

    // Set initial select value based on current theme
    if (savedTheme) {
        themeSelect.value = savedTheme;
    } else {
        themeSelect.value = 'system';
    }

    // Function to update theme description
    function updateThemeDescription(theme) {
        const descriptions = {
            system: 'Theme will match your system preferences',
            light: 'Light theme is now active',
            dark: 'Dark theme is now active'
        };
        themeDescription.textContent = descriptions[theme];
    }

    // Handle transparency toggle
    transparencyToggle.addEventListener('change', (e) => {
        const isTransparent = e.target.checked;
        if (isTransparent) {
            document.documentElement.classList.remove('no-transparency');
        } else {
            document.documentElement.classList.add('no-transparency');
        }
        localStorage.setItem('transparency', isTransparent);
        
        // Update description
        themeDescription.textContent = isTransparent ? 
            'Transparency effects are now enabled' : 
            'Transparency effects are now disabled';
    });

    // Handle motion toggle
    motionToggle.addEventListener('change', (e) => {
        const reducedMotion = e.target.checked;
        if (reducedMotion) {
            document.documentElement.classList.add('reduced-motion');
        } else {
            document.documentElement.classList.remove('reduced-motion');
        }
        localStorage.setItem('reducedMotion', reducedMotion);
        
        // Update description
        themeDescription.textContent = reducedMotion ? 
            'Animations are now reduced' : 
            'Animations are now enabled';
    });

    // Show modal when accessibility button is clicked
    themeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        themeModal.classList.add('active');
        themeBtn.setAttribute('aria-expanded', 'true');
        modalClose.focus();
    });

    // Close modal when close button is clicked
    modalClose.addEventListener('click', () => {
        themeModal.classList.remove('active');
        themeBtn.setAttribute('aria-expanded', 'false');
        themeBtn.focus();
    });

    // Close modal when clicking outside
    themeModal.addEventListener('click', (e) => {
        if (e.target === themeModal) {
            themeModal.classList.remove('active');
            themeBtn.setAttribute('aria-expanded', 'false');
            themeBtn.focus();
        }
    });

    // Handle keyboard navigation in modal
    themeModal.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            themeModal.classList.remove('active');
            themeBtn.setAttribute('aria-expanded', 'false');
            themeBtn.focus();
        }
    });

    // Handle theme selection
    themeSelect.addEventListener('change', () => {
        const selectedTheme = themeSelect.value;
        
        // Remove existing theme classes
        document.documentElement.classList.remove('dark-theme', 'light-theme');
        document.documentElement.removeAttribute('data-prefers-dark');

        if (selectedTheme === 'dark') {
            document.documentElement.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark');
        } else if (selectedTheme === 'light') {
            document.documentElement.classList.add('light-theme');
            localStorage.setItem('theme', 'light');
        } else {
            // System preference
            localStorage.removeItem('theme');
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                document.documentElement.setAttribute('data-prefers-dark', 'true');
            }
        }
        
        // Update theme description
        updateThemeDescription(selectedTheme);
        
        // Dispatch event for theme change
        document.dispatchEvent(new Event('themeChanged'));
        
        // Close the modal after selection
        themeModal.classList.remove('active');
        themeBtn.setAttribute('aria-expanded', 'false');
        themeBtn.focus();
    });

    // Listen for OS theme preference changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('theme')) {
            if (e.matches) {
                document.documentElement.setAttribute('data-prefers-dark', 'true');
            } else {
                document.documentElement.removeAttribute('data-prefers-dark');
            }
            document.dispatchEvent(new Event('themeChanged'));
            updateThemeDescription('system');
        }
    });

    // Add visually hidden class for screen readers
    const style = document.createElement('style');
    style.textContent = `
        .visually-hidden {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border: 0;
        }
    `;
    document.head.appendChild(style);
});