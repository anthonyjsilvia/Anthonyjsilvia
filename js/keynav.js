// Get all the elements in the DOM that should be focusable
const focusableElements = document.querySelectorAll('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])');

// Add event listeners to each focusable element to enable keyboard navigation
focusableElements.forEach(element => {
  element.addEventListener('keydown', e => {
    const TAB_KEYCODE = 9;
    const isTabPressed = e.key === 'Tab' || e.keyCode === TAB_KEYCODE;
    
    if (!isTabPressed) {
      return;
    }
    
    // Find the next focusable element and give it focus
    const currentIndex = Array.from(focusableElements).indexOf(e.target);
    const nextIndex = e.shiftKey ? currentIndex - 1 : currentIndex + 1;
    
    if (nextIndex >= focusableElements.length) {
      focusableElements[0].focus();
      e.preventDefault();
    } else if (nextIndex < 0) {
      focusableElements[focusableElements.length - 1].focus();
      e.preventDefault();
    } else {
      focusableElements[nextIndex].focus();
      e.preventDefault();
    }
  });
});
