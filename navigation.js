document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section, header.banner');
    const navLinks = document.querySelectorAll('.nav-links a');
    const hamburger = document.querySelector('.hamburger');
    const navLinksContainer = document.querySelector('.nav-links');
    const body = document.body;
    
    // Add padding to account for fixed navbar
    const navHeight = document.querySelector('.navbar').offsetHeight;
    const sectionMargin = 100; // Additional margin for earlier activation

    // Update hamburger color based on scroll position
    function updateHamburgerColor() {
        const scrollPosition = window.scrollY;
        const hamburgerSpans = hamburger.querySelectorAll('span');
        
        if (scrollPosition > 100 && !hamburger.classList.contains('active')) {
            hamburgerSpans.forEach(span => {
                span.style.background = '#333';
                span.style.boxShadow = 'none';
            });
        } else if (!hamburger.classList.contains('active')) {
            hamburgerSpans.forEach(span => {
                span.style.background = '#fdf8c9';
                span.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.3)';
            });
        }
    }

    // Toggle menu
    function toggleMenu() {
        hamburger.classList.toggle('active');
        navLinksContainer.classList.toggle('active');
        body.style.overflow = navLinksContainer.classList.contains('active') ? 'hidden' : '';
        
        // Update hamburger color when toggled
        const hamburgerSpans = hamburger.querySelectorAll('span');
        if (hamburger.classList.contains('active')) {
            hamburgerSpans.forEach(span => {
                span.style.background = '#333';
                span.style.boxShadow = 'none';
            });
        } else {
            updateHamburgerColor();
        }
    }

    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            toggleMenu();
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        const isClickInside = navLinksContainer.contains(e.target) || hamburger.contains(e.target);
        if (!isClickInside && navLinksContainer.classList.contains('active')) {
            toggleMenu();
        }
    });

    function updateActiveSection() {
        const scrollPosition = window.scrollY;
        updateHamburgerColor();

        let activeSection = null;
        sections.forEach(section => {
            const sectionTop = section.offsetTop - navHeight - sectionMargin;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                activeSection = section;
            }
        });

        // Remove active class from all links
        navLinks.forEach(link => link.classList.remove('active'));
        
        if (activeSection) {
            const sectionId = activeSection.getAttribute('id');
            const correspondingLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);
            if (correspondingLink) {
                correspondingLink.classList.add('active');
            }
        } else if (scrollPosition < 100) {
            const homeLink = document.querySelector('.nav-links a[href="#home"]');
            if (homeLink) {
                homeLink.classList.add('active');
            }
        }
    }

    // Update active section on scroll
    window.addEventListener('scroll', () => {
        requestAnimationFrame(updateActiveSection);
    });

    // Update active section on page load
    updateActiveSection();

    // Smooth scroll to section when clicking nav links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const targetPosition = targetSection.offsetTop - navHeight + 2;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}); 