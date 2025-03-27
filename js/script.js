/**
 * Anthony Silvia Portfolio Website
 * Main JavaScript file
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const loader = document.querySelector('.loader');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileNav = document.querySelector('.header-nav');
    
    // Hide loader after page loads
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 500);
    });
    
    // Mobile menu functionality
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            mobileNav.classList.toggle('active');
        });
    }
    
    // Get current page filename
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Active navigation link based on current page
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage || 
            (currentPage === '' && linkHref === 'index.html') || 
            (currentPage === '/' && linkHref === 'index.html')) {
            link.classList.add('active');
        }
    });
    
    // Testimonial slider (if present on page)
    const setupTestimonialSlider = () => {
        const testimonialCards = document.querySelectorAll('.testimonial-card');
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        const indicators = document.querySelectorAll('.indicator');
        
        if (!testimonialCards.length) return;
        
        let currentTestimonial = 0;
        
        function showTestimonial(index) {
            testimonialCards.forEach(card => card.classList.remove('active'));
            indicators.forEach(ind => ind.classList.remove('active'));
            
            testimonialCards[index].classList.add('active');
            if (indicators[index]) {
                indicators[index].classList.add('active');
            }
            currentTestimonial = index;
        }
        
        // Next testimonial button
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
                showTestimonial(currentTestimonial);
            });
        }
        
        // Previous testimonial button
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                currentTestimonial = (currentTestimonial - 1 + testimonialCards.length) % testimonialCards.length;
                showTestimonial(currentTestimonial);
            });
        }
        
        // Testimonial indicators
        indicators.forEach(indicator => {
            indicator.addEventListener('click', () => {
                const index = parseInt(indicator.dataset.index);
                showTestimonial(index);
            });
        });
        
        // Auto-switch testimonials every 5 seconds
        let testimonialInterval = setInterval(() => {
            currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
            showTestimonial(currentTestimonial);
        }, 5000);
        
        // Pause auto-switching on hover
        testimonialCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                clearInterval(testimonialInterval);
            });
            
            card.addEventListener('mouseleave', () => {
                testimonialInterval = setInterval(() => {
                    currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
                    showTestimonial(currentTestimonial);
                }, 5000);
            });
        });
    };
    
    // Initialize testimonial slider
    setupTestimonialSlider();
    
    // Contact form handling (if present on page)
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Form validation
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            if (!name || !email || !message) {
                alert('Please fill in all fields');
                return;
            }
            
            // Simulating form submission
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalBtnText = submitBtn.textContent;
            
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                // Reset form
                contactForm.reset();
                
                // Show success message
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.textContent = 'Your message has been sent successfully! I\'ll get back to you soon.';
                
                contactForm.appendChild(successMessage);
                
                // Reset button
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
                
                // Remove success message after 5 seconds
                setTimeout(() => {
                    successMessage.remove();
                }, 5000);
            }, 1500);
        });
    }
    
    // Skills progress animation (if present on page)
    const animateSkillBars = () => {
        const skillBars = document.querySelectorAll('.skill-level-progress');
        
        if (!skillBars.length) return;
        
        skillBars.forEach(bar => {
            const percentage = bar.getAttribute('data-percentage');
            bar.style.width = '0';
            
            setTimeout(() => {
                bar.style.width = percentage + '%';
            }, 300);
        });
    };
    
    // Initialize skill bars animation
    animateSkillBars();
});