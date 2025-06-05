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

// Function to extract unique companies from projects
function extractCompanies(projects) {
    const companies = new Set(['All']);
    projects.forEach(project => {
        if (project.company && project.company.name) {
            companies.add(project.company.name);
        }
    });
    return Array.from(companies).sort();
}

// Function to extract unique tags from projects
function extractTags(projects) {
    const tags = new Set();
    projects.forEach(project => {
        if (project.categories) {
            project.categories.forEach(tag => tags.add(tag));
        }
    });
    return Array.from(tags).sort();
}

// Function to populate filter options
function populateFilterOptions(projects) {
    const companyFilter = document.getElementById('company-filter');
    const tagFilter = document.getElementById('tag-filter');
    
    // Populate company filter
    const companies = extractCompanies(projects);
    companies.forEach(company => {
        const option = document.createElement('option');
        option.value = company.toLowerCase();
        option.textContent = company;
        companyFilter.appendChild(option);
    });
    
    // Populate tag filter
    const tags = extractTags(projects);
    tags.forEach(tag => {
        const option = document.createElement('option');
        option.value = tag.toLowerCase();
        option.textContent = tag;
        tagFilter.appendChild(option);
    });
}

// Function to filter projects
function filterProjects(projects, company, selectedTags) {
    return projects.filter(project => {
        const projectCompany = project.title.split(' ')[0].toLowerCase();
        const matchesCompany = company === 'all' || projectCompany === company;
        
        const projectTags = project.categories.map(tag => tag.toLowerCase());
        const matchesTags = selectedTags.length === 0 || 
            selectedTags.every(tag => projectTags.includes(tag));
        
        return matchesCompany && matchesTags;
    });
}

// Function to sort projects
function sortProjects(projects, sortBy) {
    return [...projects].sort((a, b) => {
        switch (sortBy) {
            case 'company':
                const companyA = a.title.split(' ')[0];
                const companyB = b.title.split(' ')[0];
                return companyA.localeCompare(companyB);
            case 'title':
                return a.title.localeCompare(b.title);
            default:
                return a.displayOrder - b.displayOrder;
        }
    });
}

// Function to update portfolio display
function updatePortfolioDisplay(projects) {
    const portfolioSections = document.querySelector('.portfolio-sections');
    portfolioSections.innerHTML = '';
    
    projects.forEach((project, index) => {
        const section = createProjectSection(project, index);
        portfolioSections.appendChild(section);
    });
}

// Function to get the appropriate logo URL based on current theme
function getLogoUrl(project) {
    if (!project.company || !project.company.logo) return '';
    
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
    
    return isDarkMode ? project.company.logo.dark : project.company.logo.light;
}

// Function to update all company logos based on current theme
function updateCompanyLogos() {
    const logoImages = document.querySelectorAll('.company-logo img');
    logoImages.forEach(img => {
        const projectId = img.closest('.portfolio-section').id.split('-')[1];
        const project = window.portfolioData.projects.find(p => p.id === parseInt(projectId));
        if (project) {
            img.src = getLogoUrl(project);
        }
    });
}

// Make updateCompanyLogos available globally
window.updateCompanyLogos = updateCompanyLogos;

function createProjectSection(project, index) {
    const section = document.createElement('section');
    section.className = 'portfolio-section';
    section.id = `project-${project.id}`;
    
    const imageUrl = project.image !== 'none' ? project.image : '/assets/images/project-placeholder.png';
    
    // Company information
    const companyInfo = project.company ? `
        <div class="project-company">
            <div class="company-logo">
                <img src="${getLogoUrl(project)}" alt="${project.company.name} logo">
            </div>
            <a href="${project.company.website}" class="company-website" target="_blank">
                Visit ${project.company.name} Website <i class="fas fa-external-link-alt"></i>
            </a>
        </div>
    ` : '';
    
    const content = `
        ${companyInfo}
        <div class="project-content">
            <div class="project-image">
                <img src="${imageUrl}" alt="${project.title}">
            </div>
            <div class="project-details">
                <h2 class="project-title">${project.title}</h2>
                <h3 class="project-subtitle">${project.subtitle}</h3>
                <p class="project-description">${project.description}</p>
                
                <div class="project-categories">
                    ${project.categories.map(category => 
                        `<span class="category-tag">${category}</span>`
                    ).join('')}
                </div>
                
                <div class="project-links">
                    ${project.link !== 'none' ? 
                        `<a href="${project.link}" class="project-link primary-link" target="_blank">
                            <i class="fas fa-external-link-alt"></i> View Project
                        </a>` : ''}
                    ${project.github !== 'disabled' ? 
                        `<a href="${project.github}" class="project-link secondary-link" target="_blank">
                            <i class="fab fa-github"></i> Contribute with GitHub
                        </a>` : ''}
                </div>
            </div>
        </div>
    `;
    
    section.innerHTML = content;
    return section;
}

// Function to initialize portfolio
async function initializePortfolio() {
    const portfolioData = await fetchPortfolioData();
    if (!portfolioData) return;

    // Store portfolio data globally for theme switching
    window.portfolioData = portfolioData;
    const projects = portfolioData.projects;
    
    // Populate filter options
    populateFilterOptions(projects);
    
    // Set up event listeners for filters and sort
    const companyFilter = document.getElementById('company-filter');
    const tagFilter = document.getElementById('tag-filter');
    const sortSelect = document.getElementById('sort-select');
    
    function applyFiltersAndSort() {
        const selectedCompany = companyFilter.value;
        const selectedTags = Array.from(tagFilter.selectedOptions).map(option => option.value);
        const sortBy = sortSelect.value;
        
        let filteredProjects = filterProjects(projects, selectedCompany, selectedTags);
        filteredProjects = sortProjects(filteredProjects, sortBy);
        
        updatePortfolioDisplay(filteredProjects);
    }
    
    companyFilter.addEventListener('change', applyFiltersAndSort);
    tagFilter.addEventListener('change', applyFiltersAndSort);
    sortSelect.addEventListener('change', applyFiltersAndSort);
    
    // Initial display
    applyFiltersAndSort();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializePortfolio);

// Fetch and display portfolio projects
async function loadPortfolio() {
    try {
        const response = await fetch('/data/portfolio.json');
        const data = await response.json();
        
        // Sort projects by displayOrder
        const sortedProjects = data.projects.sort((a, b) => a.displayOrder - b.displayOrder);
        
        const portfolioSections = document.querySelector('.portfolio-sections');
        
        // Create sections for each project
        sortedProjects.forEach((project, index) => {
            const section = createProjectSection(project, index);
            portfolioSections.appendChild(section);
        });
        
    } catch (error) {
        console.error('Error loading portfolio:', error);
    }
}

// Load portfolio when DOM is ready
document.addEventListener('DOMContentLoaded', loadPortfolio); 