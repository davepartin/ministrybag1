// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('nav-active');
        hamburger.classList.toggle('active');

        // Prevent body scroll when menu is open
        if (navLinks.classList.contains('nav-active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });

    // Mobile Dropdown Toggle
    const dropdowns = document.querySelectorAll('.dropdown');

    dropdowns.forEach(dropdown => {
        const btn = dropdown.querySelector('.dropbtn');
        if (btn) {
            btn.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    dropdown.classList.toggle('active');
                }
            });
        }
    });

    // Close menu when clicking on a link
    const navItems = navLinks.querySelectorAll('a:not(.dropbtn)');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navLinks.classList.remove('nav-active');
            hamburger.classList.remove('active');
            document.body.style.overflow = '';

            // Close all dropdowns
            dropdowns.forEach(d => d.classList.remove('active'));
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
            navLinks.classList.remove('nav-active');
            hamburger.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href !== '') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Add scroll effect to navigation
let lastScroll = 0;
const nav = document.querySelector('.main-nav');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        nav.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.1)';
    } else {
        nav.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
    }

    lastScroll = currentScroll;
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.visit-card, .rhythm-card, .story-content');

    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Hero Carousel Functionality
document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.carousel-track');
    // Guard clause if carousel doesn't exist
    if (!track) return;

    const slides = Array.from(track.children);
    const nextButton = document.querySelector('.next-btn');
    const prevButton = document.querySelector('.prev-btn');
    const dotsNav = document.querySelector('.carousel-dots');

    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.ariaLabel = `Slide ${index + 1}`;
        dotsNav.appendChild(dot);
    });

    const dots = Array.from(dotsNav.children);
    let currentSlideIndex = 0;
    let autoPlayInterval;

    const updateSlidePosition = (index) => {
        track.style.transform = `translateX(-${index * 100}%)`;

        // Update dots
        dots.forEach(dot => dot.classList.remove('active'));
        dots[index].classList.add('active');

        currentSlideIndex = index;
    };

    const nextSlide = () => {
        let newIndex = currentSlideIndex + 1;
        if (newIndex >= slides.length) {
            newIndex = 0;
        }
        updateSlidePosition(newIndex);
    };

    const prevSlide = () => {
        let newIndex = currentSlideIndex - 1;
        if (newIndex < 0) {
            newIndex = slides.length - 1;
        }
        updateSlidePosition(newIndex);
    };

    // Event Listeners
    nextButton.addEventListener('click', () => {
        nextSlide();
        resetAutoPlay();
    });

    prevButton.addEventListener('click', () => {
        prevSlide();
        resetAutoPlay();
    });

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            updateSlidePosition(index);
            resetAutoPlay();
        });
    });

    // Auto Play
    const startAutoPlay = () => {
        clearInterval(autoPlayInterval); // Clear any existing interval first
        autoPlayInterval = setInterval(nextSlide, 3000);
    };

    const resetAutoPlay = () => {
        clearInterval(autoPlayInterval);
        startAutoPlay();
    };

    // Start
    startAutoPlay();

    // Pause on hover
    const container = document.querySelector('.carousel-container');
    container.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
    container.addEventListener('mouseleave', startAutoPlay);

    // Touch swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    const SWIPE_THRESHOLD = 50; // minimum px to count as a swipe

    container.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    container.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) >= SWIPE_THRESHOLD) {
            if (diff > 0) {
                nextSlide(); // swiped left → go forward
            } else {
                prevSlide(); // swiped right → go back
            }
            resetAutoPlay();
        }
    }, { passive: true });
});
