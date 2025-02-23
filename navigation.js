document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section, header.banner');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    // Add padding to account for fixed navbar
    const navHeight = document.querySelector('.navbar').offsetHeight;
    const sectionMargin = 100; // Additional margin for earlier activation

    function updateActiveSection() {
        const scrollPosition = window.scrollY;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - navHeight - sectionMargin;
            const sectionBottom = sectionTop + section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                // Remove active class from all links
                navLinks.forEach(link => link.classList.remove('active'));
                
                // Add active class to corresponding link
                const correspondingLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);
                if (correspondingLink) {
                    correspondingLink.classList.add('active');
                }
            }
        });

        // Special case for top of page
        if (scrollPosition < 100) {
            navLinks.forEach(link => link.classList.remove('active'));
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