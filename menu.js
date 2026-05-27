const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
const overlay = document.querySelector('.menu-overlay');

function toggleMenu() {
    mobileMenu.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    }

if (hamburger) {
        hamburger.addEventListener('click', toggleMenu);
    }

if (overlay) {
        overlay.addEventListener('click', toggleMenu);
}

const menuClose = document.querySelector('.menu-close');

if (menuClose) {
    menuClose.addEventListener('click', toggleMenu);
}

document.querySelectorAll('.mobile-nav a').forEach(link => {
link.addEventListener('click', toggleMenu);});