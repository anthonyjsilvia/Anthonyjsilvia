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
    // Populate contact info in sidebar
    populateContact(resumeData.personalInfo && resumeData.personalInfo.contact);
    
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
    const strengthsSection = document.getElementById('key-strengths-section');
    if (strengthsSection && strengths && strengths.length > 0) {
        strengthsSection.innerHTML = `
            <ul class="key-strengths-list">
                ${strengths.map(strength => `<li>${strength}</li>`).join('')}
            </ul>
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
        let topSkillsHTML = '';
        
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
        
        // Top Skills
        if (skills.topSkills && skills.topSkills.length > 0) {
            topSkillsHTML = `
                <div class="skills-category">
                    <h3>Top Skills</h3>
                    <ul class="skills-list">
                        ${skills.topSkills.map(skill => `<li>${skill}</li>`).join('')}
                    </ul>
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
        skillsSection.innerHTML = topSkillsHTML + designToolsHTML + researchHTML + developmentHTML + collaborationHTML;
    }
}

function populateExperience(experience) {
    const experienceTimeline = document.getElementById('experience-timeline');
    if (experienceTimeline && experience && experience.length > 0) {
        let timelineHTML = '';
        let currentCompany = null;
        let currentCompanyHTML = '';
        let lastEndDate = null;

        // Sort experience by start date in descending order (most recent first)
        const sortedExperience = [...experience].sort((a, b) => {
            const getDate = (period) => {
                const match = period.match(/(\w+)\s+(\d{4})\s*–\s*(?:Present|(\w+)\s+(\d{4}))/);
                if (match) {
                    const [_, startMonth, startYear, endMonth, endYear] = match;
                    // For "Present", use current date
                    if (!endMonth) return new Date();
                    return new Date(`${endMonth} 1, ${endYear}`);
                }
                return new Date(0);
            };
            return getDate(b.period) - getDate(a.period);
        });

        sortedExperience.forEach((job, index) => {
            const periodMatch = job.period.match(/(\w+)\s+(\d{4})\s*–\s*(?:Present|(\w+)\s+(\d{4}))/);
            const startDate = periodMatch ? new Date(`${periodMatch[1]} 1, ${periodMatch[2]}`) : null;
            const endDate = periodMatch && periodMatch[3] ? new Date(`${periodMatch[3]} 1, ${periodMatch[4]}`) : new Date();

            // Check if this is a new company or if there's a gap
            if (currentCompany !== job.company || (lastEndDate && startDate && (lastEndDate - startDate) > 30 * 24 * 60 * 60 * 1000)) {
                // If we have a previous company, add it to the timeline
                if (currentCompanyHTML) {
                    timelineHTML += currentCompanyHTML;
                }
                
                // Start a new company section
                currentCompany = job.company;
                currentCompanyHTML = `
                    <div class="timeline-item">
                        <div class="timeline-content">
                            <div class="company-header">
                                ${job.logo ? 
                                    `<img src="${job.logo}" alt="${job.company}" class="company-logo" onerror="this.style.display='none'; this.parentElement.querySelector('.company-name').style.display='block';">` : 
                                    ''
                                }
                                <h3 class="company-name" ${job.logo ? 'style="display:none;"' : ''}>${job.company}</h3>
                            </div>
                            <div class="company-roles">
                `;
            }

            // Add the role to the current company section
            currentCompanyHTML += `
                <div class="role">
                    <h4>${job.position}</h4>
                    <span class="timeline-date-badge">${job.period}</span>
                    ${job.location ? `<p class="location">${job.location}</p>` : ''}
                    <ul class="role-duties">
                        ${job.duties.map(duty => `<li>${duty}</li>`).join('')}
                    </ul>
                </div>
            `;

            // If this is the last job or the next job is from a different company, close the current company section
            if (index === sortedExperience.length - 1 || sortedExperience[index + 1].company !== currentCompany) {
                currentCompanyHTML += `
                    </div>
                </div>
            </div>
                `;
                timelineHTML += currentCompanyHTML;
                currentCompanyHTML = '';
                currentCompany = null;
            }

            lastEndDate = startDate;
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
        let certificationsHTML = '<ul class="certifications-list">';
        
        certifications.forEach(cert => {
            // Split the certification into name and date if it contains a date in parentheses
            const match = cert.match(/(.*?)\s*\((.*?)\)/);
            if (match) {
                const [_, name, date] = match;
                certificationsHTML += `
                    <li>
                        <span class="certification-name">${name.trim()}</span>
                        <span class="certification-date">${date.trim()}</span>
                    </li>
                `;
            } else {
                certificationsHTML += `
                    <li>
                        <span class="certification-name">${cert}</span>
                    </li>
                `;
            }
        });
        
        certificationsHTML += '</ul>';
        certificationsSection.innerHTML = certificationsHTML;
    }
}

function populateLanguages(languages) {
    const languagesList = document.querySelector('.sidebar-languages');
    if (languagesList && languages && languages.length > 0) {
        languagesList.innerHTML = languages.map(lang => {
            let badge = '';
            if (lang.level) {
                badge = `<span class="lang-badge">${lang.level}</span>`;
            }
            return `<li>${lang.name} ${badge}</li>`;
        }).join('');
    }
}

function populateHonors(honors) {
    const honorsSection = document.getElementById('honors-section');
    if (honorsSection && honors && honors.length > 0) {
        honorsSection.innerHTML = `
            <ul class="honors-list">
                ${honors.map(honor => `<li>${honor}</li>`).join('')}
            </ul>
        `;
    }
}

function populateContact(contact) {
    const contactList = document.querySelector('.sidebar-contact');
    if (contactList && contact) {
        let html = '';
        if (contact.email) {
            html += `<li><i class='fas fa-envelope'></i> <button class='unlock-contact-btn' data-type='email' style='background:none;border:none;color:var(--primary-color);font-weight:600;cursor:pointer;padding:0;'>Unlock Contact Info</button></li>`;
        }
        if (contact.phone) {
            html += `<li><i class='fas fa-phone'></i> <button class='unlock-contact-btn' data-type='phone' style='background:none;border:none;color:var(--primary-color);font-weight:600;cursor:pointer;padding:0;'>Unlock Contact Info</button></li>`;
        }
        if (contact.website) {
            html += `<li><i class='fas fa-globe'></i> <a href='https://${contact.website}' target='_blank'>${contact.website}</a></li>`;
        }
        if (contact.linkedin) {
            html += `<li><i class='fab fa-linkedin'></i> <a href='https://${contact.linkedin}' target='_blank'>${contact.linkedin}</a></li>`;
        }
        contactList.innerHTML = html;
    }
}