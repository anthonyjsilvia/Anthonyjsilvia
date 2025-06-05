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
            // Store resume data globally for theme switching
            window.resumeData = data;
            
            // Once we have the data, populate the page
            populateResumePage(data);
            
            // Hide the loader
            document.querySelector('.loader').style.display = 'none';
            
            // Initial logo update based on current theme
            updateResumeLogos();
            
            // Listen for theme changes
            document.addEventListener('themeChanged', updateResumeLogos);
            
            // Listen for system color scheme changes
            if (window.matchMedia) {
                const colorSchemeMedia = window.matchMedia('(prefers-color-scheme: dark)');
                colorSchemeMedia.addEventListener('change', () => {
                    if (!localStorage.getItem('theme')) {
                        updateResumeLogos();
                    }
                });
            }
        })
        .catch(error => {
            console.error('Error loading resume data:', error);
            document.querySelector('.loader').innerHTML = 'Failed to load resume data. Please try again later.';
        });
});

function populateResumePage(resumeData) {
    // Only show professional summary on print page
    if (window.location.pathname.includes('print-resume')) {
        populateProfessionalSummary(resumeData.professionalSummary);
    }
    
    // Populate key strengths if they exist
    if (resumeData.keyStrengths) {
        populateKeyStrengths(resumeData.keyStrengths);
    }
    
    // Populate skills
    populateSkills(resumeData.skills);
    
    // Populate experience
    populateExperience(resumeData.experience);
    
    // Populate education
    populateEducation(resumeData.education);
    
    // Populate certifications
    populateCertifications(resumeData.certifications);
    
    // Populate languages (in sidebar)
    populateLanguages(resumeData.languages);
    
    // Populate honors if they exist
    if (resumeData.honors) {
        populateHonors(resumeData.honors);
    }
}

function populateProfessionalSummary(summary) {
    const summarySection = document.getElementById('professional-summary');
    if (summarySection && summary) {
        summarySection.innerHTML = `
            <p>${summary}</p>
        `;
    }
}

function populateKeyStrengths(strengths) {
    const strengthsSection = document.getElementById('key-strengths-section');
    if (strengthsSection && strengths && strengths.length > 0) {
        const list = document.createElement('ul');
        list.className = 'key-strengths-list';
        
        strengths.forEach(strength => {
            const li = document.createElement('li');
            li.textContent = strength;
            list.appendChild(li);
        });
        
        strengthsSection.innerHTML = ''; // Clear existing content
        strengthsSection.appendChild(list);
    }
}

function populateSkills(skills) {
    const skillsSection = document.getElementById('skills-section');
    if (skillsSection && skills) {
        let skillsHTML = '';
        
        // Top Skills
        const topSkills = [
            'UX Design',
            'Software Development',
            'Project Management',
            'Start-up Leadership'
        ];
        
        skillsHTML += `
            <div class="skills-category">
                <h3>Top Skills</h3>
                <ul class="skills-list">
                    ${topSkills.map(skill => `<li><i class="fas fa-star"></i>${skill}</li>`).join('')}
                </ul>
            </div>
        `;
        
        // Design Tools with skill levels
        if (skills.designTools && skills.designTools.length > 0) {
            skillsHTML += `
                <div class="skills-category">
                    <h3>Design Tools</h3>
                    <div class="skills-chart">
                        ${skills.designTools.map(tool => `
                            <div class="skill-item">
                                <div class="skill-name">${tool.name}</div>
                                <div class="skill-bar">
                                    <div class="skill-level" style="width: ${tool.level}%"></div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
        
        skillsSection.innerHTML = skillsHTML;
    }
}

function populateExperience(experience) {
    const experienceTimeline = document.getElementById('experience-timeline');
    if (experienceTimeline && experience && experience.length > 0) {
        let timelineHTML = '';
        
        experience.forEach(job => {
            // Check if job has valid logos
            const hasLogos = job.logo && (
                (typeof job.logo === 'object' && (job.logo.light || job.logo.dark)) ||
                (typeof job.logo === 'string' && job.logo)
            );
            
            timelineHTML += `
                <div class="timeline-item">
                    <div class="company-header">
                        ${hasLogos ? `<div class="company-logo"><img src="${getResumeLogoUrl(job)}" alt="${job.company}"></div>` : ''}
                        <h3 class="company-name">${job.company}</h3>
                    </div>
                    <div class="role">
                        <h4>${job.position}</h4>
                        <span class="timeline-date-badge">${job.period}</span>
                        <p class="location">${job.locationType} • ${job.positionType}</p>
                        <ul class="role-duties">
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
    if (educationTimeline && education && education.length > 0) {
        let timelineHTML = '';
        
        education.forEach(edu => {
            timelineHTML += `
                <div class="timeline-item">
                    <div class="timeline-content">
                        <h3>${edu.school}</h3>
                        ${edu.period ? `<span class="timeline-date-badge">${edu.period}</span>` : ''}
                        <p>${edu.degree}</p>
                        ${edu.minor ? `<p>Minor: ${edu.minor}</p>` : ''}
                        ${edu.gpa ? `<span class="gpa">${edu.gpa} GPA</span>` : ''}
                    </div>
                </div>
            `;
        });
        
        educationTimeline.innerHTML = timelineHTML;
    }
}

function populateCertifications(certifications) {
    const certificationsSection = document.getElementById('certifications-section');
    if (certificationsSection && certifications && certifications.length > 0) {
        const list = document.createElement('ul');
        list.className = 'certifications-list';
        
        certifications.forEach(cert => {
            const li = document.createElement('li');
            const certItem = document.createElement('div');
            certItem.className = 'certification-item';
            
            // Extract date if it exists in parentheses
            const dateMatch = cert.match(/\((.*?)\)/);
            const date = dateMatch ? dateMatch[1] : null;
            const name = dateMatch ? cert.replace(/\((.*?)\)/, '').trim() : cert;
            
            const nameSpan = document.createElement('span');
            nameSpan.className = 'certification-name';
            nameSpan.textContent = name;
            
            certItem.appendChild(nameSpan);
            
            if (date) {
                const dateSpan = document.createElement('span');
                dateSpan.className = 'certification-date';
                dateSpan.textContent = date;
                certItem.appendChild(dateSpan);
            }
            
            // Add level badge if it's a professional certificate
            if (name.toLowerCase().includes('professional certificate')) {
                const levelBadge = document.createElement('span');
                levelBadge.className = 'certification-badge';
                levelBadge.textContent = 'Professional';
                certItem.appendChild(levelBadge);
            }
            
            li.appendChild(certItem);
            list.appendChild(li);
        });
        
        certificationsSection.innerHTML = ''; // Clear existing content
        certificationsSection.appendChild(list);
    }
}

function populateLanguages(languages) {
    const languagesList = document.querySelector('.sidebar-languages');
    if (languagesList && languages && languages.length > 0) {
        languagesList.innerHTML = languages.map(lang => `
            <li>
                ${lang.name}
                <span class="language-level">${lang.level}</span>
            </li>
        `).join('');
    }
}

function populateHonors(honors) {
    const honorsSection = document.getElementById('honors-section');
    if (honorsSection && honors && honors.length > 0) {
        const list = document.createElement('ul');
        list.className = 'honors-list';
        
        honors.forEach(honor => {
            const li = document.createElement('li');
            li.textContent = honor;
            list.appendChild(li);
        });
        
        honorsSection.appendChild(list);
    }
}

// Function to get the appropriate logo URL based on current theme
function getResumeLogoUrl(job) {
    if (!job.logo) return '';
    
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
    
    // If the logo is an object with dark/light variants
    if (typeof job.logo === 'object') {
        return isDarkMode ? job.logo.dark : job.logo.light;
    }
    
    // If it's a single string URL, return as is
    return job.logo;
}

// Function to update all company logos based on current theme
function updateResumeLogos() {
    const logoImages = document.querySelectorAll('.company-logo img');
    logoImages.forEach(img => {
        const timelineItem = img.closest('.timeline-item');
        if (timelineItem) {
            const companyName = timelineItem.querySelector('.company-name').textContent;
            const job = window.resumeData.experience.find(j => j.company === companyName);
            if (job) {
                img.src = getResumeLogoUrl(job);
            }
        }
    });
}

// Make updateResumeLogos available globally
window.updateResumeLogos = updateResumeLogos;