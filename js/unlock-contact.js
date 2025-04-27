// unlock-contact.js
(function() {
    // Helper: Cookie and localStorage functions
    function setContactUnlocked() {
        document.cookie = 'contact_unlocked=true; max-age=7200; path=/';
        try { localStorage.setItem('contact_unlocked', 'true'); } catch(e) {}
    }
    function hasContactUnlocked() {
        // Check cookie
        const cookie = document.cookie.split(';').some(c => c.trim() === 'contact_unlocked=true');
        // Check localStorage
        let storage = false;
        try { storage = localStorage.getItem('contact_unlocked') === 'true'; } catch(e) {}
        return cookie || storage;
    }

    // Reveal all contact info on the page
    function revealAllContactInfo(data) {
        document.querySelectorAll('.unlock-contact-btn[data-type="phone"]').forEach(btn => {
            if (data && data.phone) {
                btn.outerHTML = `<a href='tel:${data.phone}'><i class='fas fa-phone'></i> ${data.phone}</a>`;
            }
        });
        document.querySelectorAll('.unlock-contact-btn[data-type="email"]').forEach(btn => {
            if (data && data.email) {
                btn.outerHTML = `<a href='mailto:${data.email}'><i class='fas fa-envelope'></i> ${data.email}</a>`;
            }
        });
    }

    // Modal HTML
    const modalHTML = `
    <div id="contact-unlock-modal" style="display:none;position:fixed;z-index:2000;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.35);justify-content:center;align-items:center;">
        <div style="background:#fff;padding:2rem 2.5rem;border-radius:12px;max-width:350px;box-shadow:0 8px 32px rgba(0,0,0,0.18);text-align:center;position:relative;">
            <button id="close-unlock-modal" style="position:absolute;top:10px;right:10px;background:none;border:none;font-size:1.3rem;cursor:pointer;color:#888;">&times;</button>
            <h3 style="margin-bottom:1rem;">Unlock Contact Info</h3>
            <div id="unlock-question" style="margin-bottom:1rem;font-size:1.1rem;"></div>
            <input id="unlock-answer" type="text" style="padding:0.5em 1em;font-size:1rem;border:1px solid #ccc;border-radius:6px;width:100%;margin-bottom:1rem;" placeholder="Your answer..." />
            <button id="submit-unlock" style="background:#3498db;color:#fff;padding:0.5em 1.5em;border:none;border-radius:6px;font-weight:600;cursor:pointer;">Submit</button>
            <div id="unlock-error" style="color:#c00;margin-top:0.7em;font-size:0.95em;"></div>
        </div>
    </div>`;
    if (!document.getElementById('contact-unlock-modal')) {
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    let unlockType = null; // 'phone' or 'email'
    let correctAnswer = null;

    // On page load, if unlocked, reveal all contact info
    if (hasContactUnlocked()) {
        fetch('resume.json')
            .then(r => r.json())
            .then(data => {
                if (data.personalInfo && data.personalInfo.contact) {
                    revealAllContactInfo(data.personalInfo.contact);
                }
            });
    }

    // Listen for unlock button clicks
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('unlock-contact-btn')) {
            unlockType = e.target.dataset.type;
            // Generate a random math question
            const a = Math.floor(Math.random() * 10) + 1;
            const b = Math.floor(Math.random() * 10) + 1;
            correctAnswer = a + b;
            document.getElementById('unlock-question').textContent = `What is ${a} + ${b}?`;
            document.getElementById('unlock-answer').value = '';
            document.getElementById('unlock-error').textContent = '';
            document.getElementById('contact-unlock-modal').style.display = 'flex';
        }
        if (e.target.id === 'close-unlock-modal') {
            document.getElementById('contact-unlock-modal').style.display = 'none';
        }
    });

    // Listen for submit
    document.getElementById('submit-unlock').addEventListener('click', function() {
        const userAnswer = parseInt(document.getElementById('unlock-answer').value, 10);
        if (userAnswer === correctAnswer) {
            // Fetch contact info from resume.json
            fetch('resume.json')
                .then(r => r.json())
                .then(data => {
                    const contactData = data.personalInfo && data.personalInfo.contact;
                    setContactUnlocked();
                    revealAllContactInfo(contactData);
                    document.getElementById('contact-unlock-modal').style.display = 'none';
                });
        } else {
            document.getElementById('unlock-error').textContent = 'Incorrect answer. Please try again.';
        }
    });

    // Expose for other scripts (e.g., print-resume)
    window.ContactUnlock = {
        hasContactCookie: hasContactUnlocked,
        revealAllContactInfo
    };
})(); 