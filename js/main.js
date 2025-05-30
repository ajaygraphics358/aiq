/**
 * AIQ - AI Tool Mastery Internship Website
 * Main JavaScript File
 * 
 * This file contains all the interactive functionality for the website including:
 * - Theme toggle (dark/light mode)
 * - Countdown timer
 * - Form handling and validation
 * - Scroll animations
 * - Smooth scrolling
 * - Mobile navigation
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize all components
    initializeThemeToggle();
    initializeCountdownTimer();
    initializeScrollAnimations();
    initializeSmoothScrolling();
    initializeFormHandling();
    initializeMobileNavigation();
    initializeProgressTracker();
    initializeIntersectionObserver();
    
    // Initialize AOS (Animate On Scroll) library
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            mirror: false,
            offset: 100
        });
    }
});

/**
 * Theme Toggle Functionality
 * Handles switching between light and dark themes
 */
function initializeThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const body = document.body;
    
    if (!themeToggle || !themeIcon) return;
    
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    
    // Theme toggle event listener
    themeToggle.addEventListener('click', function() {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
    });
    
    function setTheme(theme) {
        body.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        // Update icon
        if (theme === 'dark') {
            themeIcon.className = 'fas fa-sun';
            themeToggle.setAttribute('aria-label', 'Switch to light mode');
        } else {
            themeIcon.className = 'fas fa-moon';
            themeToggle.setAttribute('aria-label', 'Switch to dark mode');
        }
        
        // Smooth transition
        body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        setTimeout(() => {
            body.style.transition = '';
        }, 300);
    }
}

/**
 * Countdown Timer Functionality
 * Creates a countdown to the next batch enrollment deadline
 */
function initializeCountdownTimer() {
    const daysElement = document.getElementById('days');
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');
    
    if (!daysElement || !hoursElement || !minutesElement || !secondsElement) return;
    
    // Set countdown target date (30 days from now)
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 30);
    targetDate.setHours(23, 59, 59, 999);
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate.getTime() - now;
        
        if (distance < 0) {
            // Countdown finished - reset to next month
            targetDate.setMonth(targetDate.getMonth() + 1);
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // Update DOM with animation
        animateCounterUpdate(daysElement, days.toString().padStart(2, '0'));
        animateCounterUpdate(hoursElement, hours.toString().padStart(2, '0'));
        animateCounterUpdate(minutesElement, minutes.toString().padStart(2, '0'));
        animateCounterUpdate(secondsElement, seconds.toString().padStart(2, '0'));
    }
    
    function animateCounterUpdate(element, newValue) {
        if (element.textContent !== newValue) {
            element.style.transform = 'scale(1.1)';
            element.textContent = newValue;
            setTimeout(() => {
                element.style.transform = 'scale(1)';
            }, 100);
        }
    }
    
    // Update countdown every second
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

/**
 * Scroll Animations
 * Handles custom scroll-based animations beyond AOS
 */
function initializeScrollAnimations() {
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

/**
 * Smooth Scrolling
 * Handles smooth scrolling for navigation links
 */
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just a hash
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.offsetTop - navbarHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile navigation if open
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                    const navbarToggler = document.querySelector('.navbar-toggler');
                    if (navbarToggler) navbarToggler.click();
                }
            }
        });
    });
}

/**
 * Form Handling and Validation
 * Handles enrollment and contact form submissions
 */
function initializeFormHandling() {
    // Enrollment form
    const enrollmentForm = document.getElementById('enrollmentForm');
    if (enrollmentForm) {
        enrollmentForm.addEventListener('submit', handleFormSubmission);
    }
    
    // Contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmission);
    }
    
    // Real-time validation
    document.querySelectorAll('.form-control').forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearValidation);
    });
}

async function handleFormSubmission(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    
    // Validate form
    if (!validateForm(form)) {
        showFormMessage(form, 'error', 'Please fill in all required fields correctly.');
        return;
    }
    
    // Show loading state
    submitButton.classList.add('loading');
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Sending...';
    submitButton.disabled = true;
    
    try {
        const response = await fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        });
        
        const result = await response.json();
        
        if (response.ok && result.success) {
            showFormMessage(form, 'success', result.message || 'Thank you! Your message has been sent successfully.');
            form.reset();
            clearAllValidation(form);
        } else {
            showFormMessage(form, 'error', result.message || 'An error occurred. Please try again.');
        }
    } catch (error) {
        console.error('Form submission error:', error);
        showFormMessage(form, 'error', 'Network error. Please check your connection and try again.');
    } finally {
        // Reset button state
        submitButton.classList.remove('loading');
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
    }
}

function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!validateField({ target: field })) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    const type = field.type;
    const required = field.hasAttribute('required');
    
    let isValid = true;
    let message = '';
    
    // Required field validation
    if (required && !value) {
        isValid = false;
        message = 'This field is required.';
    }
    
    // Email validation
    else if (type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            message = 'Please enter a valid email address.';
        }
    }
    
    // Phone validation
    else if (type === 'tel' && value) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
            isValid = false;
            message = 'Please enter a valid phone number.';
        }
    }
    
    // Checkbox validation
    else if (type === 'checkbox' && required && !field.checked) {
        isValid = false;
        message = 'You must agree to continue.';
    }
    
    // Apply validation styling
    field.classList.remove('is-valid', 'is-invalid');
    const feedback = field.parentNode.querySelector('.invalid-feedback');
    
    if (feedback) {
        feedback.remove();
    }
    
    if (!isValid) {
        field.classList.add('is-invalid');
        const feedbackElement = document.createElement('div');
        feedbackElement.className = 'invalid-feedback';
        feedbackElement.textContent = message;
        field.parentNode.appendChild(feedbackElement);
    } else if (value) {
        field.classList.add('is-valid');
    }
    
    return isValid;
}

function clearValidation(e) {
    const field = e.target;
    if (field.classList.contains('is-invalid')) {
        field.classList.remove('is-invalid');
        const feedback = field.parentNode.querySelector('.invalid-feedback');
        if (feedback) feedback.remove();
    }
}

function clearAllValidation(form) {
    form.querySelectorAll('.is-valid, .is-invalid').forEach(field => {
        field.classList.remove('is-valid', 'is-invalid');
    });
    form.querySelectorAll('.invalid-feedback').forEach(feedback => {
        feedback.remove();
    });
}

function showFormMessage(form, type, message) {
    const responseDiv = form.querySelector('#formResponse') || 
                       form.parentNode.querySelector('#formResponse') ||
                       createResponseDiv(form);
    
    responseDiv.style.display = 'block';
    responseDiv.className = `alert alert-${type === 'success' ? 'success' : 'danger'}`;
    responseDiv.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'} me-2"></i>
        ${message}
    `;
    
    // Auto-hide success messages
    if (type === 'success') {
        setTimeout(() => {
            responseDiv.style.display = 'none';
        }, 5000);
    }
    
    // Scroll to message
    responseDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function createResponseDiv(form) {
    const responseDiv = document.createElement('div');
    responseDiv.id = 'formResponse';
    responseDiv.style.display = 'none';
    form.parentNode.appendChild(responseDiv);
    return responseDiv;
}

/**
 * Mobile Navigation
 * Handles mobile navigation behavior
 */
function initializeMobileNavigation() {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (!navbarToggler || !navbarCollapse) return;
    
    // Close navigation when clicking outside
    document.addEventListener('click', function(e) {
        if (navbarCollapse.classList.contains('show') && 
            !navbarCollapse.contains(e.target) && 
            !navbarToggler.contains(e.target)) {
            navbarToggler.click();
        }
    });
    
    // Close navigation when pressing escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navbarCollapse.classList.contains('show')) {
            navbarToggler.click();
        }
    });
}

/**
 * Progress Tracker
 * Updates progress tracker based on scroll position (for courses page)
 */
function initializeProgressTracker() {
    const progressSteps = document.querySelectorAll('.progress-steps .step');
    const courseModules = document.querySelectorAll('.course-module');
    
    if (progressSteps.length === 0 || courseModules.length === 0) return;
    
    function updateProgress() {
        const scrollPosition = window.scrollY + window.innerHeight / 2;
        
        courseModules.forEach((module, index) => {
            const moduleTop = module.offsetTop;
            const moduleBottom = moduleTop + module.offsetHeight;
            
            if (scrollPosition >= moduleTop && scrollPosition <= moduleBottom) {
                // Update progress steps
                progressSteps.forEach((step, stepIndex) => {
                    step.classList.remove('active', 'completed');
                    if (stepIndex < index) {
                        step.classList.add('completed');
                    } else if (stepIndex === index) {
                        step.classList.add('active');
                    }
                });
            }
        });
    }
    
    // Throttled scroll listener
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateProgress();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Initial update
    updateProgress();
}

/**
 * Intersection Observer for Performance
 * Lazy loading and performance optimizations
 */
function initializeIntersectionObserver() {
    // Lazy load images
    const images = document.querySelectorAll('img[data-src]');
    if (images.length > 0) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
    
    // Pause animations when not visible
    const animatedElements = document.querySelectorAll('[data-aos]');
    if (animatedElements.length > 0) {
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'paused';
                } else {
                    entry.target.style.animationPlayState = 'running';
                }
            });
        });
        
        animatedElements.forEach(element => animationObserver.observe(element));
    }
}

/**
 * Utility Functions
 */

// Debounce function for performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Smooth scroll to element
function scrollToElement(selector, offset = 70) {
    const element = document.querySelector(selector);
    if (element) {
        const elementPosition = element.offsetTop - offset;
        window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
        });
    }
}

// Format phone number
function formatPhoneNumber(value) {
    const cleaned = ('' + value).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
    return value;
}

// Show loading state
function showLoading(element) {
    element.classList.add('loading');
    element.disabled = true;
}

// Hide loading state
function hideLoading(element) {
    element.classList.remove('loading');
    element.disabled = false;
}

// Copy text to clipboard
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        console.error('Failed to copy text: ', err);
        return false;
    }
}

// Get browser info for debugging
function getBrowserInfo() {
    return {
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
        cookieEnabled: navigator.cookieEnabled,
        onLine: navigator.onLine,
        screenWidth: screen.width,
        screenHeight: screen.height,
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight
    };
}

// Error tracking
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', {
        message: e.message,
        filename: e.filename,
        lineno: e.lineno,
        colno: e.colno,
        error: e.error,
        browserInfo: getBrowserInfo()
    });
});

// Performance monitoring
window.addEventListener('load', function() {
    if ('performance' in window) {
        const perfData = performance.getEntriesByType('navigation')[0];
        console.log('Page Load Performance:', {
            loadTime: perfData.loadEventEnd - perfData.loadEventStart,
            domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
            firstPaint: performance.getEntriesByType('paint')[0]?.startTime,
            firstContentfulPaint: performance.getEntriesByType('paint')[1]?.startTime
        });
    }
});

// Export functions for global access if needed
window.AIQ = {
    scrollToElement,
    showLoading,
    hideLoading,
    copyToClipboard,
    debounce,
    throttle,
    isInViewport,
    formatPhoneNumber
};
