// resume-loader.js - Loads and displays resume data from JSON

document.addEventListener('DOMContentLoaded', function() {
    // Fetch the resume JSON file
    fetch('resume.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Once we have the data, populate the page
            populateResumePage(data);
            
            // Hide the loader
            document.querySelector('.loader').style.display = 'none';
        })
        .catch(error => {
            console.error('Error loading resume data:', error);
            document.querySelector('.loader').innerHTML = 'Failed to load resume data. Please try again later.';
        });
});

function populateResumePage(resumeData) {
    // Populate professional summary
    populateProfessionalSummary(resumeData.professionalSummary);
    
    // Populate skills
    populateSkills(resumeData.skills);
    
    // Populate experience
    populateExperience(resumeData.experience);
    
    // Populate education
    populateEducation(resumeData.education);
    
    // Populate certifications
    populateCertifications(resumeData.certification);
    
    // Populate projects
    populateProjects(resumeData.projects);
}

function populateProfessionalSummary(summary) {
    const summarySection = document.getElementById('professional-summary');
    if (summarySection && summary) {
        summarySection.innerHTML = `
            <p>${summary}</p>
        `;
    }
}

function populateSkills(skills) {
    const skillsSection = document.getElementById('skills-section');
    if (skillsSection && skills) {
        let designToolsHTML = '';
        let researchHTML = '';
        let developmentHTML = '';
        let collaborationHTML = '';
        
        // Design Tools with progress bars
        if (skills.designTools && skills.designTools.length > 0) {
            designToolsHTML = `
                <div class="skills-category">
                    <h3>Design Tools</h3>
                    <div class="skills-grid">
            `;
            
            skills.designTools.forEach(tool => {
                designToolsHTML += `
                    <div class="skill-item">
                        <span class="skill-name">${tool.name}</span>
                        <div class="skill-bar">
                            <div class="skill-progress" style="width: ${tool.level}%"></div>
                        </div>
                    </div>
                `;
            });
            
            designToolsHTML += `
                    </div>
                </div>
            `;
        }
        
        // Research skills
        if (skills.research && skills.research.length > 0) {
            researchHTML = `
                <div class="skills-category">
                    <h3>Research</h3>
                    <ul class="skills-list">
                        ${skills.research.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
            `;
        }
        
        // Development skills
        if (skills.development && skills.development.length > 0) {
            developmentHTML = `
                <div class="skills-category">
                    <h3>Development</h3>
                    <ul class="skills-list">
                        ${skills.development.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
            `;
        }
        
        // Collaboration skills
        if (skills.collaboration && skills.collaboration.length > 0) {
            collaborationHTML = `
                <div class="skills-category">
                    <h3>Collaboration</h3>
                    <ul class="skills-list">
                        ${skills.collaboration.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
            `;
        }
        
        // Combine all skills
        skillsSection.innerHTML = designToolsHTML + researchHTML + developmentHTML + collaborationHTML;
    }
}

function populateExperience(experience) {
    const experienceTimeline = document.getElementById('experience-timeline');
    if (experienceTimeline && experience && experience.length > 0) {
        let timelineHTML = '';
        
        experience.forEach(job => {
            timelineHTML += `
                <div class="timeline-item">
                    <div class="timeline-date">${job.period}</div>
                    <div class="timeline-content">
                        <h3>${job.position}</h3>
                        <p>${job.company}</p>
                        <ul>
                            ${job.duties.map(duty => `<li>${duty}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            `;
        });
        
        experienceTimeline.innerHTML = timelineHTML;
    }
}

function populateEducation(education) {
    const educationTimeline = document.getElementById('education-timeline');
    if (educationTimeline && education) {
        let timelineHTML = `
            <div class="timeline-item">
                <div class="timeline-date">Graduated ${education.graduation}</div>
                <div class="timeline-content">
                    <h3>${education.school}</h3>
                    <p>${education.degrees.join(', ')}</p>
                    <span class="gpa">${education.gpa} GPA</span>
                </div>
            </div>
        `;
        
        educationTimeline.innerHTML = timelineHTML;
    }
}

function populateCertifications(certifications) {
    const certificationsSection = document.getElementById('certifications-section');
    if (certificationsSection && certifications && certifications.length > 0) {
        let certificationsHTML = '<ul class="certifications-list">';
        
        certifications.forEach(cert => {
            certificationsHTML += `<li>${cert}</li>`;
        });
        
        certificationsHTML += '</ul>';
        certificationsSection.innerHTML = certificationsHTML;
    }
}

function populateProjects(projects) {
    const projectsSection = document.getElementById('projects-section');
    if (projectsSection && projects && projects.length > 0) {
        let projectsHTML = '';
        
        projects.forEach(project => {
            projectsHTML += `
                <div class="project-card">
                    <h3>${project.title}</h3>
                    <ul>
                        ${project.details.map(detail => `<li>${detail}</li>`).join('')}
                    </ul>
                </div>
            `;
        });
        
        projectsSection.innerHTML = projectsHTML;
    }
}