// ===== PRODUCT GALLERY JAVASCRIPT =====
// This file contains all interactive functionality including:
// - Theme toggle system
// - Product modal functionality
// - Card animations and effects
// - Product data management

// ===== PRODUCT DATA =====
// Product information for modal display - each product has unique image
const products = {
  1: {
    title: "Aurora Smartwatch",
    price: "$129",
    desc: "Thin, stylish smartwatch with health tracking and long battery life. Features include heart rate monitoring, sleep tracking, GPS, and water resistance up to 50m.",
    image: "https://hifuturegroup.com/cdn/shop/files/AURORA_Green.webp?v=1745319850"
  },
  2: {
    title: "Nimbus Wireless Headphones",
    price: "$199",
    desc: "Noise-cancelling, breathable ear cushions and crisp audio. Features include 30-hour battery life, quick charge, and premium sound quality with deep bass.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&s=2f"
  },
  3: {
    title: "Transit Explorer Backpack",
    price: "$89",
    desc: "Water-resistant, anti-theft pockets and a sleek commuter design. Made from durable materials with laptop compartment and multiple storage pockets.",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&s=3a"
  },
  4: {
    title: "Nexus Pro Smartphone",
    price: "$899",
    desc: "Latest flagship with 5G, AI camera system and all-day battery. Features include 6.7\" OLED display, 256GB storage, and advanced security features.",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&s=4a"
  },
  5: {
    title: "Quantum Ultra Laptop",
    price: "$1,299",
    desc: "Powerful performance with stunning 4K display and fast SSD. Features include Intel i7 processor, 16GB RAM, and dedicated graphics card.",
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&s=5a"
  },
  6: {
    title: "Solar Shield Sunglasses",
    price: "$159",
    desc: "Polarized lenses with UV protection and lightweight titanium frame. Features include scratch-resistant coating and comfortable nose pads.",
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&s=6a"
  },
  7: {
    title: "Chronos Classic Watch",
    price: "$299",
    desc: "Elegant timepiece with Swiss movement and premium leather strap. Features include date display, water resistance, and sapphire crystal glass.",
    image: "https://www.brosway.com/imgproxy/insecure/resize:fit:600:600/plain/local:////media/catalog/product/W/V/WVO27_29.jpg@jpg"
  },
  8: {
    title: "Echo Air Earbuds",
    price: "$149",
    desc: "True wireless with active noise cancellation and 24-hour battery. Features include touch controls, voice assistant, and premium audio drivers.",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&s=8a"
  },
  9: {
    title: "Vitality Fitness Band",
    price: "$79",
    desc: "Track your health metrics with heart rate and sleep monitoring. Features include step counting, calorie tracking, and smartphone notifications.",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&s=9a"
  }
};

// ===== THEME TOGGLE SYSTEM =====
// Theme switching functionality with localStorage persistence
(function(){
  const themeBtn = document.getElementById('themeBtn');
  const body = document.body;
  
  // Check for saved theme preference or default to system preference
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Apply theme based on saved preference or system preference
  if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
    body.classList.add('dark');
    themeBtn.setAttribute('aria-pressed', 'true');
  }
  
  // Theme toggle click handler
  themeBtn.addEventListener('click', () => {
    body.classList.toggle('dark');
    const isDark = body.classList.contains('dark');
    
    // Update button state and save preference
    themeBtn.setAttribute('aria-pressed', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });
})();

// ===== CARD ANIMATION SYSTEM =====
// Intersection Observer for performance-optimized fade-in animations
(function(){
  const cards = document.querySelectorAll('.card');
  
  // Create intersection observer for animation triggers
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // Stop observing after animation
      }
    });
  }, {
    threshold: 0.1, // Trigger when 10% of card is visible
    rootMargin: '0px 0px -50px 0px' // Trigger slightly before card enters viewport
  });
  
  // Observe all cards for animation
  cards.forEach(card => observer.observe(card));
  
  // Fallback animation for older browsers
  setTimeout(() => {
    cards.forEach((card, i) => {
      if (!card.classList.contains('is-visible')) {
        card.style.animationDelay = `${100*i}ms`;
        card.classList.add('is-visible');
      }
    });
  }, 1000);
})();

// ===== PRODUCT MODAL SYSTEM =====
// Product detail modal functionality with dynamic content loading
(function(){
  const modal = document.getElementById('productModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalPrice = document.getElementById('modalPrice');
  const modalDesc = document.getElementById('modalDesc');
  const modalImage = document.getElementById('modalImage');
  const modalBtn = document.getElementById('modalBtn');
  const modalClose = document.getElementById('modalClose');
  const cards = document.querySelectorAll('.card');

  // ===== MODAL OPEN FUNCTIONALITY =====
  // Open modal when product card is clicked (excluding button clicks)
  cards.forEach(card => {
    card.addEventListener('click', (e) => {
      // Prevent modal opening when clicking on "Buy now" button
      if (e.target.classList.contains('btn')) return;
      
      // Get product data based on card's data-product attribute
      const productId = card.getAttribute('data-product');
      const product = products[productId];
      
      if (product) {
        // Populate modal with product information
        modalTitle.textContent = product.title;
        modalPrice.textContent = product.price;
        modalDesc.textContent = product.desc;
        modalImage.src = product.image;
        modalImage.alt = product.title;
        modalBtn.textContent = `Add ${product.title} to Cart`;
        
        // Show modal with smooth animation
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
      }
    });
  });

  // ===== MODAL CLOSE FUNCTIONALITY =====
  // Centralized function to close modal
  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
  };

  // Close modal when close button is clicked
  modalClose.addEventListener('click', closeModal);

  // Close modal when clicking outside the modal content
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Close modal when Escape key is pressed
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // ===== ADD TO CART FUNCTIONALITY =====
  // Simulate adding product to cart with visual feedback
  modalBtn.addEventListener('click', () => {
    const title = modalTitle.textContent;
    const price = modalPrice.textContent;
    
    // Visual feedback: change button text and style
    modalBtn.textContent = 'Added to Cart!';
    modalBtn.style.background = 'linear-gradient(90deg,#10b981,#059669)';
    
    // Reset button after 2 seconds
    setTimeout(() => {
      modalBtn.textContent = `Add ${title} to Cart`;
      modalBtn.style.background = 'linear-gradient(90deg,var(--accent),#8b5cf6)';
    }, 2000);
    
    // Log action to console (replace with actual cart functionality)
    console.log(`Added ${title} (${price}) to cart`);
  });
})();

// ===== ENHANCED CARD INTERACTIONS =====
// Ripple effect and additional animations for better user experience
(function(){
  const cards = document.querySelectorAll('.card');
  
  // Add ripple effect on card clicks (excluding button clicks)
  cards.forEach(card => {
    card.addEventListener('click', (e) => {
      // Skip ripple effect for button clicks
      if (e.target.classList.contains('btn')) return;
      
      // Create ripple element
      const ripple = document.createElement('div');
      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(59, 130, 246, 0.3);
        transform: scale(0);
        animation: ripple 600ms linear;
        pointer-events: none;
        width: 100px;
        height: 100px;
        left: ${e.clientX - card.offsetLeft - 50}px;
        top: ${e.clientY - card.offsetTop - 50}px;
      `;
      
      // Add ripple to card
      card.appendChild(ripple);
      
      // Remove ripple element after animation
      setTimeout(() => ripple.remove(), 600);
    });
  });
  
  // Add ripple animation CSS dynamically
  if (!document.querySelector('#ripple-styles')) {
    const style = document.createElement('style');
    style.id = 'ripple-styles';
    style.textContent = `
      @keyframes ripple {
        to {
          transform: scale(4);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
})();
