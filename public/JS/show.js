// Property Details JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initPropertyDetails();
});

function initPropertyDetails() {
    // Contact form handling
    initContactForm();
    
    // Smooth scrolling for anchor links
    initSmoothScrolling();
    
    // Favorite functionality
    initFavoriteToggle();
    
    // Share functionality
    initShareFunctionality();
}

// Contact Form
function initContactForm() {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const name = this.querySelector('input[placeholder="Your Name"]').value;
            const email = this.querySelector('input[placeholder="Your Email"]').value;
            const phone = this.querySelector('input[placeholder="Your Phone"]').value;
            const message = this.querySelector('textarea').value;
            
            // Basic validation
            if (!name || !email || !phone) {
                showAlert('Please fill in all required fields', 'danger');
                return;
            }
            
            if (!isValidEmail(email)) {
                showAlert('Please enter a valid email address', 'danger');
                return;
            }
            
            if (!isValidPhone(phone)) {
                showAlert('Please enter a valid phone number', 'danger');
                return;
            }
            
            // Simulate form submission
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Sending...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                showAlert('Your inquiry has been sent successfully! The agent will contact you soon.', 'success');
                contactForm.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }
}


// Smooth scrolling
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Favorite toggle
function initFavoriteToggle() {
    const favoriteBtn = document.querySelector('.btn-outline-secondary');
    if (favoriteBtn && favoriteBtn.innerHTML.includes('heart')) {
        favoriteBtn.addEventListener('click', function() {
            const icon = this.querySelector('i');
            if (icon.classList.contains('fa-heart')) {
                icon.classList.remove('fa-heart');
                icon.classList.add('fa-heart');
                icon.style.color = '#ef4444';
                showAlert('Property added to favorites', 'success');
            } else {
                icon.style.color = '';
                showAlert('Property removed from favorites', 'info');
            }
        });
    }
}

// Share functionality
function initShareFunctionality() {
    const shareBtn = document.querySelector('.btn-outline-secondary:has(.fa-share)');
    if (shareBtn) {
        shareBtn.addEventListener('click', function() {
            if (navigator.share) {
                navigator.share({
                    title: document.querySelector('.property-title').textContent,
                    text: 'Check out this amazing property on HavenSeek',
                    url: window.location.href
                });
            } else {
                // Fallback: copy to clipboard
                navigator.clipboard.writeText(window.location.href);
                showAlert('Property link copied to clipboard', 'success');
            }
        });
    }
}

// Utility functions
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
    return /^[\+]?[0-9\s\-\(\)]{10,}$/.test(phone);
}

function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.parentNode.removeChild(alertDiv);
        }
    }, 5000);
}

// Contact owner functionality
document.addEventListener('click', function(e) {
    if (e.target.closest('.contact-btn, .owner-contact .btn-outline-primary')) {
        e.preventDefault();
        showAlert('Connecting you with the property owner...', 'info');
        
        setTimeout(() => {
            // In a real app, this would initiate a call or open a dialer
            window.location.href = 'tel: '+ mobileNo;
        }, 1500);
    }
});
