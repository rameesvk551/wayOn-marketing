/**
 * TravelOps Static Marketing Website
 * JavaScript for interactions, animations, and functionality
 */

(function () {
    'use strict';

    // ========================================================================
    // NAVIGATION
    // ========================================================================

    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when clicking a link
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // Scroll-based nav styling
    let lastScrollY = 0;
    let ticking = false;

    function updateNavOnScroll() {
        const scrollY = window.scrollY;

        if (scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        lastScrollY = scrollY;
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(updateNavOnScroll);
            ticking = true;
        }
    }, { passive: true });


    // ========================================================================
    // SMOOTH SCROLL
    // ========================================================================

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const navHeight = nav.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });


    // ========================================================================
    // ROLE TABS
    // ========================================================================

    const roleTabs = document.querySelectorAll('.role-tab');
    const rolePanels = document.querySelectorAll('.role-panel');

    roleTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const role = tab.dataset.role;

            // Update tabs
            roleTabs.forEach(t => {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
            });
            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');

            // Update panels
            rolePanels.forEach(panel => {
                panel.classList.remove('active');
            });
            const targetPanel = document.getElementById(`role-${role}`);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });


    // ========================================================================
    // FORM HANDLING
    // ========================================================================

    const demoForm = document.getElementById('demoForm');

    if (demoForm) {
        demoForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Collect form data
            const formData = new FormData(this);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });

            // Show success message (in production, this would send to a server)
            const button = this.querySelector('button[type="submit"]');
            const originalText = button.textContent;

            button.textContent = 'Sending...';
            button.disabled = true;

            // Simulate API call
            setTimeout(() => {
                button.textContent = '✓ Request Received';
                button.style.backgroundColor = '#059669';

                // Show thank you message
                const formContent = this.innerHTML;
                this.innerHTML = `
                    <div style="text-align: center; padding: 3rem 1rem;">
                        <div style="font-size: 4rem; margin-bottom: 1rem;">✓</div>
                        <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem; color: #fff;">Thank You!</h3>
                        <p style="color: #9ca3af; margin-bottom: 1.5rem;">We've received your demo request. A product expert will reach out within 24 hours.</p>
                        <p style="color: #6b7280; font-size: 0.875rem;">In the meantime, feel free to explore the rest of the platform overview above.</p>
                    </div>
                `;

                console.log('Form submitted:', data);
            }, 1500);
        });
    }


    // ========================================================================
    // SCROLL REVEAL ANIMATIONS
    // ========================================================================

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Optionally unobserve after reveal
                // observer.unobserve(entry.target);
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, observerOptions);

    // Add reveal class to sections and elements
    document.querySelectorAll('.section-header, .chaos-grid, .platform-content, .pillars-grid, .gear-features, .flow-diagram, .roles-showcase, .comparison-table, .scale-grid, .conversion-content').forEach(el => {
        el.classList.add('reveal');
        revealObserver.observe(el);
    });

    // Stagger animations for grids
    document.querySelectorAll('.chaos-grid, .pillars-grid, .scale-grid').forEach(grid => {
        grid.classList.add('stagger-children');
    });


    // ========================================================================
    // HUB ANIMATION (Hero Visual)
    // ========================================================================

    const hubNodes = document.querySelectorAll('.hub-node');

    hubNodes.forEach((node, index) => {
        // Add subtle floating animation
        node.style.animation = `float ${3 + index * 0.5}s ease-in-out infinite`;
        node.style.animationDelay = `${index * 0.3}s`;
    });

    // Add float keyframes dynamically
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float {
            0%, 100% { transform: translateY(0) translateX(${Math.random() > 0.5 ? '' : '-'}50%); }
            50% { transform: translateY(-8px) translateX(${Math.random() > 0.5 ? '' : '-'}50%); }
        }
        
        .hub-node-1, .hub-node-4 {
            animation-name: float-center !important;
        }
        
        @keyframes float-center {
            0%, 100% { transform: translateY(0) translateX(-50%); }
            50% { transform: translateY(-8px) translateX(-50%); }
        }
    `;
    document.head.appendChild(style);


    // ========================================================================
    // CONNECTION LINES ANIMATION
    // ========================================================================

    const connectionLines = document.querySelectorAll('.connection-line');

    connectionLines.forEach((line, index) => {
        line.style.animationDelay = `${index * 0.5}s`;
    });


    // ========================================================================
    // PERFORMANCE: Lazy load sections
    // ========================================================================

    // Preload critical sections
    const criticalSections = ['#hero', '#chaos', '#platform'];

    // Mark other sections for lazy behavior
    const lazySections = document.querySelectorAll('section:not(#hero):not(#chaos):not(#platform)');

    lazySections.forEach(section => {
        section.style.contentVisibility = 'auto';
        section.style.containIntrinsicSize = '0 500px';
    });


    // ========================================================================
    // KEYBOARD ACCESSIBILITY
    // ========================================================================

    // Handle Enter/Space on role tabs
    roleTabs.forEach(tab => {
        tab.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                tab.click();
            }
        });
    });


    // ========================================================================
    // PRINT STYLES
    // ========================================================================

    window.addEventListener('beforeprint', () => {
        // Expand all collapsed content for printing
        document.querySelectorAll('.reveal').forEach(el => {
            el.classList.add('revealed');
        });
    });


    // ========================================================================
    // BUSINESS TYPE SELECTION (Navbar Dropdown)
    // ========================================================================

    const businessCategories = {
        'tour-operator': {
            name: 'Tour Operator',
            icon: '🚌',
            showGear: false,
            showFlights: false,
            subtitle: 'One platform connecting your leads, bookings, staff, vendors, and money. Built for tour operators who refuse to run their business on spreadsheets.'
        },
        'trekking': {
            name: 'Trekking / Adventure',
            icon: '🏔️',
            showGear: true,
            showFlights: false,
            subtitle: 'One platform connecting your leads, bookings, staff, gear, vendors, and money. Built for trek and adventure operators who refuse to run their business on spreadsheets.'
        },
        'travel-agent': {
            name: 'Travel Agent',
            icon: '✈️',
            showGear: false,
            showFlights: true,
            subtitle: 'One platform connecting your leads, bookings, suppliers, commissions, and money. Built for travel agents who refuse to run their business on spreadsheets.'
        },
        'travel-tourism': {
            name: 'Travel & Tourism',
            icon: '🌍',
            showGear: true,
            showFlights: true,
            subtitle: 'One platform connecting your leads, bookings, staff, inventory, vendors, and finances. Built for DMCs and travel companies who refuse to run their business on spreadsheets.'
        },
        'full-service': {
            name: 'Full-Service',
            icon: '🎯',
            showGear: true,
            showFlights: true,
            subtitle: 'One platform connecting your leads, bookings, staff, gear, vendors, and money. The complete operating system for travel businesses who refuse to run their operations on spreadsheets.'
        }
    };

    // Navbar dropdown elements
    const navBusinessDropdown = document.getElementById('navBusinessDropdown');
    const businessTrigger = document.getElementById('businessTrigger');
    const businessMenu = document.getElementById('businessMenu');
    const navBusinessIcon = document.getElementById('navBusinessIcon');
    const navBusinessLabel = document.getElementById('navBusinessLabel');
    const businessOptions = document.querySelectorAll('.nav-business-option');

    // Other elements
    const heroSubtitle = document.getElementById('heroSubtitle');
    const businessIndicator = document.getElementById('businessIndicator');
    const indicatorIcon = document.getElementById('indicatorIcon');
    const indicatorText = document.getElementById('indicatorText');
    const businessTypeSelect = document.getElementById('businessType');

    // Get all gear-related content
    const gearContent = document.querySelectorAll('[data-category="gear"]');
    const navGearLink = document.getElementById('navGearLink');
    const hubNodeGear = document.getElementById('hubNodeGear');

    // Toggle dropdown
    if (businessTrigger) {
        businessTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            navBusinessDropdown.classList.toggle('open');
        });
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (navBusinessDropdown && !navBusinessDropdown.contains(e.target)) {
            navBusinessDropdown.classList.remove('open');
        }
    });

    function setBusinessType(type, saveToStorage = true) {
        const config = businessCategories[type];
        if (!config) return;

        // Update navbar dropdown trigger
        if (navBusinessIcon) {
            navBusinessIcon.textContent = config.icon;
        }
        if (navBusinessLabel) {
            navBusinessLabel.textContent = config.name;
        }

        // Update active option in dropdown
        businessOptions.forEach(option => {
            option.classList.remove('active');
            if (option.dataset.business === type) {
                option.classList.add('active');
            }
        });

        // Close dropdown after selection
        if (navBusinessDropdown) {
            navBusinessDropdown.classList.remove('open');
        }

        // Update hero subtitle with smooth transition
        if (heroSubtitle) {
            heroSubtitle.classList.add('changing');
            setTimeout(() => {
                heroSubtitle.textContent = config.subtitle;
                heroSubtitle.classList.remove('changing');
            }, 300);
        }

        // Toggle gear content visibility
        gearContent.forEach(el => {
            if (config.showGear) {
                el.classList.remove('category-hidden');
            } else {
                el.classList.add('category-hidden');
            }
        });

        // Update nav gear link
        if (navGearLink) {
            if (config.showGear) {
                navGearLink.classList.remove('nav-hidden');
            } else {
                navGearLink.classList.add('nav-hidden');
            }
        }

        // Update hub node gear
        if (hubNodeGear) {
            if (config.showGear) {
                hubNodeGear.classList.remove('node-hidden');
            } else {
                hubNodeGear.classList.add('node-hidden');
            }
        }

        // Update floating indicator
        if (businessIndicator && indicatorIcon && indicatorText) {
            indicatorIcon.textContent = config.icon;
            indicatorText.textContent = config.name;
        }

        // Update form business type dropdown
        if (businessTypeSelect) {
            businessTypeSelect.value = type;
        }

        // Save to localStorage
        if (saveToStorage) {
            localStorage.setItem('travelops_business_type', type);
        }

        console.log(`Business type set to: ${config.name}`);
    }

    // Business option click handlers
    businessOptions.forEach(option => {
        option.addEventListener('click', () => {
            const type = option.dataset.business;
            setBusinessType(type);
        });
    });

    // Business type dropdown change handler (form)
    if (businessTypeSelect) {
        businessTypeSelect.addEventListener('change', () => {
            const type = businessTypeSelect.value;
            if (type) {
                setBusinessType(type);
            }
        });
    }

    // Floating indicator click to open dropdown
    if (businessIndicator) {
        businessIndicator.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            setTimeout(() => {
                if (navBusinessDropdown) {
                    navBusinessDropdown.classList.add('open');
                }
            }, 500);
        });
    }

    // Show/hide floating indicator based on scroll position
    function updateIndicatorVisibility() {
        if (businessIndicator) {
            const savedType = localStorage.getItem('travelops_business_type');

            // Show indicator when scrolled down AND a type has been selected
            if (window.scrollY > 200 && savedType) {
                businessIndicator.classList.add('visible');
            } else {
                businessIndicator.classList.remove('visible');
            }
        }
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateIndicatorVisibility();
            });
        }
    }, { passive: true });

    // Restore saved business type on page load
    const savedBusinessType = localStorage.getItem('travelops_business_type');
    if (savedBusinessType && businessCategories[savedBusinessType]) {
        setBusinessType(savedBusinessType, false);
    }

    // ========================================================================
    // INITIAL STATE
    // ========================================================================

    // Trigger initial scroll check
    updateNavOnScroll();
    updateIndicatorVisibility();

    // Log initialization
    console.log('TravelOps website initialized');

})();