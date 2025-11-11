document.addEventListener('DOMContentLoaded', function() {
    initProfilePage();
});

function initProfilePage() {
    // Initialize profile image upload
    initImageUpload();
    
    // Initialize forms
    initForms();
    
    // Initialize property actions
    initPropertyActions();
    
    // Initialize tab switching
    initTabSwitching();
}

// Profile Image Upload
function initImageUpload() {
    const imageUpload = document.getElementById('imageUpload');
    const profileImage = document.getElementById('profileImage');
    
    if (imageUpload && profileImage) {
        imageUpload.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        profileImage.src = e.target.result;
                        showAlert('Profile picture updated successfully!', 'success');
                    };
                    reader.readAsDataURL(file);
                } else {
                    showAlert('Please select a valid image file.', 'danger');
                }
            }
        });
    }
}

// Form Handling
function initForms() {
    // Settings Form
    const settingsForm = document.getElementById('settingsForm');
    if (settingsForm) {
        settingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleSettingsUpdate();
        });
    }
    
    // Password Form
    const passwordForm = document.getElementById('passwordForm');
    if (passwordForm) {
        passwordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handlePasswordChange();
        });
    }
    
    // Edit Profile Form
    const editProfileForm = document.getElementById('editProfileForm');
    if (editProfileForm) {
        editProfileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleProfileEdit();
        });
    }
}

function handleSettingsUpdate() {
    // Show loading state
    const submitBtn = document.querySelector('#settingsForm button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Saving...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        showAlert('Settings updated successfully!', 'success');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 1500);
}

function handlePasswordChange() {
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
        showAlert('Please fill in all password fields.', 'danger');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        showAlert('New passwords do not match.', 'danger');
        return;
    }
    
    if (newPassword.length < 6) {
        showAlert('New password must be at least 6 characters long.', 'danger');
        return;
    }
    
    // Show loading state
    const submitBtn = document.querySelector('#passwordForm button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Updating...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        showAlert('Password updated successfully!', 'success');
        document.getElementById('passwordForm').reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 1500);
}

function handleProfileEdit() {
    const modal = document.getElementById('editProfileModal');
    const modalInstance = bootstrap.Modal.getInstance(modal);
    
    // Show loading state
    const submitBtn = document.querySelector('#editProfileModal .btn-primary');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Saving...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        showAlert('Profile updated successfully!', 'success');
        modalInstance.hide();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Update profile info on page
        updateProfileDisplay();
    }, 1500);
}

function updateProfileDisplay() {
    // Update profile information displayed on the page
    // This would typically update from the form values
    console.log('Profile display updated');
}

// Property Actions
function initPropertyActions() {
    // Edit buttons
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const propertyCard = this.closest('.property-card');
            const propertyTitle = propertyCard.querySelector('.property-title').textContent;
            showAlert(`Edit functionality for "${propertyTitle}" would open here.`, 'info');
        });
    });
    
    // Delete buttons
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const propertyCard = this.closest('.property-card');
            const propertyTitle = propertyCard.querySelector('.property-title').textContent;
            
            if (confirm(`Are you sure you want to delete "${propertyTitle}"?`)) {
                // Animate removal
                propertyCard.style.transition = 'all 0.3s ease';
                propertyCard.style.opacity = '0';
                propertyCard.style.transform = 'translateY(-20px)';
                
                setTimeout(() => {
                    propertyCard.remove();
                    showAlert('Property deleted successfully!', 'success');
                }, 300);
            }
        });
    });
    
    // Favorite actions
    document.querySelectorAll('.favorite-item .btn-outline-danger').forEach(btn => {
        btn.addEventListener('click', function() {
            const favoriteItem = this.closest('.favorite-item');
            const propertyTitle = favoriteItem.querySelector('h6').textContent;
            
            if (confirm(`Remove "${propertyTitle}" from favorites?`)) {
                // Animate removal
                favoriteItem.style.transition = 'all 0.3s ease';
                favoriteItem.style.opacity = '0';
                favoriteItem.style.transform = 'translateX(-20px)';
                
                setTimeout(() => {
                    favoriteItem.remove();
                    showAlert('Removed from favorites!', 'success');
                }, 300);
            }
        });
    });
}

// Tab Switching
function initTabSwitching() {
    const tabLinks = document.querySelectorAll('#profileTabs .nav-link');
    
    tabLinks.forEach(link => {
        link.addEventListener('shown.bs.tab', function(e) {
            const targetTab = e.target.getAttribute('href');
            console.log('Switched to tab:', targetTab);
            
            // Add any tab-specific initialization here
            if (targetTab === '#properties') {
                // Refresh properties if needed
                console.log('Properties tab activated');
            }
        });
    });
}

// Two-factor authentication toggle
document.addEventListener('change', function(e) {
    if (e.target.id === 'twoFactorSMS') {
        const isEnabled = e.target.checked;
        if (isEnabled) {
            showAlert('SMS two-factor authentication enabled!', 'success');
        } else {
            showAlert('SMS two-factor authentication disabled.', 'info');
        }
    }
});

// Notification preferences
document.addEventListener('change', function(e) {
    if (e.target.classList.contains('form-check-input')) {
        const label = e.target.nextElementSibling.textContent;
        const isEnabled = e.target.checked;
        console.log(`${label}: ${isEnabled ? 'Enabled' : 'Disabled'}`);
    }
});

// Utility Functions
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

// Share Profile Function
// document.addEventListener('click', function(e) {
//     if (e.target.closest('.btn-outline-primary') && e.target.closest('.btn-outline-primary').innerHTML.includes('Share Profile')) {
//         e.preventDefault();
        
//         if (navigator.share) {
//             navigator.share({
//                 title: 'Rajesh Kumar - HavenSeek Profile',
//                 text: 'Check out my property listings on HavenSeek',
//                 url: window.location.href
//             });
//         } else {
//             // Fallback: copy to clipboard
//             navigator.clipboard.writeText(window.location.href);
//             showAlert('Profile link copied to clipboard!', 'success');
//         }
//     }
// });


// Smooth scrolling for internal links
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
