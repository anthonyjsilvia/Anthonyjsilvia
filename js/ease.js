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




