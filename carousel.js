document.addEventListener('DOMContentLoaded', () => {
    // Show/hide scroll-to-top button based on scroll position
    window.addEventListener('scroll', () => {
        const scrollButton = document.querySelector('.scroll-to-top');
        if (window.scrollY > 500) {
            scrollButton.classList.add('visible');
        } else {
            scrollButton.classList.remove('visible');
        }
    });

    // Generate placeholder images for cereals
    function generatePlaceholderImage(type) {
        return `/assets/images/cereals/${type.replace(/-/g, '-')}-thumb.png`;
    }

    // Handle image loading errors
    function handleImageError(img) {
        const cerealType = img.closest('[data-cereal]')?.dataset.cereal || 'cereal';
        img.src = `https://placehold.co/600x600/e9e9e9/006837?text=${cerealType.replace(/-/g, ' ')}`;
    }

    // Initialize images and add error handlers
    document.querySelectorAll('.cereal-thumbnail, #selected-cereal-image').forEach(img => {
        img.onerror = () => handleImageError(img);
        if (!img.src || img.src.includes('placehold.co')) {
            const cerealType = img.closest('[data-cereal]')?.dataset.cereal || 'star-shaped';
            img.src = generatePlaceholderImage(cerealType);
        }
    });

    const typeTabs = document.querySelectorAll('.type-tab');
    const cerealLists = document.querySelectorAll('.cereal-list');
    const cerealItems = document.querySelectorAll('.cereal-item');
    const selectedImage = document.getElementById('selected-cereal-image');
    const selectedName = document.getElementById('selected-cereal-name');
    const selectedDescription = document.getElementById('selected-cereal-description');
    const prevBtn = document.querySelector('.nav-btn.prev');
    const nextBtn = document.querySelector('.nav-btn.next');

    // Cereal descriptions
    const cerealDescriptions = {
        "star-shaped": "Colorful star-shaped cereals perfect for children's breakfast. Made with whole grains and enriched with vitamins and minerals.",
        "cookie": "Cookie-inspired cereals that bring the beloved taste of cookies to breakfast time, with a healthy twist.",
        "chocolate": "Rich chocolate-flavored cereals that satisfy sweet cravings while providing essential nutrients.",
        "honey": "Crunchy squares with natural honey sweetness, perfect for a wholesome breakfast.",
        "filled": "Delicious pillows filled with chocolate or other sweet fillings, creating an exciting breakfast experience.",
        "loops": "Fun loops and balls in various flavors, making breakfast time more enjoyable for kids.",
        "corn-flakes": "Traditional corn flakes made from premium corn, providing a classic breakfast option.",
        "bran": "Nutritious bran and wheat flakes rich in fiber and essential nutrients.",
        "rice": "Light and crispy rice and wheat flakes, perfect for a gentle start to the day.",
        "crispies": "Crispy rice cereals that maintain their crunch in milk.",
        "granola": "Premium granola and muesli blend with carefully selected ingredients and dried fruits."
    };

    // Select cereal item
    function selectCerealItem(item) {
        // Remove active class from all items
        cerealItems.forEach(i => i.classList.remove('active'));
        // Add active class to selected item
        item.classList.add('active');
        
        const cerealType = item.dataset.cereal;
        
        // For the main carousel, we'll use a placeholder until high-quality images are provided
        selectedImage.src = generatePlaceholderImage(cerealType);
        selectedImage.alt = item.querySelector('.cereal-thumbnail').alt;
        
        selectedName.textContent = item.querySelector('span').textContent;
        selectedDescription.textContent = cerealDescriptions[cerealType];

        // Ensure the item is visible in the scroll view
        item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Click handlers for cereal items
    cerealItems.forEach(item => {
        item.addEventListener('click', () => selectCerealItem(item));
    });

    // Navigation buttons
    function navigateCereal(direction) {
        const currentList = document.querySelector('.cereal-list:not(.hidden)');
        const items = Array.from(currentList.querySelectorAll('.cereal-item'));
        const currentIndex = items.findIndex(item => item.classList.contains('active'));
        let newIndex;

        if (direction === 'next') {
            newIndex = (currentIndex + 1) % items.length;
        } else {
            newIndex = (currentIndex - 1 + items.length) % items.length;
        }

        selectCerealItem(items[newIndex]);
    }

    prevBtn.addEventListener('click', () => navigateCereal('prev'));
    nextBtn.addEventListener('click', () => navigateCereal('next'));

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            navigateCereal('prev');
        } else if (e.key === 'ArrowRight') {
            navigateCereal('next');
        }
    });

    // Select the first item by default
    const firstItem = document.querySelector('.cereal-item');
    if (firstItem) {
        selectCerealItem(firstItem);
    }

    // Switch between children's and classic cereals
    typeTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const type = tab.dataset.type;
            
            // Update active tab
            typeTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Show corresponding list
            cerealLists.forEach(list => {
                if (list.id === `${type}-cereals`) {
                    list.classList.remove('hidden');
                    // Select first item in the list
                    const firstItem = list.querySelector('.cereal-item');
                    if (firstItem) {
                        selectCerealItem(firstItem);
                    }
                } else {
                    list.classList.add('hidden');
                }
            });
        });
    });
}); 