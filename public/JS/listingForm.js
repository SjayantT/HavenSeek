// DOM Elements
const uploadArea = document.querySelector('.upload-area');
const fileInput = document.getElementById('imageUpload');
const form = document.getElementById('listingForm');

// File Upload Functionality
function initFileUpload() {
    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    // Highlight drop area
    ['dragenter', 'dragover'].forEach(eventName => {
        uploadArea.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, unhighlight, false);
    });

    function highlight(e) {
        uploadArea.classList.add('dragover');
    }

    function unhighlight(e) {
        uploadArea.classList.remove('dragover');
    }

    // Handle dropped files
    uploadArea.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            fileInput.files = files;
            updateUploadArea(files[0]);
        }
    }

    // Handle file input change
    fileInput.addEventListener('change', function(e) {
        if (e.target.files.length > 0) {
            updateUploadArea(e.target.files[0]);
        }
    });

    function updateUploadArea(file) {
        const icon = uploadArea.querySelector('i');
        const title = uploadArea.querySelector('h6');
        const text = uploadArea.querySelector('p');
        
        icon.className = 'fas fa-check-circle fa-2x mb-3 text-success';
        title.textContent = 'File Selected';
        text.textContent = file.name;
        text.className = 'text-success mb-3';
    }
}

// Form Validation
function initFormValidation() {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            // Show success message
            showAlert('Listing submitted successfully!', 'success');
            // Here you would normally submit the form data
        } else {
            showAlert('Please fill in all required fields correctly.', 'danger');
        }
    });

    // Real-time validation
    const requiredFields = document.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        field.addEventListener('blur', function() {
            validateField(this);
        });

        field.addEventListener('input', function() {
            if (this.classList.contains('is-invalid')) {
                validateField(this);
            }
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    const isValid = value !== '';
    
    // Special validation for specific fields
    if (field.type === 'number') {
        const num = parseFloat(value);
        if (field.id === 'pincode') {
            if (value.length !== 6 || isNaN(num)) {
                field.classList.add('is-invalid');
                field.classList.remove('is-valid');
                return false;
            }
        } else if (field.id === 'price') {
            if (isNaN(num) || num <= 0) {
                field.classList.add('is-invalid');
                field.classList.remove('is-valid');
                return false;
            }
        }
    }
    
    if (isValid) {
        field.classList.remove('is-invalid');
        field.classList.add('is-valid');
    } else {
        field.classList.add('is-invalid');
        field.classList.remove('is-valid');
    }
    
    return isValid;
}

function validateForm() {
    const requiredFields = document.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

// Alert Function
function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.parentNode.removeChild(alertDiv);
        }
    }, 5000);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initFileUpload();
    initFormValidation();
});
