/**
 * Anthony Silvia Portfolio Website
 * Main JavaScript file for all functionality
 * Updated with improved mobile & desktop menu handling
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Website scripts loaded');
    
    // Initialize the header component
    initHeader();
    
    // Initialize the theme switcher
    initThemeSwitcher();
    
    // Initialize mobile optimizations
    initMobileOptimizations();
    
    // Initialize current year in footer
    updateCurrentYear();
    
    // Initialize loader (optional)
    hideLoader();
});

/**
 * Header Component with Apple-Style Mobile Menu
 * Creates and injects the header navigation component
 */
function initHeader() {
    console.log('Initializing header component...');
    
    // Create header content
    const header = document.getElementById('main-header');
    if (!header) {
        console.error('ERROR: Header element (#main-header) not found!');
        return;
    }
    
    // Get current page filename
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    console.log('Current page detected as:', currentPage);
    
    // Navigation items with paths to separate pages
    const navItems = [
        { label: 'Home', icon: 'fas fa-home', href: 'index.html' },
        { label: 'About', icon: 'fas fa-user', href: 'about.html' },
        { label: 'Resume', icon: 'fas fa-briefcase', href: 'resume.html' },
        //{ label: 'Disciplines', icon: 'fas fa-puzzle-piece', href: 'services.html' },
        //{ label: 'Skills', icon: 'fas fa-shapes', href: 'skills.html' },
        { label: 'Portfolio', icon: 'fas fa-grip-vertical', href: 'portfolio.html' },
        { label: 'Testimonials', icon: 'far fa-comment', href: 'testimonials.html' },
        //{ label: 'Contact', icon: 'fas fa-envelope', href: 'contact.html' }
    ];
    
    // Create header HTML
    const headerHTML = `
        <div class="header-container">
            <div class="logo">
                <a href="index.html">
                    <h1 style="color: var(--primary-color);">Anthony Silvia</h1>
                    <!--span>UX Designer & Developer</span-->
                </a>
            </div>
            <nav class="header-nav" id="main-nav">
                <ul>
                    ${navItems.map(item => `
                        <li>
                            <a href="${item.href}" class="nav-link ${currentPage === item.href ? 'active' : ''}" aria-label="${item.label}">
                                <span><i class="${item.icon}"></i> ${item.label}</span>
                            </a>
                        </li>
                    `).join('')}
                </ul>
            </nav>
            <div class="mobile-menu-btn" id="menu-toggle">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;
    
    // Inject header HTML
    header.innerHTML = headerHTML;
    console.log('Header HTML injected');
    
    // Mobile menu functionality with enhanced error logging
    setupMobileMenu();
    
    // Close menu when links are clicked on mobile
    const navLinks = document.querySelectorAll('.header-nav a');
    navLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            try {
                console.log('Navigation link clicked');
                // Only trigger mobile menu close if we're in mobile view
                if (window.innerWidth <= 768) {
                    const mobileMenuBtn = document.getElementById('menu-toggle');
                    const mobileNav = document.getElementById('main-nav');
                    
                    if (!mobileNav || !mobileMenuBtn) {
                        console.error('ERROR: Menu elements not found when link clicked');
                        return;
                    }
                    
                    // Add staggered exit animation
                    document.querySelectorAll('.header-nav li').forEach((item, index) => {
                        item.style.transitionDelay = (0.05 * index) + 's';
                        item.style.opacity = '0';
                        item.style.transform = 'translateX(-20px)';
                    });
                    
                    // Delay the closing of the menu to allow for animation
                    setTimeout(() => {
                        mobileMenuBtn.classList.remove('active');
                        mobileNav.classList.remove('active');
                        document.body.classList.remove('menu-open');
                        
                        // Force styles for closure
                        mobileNav.style.height = '0';
                        mobileNav.style.opacity = '0';
                        
                        // Wait for transition to complete before hiding completely
                        setTimeout(() => {
                            mobileNav.style.visibility = 'hidden';
                            mobileNav.style.display = 'none';
                            mobileNav.style.pointerEvents = 'none';
                            
                            // Reset item styles
                            document.querySelectorAll('.header-nav li').forEach(item => {
                                item.removeAttribute('style');
                            });
                        }, 500);
                        
                        console.log('Menu closed via link click');
                    }, 300);
                }
            } catch (error) {
                console.error('ERROR in nav link click handler:', error);
            }
        });
    });
    
    // Close menu when clicking outside (mobile only)
    document.addEventListener('click', function(event) {
        try {
            // Only trigger on mobile
            if (window.innerWidth <= 768) {
                const mobileMenuBtn = document.getElementById('menu-toggle');
                const mobileNav = document.getElementById('main-nav');
                
                if (!mobileNav || !mobileMenuBtn) {
                    console.error('ERROR: Menu elements not found in document click handler');
                    return;
                }
                
                if (!mobileMenuBtn.contains(event.target) && !mobileNav.contains(event.target) && mobileNav.classList.contains('active')) {
                    console.log('Click outside detected, closing menu');
                    
                    // Add staggered exit animation
                    document.querySelectorAll('.header-nav li').forEach((item, index) => {
                        item.style.transitionDelay = (0.05 * index) + 's';
                        item.style.opacity = '0';
                        item.style.transform = 'translateX(-20px)';
                    });
                    
                    // Delay the closing of the menu to allow for animation
                    setTimeout(() => {
                        mobileMenuBtn.classList.remove('active');
                        mobileNav.classList.remove('active');
                        document.body.classList.remove('menu-open');
                        
                        // Force styles for closure
                        mobileNav.style.height = '0';
                        mobileNav.style.opacity = '0';
                        
                        // Wait for transition to complete before hiding completely
                        setTimeout(() => {
                            mobileNav.style.visibility = 'hidden';
                            mobileNav.style.display = 'none';
                            mobileNav.style.pointerEvents = 'none';
                            
                            // Reset item styles
                            document.querySelectorAll('.header-nav li').forEach(item => {
                                item.removeAttribute('style');
                            });
                        }, 500);
                    }, 300);
                }
            }
        } catch (error) {
            console.error('ERROR in document click handler:', error);
        }
    });
    
    // Close menu on escape key (mobile only)
    document.addEventListener('keydown', function(e) {
        try {
            if (e.key === 'Escape' && window.innerWidth <= 768) {
                console.log('Escape key pressed');
                
                const mobileMenuBtn = document.getElementById('menu-toggle');
                const mobileNav = document.getElementById('main-nav');
                
                if (!mobileNav || !mobileMenuBtn) {
                    console.error('ERROR: Menu elements not found in keydown handler');
                    return;
                }
                
                if (mobileNav.classList.contains('active')) {
                    console.log('Menu is active, closing on ESC');
                    
                    // Add staggered exit animation
                    document.querySelectorAll('.header-nav li').forEach((item, index) => {
                        item.style.transitionDelay = (0.05 * index) + 's';
                        item.style.opacity = '0';
                        item.style.transform = 'translateX(-20px)';
                    });
                    
                    // Delay the closing of the menu to allow for animation
                    setTimeout(() => {
                        mobileMenuBtn.classList.remove('active');
                        mobileNav.classList.remove('active');
                        document.body.classList.remove('menu-open');
                        
                        // Force styles for closure
                        mobileNav.style.height = '0';
                        mobileNav.style.opacity = '0';
                        
                        // Wait for transition to complete before hiding completely
                        setTimeout(() => {
                            mobileNav.style.visibility = 'hidden';
                            mobileNav.style.display = 'none';
                            mobileNav.style.pointerEvents = 'none';
                            
                            // Reset item styles
                            document.querySelectorAll('.header-nav li').forEach(item => {
                                item.removeAttribute('style');
                            });
                        }, 500);
                    }, 300);
                }
            }
        } catch (error) {
            console.error('ERROR in keydown handler:', error);
        }
    });
}

/**
 * Enhanced Mobile/Desktop Menu functionality with detailed error logging
 * This function handles the menu setup for both desktop and mobile views
 */
function setupMobileMenu() {
    console.log('Setting up responsive menu with enhanced debugging...');
    
    // Menu elements
    const mobileMenuBtn = document.getElementById('menu-toggle');
    const mobileNav = document.getElementById('main-nav');
    
    // Check if elements exist and log results
    if (!mobileMenuBtn) {
        console.error('ERROR: Mobile menu button (#menu-toggle) not found in the DOM!');
        return;
    }
    
    if (!mobileNav) {
        console.error('ERROR: Navigation (#main-nav) not found in the DOM!');
        return;
    }
    
    console.log('Menu elements found:', {
        menuButton: mobileMenuBtn,
        navigation: mobileNav
    });
    
    // Function to set menu state based on viewport width
    function setMenuStateByViewport() {
        // Check if we're in mobile view or desktop view
        const isMobileView = window.innerWidth <= 768;
        console.log('Setting menu state based on viewport width. Mobile view:', isMobileView);
        
        if (isMobileView) {
            // Mobile view - hide menu initially
            mobileNav.style.display = 'none';
            mobileNav.style.visibility = 'hidden';
            mobileNav.style.opacity = '0';
            mobileNav.style.height = '0';
            mobileNav.style.pointerEvents = 'none';
            mobileNav.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
            document.body.classList.remove('menu-open');
            
            // Make sure mobile menu button is visible
            mobileMenuBtn.style.display = 'block';
        } else {
            // Desktop view - show menu by default
            mobileNav.style.display = 'block';
            mobileNav.style.visibility = 'visible';
            mobileNav.style.opacity = '1';
            mobileNav.style.height = 'auto';
            mobileNav.style.pointerEvents = 'auto';
            
            // Hide mobile menu button
            mobileMenuBtn.style.display = 'none';
            
            // Reset any animation styles
            document.querySelectorAll('.header-nav li').forEach(item => {
                item.removeAttribute('style');
            });
        }
    }
    
    // Set initial menu state
    setMenuStateByViewport();
    
    // Listen for window resize to update menu state
    window.addEventListener('resize', setMenuStateByViewport);
    
    // Verify CSS classes are properly defined
    try {
        const cssTest = window.getComputedStyle(mobileMenuBtn);
        console.log('Mobile button CSS display:', cssTest.display);
        if (cssTest.display === 'none' && window.innerWidth <= 768) {
            console.warn('WARNING: Mobile menu button has display:none on mobile - it may be hidden by CSS');
        }
    } catch (e) {
        console.error('ERROR checking CSS styles:', e);
    }
    
    // Verify mobile nav initial state
    try {
        const navStyles = window.getComputedStyle(mobileNav);
        console.log('Nav initial state:', {
            height: navStyles.height,
            opacity: navStyles.opacity,
            visibility: navStyles.visibility,
            display: navStyles.display,
            position: navStyles.position,
            zIndex: navStyles.zIndex
        });
    } catch (e) {
        console.error('ERROR checking nav styles:', e);
    }
    
    // Enhanced click handler with error tracking
    mobileMenuBtn.addEventListener('click', function(e) {
        try {
            console.log('Mobile menu button clicked');
            
            // Prevent default
            e.preventDefault();
            
            // Check if menu is currently active
            const isActive = mobileNav.classList.contains('active');
            console.log('Is menu currently active?', isActive);
            
            if (isActive) {
                // CLOSE MENU
                console.log('Closing menu...');
                
                // Transform X back to hamburger
                mobileMenuBtn.classList.remove('active');
                
                // Add exit animation to menu items first
                document.querySelectorAll('.header-nav li').forEach((item, index) => {
                    item.style.transitionDelay = (0.05 * index) + 's';
                    item.style.opacity = '0';
                    item.style.transform = 'translateX(-20px)';
                });
                
                // Wait briefly for item animation to start
                setTimeout(() => {
                    // Remove active class from navigation
                    mobileNav.classList.remove('active');
                    document.body.classList.remove('menu-open');
                    
                    // Force styles for closure
                    mobileNav.style.height = '0';
                    mobileNav.style.opacity = '0';
                    
                    // Wait for transition to complete before hiding completely
                    setTimeout(() => {
                        mobileNav.style.visibility = 'hidden';
                        mobileNav.style.display = 'none';
                        mobileNav.style.pointerEvents = 'none';
                        
                        // Reset item styles
                        document.querySelectorAll('.header-nav li').forEach(item => {
                            item.removeAttribute('style');
                        });
                    }, 500);
                }, 100);
                
            } else {
                // OPEN MENU
                console.log('Opening menu...');
                
                // Transform hamburger button into X
                mobileMenuBtn.classList.add('active');
                
                // Reset any leftover styles
                document.querySelectorAll('.header-nav li').forEach(item => {
                    item.removeAttribute('style');
                    item.style.opacity = '0';
                    item.style.transform = 'translateX(-20px)';
                });
                
                // Show menu immediately but invisible
                mobileNav.style.display = 'block';
                mobileNav.style.visibility = 'visible';
                mobileNav.style.pointerEvents = 'auto';
                mobileNav.style.backgroundColor = 'var(--bg-color, #ffffff)';
                
                // Force reflow to ensure transitions work
                void mobileNav.offsetWidth;
                
                // Add active class and start transition
                mobileNav.classList.add('active');
                document.body.classList.add('menu-open');
                
                // Update styles to trigger transition
                mobileNav.style.opacity = '1';
                mobileNav.style.height = 'calc(100vh - 60px)';
                
                // Animate menu items with delay
                setTimeout(() => {
                    document.querySelectorAll('.header-nav li').forEach((item, index) => {
                        item.style.transitionDelay = (0.1 + 0.05 * index) + 's';
                        item.style.opacity = '1';
                        item.style.transform = 'translateX(0)';
                    });
                }, 200);
            }
            
            // Debug info after state change
            setTimeout(() => {
                const navStylesAfterClick = window.getComputedStyle(mobileNav);
                console.log('Nav styles after click:', {
                    height: navStylesAfterClick.height,
                    opacity: navStylesAfterClick.opacity,
                    visibility: navStylesAfterClick.visibility,
                    display: navStylesAfterClick.display,
                    classList: Array.from(mobileNav.classList)
                });
            }, 50);
            
        } catch (error) {
            console.error('ERROR in mobile menu click handler:', error);
        }
    });
    
    // CSS fix for menu responsiveness
    const style = document.createElement('style');
    style.textContent = `
        /* Desktop Menu Styles */
        @media (min-width: 769px) {
            .mobile-menu-btn {
                display: none !important;
            }
            
            .header-nav {
                display: block !important;
                visibility: visible !important;
                opacity: 1 !important;
                height: auto !important;
                pointer-events: auto !important;
                position: static !important;
                background: transparent !important;
                width: auto !important;
                overflow: visible !important;
            }
            
            .header-nav ul {
                display: flex !important;
                flex-direction: row !important;
                gap: 1.5rem !important;
                padding: 0 !important;
                margin: 0 !important;
            }
            
            .header-nav li {
                opacity: 1 !important;
                transform: none !important;
                margin-bottom: 0 !important;
            }
            
            .menu-close-btn {
                display: none !important;
            }
        }
        
        /* Mobile Menu Styles */
        @media (max-width: 768px) {
            /* Hamburger to X animation */
            .mobile-menu-btn {
                display: flex !important;
                flex-direction: column !important;
                justify-content: space-between !important;
                width: 30px !important;
                height: 20px !important;
                position: relative !important;
                cursor: pointer !important;
                z-index: 1002 !important;
            }
            
            .mobile-menu-btn span {
                display: block !important;
                height: 2px !important;
                width: 100% !important;
                background-color: var(--text-color) !important;
                border-radius: 1px !important;
                transition: transform 0.3s ease, opacity 0.3s ease !important;
                transform-origin: center !important;
                position: absolute !important;
            }
            
            .mobile-menu-btn span:nth-child(1) {
                top: 0 !important;
            }
            
            .mobile-menu-btn span:nth-child(2) {
                top: 9px !important;
            }
            
            .mobile-menu-btn span:nth-child(3) {
                top: 18px !important;
            }
            
            /* X state */
            .mobile-menu-btn.active span:nth-child(1) {
                top: 9px !important;
                transform: rotate(45deg) !important;
            }
            
            .mobile-menu-btn.active span:nth-child(2) {
                opacity: 0 !important;
                transform: translateX(-20px) !important;
            }
            
            .mobile-menu-btn.active span:nth-child(3) {
                top: 9px !important;
                transform: rotate(-45deg) !important;
            }
            
            /* Mobile Menu Background and Visibility */
            .header-nav {
                position: fixed !important;
                top: 60px !important;
                left: 0 !important;
                width: 100% !important;
                background-color: var(--bg-color, #ffffff) !important;
                box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
                z-index: 1000 !important;
                overflow-y: auto !important;
                transition: opacity 0.3s ease, height 0.3s ease !important;
            }
            
            body.menu-open {
                overflow: hidden !important;
            }
            
            /* Ensure menu visibility when active */
            .header-nav.active {
                display: block !important;
                visibility: visible !important;
                opacity: 1 !important;
                height: calc(100vh - 60px) !important;
                overflow-y: auto !important;
                pointer-events: auto !important;
                background-color: var(--bg-color, #ffffff) !important;
                border-top: 1px solid rgba(0,0,0,0.1) !important;
            }
            
            /* Menu items visibility */
            .header-nav ul {
                padding: 20px !important;
                margin-top: 20px !important;
                flex-direction: column !important;
            }
            
            .header-nav li {
                opacity: 1 !important;
                transform: translateX(0) !important;
                margin-bottom: 15px !important;
            }
            
            .header-nav a {
                font-size: 1.2rem !important;
                padding: 12px 0 !important;
                display: block !important;
                width: 100% !important;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Log successful setup
    console.log('Menu event handlers initialized successfully');
    console.log('Added responsive CSS fixes for menu visibility');
    
    // We're removing the separate close button since we're using the hamburger-to-X transform
    // No need for an additional close button when the hamburger menu turns into an X
    
    // Verify that everything is set up correctly
    setTimeout(() => {
        try {
            console.log('Performing final verification of menu setup...');
            const finalCheck = {
                menuButton: !!document.getElementById('menu-toggle'),
                navigation: !!document.getElementById('main-nav'),
                cssLoaded: document.styleSheets.length > 0
            };
            console.log('Final check results:', finalCheck);
            
            // Test menu button display in current view
            const isMobileView = window.innerWidth <= 768;
            if (isMobileView) {
                const menuBtn = document.getElementById('menu-toggle');
                const btnStyles = menuBtn ? window.getComputedStyle(menuBtn) : null;
                console.log('Mobile view detected, menu button display:', btnStyles ? btnStyles.display : 'element not found');
                
                if (btnStyles && btnStyles.display === 'none') {
                    console.error('ERROR: Mobile menu button is hidden (display:none) in mobile view!');
                }
            } else {
                console.log('Desktop view detected, menu should be visible');
                const nav = document.getElementById('main-nav');
                const navStyles = nav ? window.getComputedStyle(nav) : null;
                
                if (navStyles && (navStyles.display === 'none' || navStyles.visibility === 'hidden')) {
                    console.error('ERROR: Desktop menu is hidden in desktop view!');
                }
            }
        } catch (error) {
            console.error('ERROR in final verification:', error);
        }
    }, 1000);
}

/**
 * Theme Switcher
 * Handles dark/light mode toggling
 */
function initThemeSwitcher() {
    // Check if theme switcher already exists
    if (document.querySelector('.theme-switcher')) {
        return;
    }
    
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
    
    // Create and add theme switcher button to the DOM
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
}

/**
 * Mobile Optimizations
 * Various improvements for mobile devices including Apple-style header
 */
function initMobileOptimizations() {
    // Fix for iOS viewport height issues
    function setMobileVH() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    // Call on initial load
    setMobileVH();
    
    // Update on resize and orientation change
    window.addEventListener('resize', setMobileVH);
    window.addEventListener('orientationchange', () => {
        setTimeout(setMobileVH, 100);
    });
    
    // Detect touch devices
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
        document.documentElement.classList.add('touch-device');
        
        // Add touch hover simulation
        const touchElements = document.querySelectorAll('.service-card, .skill-card, .testimonial-card, .social-links a');
        touchElements.forEach(element => {
            element.addEventListener('touchstart', function() {
                this.classList.add('touch-hover');
            }, { passive: true });
            
            element.addEventListener('touchend', function() {
                setTimeout(() => {
                    this.classList.remove('touch-hover');
                }, 300);
            }, { passive: true });
        });
    }
    
    // Apple-style header scroll behavior
    const header = document.getElementById('main-header');
    let lastScrollTop = 0;
    
    if (header) {
        // Apply initial classes
        header.classList.add('header-transparent');
        
        // Listen for scroll
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
            
            // Add/remove classes based on scroll position and direction
            if (currentScroll > 20) {
                header.classList.add('header-scrolled');
            } else {
                header.classList.remove('header-scrolled');
            }
            
            // Add subtle header hide/show on scroll direction (like Apple)
            if (currentScroll > lastScrollTop && currentScroll > 60) {
                // Scrolling down & not at the top
                header.classList.add('header-hidden');
            } else {
                // Scrolling up or at the top
                header.classList.remove('header-hidden');
            }
            
            lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
        }, {passive: true});
    }
    
    // Smooth scrolling for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;
            
            e.preventDefault();
            
            // Calculate header height
            const headerHeight = document.getElementById('main-header').offsetHeight;
            
            // Calculate position with offset
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 20;
            
            // Scroll smoothly
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        });
    });
}

/**
 * Update Current Year
 * Adds current year to footer
 */
function updateCurrentYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        const currentYear = new Date().getFullYear();
        yearElement.textContent = currentYear;
        yearElement.classList.remove('loading');
    }
}

/**
 * Hide Loader
 * Removes the loading screen
 */
function hideLoader() {
    const loader = document.querySelector('.loader');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('hidden');
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }, 500);
    }
}