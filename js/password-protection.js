// Localhost check for print resume page
document.addEventListener('DOMContentLoaded', function() {
    const allowedHosts = ['localhost', '127.0.0.1'];
    const currentHost = window.location.hostname;
    
    // Check if the current host is not in the allowed hosts list
    if (!allowedHosts.includes(currentHost)) {
        // Redirect to homepage
        window.location.href = '/';
    }
}); 