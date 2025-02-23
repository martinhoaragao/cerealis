// Animate numbers when they come into view
function animateNumbers() {
    const stats = document.querySelectorAll('.stat strong');
    const animatedElements = new WeakSet(); // Track which elements have been animated
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const target = entry.target;
            
            // Only animate if:
            // 1. The element is intersecting
            // 2. The page is fully loaded
            // 3. This specific element hasn't been animated
            // 4. The user has actually scrolled (not an automatic scroll)
            if (entry.isIntersecting && 
                document.readyState === 'complete' && 
                !animatedElements.has(target) && 
                window.pageYOffset > 50) { // More reliable scroll check
                
                animatedElements.add(target); // Mark this specific element as animated
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
                
                // Only unobserve this specific element after its animation starts
                observer.unobserve(target);
            }
        });
    }, {
        threshold: 0.5,
        rootMargin: '-50px' // Slightly delay the trigger until more of the element is visible
    });
    
    // Start observing each stat individually
    stats.forEach(stat => observer.observe(stat));
}

// Initialize the animation observer when the DOM is ready
document.addEventListener('DOMContentLoaded', animateNumbers); 