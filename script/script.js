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
});
