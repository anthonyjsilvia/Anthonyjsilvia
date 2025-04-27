// Resume Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Get the print button
    const printButton = document.getElementById('print-resume');
    
    // Add click event listener to the print button
    if (printButton) {
        printButton.addEventListener('click', function() {
            // Add a class to the body to indicate printing
            document.body.classList.add('printing');
            
            // Print the page
            window.print();
            
            // Remove the printing class after printing
            setTimeout(() => {
                document.body.classList.remove('printing');
            }, 1000);
        });
    }
    
    // Add keyboard shortcut for printing (Ctrl/Cmd + P)
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
            e.preventDefault();
            document.body.classList.add('printing');
            window.print();
            setTimeout(() => {
                document.body.classList.remove('printing');
            }, 1000);
        }
    });
}); 