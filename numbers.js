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
            if (entry.isIntersecting && 
                document.readyState === 'complete' && 
                !animatedElements.has(target)) {
                
                animatedElements.add(target); // Mark this specific element as animated
                const finalNumber = parseInt(target.textContent.replace(/,/g, ''));
                
                // Add the animated class to trigger the fade-in animation
                target.classList.add('animated');
                
                // Use requestAnimationFrame for smoother animation
                const startTime = performance.now();
                const duration = 1500; // Reduced from 2000ms to 1500ms for better UX
                
                function updateNumber(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    
                    // Use easeOutQuad for smoother animation
                    const easeProgress = 1 - (1 - progress) * (1 - progress);
                    const currentNumber = Math.floor(finalNumber * easeProgress);
                    
                    target.textContent = currentNumber.toLocaleString();
                    
                    if (progress < 1) {
                        requestAnimationFrame(updateNumber);
                    }
                }
                
                requestAnimationFrame(updateNumber);
                
                // Only unobserve this specific element after its animation starts
                observer.unobserve(target);
            }
        });
    }, {
        threshold: 0.5,
        rootMargin: '0px'
    });
    
    // Start observing each stat individually
    stats.forEach(stat => observer.observe(stat));
}

// Initialize the animation observer when the DOM is ready
document.addEventListener('DOMContentLoaded', animateNumbers); 