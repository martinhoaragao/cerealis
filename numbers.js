// Animate numbers when they come into view
function animateNumbers() {
    const stats = document.querySelectorAll('.stat strong');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalNumber = parseInt(target.textContent.replace(/,/g, ''));
                
                // Add the animated class to trigger the fade-in animation
                target.classList.add('animated');
                
                // Animate the number counting up
                let startNumber = 0;
                const duration = 2000; // 2 seconds
                const steps = 60;
                const increment = finalNumber / steps;
                const stepDuration = duration / steps;
                
                const counter = setInterval(() => {
                    startNumber += increment;
                    if (startNumber >= finalNumber) {
                        target.textContent = finalNumber.toLocaleString();
                        clearInterval(counter);
                    } else {
                        target.textContent = Math.floor(startNumber).toLocaleString();
                    }
                }, stepDuration);
                
                // Unobserve after animation starts
                observer.unobserve(target);
            }
        });
    }, {
        threshold: 0.5
    });
    
    stats.forEach(stat => observer.observe(stat));
}

// Run animation when the page loads
document.addEventListener('DOMContentLoaded', animateNumbers); 