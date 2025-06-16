/**
 * Anthony Silvia Portfolio Website
 * Main JavaScript file for all functionality
 * Updated with improved mobile & desktop menu handling
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Website scripts loaded');
    
    // Initialize the header component
    initHeader();
    
    // Initialize mobile optimizations
    initMobileOptimizations();
    
    // Initialize current year in footer
    updateCurrentYear();
    
    // Initialize loader (optional)
    hideLoader();

    // Add scroll handling for header shadow
    const header = document.getElementById('main-header');
    
    window.addEventListener('scroll', function() {
        // Add shadow when page has been scrolled
        if (window.pageYOffset > 0) {
            header.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = 'none';
        }
    });
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
        { label: 'About Me', icon: 'fas fa-home', href: 'index.html' },
        { label: 'Resume', icon: 'fas fa-briefcase', href: 'resume.html' },
        //{ label: 'Disciplines', icon: 'fas fa-puzzle-piece', href: 'services.html' },
        //{ label: 'Skills', icon: 'fas fa-shapes', href: 'skills.html' },
        { label: 'Portfolio', icon: 'fas fa-grip-vertical', href: 'portfolio.html' },
        { label: 'Contact Me', icon: 'fas fa-envelope', href: 'contact.html' }
    ];
    
    // Create header HTML
    const headerHTML = `
        <div class="header-container">
            <div class="logo">
                <a href="index.html">
                    <div class="logo-content">
                        <div class="profile-image-small">
                            <img src="assets/images/me.jpg" alt="Anthony Silvia">
                        </div>
                        <h1 style="color: var(--primary-color);">Anthony Silvia</h1>
                    </div>
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
            <div class="mobile-close-btn" id="menu-close" style="display: none;">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;
    
    // Inject header HTML
    header.innerHTML = headerHTML;
    console.log('Header HTML injected, menu button:', document.getElementById('menu-toggle'));
    
    // Mobile menu functionality with enhanced error logging
    // Ensure listeners are attached after DOM is updated
    setTimeout(setupMobileMenu, 0);
    
    // Close menu when links are clicked on mobile
    const navLinks = document.querySelectorAll('.header-nav a');
    navLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            try {
                console.log('Navigation link clicked');
                // Only trigger mobile menu close if we're in mobile view
                if (window.innerWidth <= 768) {
                    const mobileMenuBtn = document.getElementById('menu-toggle');
                    const mobileCloseBtn = document.getElementById('menu-close');
                    const mobileNav = document.getElementById('main-nav');
                    
                    if (!mobileNav || !mobileMenuBtn || !mobileCloseBtn) {
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
                        // Hide close button, show menu button
                        mobileCloseBtn.style.display = 'none';
                        mobileCloseBtn.style.visibility = 'hidden';
                        mobileCloseBtn.style.opacity = '0';
                        mobileMenuBtn.style.display = 'flex';
                        mobileMenuBtn.style.visibility = 'visible';
                        mobileMenuBtn.style.opacity = '1';
                        
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
                        }, 300);
                        
                        console.log('Menu closed via link click');
                    }, 100);
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
                const mobileCloseBtn = document.getElementById('menu-close');
                const mobileNav = document.getElementById('main-nav');
                
                if (!mobileNav || !mobileMenuBtn || !mobileCloseBtn) {
                    console.error('ERROR: Menu elements not found in document click handler');
                    return;
                }
                
                if (!mobileMenuBtn.contains(event.target) && !mobileCloseBtn.contains(event.target) && !mobileNav.contains(event.target) && mobileNav.classList.contains('active')) {
                    console.log('Click outside detected, closing menu');
                    
                    // Add staggered exit animation
                    document.querySelectorAll('.header-nav li').forEach((item, index) => {
                        item.style.transitionDelay = (0.05 * index) + 's';
                        item.style.opacity = '0';
                        item.style.transform = 'translateX(-20px)';
                    });
                    
                    // Delay the closing of the menu to allow for animation
                    setTimeout(() => {
                        // Hide close button, show menu button
                        mobileCloseBtn.style.display = 'none';
                        mobileCloseBtn.style.visibility = 'hidden';
                        mobileCloseBtn.style.opacity = '0';
                        mobileMenuBtn.style.display = 'flex';
                        mobileMenuBtn.style.visibility = 'visible';
                        mobileMenuBtn.style.opacity = '1';
                        
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
                        }, 300);
                    }, 100);
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
    const mobileCloseBtn = document.getElementById('menu-close');
    const mobileNav = document.getElementById('main-nav');
    const header = document.getElementById('main-header');
    
    // Check if elements exist and log results
    if (!mobileMenuBtn || !mobileCloseBtn) {
        console.error('ERROR: Mobile menu buttons not found in the DOM!');
        return;
    }
    
    if (!mobileNav) {
        console.error('ERROR: Navigation (#main-nav) not found in the DOM!');
        return;
    }
    
    // Function to set menu state based on viewport width
    function setMenuStateByViewport() {
        const isMobileView = window.innerWidth <= 768;
        if (isMobileView) {
            // Mobile view - hide menu initially
            mobileNav.classList.remove('active');
            header.classList.remove('menu-open');
            mobileMenuBtn.style.display = 'flex';
            mobileCloseBtn.style.display = 'none';
        } else {
            // Desktop view - show menu by default
            mobileNav.classList.add('active');
            header.classList.remove('menu-open');
            mobileMenuBtn.style.display = 'none';
            mobileCloseBtn.style.display = 'none';
        }
    }
    
    // Set initial menu state
    setMenuStateByViewport();
    
    // Listen for window resize to update menu state
    window.addEventListener('resize', setMenuStateByViewport);
    
    // Open menu handler
    mobileMenuBtn.addEventListener('click', function(e) {
        e.preventDefault();
        mobileMenuBtn.classList.add('active');
        mobileNav.classList.add('active');
        header.classList.add('menu-open');
        console.log('Mobile menu opened, .active class added to .header-nav');
    });
    
    // Close menu handler
    mobileCloseBtn.addEventListener('click', function(e) {
        e.preventDefault();
        mobileMenuBtn.classList.remove('active');
        mobileNav.classList.remove('active');
        header.classList.remove('menu-open');
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

// Add header.css and fonts.css stylesheets
const headerStylesheet = document.createElement('link');
headerStylesheet.rel = 'stylesheet';
headerStylesheet.href = 'css/header.css';
document.head.appendChild(headerStylesheet);

const fontsStylesheet = document.createElement('link');
fontsStylesheet.rel = 'stylesheet';
fontsStylesheet.href = 'css/fonts.css';
document.head.appendChild(fontsStylesheet);