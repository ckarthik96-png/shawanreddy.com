/* ==========================================
   THEME TOGGLE SYSTEM (LIGHT/DARK)
   ========================================== */
let themeToggleBtn;
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)');

const getCurrentTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme;
    return systemPrefersDark.matches ? 'dark' : 'light';
};

const setTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    updateThemeToggleIcon(theme);
};

const updateThemeToggleIcon = (theme) => {
    if (!themeToggleBtn) return;
    if (theme === 'dark') {
        themeToggleBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" width="22" height="22">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
            </svg>
        `;
    } else {
        themeToggleBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" width="22" height="22">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
            </svg>
        `;
    }
};

// Initialize theme instantly to prevent flash
document.documentElement.setAttribute('data-theme', getCurrentTheme());

/* ==========================================
   MOBILE NAVIGATION TOGGLE
   ========================================== */
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close menu when links are clicked
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
    });
});


/* ==========================================
   DYNAMIC TYPEWRITER EFFECT
   ========================================== */
const typewriter = document.getElementById('typewriter');
const phrases = [
    "Full Stack Web Applications",
    "Scalable API Gateways",
    "High-Performance Cloud Portals",
    "Secure & Optimized Systems"
];
let phraseIdx = 0;
let charIdx = 0;
let deleting = false;
let delay = 100;

function type() {
    const currentText = phrases[phraseIdx];
    
    if (deleting) {
        typewriter.textContent = currentText.substring(0, charIdx - 1);
        charIdx--;
        delay = 40; // Backspace faster
    } else {
        typewriter.textContent = currentText.substring(0, charIdx + 1);
        charIdx++;
        delay = 100; // Normal typing speed
    }
    
    // Switch state at boundaries
    if (!deleting && charIdx === currentText.length) {
        deleting = true;
        delay = 2000; // Pause at end of phrase
    } else if (deleting && charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        delay = 500; // Pause before typing next phrase
    }
    
    setTimeout(type, delay);
}

document.addEventListener('DOMContentLoaded', () => {
    themeToggleBtn = document.getElementById('themeToggleBtn');
    updateThemeToggleIcon(getCurrentTheme());
    
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            setTheme(newTheme);
        });
    }
    
    setTimeout(type, 1000);
});


/* ==========================================
   ACTIVE NAVIGATION SECTION HIGHLIGHTER
   ========================================== */
const sections = document.querySelectorAll('section');

function highlightNav() {
    let scrollPos = window.scrollY + 200; // Offset for accuracy
    
    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        
        if (scrollPos >= top && scrollPos < top + height) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', highlightNav);


/* ==========================================
   SCROLL REVEAL (INTERSECTION OBSERVER)
   ========================================== */
const revealElements = document.querySelectorAll('.glass-card, .project-card, .section-title-wrapper');

const observerOptions = {
    root: null,
    threshold: 0.1,
    rootMargin: "0px"
};

const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

revealElements.forEach(el => {
    // Set initial animation properties
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
    revealObserver.observe(el);
});

// Class selector to trigger CSS activation
const revealStyle = document.createElement('style');
revealStyle.innerHTML = `
    .revealed {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(revealStyle);


/* ==========================================
   CONTACT FORM HANDLER
   ========================================== */
const contactForm = document.getElementById('contactForm');
const btnSubmit = document.getElementById('btnSubmit');
const formFeedback = document.getElementById('formFeedback');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const btnSpan = btnSubmit.querySelector('span');
        const originalText = btnSpan.textContent;
        
        // UI feedback states
        btnSpan.textContent = 'Transmitting Message...';
        btnSubmit.disabled = true;
        
        const name = document.getElementById('formName').value.trim();
        
        setTimeout(() => {
            formFeedback.textContent = `Thank you, ${name}! Your transmission was successful. I'll get back to you soon.`;
            formFeedback.className = 'form-feedback success';
            
            contactForm.reset();
            btnSpan.textContent = originalText;
            btnSubmit.disabled = false;
            
            setTimeout(() => {
                formFeedback.textContent = '';
                formFeedback.className = 'form-feedback';
            }, 6000);
        }, 1500);
    });
}
