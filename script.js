// ===== DOM CONTENT LOADED =====
document.addEventListener('DOMContentLoaded', function() {
  initializePortfolio();
});

// ===== PORTFOLIO INITIALIZATION =====
function initializePortfolio() {
  initializePreloader();
  initializeTheme();
  initializeNavigation();
  initializeTypewriter();
  initializeScrollReveal();
  initializeParticles();
  initializeBackToTop();
  initializeSkillBars();
  initializeProjectFilter();
  initializeContactForm();
  initializeScrollAnimations();
  initializePerformanceOptimizations();
}

// ===== PRELOADER =====
function initializePreloader() {
  const preloader = document.getElementById('preloader');
  
  // Simulate loading time (you can remove this in production)
  const minLoadTime = 1000; // 1 second minimum
  const startTime = Date.now();
  
  window.addEventListener('load', function() {
    const loadTime = Date.now() - startTime;
    const remainingTime = Math.max(0, minLoadTime - loadTime);
    
    setTimeout(() => {
      preloader.classList.add('fade-out');
      
      setTimeout(() => {
        preloader.style.display = 'none';
        // Trigger initial animations after preloader is gone
        triggerInitialAnimations();
      }, 500);
    }, remainingTime);
  });
}

function triggerInitialAnimations() {
  // Animate hero section elements sequentially
  const heroElements = document.querySelectorAll('.hero-badge, .hero-title, .hero-subtitle, .hero-description, .hero-actions');
  
  heroElements.forEach((element, index) => {
    setTimeout(() => {
      element.style.opacity = '0';
      element.style.transform = 'translateY(30px)';
      element.style.display = 'block';
      
      setTimeout(() => {
        element.style.transition = 'all 0.6s ease';
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      }, 50);
    }, index * 200);
  });
}

// ===== THEME MANAGEMENT =====
function initializeTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = themeToggle.querySelector('.theme-icon');
  const themeText = themeToggle.querySelector('.theme-text');
  
  // Check for saved theme preference or default to dark
  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
  setTheme(savedTheme);
  
  themeToggle.addEventListener('click', function() {
    const currentTheme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  });
  
  function setTheme(theme) {
    if (theme === 'light') {
      document.body.classList.add('light-theme');
      themeIcon.textContent = '🌞';
      themeText.textContent = 'Light Mode';
    } else {
      document.body.classList.remove('light-theme');
      themeIcon.textContent = '🌙';
      themeText.textContent = 'Dark Mode';
    }
    
    // Save preference
    localStorage.setItem('portfolio-theme', theme);
    
    // Update particles if they exist
    updateParticlesTheme(theme);
  }
  
  function updateParticlesTheme(theme) {
    if (window.pJSDom && window.pJSDom[0] && window.pJSDom[0].pJS) {
      const pJS = window.pJSDom[0].pJS;
      pJS.particles.color.value = theme === 'light' ? '#6c63ff' : '#ff4c75';
      pJS.particles.line_linked.color = theme === 'light' ? '#6c63ff' : '#ff4c75';
      pJS.fn.particlesRefresh();
    }
  }
}

// ===== NAVIGATION =====
function initializeNavigation() {
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  
  // Navbar scroll effect
  let lastScrollY = window.scrollY;
  
  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    
    // Show/hide navbar based on scroll direction
    if (currentScrollY > lastScrollY && currentScrollY > 100) {
      navbar.style.transform = 'translateY(-100%)';
    } else {
      navbar.style.transform = 'translateY(0)';
    }
    
    // Add scrolled class for background
    if (currentScrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    
    lastScrollY = currentScrollY;
    
    // Update active nav link
    updateActiveNavLink();
  });
  
  // Mobile menu toggle
  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
  });
  
  // Close mobile menu when clicking on links
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      navToggle.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
  
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const offsetTop = targetElement.offsetTop - 70; // Account for navbar height
        
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });
}

function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  
  let currentSection = '';
  const scrollY = window.pageYOffset + 100;
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    
    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      currentSection = section.getAttribute('id');
    }
  });
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentSection}`) {
      link.classList.add('active');
    }
  });
}

// ===== TYPEWRITER EFFECT =====
function initializeTypewriter() {
  const typedTextSpan = document.querySelector(".typewriter-text");
  const cursorSpan = document.querySelector(".typewriter-cursor");
  
  const textArray = [
    "Full Stack Developer",
    "MERN Stack Specialist", 
    "AI Enthusiast",
    "Problem Solver",
    "Continuous Learner"
  ];
  
  const typingDelay = 80;
  const erasingDelay = 50;
  const newTextDelay = 2000;
  let textArrayIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  
  function type() {
    const currentText = textArray[textArrayIndex];
    
    if (isDeleting) {
      // Deleting text
      typedTextSpan.textContent = currentText.substring(0, charIndex - 1);
      charIndex--;
    } else {
      // Typing text
      typedTextSpan.textContent = currentText.substring(0, charIndex + 1);
      charIndex++;
    }
    
    // Check if current word is complete
    if (!isDeleting && charIndex === currentText.length) {
      // Pause at end of word
      isDeleting = true;
      setTimeout(type, newTextDelay);
      return;
    } else if (isDeleting && charIndex === 0) {
      // Move to next word
      isDeleting = false;
      textArrayIndex = (textArrayIndex + 1) % textArray.length;
      setTimeout(type, typingDelay + 500);
      return;
    }
    
    // Continue typing/deleting
    setTimeout(type, isDeleting ? erasingDelay : typingDelay);
  }
  
  // Start typewriter effect
  setTimeout(type, newTextDelay + 250);
  
  // Blinking cursor animation
  setInterval(() => {
    cursorSpan.style.opacity = cursorSpan.style.opacity === '0' ? '1' : '0';
  }, 500);
}

// ===== SCROLL REVEAL ANIMATIONS =====
function initializeScrollReveal() {
  // Custom scroll reveal implementation for better performance
  const animatedElements = document.querySelectorAll(
    '.about-container, .skills-category, .project-card, .achievement-card, .contact-container, .github-stats'
  );
  
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  animatedElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'all 0.6s ease';
    observer.observe(element);
  });
  
  // Add CSS for animate-in class
  const style = document.createElement('style');
  style.textContent = `
    .animate-in {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `;
  document.head.appendChild(style);
}

// ===== PARTICLES.JS CONFIGURATION =====
function initializeParticles() {
  if (document.getElementById('particles-js')) {
    particlesJS('particles-js', {
      particles: {
        number: {
          value: 80,
          density: {
            enable: true,
            value_area: 800
          }
        },
        color: {
          value: '#ff4c75'
        },
        shape: {
          type: 'circle',
          stroke: {
            width: 0,
            color: '#000000'
          }
        },
        opacity: {
          value: 0.5,
          random: true,
          anim: {
            enable: true,
            speed: 1,
            opacity_min: 0.1,
            sync: false
          }
        },
        size: {
          value: 3,
          random: true,
          anim: {
            enable: true,
            speed: 2,
            size_min: 0.1,
            sync: false
          }
        },
        line_linked: {
          enable: true,
          distance: 150,
          color: '#ff4c75',
          opacity: 0.4,
          width: 1
        },
        move: {
          enable: true,
          speed: 2,
          direction: 'none',
          random: true,
          straight: false,
          out_mode: 'out',
          bounce: false,
          attract: {
            enable: false,
            rotateX: 600,
            rotateY: 1200
          }
        }
      },
      interactivity: {
        detect_on: 'canvas',
        events: {
          onhover: {
            enable: true,
            mode: 'grab'
          },
          onclick: {
            enable: true,
            mode: 'push'
          },
          resize: true
        },
        modes: {
          grab: {
            distance: 140,
            line_linked: {
              opacity: 1
            }
          },
          push: {
            particles_nb: 4
          }
        }
      },
      retina_detect: true
    });
  }
}

// ===== BACK TO TOP BUTTON =====
function initializeBackToTop() {
  const backToTopButton = document.getElementById('back-to-top');
  
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      backToTopButton.classList.add('show');
    } else {
      backToTopButton.classList.remove('show');
    }
  });
  
  backToTopButton.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// ===== SKILL BARS ANIMATION =====
function initializeSkillBars() {
  const skillBars = document.querySelectorAll('.skill-progress');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const skillBar = entry.target;
        const level = skillBar.getAttribute('data-level');
        
        setTimeout(() => {
          skillBar.style.width = level + '%';
        }, 200);
        
        observer.unobserve(skillBar);
      }
    });
  }, {
    threshold: 0.5,
    rootMargin: '0px 0px -100px 0px'
  });
  
  skillBars.forEach(bar => {
    bar.style.width = '0%';
    observer.observe(bar);
  });
}

// ===== PROJECT FILTERING =====
function initializeProjectFilter() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to clicked button
      button.classList.add('active');
      
      const filterValue = button.getAttribute('data-filter');
      
      // Filter projects
      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.8)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

// ===== CONTACT FORM =====
function initializeContactForm() {
  const contactForm = document.querySelector('.contact-form');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form data
      const formData = new FormData(this);
      const formObject = Object.fromEntries(formData.entries());
      
      // Simple validation
      if (validateForm(formObject)) {
        showFormStatus('Sending message...', 'info');
        
        // Simulate form submission (replace with actual FormSubmit.co integration)
        setTimeout(() => {
          showFormStatus('Message sent successfully! I\'ll get back to you soon.', 'success');
          contactForm.reset();
          resetFormLabels();
        }, 2000);
      }
    });
    
    // Floating labels functionality
    const formInputs = contactForm.querySelectorAll('input, textarea');
    
    formInputs.forEach(input => {
      // Check initial state
      if (input.value) {
        input.parentElement.classList.add('filled');
      }
      
      input.addEventListener('focus', function() {
        this.parentElement.classList.add('focused');
      });
      
      input.addEventListener('blur', function() {
        this.parentElement.classList.remove('focused');
        if (this.value) {
          this.parentElement.classList.add('filled');
        } else {
          this.parentElement.classList.remove('filled');
        }
      });
      
      // Real-time validation
      input.addEventListener('input', function() {
        validateField(this);
      });
    });
  }
}

function validateForm(formData) {
  const { name, email, subject, message } = formData;
  
  if (!name.trim()) {
    showFormStatus('Please enter your name.', 'error');
    return false;
  }
  
  if (!email.trim() || !isValidEmail(email)) {
    showFormStatus('Please enter a valid email address.', 'error');
    return false;
  }
  
  if (!subject.trim()) {
    showFormStatus('Please enter a subject.', 'error');
    return false;
  }
  
  if (!message.trim()) {
    showFormStatus('Please enter your message.', 'error');
    return false;
  }
  
  return true;
}

function validateField(field) {
  const value = field.value.trim();
  
  if (field.type === 'email' && value && !isValidEmail(value)) {
    field.style.borderColor = 'var(--accent-primary)';
  } else if (value) {
    field.style.borderColor = 'var(--accent-secondary)';
  } else {
    field.style.borderColor = 'var(--border-color)';
  }
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function showFormStatus(message, type) {
  // Remove existing status messages
  const existingStatus = document.querySelector('.form-status');
  if (existingStatus) {
    existingStatus.remove();
  }
  
  // Create new status message
  const statusElement = document.createElement('div');
  statusElement.className = `form-status form-status-${type}`;
  statusElement.textContent = message;
  
  // Add styles
  statusElement.style.cssText = `
    padding: var(--spacing-md);
    margin-top: var(--spacing-md);
    border-radius: var(--radius-md);
    text-align: center;
    font-weight: 500;
    background: ${type === 'error' ? 'rgba(255, 76, 117, 0.1)' : type === 'success' ? 'rgba(108, 99, 255, 0.1)' : 'rgba(0, 212, 255, 0.1)'};
    color: ${type === 'error' ? 'var(--accent-primary)' : type === 'success' ? 'var(--accent-secondary)' : 'var(--accent-tertiary)'};
    border: 1px solid ${type === 'error' ? 'var(--accent-primary)' : type === 'success' ? 'var(--accent-secondary)' : 'var(--accent-tertiary)'};
  `;
  
  const contactForm = document.querySelector('.contact-form');
  contactForm.appendChild(statusElement);
  
  // Auto-remove success/info messages after 5 seconds
  if (type !== 'error') {
    setTimeout(() => {
      statusElement.remove();
    }, 5000);
  }
}

function resetFormLabels() {
  const formGroups = document.querySelectorAll('.form-group');
  formGroups.forEach(group => {
    group.classList.remove('filled', 'focused');
  });
}

// ===== SCROLL ANIMATIONS =====
function initializeScrollAnimations() {
  // Parallax effect for hero section
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const heroVisual = document.querySelector('.hero-visual');
    
    if (hero && heroVisual) {
      heroVisual.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
  });
  
  // Animate elements on scroll with throttle
  let ticking = false;
  
  function updateAnimations() {
    const elements = document.querySelectorAll('.skill-item, .achievement-card, .project-card');
    const windowHeight = window.innerHeight;
    
    elements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      const elementVisible = 150;
      
      if (elementTop < windowHeight - elementVisible) {
        element.classList.add('animate-in');
      }
    });
    
    ticking = false;
  }
  
  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(updateAnimations);
      ticking = true;
    }
  }
  
  window.addEventListener('scroll', requestTick);
  window.addEventListener('resize', requestTick);
  
  // Initial check
  updateAnimations();
}

// ===== PERFORMANCE OPTIMIZATIONS =====
function initializePerformanceOptimizations() {
  // Lazy load images
  const images = document.querySelectorAll('img[data-src]');
  
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.getAttribute('data-src');
        img.removeAttribute('data-src');
        imageObserver.unobserve(img);
      }
    });
  });
  
  images.forEach(img => imageObserver.observe(img));
  
  // Throttle scroll events
  function throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
  
  // Optimize resize events
  let resizeTimeout;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      // Update any layout-dependent calculations
      updateScrollAnimations();
    }, 250);
  });
}

function updateScrollAnimations() {
  // Re-initialize any scroll-based calculations if needed
}

// ===== ADDITIONAL ENHANCEMENTS =====

// Page visibility API for performance
document.addEventListener('visibilitychange', function() {
  if (document.hidden) {
    // Page is hidden, reduce animations if any
    document.body.classList.add('page-hidden');
  } else {
    // Page is visible again
    document.body.classList.remove('page-hidden');
  }
});

// Keyboard navigation enhancements
document.addEventListener('keydown', function(e) {
  // Escape key closes mobile menu
  if (e.key === 'Escape') {
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    
    if (navMenu && navMenu.classList.contains('active')) {
      navMenu.classList.remove('active');
      navToggle.classList.remove('active');
      document.body.style.overflow = '';
    }
  }
  
  // Tab key navigation improvements
  if (e.key === 'Tab') {
    document.body.classList.add('keyboard-navigation');
  }
});

document.addEventListener('mousedown', function() {
  document.body.classList.remove('keyboard-navigation');
});

// Add CSS for keyboard navigation
const keyboardNavStyles = `
  .keyboard-navigation *:focus {
    outline: 2px solid var(--accent-primary) !important;
    outline-offset: 2px !important;
  }
  
  .page-hidden .hero-decoration {
    animation-play-state: paused;
  }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = keyboardNavStyles;
document.head.appendChild(styleSheet);

// Console greeting (optional)
console.log(`
%c👋 Hello there! Welcome to Priyanka's Portfolio
%c
I see you're curious about the code! This portfolio is built with:
• Vanilla JavaScript (ES6+)
• Modern CSS with CSS Variables
• Semantic HTML5
• Particles.js for background effects
• Custom animations and interactions

Feel free to explore the code and get inspired! 🚀

GitHub: https://github.com/Priyanka-Khasa
LinkedIn: https://linkedin.com/in/priyanka-khasa

`, 
'color: #ff4c75; font-size: 16px; font-weight: bold;',
'color: #6c63ff; font-size: 14px;'
);

// Export functions for potential module use (if needed)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initializePortfolio,
    initializeTheme,
    initializeTypewriter,
    initializeNavigation
  };
}