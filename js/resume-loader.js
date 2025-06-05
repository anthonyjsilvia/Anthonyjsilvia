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
    const strengthsSection = document.getElementById('key-strengths');
    if (strengthsSection && strengths && strengths.length > 0) {
        const list = document.createElement('ul');
        list.className = 'strengths-list';
        
        strengths.forEach(strength => {
            const li = document.createElement('li');
            li.textContent = strength;
            list.appendChild(li);
        });
        
        strengthsSection.appendChild(list);
    }
}

function populateSkills(skills) {
    const skillsSection = document.getElementById('skills-section');
    if (skillsSection && skills) {
        let skillsHTML = '';
        
        // Top Skills
        if (skills.topSkills && skills.topSkills.length > 0) {
            skillsHTML += `
                <div class="skills-category">
                    <h3>Top Skills</h3>
                    <ul class="skills-list">
                        ${skills.topSkills.map(skill => `<li><i class="fas fa-star"></i>${skill}</li>`).join('')}
                    </ul>
                </div>
            `;
        }
        
        // Design Tools
        if (skills.designTools && skills.designTools.length > 0) {
            skillsHTML += `
                <div class="skills-category">
                    <h3>Design Tools</h3>
                    <ul class="skills-list">
                        ${skills.designTools.map(tool => `<li><i class="fas fa-paint-brush"></i>${tool.name}</li>`).join('')}
                    </ul>
                </div>
            `;
        }
        
        // Research Skills
        if (skills.research && skills.research.length > 0) {
            skillsHTML += `
                <div class="skills-category">
                    <h3>Research</h3>
                    <ul class="skills-list">
                        ${skills.research.map(skill => `<li><i class="fas fa-search"></i>${skill}</li>`).join('')}
                    </ul>
                </div>
            `;
        }
        
        // Development Skills
        if (skills.development && skills.development.length > 0) {
            skillsHTML += `
                <div class="skills-category">
                    <h3>Development</h3>
                    <ul class="skills-list">
                        ${skills.development.map(skill => `<li><i class="fas fa-code"></i>${skill}</li>`).join('')}
                    </ul>
                </div>
            `;
        }
        
        // Collaboration Skills
        if (skills.collaboration && skills.collaboration.length > 0) {
            skillsHTML += `
                <div class="skills-category">
                    <h3>Collaboration</h3>
                    <ul class="skills-list">
                        ${skills.collaboration.map(skill => `<li><i class="fas fa-users"></i>${skill}</li>`).join('')}
                    </ul>
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
            timelineHTML += `
                <div class="timeline-item">
                    <div class="timeline-content">
                        <h3>${job.position}</h3>
                        <h4>${job.company}</h4>
                        <span class="timeline-date-badge">${job.period}</span>
                        <p class="job-location">${job.locationType} • ${job.positionType}</p>
                        <ul class="job-duties">
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
            li.textContent = cert;
            list.appendChild(li);
        });
        
        certificationsSection.appendChild(list);
    }
}

function populateLanguages(languages) {
    const languagesList = document.querySelector('.sidebar-languages');
    if (languagesList && languages && languages.length > 0) {
        languages.forEach(lang => {
            const li = document.createElement('li');
            li.innerHTML = `${lang.name} <span class="language-level">${lang.level}</span>`;
            languagesList.appendChild(li);
        });
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