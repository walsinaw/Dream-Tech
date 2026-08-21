const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
const overlay = document.querySelector('.menu-overlay');
const menuClose = document.querySelector('.menu-close');

function toggleMenu() {
    mobileMenu.classList.toggle('active');
    overlay.classList.toggle('active');

    if (hamburger) {
        hamburger.classList.toggle('active');
    }

    document.body.style.overflow =
        mobileMenu.classList.contains('active') ? 'hidden' : '';
}

if (hamburger) {
    hamburger.addEventListener('click', toggleMenu);
}

if (overlay) {
    overlay.addEventListener('click', toggleMenu);
}

if (menuClose) {
    menuClose.addEventListener('click', toggleMenu);
}

const mobileDropdown = document.querySelector('.mobile-dropdown');
const mobileDropdownToggle = document.querySelector('.mobile-dropdown-toggle');
if (mobileDropdownToggle && mobileDropdown) {
    mobileDropdownToggle.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        mobileDropdown.classList.toggle('active');
    });
}

document.querySelectorAll('.mobile-nav a').forEach(link => {
    link.addEventListener('click', function () {
        if (mobileMenu && mobileMenu.classList.contains('active')) {
            toggleMenu();
        }
    });
});