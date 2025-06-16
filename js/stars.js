class StarryText {
    constructor(container) {
        this.container = container;
        this.stars = [];
        this.numStars = 15; // Number of stars to generate
        this.init();
    }

    init() {
        // Create stars
        for (let i = 0; i < this.numStars; i++) {
            this.createStar();
        }

        // Start animation
        this.animate();
    }

    createStar() {
        const star = document.createElement('div');
        star.className = 'star';
        
        // Random size between 3 and 6 pixels
        const size = Math.random() * 3 + 3;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        
        // Random position within the container
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        star.style.left = `${x}%`;
        star.style.top = `${y}%`;
        
        // Random initial opacity
        star.style.opacity = Math.random() * 0.5 + 0.5;
        
        // Random rotation
        star.style.transform = `rotate(${Math.random() * 360}deg)`;
        
        this.container.appendChild(star);
        this.stars.push(star);
    }

    animate() {
        this.stars.forEach(star => {
            // Random twinkle duration between 1 and 3 seconds
            const duration = Math.random() * 2 + 1;
            
            // Create twinkling animation
            const animate = () => {
                star.style.opacity = Math.random() * 0.5 + 0.5;
                setTimeout(animate, duration * 1000);
            };
            
            animate();
        });
    }
}

// Initialize starry text when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const starsContainer = document.querySelector('.stars-container');
    if (starsContainer) {
        new StarryText(starsContainer);
    }
}); 