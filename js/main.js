// Sidebar Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const sidebarClose = document.getElementById('sidebarClose');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const mainContent = document.querySelector('.main-content');
    const header = document.querySelector('.header');
    
    let lastScrollTop = 0;
    let isScrolling = false;
    
    // Open sidebar
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            sidebar.classList.toggle('open');
            sidebarOverlay.classList.toggle('show');
            document.body.style.overflow = sidebar.classList.contains('open') ? 'hidden' : '';
        });
    }
    
    // Close sidebar
    function closeSidebar() {
        menuToggle.classList.remove('active');
        sidebar.classList.remove('open');
        sidebarOverlay.classList.remove('show');
        document.body.style.overflow = '';
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
        if (window.innerWidth >= 1200) {
            document.body.style.overflow = '';
            sidebarOverlay.classList.remove('show');
        }
    }
    
    window.addEventListener('resize', handleResize);
    
    // Escape key to close sidebar
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && sidebar.classList.contains('open')) {
            closeSidebar();
        }
    });
    
    // Hide/show sidebar on scroll
    window.addEventListener('scroll', function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop <= 0) {
            // At the top of the page - always show sidebar
            sidebar.style.transform = 'translateX(0)';
            mainContent.style.marginLeft = '300px';
            header.style.marginLeft = '300px';
            isScrolling = false;
        } else if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            if (!isScrolling) {
                sidebar.style.transform = 'translateX(-100%)';
                mainContent.style.marginLeft = '0';
                header.style.marginLeft = '0';
                isScrolling = true;
            }
        } else if (scrollTop < lastScrollTop) {
            // Scrolling up
            if (isScrolling) {
                sidebar.style.transform = 'translateX(0)';
                mainContent.style.marginLeft = '300px';
                header.style.marginLeft = '300px';
                isScrolling = false;
            }
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });
    
    // Add hover effects to menu items
    const menuLinks = document.querySelectorAll('.menu-link');
    menuLinks.forEach(link => {
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