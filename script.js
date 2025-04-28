// Loader
window.addEventListener("load", function(){
  document.getElementById("loader").style.display = "none";
});

// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light-theme');
  
  if(document.body.classList.contains('light-theme')) {
    themeToggle.textContent = "🌞/Day";
  } else {
    themeToggle.textContent = "🌙/Night";
  }
});

// Typewriter Effect
const typedTextSpan = document.querySelector(".typewriter-text");
const textArray = ["Priyanka", "Full Stack Developer", "Tech Enthusiast"];
let typingDelay = 150;
let erasingDelay = 100;
let newTextDelay = 2000;
let textArrayIndex = 0;
let charIndex = 0;

function type() {
  if (charIndex < textArray[textArrayIndex].length) {
    typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
    charIndex++;
    setTimeout(type, typingDelay);
  } else {
    setTimeout(erase, newTextDelay);
  }
}

function erase() {
  if (charIndex > 0) {
    typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex-1);
    charIndex--;
    setTimeout(erase, erasingDelay);
  } else {
    textArrayIndex++;
    if (textArrayIndex >= textArray.length) textArrayIndex = 0;
    setTimeout(type, typingDelay + 500);
  }
}
document.addEventListener("DOMContentLoaded", function() {
  if(textArray.length) setTimeout(type, newTextDelay + 250);
});

// ScrollReveal Animations
ScrollReveal({
  reset: true,
  distance: '60px',
  duration: 2000,
  delay: 200
});
ScrollReveal().reveal('.hero', { delay: 300, origin: 'top' });
ScrollReveal().reveal('#about', { delay: 400, origin: 'left' });
ScrollReveal().reveal('#skills', { delay: 500, origin: 'right' });
ScrollReveal().reveal('#projects', { delay: 600, origin: 'bottom' });
ScrollReveal().reveal('#achievements', { delay: 700, origin: 'top' });
ScrollReveal().reveal('#contact', { delay: 800, origin: 'left' });

// ParticlesJS
particlesJS("particles-js", {
  "particles": {
    "number": {
      "value": 80
    },
    "color": {
      "value": "#ff4c75"
    },
    "shape": {
      "type": "circle"
    },
    "opacity": {
      "value": 0.5
    },
    "size": {
      "value": 3
    },
    "move": {
      "enable": true,
      "speed": 2
    },
    "line_linked": {
      "enable": true,
      "distance": 150,
      "color": "#ff4c75",
      "opacity": 0.4,
      "width": 1
    }
  }
});

// Back to Top Button
const backToTop = document.getElementById('back-to-top');
window.addEventListener('scroll', () => {
  if(window.pageYOffset > 100){
    backToTop.style.display = "block";
  } else {
    backToTop.style.display = "none";
  }
});
backToTop.addEventListener('click', () => {
  window.scrollTo({top: 0, behavior: 'smooth'});
});

// Contact Form (just dummy for now)
const contactForm = document.getElementById('contact-form');
contactForm.addEventListener('submit', function(event){
  event.preventDefault();
  alert('Thank you for your message, Priyanka will reach out to you soon!');
  contactForm.reset();
});
