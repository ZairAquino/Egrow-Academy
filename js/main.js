/**
 * @fileoverview Funcionalidades principales de eGrow Academy
 * @author eGrow Academy Team
 * @version 1.0.0
 * @description Maneja la navegación, sidebar, animaciones y formularios del sitio web
 */

/**
 * @function initializeApp
 * @description Inicializa todas las funcionalidades de la aplicación cuando el DOM está listo
 * @listens DOMContentLoaded
 */
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const sidebarClose = document.getElementById('sidebarClose');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    
    // Debug logging
    console.log('Menu Toggle Element:', menuToggle);
    console.log('Sidebar Element:', sidebar);
    console.log('Sidebar Overlay Element:', sidebarOverlay);
    
    // Open/close sidebar with animation
    if (menuToggle && sidebar) {
        const mainContent = document.querySelector('.main-content');
        const header = document.querySelector('.header');
        
        menuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            sidebar.classList.toggle('open');
            
            // Toggle classes for main content and header
            if (mainContent) {
                mainContent.classList.toggle('sidebar-open');
            }
            if (header) {
                header.classList.toggle('sidebar-open');
            }
            
            // Toggle button position
            this.classList.toggle('sidebar-open');
            
            // Only show overlay and block scroll on mobile
            if (window.innerWidth < 768) {
                if (sidebarOverlay) {
                    sidebarOverlay.classList.toggle('show');
                }
                document.body.style.overflow = sidebar.classList.contains('open') ? 'hidden' : '';
            }
            
            // Add animation class to sidebar with optimized performance
            sidebar.classList.add('sidebar-animating');
            requestAnimationFrame(() => {
                setTimeout(() => {
                    sidebar.classList.remove('sidebar-animating');
                }, 300);
            });
        });
    }
    
    // Close sidebar with animation
    function closeSidebar() {
        const mainContent = document.querySelector('.main-content');
        const header = document.querySelector('.header');
        
        if (menuToggle) {
            menuToggle.classList.remove('active');
            menuToggle.classList.remove('sidebar-open');
        }
        
        sidebar.classList.remove('open');
        
        // Remove classes from main content and header
        if (mainContent) {
            mainContent.classList.remove('sidebar-open');
        }
        if (header) {
            header.classList.remove('sidebar-open');
        }
        
        if (sidebarOverlay) {
            sidebarOverlay.classList.remove('show');
        }
        
        // Force restore scroll immediately
        document.body.style.overflow = 'auto';
        setTimeout(() => {
            document.body.style.overflow = '';
        }, 50);
        
        // Add animation class to sidebar with optimized performance
        sidebar.classList.add('sidebar-animating');
        requestAnimationFrame(() => {
            setTimeout(() => {
                sidebar.classList.remove('sidebar-animating');
            }, 300);
        });
    }
    
    if (sidebarClose) {
        sidebarClose.addEventListener('click', closeSidebar);
    }
    
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', closeSidebar);
    }
    
    // Dropdown functionality in sidebar
    const dropdownItems = document.querySelectorAll('.dropdown-sidebar');
    dropdownItems.forEach(item => {
        const link = item.querySelector('.menu-link');
        if (link) {
            link.addEventListener('click', function(e) {
                if (this.parentElement.classList.contains('dropdown-sidebar')) {
                    e.preventDefault();
                    item.classList.toggle('active');
                }
            });
        }
    });
    
    // Close sidebar when clicking on regular links
    const sidebarLinks = sidebar.querySelectorAll('.menu-link:not(.dropdown-sidebar .menu-link), .submenu-link');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (!this.parentElement.classList.contains('dropdown-sidebar')) {
                closeSidebar();
            }
        });
    });
    
    // Handle responsive behavior
    function handleResize() {
        if (window.innerWidth >= 768) {
            // Force restore scroll on desktop
            document.body.style.overflow = 'auto';
            setTimeout(() => {
                document.body.style.overflow = '';
            }, 50);
            if (sidebarOverlay) {
                sidebarOverlay.classList.remove('show');
            }
            // Don't auto-close sidebar on desktop resize
        }
    }
    
    // Add touch event support for better mobile experience
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;
    
    // Handle swipe to open/close sidebar
    document.addEventListener('touchstart', function(e) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    });
    
    document.addEventListener('touchmove', function(e) {
        // Prevent scrolling when sidebar is open
        if (sidebar.classList.contains('open')) {
            e.preventDefault();
        }
    }, { passive: false });
    
    document.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].clientX;
        touchEndY = e.changedTouches[0].clientY;
        
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        
        // Only handle horizontal swipes
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
            // Swipe right from left edge to open sidebar
            if (deltaX > 0 && touchStartX < 50 && window.innerWidth < 768) {
                if (!sidebar.classList.contains('open')) {
                    const mainContent = document.querySelector('.main-content');
                    const header = document.querySelector('.header');
                    
                    if (menuToggle) {
                        menuToggle.classList.add('active');
                        menuToggle.classList.add('sidebar-open');
                    }
                    sidebar.classList.add('open');
                    
                    if (mainContent) {
                        mainContent.classList.add('sidebar-open');
                    }
                    if (header) {
                        header.classList.add('sidebar-open');
                    }
                    
                    if (sidebarOverlay) {
                        sidebarOverlay.classList.add('show');
                    }
                    document.body.style.overflow = 'hidden';
                }
            }
            // Swipe left to close sidebar
            else if (deltaX < 0 && sidebar.classList.contains('open')) {
                closeSidebar();
            }
        }
    });
    
    window.addEventListener('resize', handleResize);
    
    // Escape key to close sidebar
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && sidebar.classList.contains('open')) {
            closeSidebar();
        }
    });
    
    // Sidebar remains visible at all times - scroll effect removed
    
    // Add hover effects to menu items (desktop only)
    const menuLinks = document.querySelectorAll('.menu-link');
    menuLinks.forEach(link => {
        // Only add hover effects on non-touch devices
        if (!('ontouchstart' in window)) {
            link.addEventListener('mouseenter', function() {
                const icon = this.querySelector('.menu-icon');
                if (icon) {
                    icon.style.transform = 'scale(1.1) rotate(5deg)';
                }
            });
            
            link.addEventListener('mouseleave', function() {
                const icon = this.querySelector('.menu-icon');
                if (icon) {
                    icon.style.transform = 'scale(1) rotate(0deg)';
                }
            });
        }
    });
    
    // Newsletter form submission
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            alert(`¡Gracias por suscribirte! Te enviaremos las últimas noticias de IA a ${email}`);
            this.reset();
        });
    }
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Add animation on scroll
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-slide-down');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    const animateElements = document.querySelectorAll('.course-card, .feature-item, .cta-card');
    animateElements.forEach(el => {
        observer.observe(el);
    });
});