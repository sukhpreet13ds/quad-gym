/**
 * Quad Gym - Interactive Scripts
 * Handles mobile hamburger toggle, bottom drawer menu panel,
 * and keyboard accessibility.
 */

document.addEventListener('DOMContentLoaded', () => {
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobilePanel = document.getElementById('mobile-menu-panel');
    const mobileBackdrop = document.getElementById('mobile-menu-backdrop');
    const mobileCloseBtn = document.getElementById('mobile-close-btn');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link, .btn-mobile-cta');

    if (!hamburgerBtn || !mobilePanel || !mobileBackdrop) {
        return;
    }

    // Open mobile menu panel
    const openMenu = () => {
        hamburgerBtn.classList.add('is-active');
        hamburgerBtn.setAttribute('aria-expanded', 'true');
        mobilePanel.classList.add('is-open');
        mobileBackdrop.classList.add('is-active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    };

    // Close mobile menu panel
    const closeMenu = () => {
        hamburgerBtn.classList.remove('is-active');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        mobilePanel.classList.remove('is-open');
        mobileBackdrop.classList.remove('is-active');
        document.body.style.overflow = ''; // Restore background scrolling
    };

    // Toggle menu state on hamburger click
    hamburgerBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = mobilePanel.classList.contains('is-open');
        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // Close on close button click
    if (mobileCloseBtn) {
        mobileCloseBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeMenu();
        });
    }

    // Close on backdrop click
    mobileBackdrop.addEventListener('click', () => {
        closeMenu();
    });

    // Close on navigation link click
    mobileNavLinks.forEach((link) => {
        link.addEventListener('click', () => {
            closeMenu();
        });
    });

    // Close on Escape key press
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobilePanel.classList.contains('is-open')) {
            closeMenu();
        }
    });

    // Prevent click inside mobile panel from bubbling to backdrop
    mobilePanel.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // ================= TESTIMONIAL VIDEO POPOUT MODAL =================
    const videoModal = document.getElementById('video-modal-backdrop');
    const modalPlayer = document.getElementById('modal-video-player');
    const modalCloseBtn = document.getElementById('video-modal-close');
    const testimonialCards = document.querySelectorAll('.testimonial-card');

    const openVideoModal = (src) => {
        if (!videoModal || !modalPlayer || !src) return;
        modalPlayer.src = src;
        videoModal.classList.add('is-active');
        videoModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        modalPlayer.play().catch(() => {});
    };

    const closeVideoModal = () => {
        if (!videoModal || !modalPlayer) return;
        modalPlayer.pause();
        modalPlayer.currentTime = 0;
        modalPlayer.src = '';
        videoModal.classList.remove('is-active');
        videoModal.setAttribute('aria-hidden', 'true');
        // Restore scrolling only if mobile menu is not open
        if (!mobilePanel.classList.contains('is-open')) {
            document.body.style.overflow = '';
        }
    };

    testimonialCards.forEach((card) => {
        card.addEventListener('click', (e) => {
            e.preventDefault();
            const videoSrc = card.getAttribute('data-video-src');
            if (videoSrc) {
                openVideoModal(videoSrc);
            }
        });
    });

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeVideoModal();
        });
    }

    if (videoModal) {
        videoModal.addEventListener('click', (e) => {
            if (e.target === videoModal) {
                closeVideoModal();
            }
        });
    }

    // Close video modal on Escape key press
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && videoModal && videoModal.classList.contains('is-active')) {
            closeVideoModal();
        }
    });

    // ================= FAQ ACCORDION =================
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach((item) => {
        const questionBtn = item.querySelector('.faq-question');
        if (!questionBtn) return;

        questionBtn.addEventListener('click', () => {
            const isOpen = item.classList.contains('is-open');

            // Close other items
            faqItems.forEach((other) => {
                if (other !== item) {
                    other.classList.remove('is-open');
                    other.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
                }
            });

            if (isOpen) {
                item.classList.remove('is-open');
                questionBtn.setAttribute('aria-expanded', 'false');
            } else {
                item.classList.add('is-open');
                questionBtn.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // ================= SCROLL-TRIGGERED ANIMATIONS =================
    const animatedElements = document.querySelectorAll('.animate__animated');

    if ('IntersectionObserver' in window && animatedElements.length > 0) {
        animatedElements.forEach((el) => {
            const animClasses = Array.from(el.classList).filter(
                (c) => c.startsWith('animate__') && c !== 'animate__animated'
            );

            if (animClasses.length > 0) {
                el.dataset.animClasses = animClasses.join(' ');

                // If element is already in the viewport on initial page load (e.g., hero), allow it to play
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    return;
                }

                // Below fold: hide until scrolled into view
                animClasses.forEach((c) => el.classList.remove(c));
                el.style.opacity = '0';
                el.style.visibility = 'hidden';
            }
        });

        const scrollObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const savedClasses = el.dataset.animClasses;
                    if (savedClasses) {
                        el.style.opacity = '';
                        el.style.visibility = '';
                        savedClasses.split(' ').forEach((c) => {
                            if (c) el.classList.add(c);
                        });
                    }
                    observer.unobserve(el);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -40px 0px'
        });

        animatedElements.forEach((el) => {
            if (el.dataset.animClasses) {
                const rect = el.getBoundingClientRect();
                if (rect.top >= window.innerHeight || rect.bottom <= 0) {
                    scrollObserver.observe(el);
                }
            }
        });
    }
});
