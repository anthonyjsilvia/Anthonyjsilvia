// get the back-to-top button
const backToTopButton = document.querySelector('.back-to-top');

// add a click event listener to the button
backToTopButton.addEventListener('click', () => {
  // scroll to the top of the page
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// add a scroll event listener to the window
window.addEventListener('scroll', () => {
  // if the user has scrolled down more than 300 pixels, show the button
  if (window.pageYOffset > 300) {
    backToTopButton.classList.add('active');
  } else {
    backToTopButton.classList.remove('active');
  }
});
