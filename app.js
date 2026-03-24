/* ========================================
   Etern'Pictures - Application JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', function () {

    // ---- Navigation scroll effect ----
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ---- Mobile menu toggle ----
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (navToggle) {
        navToggle.addEventListener('click', function () {
            navLinks.classList.toggle('active');
        });

        // Close menu on link click
        navLinks.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                navLinks.classList.remove('active');
            });
        });
    }

    // ---- Portfolio filter ----
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
            filterButtons.forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');

            var filter = btn.getAttribute('data-filter');

            portfolioItems.forEach(function (item) {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });

    // ---- Lightbox ----
    var lightbox = document.getElementById('lightbox');
    var lightboxClose = document.querySelector('.lightbox-close');

    portfolioItems.forEach(function (item) {
        item.addEventListener('click', function () {
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    if (lightboxClose) {
        lightboxClose.addEventListener('click', function () {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    if (lightbox) {
        lightbox.addEventListener('click', function (e) {
            if (e.target === lightbox) {
                lightbox.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // Close lightbox on Escape
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // ---- Counter animation ----
    var statNumbers = document.querySelectorAll('.stat-number');
    var statsAnimated = false;

    function animateCounters() {
        statNumbers.forEach(function (stat) {
            var target = parseInt(stat.getAttribute('data-target'), 10);
            var duration = 2000;
            var start = 0;
            var startTime = null;

            function step(timestamp) {
                if (!startTime) startTime = timestamp;
                var progress = Math.min((timestamp - startTime) / duration, 1);
                var eased = 1 - Math.pow(1 - progress, 3);
                stat.textContent = Math.floor(eased * target);
                if (progress < 1) {
                    requestAnimationFrame(step);
                } else {
                    stat.textContent = target;
                }
            }

            requestAnimationFrame(step);
        });
    }

    // ---- Scroll animations ----
    var fadeElements = document.querySelectorAll(
        '.service-card, .testimonial-card, .portfolio-item, .about-text, .about-image, .contact-info, .contact-form'
    );

    fadeElements.forEach(function (el) {
        el.classList.add('fade-in');
    });

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    fadeElements.forEach(function (el) {
        observer.observe(el);
    });

    // Stats counter observer
    var statsSection = document.querySelector('.about-stats');
    if (statsSection) {
        var statsObserver = new IntersectionObserver(function (entries) {
            if (entries[0].isIntersecting && !statsAnimated) {
                statsAnimated = true;
                animateCounters();
                statsObserver.unobserve(statsSection);
            }
        }, { threshold: 0.5 });

        statsObserver.observe(statsSection);
    }

    // ---- Contact form ----
    var contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            var formData = new FormData(contactForm);
            var data = {};
            formData.forEach(function (value, key) {
                data[key] = value;
            });

            // Validate required fields
            if (!data.nom || !data.prenom || !data.email || !data.message) {
                showNotification('Veuillez remplir tous les champs obligatoires.', 'error');
                return;
            }

            // Email validation
            var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                showNotification('Veuillez saisir une adresse email valide.', 'error');
                return;
            }

            // Simulate form submission
            var submitBtn = contactForm.querySelector('button[type="submit"]');
            submitBtn.textContent = 'Envoi en cours...';
            submitBtn.disabled = true;

            setTimeout(function () {
                showNotification('Merci ! Votre message a bien ete envoye. Nous vous repondrons dans les plus brefs delais.', 'success');
                contactForm.reset();
                submitBtn.textContent = 'Envoyer ma demande';
                submitBtn.disabled = false;
            }, 1500);
        });
    }

    // ---- Notification ----
    function showNotification(message, type) {
        var existing = document.querySelector('.notification');
        if (existing) existing.remove();

        var notification = document.createElement('div');
        notification.className = 'notification notification-' + type;
        notification.textContent = message;

        // Styles
        notification.style.cssText =
            'position:fixed;bottom:2rem;right:2rem;padding:1rem 1.5rem;border-radius:8px;' +
            'font-family:var(--font-body);font-size:0.95rem;z-index:3000;max-width:400px;' +
            'animation:fadeInUp 0.4s ease;box-shadow:0 4px 20px rgba(0,0,0,0.2);';

        if (type === 'success') {
            notification.style.background = '#2d7a4f';
            notification.style.color = 'white';
        } else {
            notification.style.background = '#c0392b';
            notification.style.color = 'white';
        }

        document.body.appendChild(notification);

        setTimeout(function () {
            if (notification.parentNode) {
                notification.style.opacity = '0';
                notification.style.transform = 'translateY(10px)';
                notification.style.transition = 'all 0.3s ease';
                setTimeout(function () { notification.remove(); }, 300);
            }
        }, 4000);
    }

    // ---- Smooth scroll for anchor links ----
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;
            var target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                var offset = navbar.offsetHeight;
                var position = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top: position, behavior: 'smooth' });
            }
        });
    });

});
