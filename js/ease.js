window.onload = function() {
    var size = getCookie("fontSize");
    if (size) {
        changeFontSize(size);
    }
};

function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) {
        return parts.pop().split(";").shift();
    }
}

function changeFontSize(size) {
    var body = document.getElementsByTagName('body')[0];
    var bodyFontSize = parseFloat(window.getComputedStyle(body).fontSize);
    var newFontSize;

    switch(size) {
        case 'small':
            newFontSize = 14;
            break;
        case 'medium':
            newFontSize = 16;
            break;
        case 'large':
            newFontSize = 18;
            break;
        default:
            newFontSize = bodyFontSize;
    }

    // update body font size
    body.style.fontSize = newFontSize + 'px';

    // get all text elements, including paragraphs
    var elements = document.querySelectorAll('body, body *');
    for (var i = 0; i < elements.length; i++) {
        var style = window.getComputedStyle(elements[i]);
        var fontSize = parseFloat(style.fontSize);
        var lineHeight = parseFloat(style.lineHeight);

        // update font size and line height for paragraphs
        if (elements[i].tagName === 'P' && !isNaN(fontSize)) {
            elements[i].style.fontSize = (fontSize / bodyFontSize) * newFontSize + 'px';
        }

        // update font size and line height for non-paragraph text elements
        if (elements[i].tagName !== 'P' && !isNaN(fontSize)) {
            elements[i].style.fontSize = (fontSize / bodyFontSize) * newFontSize + 'px';
        }
        if (!isNaN(lineHeight)) {
            elements[i].style.lineHeight = (lineHeight / bodyFontSize) * newFontSize + 'px';
        }
    }

    // save the user's preferred font size in a cookie
    document.cookie = "fontSize=" + size + ";expires=Fri, 31 Dec 9999 23:59:59 GMT;path=/";
}

// add a dropdown option for a high contrast toggle
var highContrastOption = document.createElement('a');
highContrastOption.classList.add('dropdown-item');
highContrastOption.href = "#";
highContrastOption.innerText = "High Contrast";
document.getElementById('accessibility-link').nextElementSibling.appendChild(highContrastOption);

// apply or remove high contrast styles when the toggle is clicked
highContrastOption.addEventListener('click', function() {
    if (document.body.classList.contains('high-contrast')) {
        document.body.classList.remove('high-contrast');
    } else {
        document.body.classList.add('high-contrast');
    }
});

// Get all focusable elements on the page
const focusableElements = document.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');

// Add event listener for keydown
document.addEventListener('keydown', function(event) {
  // Check if the key pressed was the Tab key
  if (event.key === 'Tab') {
    // Prevent the default tab behavior
    event.preventDefault();
    
    // Find the index of the currently focused element
    const currentIndex = Array.from(focusableElements).indexOf(document.activeElement);
    
    // Find the next focusable element and focus on it
    if (event.shiftKey) {
      // If Shift+Tab was pressed, move to the previous focusable element
      focusableElements[(currentIndex - 1 + focusableElements.length) % focusableElements.length].focus();
    } else {
      // If Tab was pressed, move to the next focusable element
      focusableElements[(currentIndex + 1) % focusableElements.length].focus();
    }
  }
});
function showDarkModeMessage() {
  alert("When you turn on the Dark Mode option on your device, the website's Dark Mode will also turn on by itself. If you want to turn off the Dark Mode for the website, you can go to your device's settings and turn off the Dark Mode option from there.");
}
