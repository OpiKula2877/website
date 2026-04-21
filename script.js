document.addEventListener('DOMContentLoaded', () => {
    // Easter Egg: Console message
    console.log("%cWellcome", "color: rgb(62, 91, 255); font-size: 20px; font-weight: bold; font-family: 'Cinzel', serif;");

    // Easter Egg: Logo interaction
    const logo = document.getElementById('brand-logo');
    if (logo) {
        let clickCount = 0;
        logo.addEventListener('click', (e) => {
            e.preventDefault(); // prevent default link if any
            clickCount++;
            if (clickCount >= 3) {
                logo.classList.add('spin-fast');
                setTimeout(() => {
                    logo.classList.remove('spin-fast');
                    clickCount = 0;
                }, 2000);
            }
        });
    }

    // Accordion Logic
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            // Close other open accordions
            const currentActive = document.querySelector('.accordion-header.active');
            if (currentActive && currentActive !== header) {
                currentActive.classList.remove('active');
                const currentContent = currentActive.nextElementSibling;
                currentContent.style.maxHeight = null;
                currentContent.classList.remove('expanded');
            }

            // Toggle current
            header.classList.toggle('active');
            const content = header.nextElementSibling;
            
            if (header.classList.contains('active')) {
                content.classList.add('expanded');
                content.style.maxHeight = content.scrollHeight + 40 + "px"; // added extra padding approx
            } else {
                content.style.maxHeight = null;
                content.classList.remove('expanded');
            }
        });
    });

    // Docs Sidebar Toggle Logic
    const openSidebarBtn = document.getElementById('open-sidebar');
    const closeSidebarBtn = document.getElementById('close-sidebar');
    const docsLayout = document.querySelector('.docs-layout');

    if (openSidebarBtn && closeSidebarBtn && docsLayout) {
        openSidebarBtn.addEventListener('click', () => {
            docsLayout.classList.remove('sidebar-closed');
        });

        closeSidebarBtn.addEventListener('click', () => {
            docsLayout.classList.add('sidebar-closed');
        });
        
        if (window.innerWidth < 768) {
            docsLayout.classList.add('sidebar-closed');
        }
    }

    // Docs chapter dropdown logic
    const chapterToggles = document.querySelectorAll('.chapter-group-toggle');

    chapterToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const group = toggle.closest('.chapter-group');
            if (!group) return;

            group.classList.toggle('open');
            toggle.setAttribute('aria-expanded', String(group.classList.contains('open')));
        });
    });
});
