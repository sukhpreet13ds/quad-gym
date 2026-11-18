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

    // ================= TESTIMONIAL & GALLERY VIDEO POPOUT MODAL =================
    const videoModal = document.getElementById('video-modal-backdrop');
    const modalPlayer = document.getElementById('modal-video-player');
    const modalCloseBtn = document.getElementById('video-modal-close');
    const videoTriggers = document.querySelectorAll('.testimonial-card, .gallery-video-item, [data-video-src]');

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

    videoTriggers.forEach((card) => {
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

    // ================= GALLERY IMAGE LIGHTBOX =================
    const imageLightbox = document.getElementById('image-lightbox-backdrop');
    const lightboxImg = document.getElementById('lightbox-main-img');
    const lightboxCounter = document.getElementById('lightbox-counter');
    const lightboxCloseBtn = document.getElementById('lightbox-close-btn');
    const lightboxPrevBtn = document.getElementById('lightbox-prev-btn');
    const lightboxNextBtn = document.getElementById('lightbox-next-btn');
    const galleryImageCards = Array.from(document.querySelectorAll('.gallery-image-item'));

    let currentImageIndex = 0;

    const updateLightboxImage = (index) => {
        if (!lightboxImg || galleryImageCards.length === 0) return;
        currentImageIndex = (index + galleryImageCards.length) % galleryImageCards.length;
        const targetCard = galleryImageCards[currentImageIndex];
        const src = targetCard.getAttribute('data-image-src');
        if (src) {
            lightboxImg.style.opacity = '0';
            setTimeout(() => {
                lightboxImg.src = src;
                lightboxImg.style.opacity = '1';
            }, 120);
        }
        if (lightboxCounter) {
            lightboxCounter.textContent = `${currentImageIndex + 1} / ${galleryImageCards.length}`;
        }
    };

    const openImageLightbox = (index) => {
        if (!imageLightbox) return;
        updateLightboxImage(index);
        imageLightbox.classList.add('is-active');
        imageLightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    };

    const closeImageLightbox = () => {
        if (!imageLightbox) return;
        imageLightbox.classList.remove('is-active');
        imageLightbox.setAttribute('aria-hidden', 'true');
        if (lightboxImg) lightboxImg.src = '';
        if (!mobilePanel || !mobilePanel.classList.contains('is-open')) {
            document.body.style.overflow = '';
        }
    };

    galleryImageCards.forEach((card, idx) => {
        card.addEventListener('click', (e) => {
            e.preventDefault();
            openImageLightbox(idx);
        });
    });

    if (lightboxCloseBtn) {
        lightboxCloseBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeImageLightbox();
        });
    }

    if (lightboxPrevBtn) {
        lightboxPrevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            updateLightboxImage(currentImageIndex - 1);
        });
    }

    if (lightboxNextBtn) {
        lightboxNextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            updateLightboxImage(currentImageIndex + 1);
        });
    }

    if (imageLightbox) {
        imageLightbox.addEventListener('click', (e) => {
            if (e.target === imageLightbox) {
                closeImageLightbox();
            }
        });
    }

    // Keyboard navigation (arrows and escape)
    document.addEventListener('keydown', (e) => {
        if (imageLightbox && imageLightbox.classList.contains('is-active')) {
            if (e.key === 'ArrowLeft') {
                updateLightboxImage(currentImageIndex - 1);
            } else if (e.key === 'ArrowRight') {
                updateLightboxImage(currentImageIndex + 1);
            } else if (e.key === 'Escape') {
                closeImageLightbox();
            }
        }
    });

    // ================= GALLERY FILTER TABS =================
    const filterBtns = document.querySelectorAll('.gallery-filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            filterBtns.forEach((b) => b.classList.remove('is-active'));
            btn.classList.add('is-active');
            const filter = btn.getAttribute('data-filter');

            galleryItems.forEach((item) => {
                const itemType = item.getAttribute('data-type');
                if (filter === 'all' || itemType === filter) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
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
    const animatedElements = Array.from(document.querySelectorAll('.animate__animated'));

    if (animatedElements.length > 0) {
        const revealElement = (el) => {
            el.style.opacity = '';
            el.style.visibility = '';
            const savedClasses = el.dataset.animClasses;
            if (savedClasses) {
                savedClasses.split(' ').forEach((c) => {
                    if (c) el.classList.add(c);
                });
            } else if (!el.classList.contains('animate__fadeInUp')) {
                el.classList.add('animate__fadeInUp');
            }
        };

        if ('IntersectionObserver' in window) {
            const windowHeight = window.innerHeight || document.documentElement.clientHeight;
            const elementsToObserve = [];

            animatedElements.forEach((el) => {
                const animClasses = Array.from(el.classList).filter(
                    (c) => c.startsWith('animate__') && c !== 'animate__animated'
                );

                if (animClasses.length > 0) {
                    el.dataset.animClasses = animClasses.join(' ');
                }

                const rect = el.getBoundingClientRect();
                // If element is already in the viewport or near it on load, show it immediately
                if (rect.top < windowHeight + 60 && rect.bottom > -60) {
                    revealElement(el);
                } else {
                    // Below or above: prepare for scroll reveal
                    animClasses.forEach((c) => el.classList.remove(c));
                    el.style.opacity = '0';
                    el.style.visibility = 'hidden';
                    elementsToObserve.push(el);
                }
            });

            // Positive bottom margin triggers 80px BEFORE entering viewport so sections are never blank
            const scrollObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const el = entry.target;
                        revealElement(el);
                        observer.unobserve(el);
                    }
                });
            }, {
                threshold: 0,
                rootMargin: '0px 0px 80px 0px'
            });

            elementsToObserve.forEach((el) => {
                scrollObserver.observe(el);
            });

            // Backup scroll listener for high-speed momentum scrolling
            let scrollCheckPending = false;
            const backupScrollCheck = () => {
                if (scrollCheckPending) return;
                scrollCheckPending = true;
                requestAnimationFrame(() => {
                    const currentH = window.innerHeight || document.documentElement.clientHeight;
                    elementsToObserve.forEach((el) => {
                        if (el.style.visibility === 'hidden') {
                            const r = el.getBoundingClientRect();
                            if (r.top <= currentH + 80 && r.bottom >= -80) {
                                revealElement(el);
                                scrollObserver.unobserve(el);
                            }
                        }
                    });
                    scrollCheckPending = false;
                });
            };

            window.addEventListener('scroll', backupScrollCheck, { passive: true });
            window.addEventListener('resize', backupScrollCheck, { passive: true });

            // Failsafe timer: guarantees no section is ever left hidden
            setTimeout(() => {
                animatedElements.forEach((el) => {
                    if (el.style.visibility === 'hidden' || el.style.opacity === '0') {
                        revealElement(el);
                    }
                });
            }, 1200);

        } else {
            // Fallback for browsers without IntersectionObserver
            animatedElements.forEach((el) => {
                revealElement(el);
            });
        }
    }

    // ================= FIXED NAVBAR SCROLL & ACTIVE STATE =================
    const siteHeader = document.querySelector('.site-header');
    const navLinks = document.querySelectorAll('.desktop-nav .nav-link');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');
    const ctaNavButtons = document.querySelectorAll('.btn-nav, .btn-mobile-cta');

    // 1. Pinned header scrolled style on scroll
    const handleHeaderScroll = () => {
        if (!siteHeader) return;
        if (window.scrollY > 20) {
            siteHeader.classList.add('is-scrolled');
        } else {
            siteHeader.classList.remove('is-scrolled');
        }
    };
    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
    handleHeaderScroll();

    // 2. Active navbar links detection based on URL
    let currentPath = window.location.pathname.split('/').pop().toLowerCase();
    if (!currentPath || currentPath === '' || currentPath === '/') {
        currentPath = 'index.html';
    }

    const setActiveLinks = (targetHref) => {
        navLinks.forEach((link) => {
            const href = (link.getAttribute('href') || '').toLowerCase();
            if (targetHref && (href === targetHref || href.endsWith('/' + targetHref))) {
                link.classList.add('is-active');
            } else {
                link.classList.remove('is-active');
            }
        });

        mobileLinks.forEach((link) => {
            const href = (link.getAttribute('href') || '').toLowerCase();
            if (targetHref && (href === targetHref || href.endsWith('/' + targetHref))) {
                link.classList.add('is-active');
            } else {
                link.classList.remove('is-active');
            }
        });

        ctaNavButtons.forEach((btn) => {
            const href = (btn.getAttribute('href') || '').toLowerCase();
            if (targetHref && (href === targetHref || href.endsWith('/' + targetHref))) {
                btn.classList.add('is-active');
            } else {
                btn.classList.remove('is-active');
            }
        });
    };

    if (currentPath !== 'index.html') {
        // Inner pages: activate current page's nav item
        setActiveLinks(currentPath);
    } else {
        // Homepage: keep nav links clean (no scrollspy)
        setActiveLinks('');
    }
});
