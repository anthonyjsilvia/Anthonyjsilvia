// Function to fetch portfolio data
async function fetchPortfolioData() {
    try {
        const response = await fetch('/data/portfolio.json');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error loading portfolio data:', error);
        return null;
    }
}

// Function to extract unique categories from projects
function extractCategories(projects) {
    const categories = new Set(['All']); // Always include 'All' category
    
    projects.forEach(project => {
        if (project.categories) {
            project.categories.forEach(category => categories.add(category));
        }
    });
    
    return Array.from(categories).sort((a, b) => {
        // Keep 'All' at the beginning
        if (a === 'All') return -1;
        if (b === 'All') return 1;
        return a.localeCompare(b);
    });
}

// Function to create project card
function createProjectCard(project) {
    const githubButton = project.github && project.github !== "disabled" 
        ? `<a href="${project.github}" class="btn btn-secondary" target="_blank">
             <i class="fab fa-github"></i> GitHub
           </a>`
        : '';

    return `
        <div class="project-card" data-categories="${project.categories.join(' ')}">
            <div class="project-image">
                <img src="${project.image}" alt="${project.title}">
            </div>
            <div class="project-content">
                <h3>${project.title}</h3>
                <p class="project-subtitle">${project.subtitle}</p>
                <p class="project-description">${project.description}</p>
                <div class="project-links">
                    <a href="${project.link}" class="btn btn-primary" target="_blank">View Project</a>
                    ${githubButton}
                </div>
            </div>
        </div>
    `;
}

// Function to create category filter
function createCategoryFilter(categories) {
    return `
        <div class="portfolio-filters">
            ${categories.map(category => `
                <button class="filter-btn" data-category="${category}">${category}</button>
            `).join('')}
        </div>
    `;
}

// Function to initialize portfolio
async function initializePortfolio() {
    const portfolioData = await fetchPortfolioData();
    if (!portfolioData) return;

    const portfolioContainer = document.querySelector('.portfolio-container');
    const filtersContainer = document.querySelector('.portfolio-filters-container');

    // Extract categories from projects
    const categories = extractCategories(portfolioData.projects);

    // Add category filters
    filtersContainer.innerHTML = createCategoryFilter(categories);

    // Add project cards
    portfolioContainer.innerHTML = portfolioData.projects
        .filter(project => project.featured)
        .map(project => createProjectCard(project))
        .join('');

    // Add filter functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.dataset.category;
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const projects = document.querySelectorAll('.project-card');
            projects.forEach(project => {
                if (category === 'All') {
                    project.style.display = 'block';
                } else {
                    const projectCategories = project.dataset.categories.split(' ');
                    project.style.display = projectCategories.includes(category) ? 'block' : 'none';
                }
            });
        });
    });

    // Set 'All' as active by default
    const allButton = document.querySelector('.filter-btn[data-category="All"]');
    if (allButton) {
        allButton.classList.add('active');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializePortfolio); 