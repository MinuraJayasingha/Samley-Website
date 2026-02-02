// Dropdown Toggle Functionality
document.addEventListener('DOMContentLoaded', function() {
    const dropdownToggle = document.getElementById('dropdown-toggle');
    const dropdownMenu = document.getElementById('products-dropdown');
    const navDropdownToggle = document.getElementById('nav-dropdown-toggle');

    // Toggle dropdown on arrow/button click
    if (dropdownToggle) {
        dropdownToggle.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove 'hidden' class and add 'show' class (or toggle)
            if (dropdownMenu.classList.contains('hidden')) {
                dropdownMenu.classList.remove('hidden');
                dropdownMenu.classList.add('show');
                dropdownToggle.classList.add('open');
            } else {
                dropdownMenu.classList.add('hidden');
                dropdownMenu.classList.remove('show');
                dropdownToggle.classList.remove('open');
            }
        });
    }

    // Toggle dropdown when clicking on the nav item text too
    if (navDropdownToggle) {
        navDropdownToggle.addEventListener('click', function(e) {
            // Don't toggle if clicking the arrow button (it has its own listener)
            if (!e.target.closest('.dropdown-toggle')) {
                if (dropdownMenu.classList.contains('hidden')) {
                    dropdownMenu.classList.remove('hidden');
                    dropdownMenu.classList.add('show');
                    dropdownToggle.classList.add('open');
                } else {
                    dropdownMenu.classList.add('hidden');
                    dropdownMenu.classList.remove('show');
                    dropdownToggle.classList.remove('open');
                }
            }
        });
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.nav-has-dropdown')) {
            if (dropdownMenu && !dropdownMenu.classList.contains('hidden')) {
                dropdownMenu.classList.add('hidden');
                dropdownMenu.classList.remove('show');
                if (dropdownToggle) {
                    dropdownToggle.classList.remove('open');
                }
            }
        }
    });

    // Mobile menu toggle
    const navbarToggle = document.querySelector('.navbar-toggle');
    const navbarMenu = document.querySelector('.navbar-menu');

    if (navbarToggle) {
        navbarToggle.addEventListener('click', function() {
            navbarToggle.classList.toggle('active');
            navbarMenu.classList.toggle('open');
        });
    }
});