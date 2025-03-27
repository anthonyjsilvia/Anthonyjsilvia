/**
 * Anthony Silvia Portfolio Website
 * Main JavaScript file for all functionality
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
 * Header Component with Mobile Menu
 * Creates and injects the header navigation component
 */
function initHeader() {
    // Create header content
    const header = document.getElementById('main-header');
    if (!header) {
        console.error('Header element not found!');
        return;
    }
    
    // Get current page filename
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Navigation items with paths to separate pages
    const navItems = [
        { label: 'Home', icon: 'fas fa-home', href: 'index.html' },
        { label: 'About', icon: 'fas fa-user', href: 'about.html' },
        { label: 'Resume', icon: 'fas fa-briefcase', href: 'resume.html' },
        { label: 'Disciplines', icon: 'fas fa-puzzle-piece', href: 'services.html' },
        //{ label: 'Skills', icon: 'fas fa-shapes', href: 'skills.html' },
        //{ label: 'Portfolio', icon: 'fas fa-grip-vertical', href: 'portfolio.html' },
        //{ label: 'Testimonials', icon: 'far fa-comment', href: 'testimonials.html' },
        //{ label: 'Contact', icon: 'fas fa-envelope', href: 'contact.html' }
    ];
    
    // Create header HTML
    const headerHTML = `
        <div class="header-container">
            <div class="logo">
                <a href="index.html">
                    <h1>Anthony Silvia</h1>
                    <span>UX Designer & Developer</span>
                </a>
            </div>
            <nav class="header-nav" id="main-nav">
                <ul>
                    ${navItems.map(item => `
                        <li>
                            <a href="${item.href}" class="nav-link ${currentPage === item.href ? 'active' : ''}" aria-label="${item.label}">
                                <i class="${item.icon}"></i> ${item.label}
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
    
    // Mobile menu functionality
    const mobileMenuBtn = document.getElementById('menu-toggle');
    const mobileNav = document.getElementById('main-nav');
    
    if (mobileMenuBtn && mobileNav) {
        // Log for debugging
        console.log('Mobile menu elements found and initialized');
        
        // Mobile menu toggle
        mobileMenuBtn.addEventListener('click', function(e) {
            // Prevent default
            e.preventDefault();
            
            // Toggle active classes
            this.classList.toggle('active');
            mobileNav.classList.toggle('active');
            
            // Log for debugging
            console.log('Mobile menu toggled, active state:', mobileNav.classList.contains('active'));
            
            // Control body scroll
            document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
        });
        
        // Close menu when links are clicked
        const navLinks = mobileNav.querySelectorAll('a');
        navLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                mobileMenuBtn.classList.remove('active');
                mobileNav.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!mobileMenuBtn.contains(event.target) && !mobileNav.contains(event.target) && mobileNav.classList.contains('active')) {
                mobileMenuBtn.classList.remove('active');
                mobileNav.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
                mobileMenuBtn.classList.remove('active');
                mobileNav.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    } else {
        console.error('Mobile menu elements not found');
    }
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
 * Various improvements for mobile devices
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