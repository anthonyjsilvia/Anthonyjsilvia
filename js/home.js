// Function to fetch and update project count
async function updateProjectCount() {
    try {
        const response = await fetch('/data/portfolio.json');
        const data = await response.json();
        const projectCount = data.projects.length;
        
        // Update the project count in the experience stats
        const projectCountElement = document.querySelector('.stat:nth-child(2) h3');
        if (projectCountElement) {
            projectCountElement.textContent = `${projectCount}+`;
        }
    } catch (error) {
        console.error('Error updating project count:', error);
    }
}

// Initialize when the DOM is loaded
document.addEventListener('DOMContentLoaded', updateProjectCount); 