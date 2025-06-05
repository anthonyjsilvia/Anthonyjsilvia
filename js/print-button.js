// Print button visibility control
document.addEventListener('DOMContentLoaded', function() {
    const allowedHosts = ['localhost', '127.0.0.1'];
    const currentHost = window.location.hostname;
    const printButton = document.querySelector('.floating-print-btn');
    
    // Hide print button if not on allowed hosts
    if (printButton && !allowedHosts.includes(currentHost)) {
        printButton.style.display = 'none';
    }
}); 