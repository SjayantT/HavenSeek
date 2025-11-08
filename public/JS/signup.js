// Global variables
let otpTimer;
let timeLeft = 60;
let formData = {};

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initSignupForm();
    initAadharField();
});

// ==================== SIGNUP FORM HANDLING ====================

function initSignupForm() {
    const signupForm = document.querySelector('form[action="/user/signup"]');
    
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent default form submission
            
            console.log('Form submitted, starting validation...');
            
            if (validateAllFields()) {
                console.log('Validation passed, storing form data...');
                
                // Store form data
                if (storeFormData()) {
                    // Show OTP verification
                    showOTPVerification();
                }
            } else {
                showAlert('Please fill all required fields correctly', 'danger');
            }
        });
        
        // Add real-time validation
        addRealTimeValidation();
    }
}

function validateAllFields() {
    const form = document.querySelector('form[action="/user/signup"]');
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });

    // Special validation for Aadhar
    if (!validateAadharField()) {
        isValid = false;
    }

    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;

    // Clear previous validation
    field.classList.remove('is-valid', 'is-invalid');

    if (field.type === 'checkbox') {
        isValid = field.checked;
    } else if (!value && field.hasAttribute('required')) {
        isValid = false;
    } else if (value) {
        switch (field.type) {
            case 'email':
                isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
                break;
            case 'tel':
                if (field.name === 'mobile') {
                    isValid = /^[0-9]{10}$/.test(value);
                }
                break;
            case 'password':
                isValid = value.length >= 6;
                break;
            default:
                isValid = value.length >= 2;
        }
    }

    // Apply validation classes
    if (isValid) {
        field.classList.add('is-valid');
    } else {
        field.classList.add('is-invalid');
    }

    return isValid;
}

function addRealTimeValidation() {
    const form = document.querySelector('form[action="/user/signup"]');
    const inputs = form.querySelectorAll('input');

    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });

        input.addEventListener('input', function() {
            if (this.classList.contains('is-invalid')) {
                validateField(this);
            }
        });
    });
}

function storeFormData() {
    const form = document.querySelector('form[action="/user/signup"]');
    
    if (!form) {
        console.error('Signup form not found');
        return false;
    }
    
    // Get all form inputs manually to ensure we capture everything
    formData = {
        name: document.querySelector('input[name="name"]') ? document.querySelector('input[name="name"]').value : '',
        username: document.querySelector('input[name="username"]') ? document.querySelector('input[name="username"]').value : '',
        email: document.getElementById('signupEmail') ? document.getElementById('signupEmail').value : '',
        mobile: document.getElementById('signupMobile') ? document.getElementById('signupMobile').value : '',
        aadhar: document.getElementById('signupaadhar') ? document.getElementById('signupaadhar').value.replace(/\s/g, '') : '',
        password: document.getElementById('signupPassword') ? document.getElementById('signupPassword').value : '',
        role: document.getElementById('role') ? document.getElementById('role').value: ''
    };
    
    // Debug: Log the stored data
    console.log('Stored form data:', formData);
    
    // Validate that we have all required data
    const requiredFields = ['name', 'username', 'email', 'mobile', 'aadhar', 'password'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
        console.error('Missing required fields:', missingFields);
        showAlert('Please fill all required fields before verification', 'danger');
        return false;
    }
    
    return true;
}

// ==================== AADHAR VALIDATION ====================

function initAadharField() {
    const aadharInput = document.getElementById('signupaadhar');
    if (!aadharInput) return;

    // Remove the pattern attribute to avoid conflicts
    aadharInput.removeAttribute('pattern');
    
    // Input event for formatting and validation
    aadharInput.addEventListener('input', function(e) {
        let value = e.target.value;
        
        // Remove all non-digits
        let digitsOnly = value.replace(/\D/g, '');
        
        // Limit to 12 digits
        if (digitsOnly.length > 12) {
            digitsOnly = digitsOnly.substring(0, 12);
        }
        
        // Format with spaces (XXXX XXXX XXXX)
        let formattedValue = '';
        for (let i = 0; i < digitsOnly.length; i++) {
            if (i > 0 && i % 4 === 0) {
                formattedValue += ' ';
            }
            formattedValue += digitsOnly[i];
        }
        
        // Update input value
        e.target.value = formattedValue;
        
        // Validate in real-time
        validateAadharField();
    });

    // Prevent non-numeric input
    aadharInput.addEventListener('keypress', function(e) {
        const char = String.fromCharCode(e.which);
        if (!/[0-9\s]/.test(char) && e.which !== 8 && e.which !== 0) {
            e.preventDefault();
        }
    });

    // Handle paste
    aadharInput.addEventListener('paste', function(e) {
        setTimeout(() => {
            let value = e.target.value;
            let digitsOnly = value.replace(/\D/g, '');
            
            if (digitsOnly.length > 12) {
                digitsOnly = digitsOnly.substring(0, 12);
            }
            
            // Format the pasted value
            let formattedValue = '';
            for (let i = 0; i < digitsOnly.length; i++) {
                if (i > 0 && i % 4 === 0) {
                    formattedValue += ' ';
                }
                formattedValue += digitsOnly[i];
            }
            
            e.target.value = formattedValue;
            validateAadharField();
        }, 10);
    });

    // Validate on blur
    aadharInput.addEventListener('blur', function() {
        validateAadharField();
    });

    // Clear validation styling on focus
    aadharInput.addEventListener('focus', function() {
        this.classList.remove('is-invalid', 'is-valid');
        hideErrorMessage();
    });
}

function validateAadharField() {
    const aadharInput = document.getElementById('signupaadhar');
    if (!aadharInput) return false;

    const value = aadharInput.value;
    const digitsOnly = value.replace(/\s/g, ''); // Remove spaces
    
    // Clear previous validation
    aadharInput.classList.remove('is-valid', 'is-invalid');
    hideErrorMessage();

    // Check if empty
    if (digitsOnly.length === 0) {
        return false; // Don't show error for empty field until form submission
    }

    // Validate Aadhar
    if (isValidAadharNumber(digitsOnly)) {
        aadharInput.classList.add('is-valid');
        return true;
    } else {
        aadharInput.classList.add('is-invalid');
        showErrorMessage(getErrorMessage(digitsOnly));
        return false;
    }
}

function isValidAadharNumber(aadhar) {
    // Must be exactly 12 digits
    if (aadhar.length !== 12) {
        return false;
    }

    // Must be all numeric
    if (!/^\d{12}$/.test(aadhar)) {
        return false;
    }

    // Should not be all same digits
    if (/^(.)\1{11}$/.test(aadhar)) {
        return false;
    }

    // Should not start with 0 or 1
    if (aadhar.charAt(0) === '0' || aadhar.charAt(0) === '1') {
        return false;
    }

    // Basic validation check
    return basicAadharCheck(aadhar);
}

function basicAadharCheck(aadhar) {
    const digits = aadhar.split('').map(Number);
    
    // Check if it's not a simple sequence
    let isSequence = true;
    for (let i = 1; i < digits.length; i++) {
        if (digits[i] !== digits[i-1] + 1 && digits[i] !== digits[i-1] - 1) {
            isSequence = false;
            break;
        }
    }
    
    if (isSequence) {
        return false;
    }

    return true;
}

function getErrorMessage(aadhar) {
    if (aadhar.length === 0) {
        return 'Aadhar number is required';
    } else if (aadhar.length < 12) {
        return `Aadhar number must be 12 digits (${aadhar.length}/12)`;
    } else if (aadhar.length > 12) {
        return 'Aadhar number cannot exceed 12 digits';
    } else if (!/^\d{12}$/.test(aadhar)) {
        return 'Aadhar number must contain only digits';
    } else if (/^(.)\1{11}$/.test(aadhar)) {
        return 'Aadhar number cannot have all same digits';
    } else if (aadhar.charAt(0) === '0' || aadhar.charAt(0) === '1') {
        return 'Aadhar number cannot start with 0 or 1';
    } else {
        return 'Please enter a valid Aadhar number';
    }
}

function showErrorMessage(message) {
    const aadharInput = document.getElementById('signupaadhar');
    const feedback = aadharInput.closest('.input-group').nextElementSibling;
    
    if (feedback && feedback.classList.contains('invalid-feedback')) {
        feedback.textContent = message;
        feedback.style.display = 'block';
    }
}

function hideErrorMessage() {
    const aadharInput = document.getElementById('signupaadhar');
    const feedback = aadharInput.closest('.input-group').nextElementSibling;
    
    if (feedback && feedback.classList.contains('invalid-feedback')) {
        feedback.style.display = 'none';
    }
}

// ==================== OTP FUNCTIONALITY ====================

async function showOTPVerification() {
    const email = document.getElementById('signupEmail').value;
    
    try {
        showAlert('Sending verification code...', 'info');
        
        const response = await fetch('/user/send-otp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email })
        });

        const result = await response.json();

        if (result.success) {
            // Create OTP verification overlay
            const otpOverlay = createOTPOverlay(email);
            document.body.appendChild(otpOverlay);
            
            // Setup OTP inputs AFTER adding to DOM
            setTimeout(() => {
                setupOTPInputs();
                setupOverlayEvents();
            }, 100);
            
            // Show overlay with animation
            setTimeout(() => {
                otpOverlay.style.opacity = '1';
                otpOverlay.style.visibility = 'visible';
            }, 150);
            
            // Start timer
            startTimer();
            
            showAlert('Verification code sent to your email!', 'success');
        } else {
            showAlert(result.message || 'Failed to send verification code', 'danger');
        }

    } catch (error) {
        console.error('Error sending OTP:', error);
        showAlert('Failed to send verification code. Please try again.', 'danger');
    }
}

function createOTPOverlay(email) {
    const overlay = document.createElement('div');
    overlay.id = 'otpOverlay';
    overlay.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.7); display: flex; justify-content: center; align-items: center;
        z-index: 9999; opacity: 0; visibility: hidden; transition: all 0.3s ease;
    `;
    
    overlay.innerHTML = `
        <div style="background: white; padding: 2rem; border-radius: 1rem; max-width: 400px; width: 90%; text-align: center;">
            <h2 class="mb-3" style="color: #4f46e5;">Verify Your Email</h2>
            <p class="mb-4">OTP sent to <strong>${email}</strong></p>

            <form id="otpForm">
                <div class="otp-container" style="display: flex; justify-content: center; gap: 0.5rem; margin-bottom: 1.5rem;">
                    <input type="text" maxlength="1" class="otp-input" data-index="0"
                        style="width: 45px; height: 45px; font-size: 1.5rem; font-weight: bold; text-align: center; border: 2px solid #e5e7eb; border-radius: 0.5rem;" />
                    <input type="text" maxlength="1" class="otp-input" data-index="1"
                        style="width: 45px; height: 45px; font-size: 1.5rem; font-weight: bold; text-align: center; border: 2px solid #e5e7eb; border-radius: 0.5rem;" />
                    <input type="text" maxlength="1" class="otp-input" data-index="2"
                        style="width: 45px; height: 45px; font-size: 1.5rem; font-weight: bold; text-align: center; border: 2px solid #e5e7eb; border-radius: 0.5rem;" />
                    <input type="text" maxlength="1" class="otp-input" data-index="3"
                        style="width: 45px; height: 45px; font-size: 1.5rem; font-weight: bold; text-align: center; border: 2px solid #e5e7eb; border-radius: 0.5rem;" />
                    <input type="text" maxlength="1" class="otp-input" data-index="4"
                        style="width: 45px; height: 45px; font-size: 1.5rem; font-weight: bold; text-align: center; border: 2px solid #e5e7eb; border-radius: 0.5rem;" />
                    <input type="text" maxlength="1" class="otp-input" data-index="5"
                        style="width: 45px; height: 45px; font-size: 1.5rem; font-weight: bold; text-align: center; border: 2px solid #e5e7eb; border-radius: 0.5rem;" />
                </div>

                <p class="text-muted mb-2" id="timerText">
                    Resend code in <span id="timer">60</span>s
                </p>
                <button type="button" id="resendBtn" class="btn btn-outline-primary btn-sm d-none" style="margin-bottom: 1rem;">
                    <i class="fas fa-redo me-2"></i>Resend Code
                </button>

                <button type="submit" id="verifyOtpBtn" class="btn btn-success w-100 fw-bold" disabled>
                    <i class="fas fa-check-circle me-2"></i>Verify & Complete Registration
                </button>
                <button type="button" id="backBtn" class="btn btn-outline-secondary w-100 mt-2">
                    <i class="fas fa-arrow-left me-2"></i>Back to Sign Up
                </button>
            </form>
        </div>
    `;

    return overlay;
}

function setupOTPInputs() {
    const otpInputs = document.querySelectorAll('#otpOverlay .otp-input');
    
    otpInputs.forEach((input, index) => {
        // Input event for auto-navigation
        input.addEventListener('input', function(e) {
            const value = e.target.value;
            
            // Only allow numbers
            if (!/^\d$/.test(value)) {
                e.target.value = '';
                return;
            }
            
            // Style the filled input
            e.target.style.borderColor = '#10b981';
            e.target.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
            
            // Move to next input
            if (index < otpInputs.length - 1) {
                otpInputs[index + 1].focus();
            }
            
            updateVerifyButton();
        });
        
        // Keydown event for backspace navigation
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Backspace') {
                if (!this.value && index > 0) {
                    otpInputs[index - 1].focus();
                }
                this.style.borderColor = '#e5e7eb';
                this.style.backgroundColor = 'white';
                updateVerifyButton();
            }
            
            // Only allow numbers and control keys
            if (!/^\d$/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault();
            }
        });
        
        // Paste event
        input.addEventListener('paste', function(e) {
            e.preventDefault();
            const pasteData = (e.clipboardData || window.clipboardData).getData('text');
            const digits = pasteData.replace(/\D/g, '').slice(0, 6);
            
            for (let i = 0; i < digits.length && i < otpInputs.length; i++) {
                otpInputs[i].value = digits[i];
                otpInputs[i].style.borderColor = '#10b981';
                otpInputs[i].style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
            }
            updateVerifyButton();
        });
    });
    
    // Focus first input
    if (otpInputs.length > 0) {
        otpInputs[0].focus();
    }
}

function updateVerifyButton() {
    const otpInputs = document.querySelectorAll('#otpOverlay .otp-input');
    const verifyBtn = document.getElementById('verifyOtpBtn');
    
    if (verifyBtn) {
        const allFilled = Array.from(otpInputs).every(input => input.value.trim() !== '');
        verifyBtn.disabled = !allFilled;
        
        if (allFilled) {
            verifyBtn.style.opacity = '1';
            verifyBtn.style.cursor = 'pointer';
        } else {
            verifyBtn.style.opacity = '0.6';
            verifyBtn.style.cursor = 'not-allowed';
        }
    }
}

function clearOTPInputs() {
    const otpInputs = document.querySelectorAll('#otpOverlay .otp-input');
    otpInputs.forEach(input => {
        input.value = '';
        input.style.borderColor = '#e5e7eb';
        input.style.backgroundColor = 'white';
    });
    updateVerifyButton();
}

function closeOTPOverlay() {
    const overlay = document.getElementById('otpOverlay');
    if (overlay) {
        overlay.style.opacity = '0';
        overlay.style.visibility = 'hidden';
        setTimeout(() => {
            if (overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
        }, 300);
    }
    if (otpTimer) {
        clearInterval(otpTimer);
    }
}

function startTimer() {
    timeLeft = 60;
    const timerElement = document.getElementById('timer');
    const timerText = document.getElementById('timerText');
    const resendBtn = document.getElementById('resendBtn');

    if (!timerElement || !timerText || !resendBtn) {
        console.warn('Timer elements not found in DOM');
        return;
    }

    resendBtn.classList.add('d-none');
    timerText.classList.remove('d-none');
    timerElement.textContent = timeLeft;

    otpTimer = setInterval(() => {
        timeLeft--;
        timerElement.textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(otpTimer);
            timerText.classList.add('d-none');
            resendBtn.classList.remove('d-none');
        }
    }, 1000);
}

function setupOverlayEvents() {
    // Setup form submission
    const otpForm = document.getElementById('otpForm');
    if (otpForm) {
        otpForm.addEventListener('submit', handleOTPSubmission);
    }
    
    // Setup resend button
    const resendBtn = document.getElementById('resendBtn');
    if (resendBtn) {
        resendBtn.addEventListener('click', async function() {
            await resendOTP();
            clearOTPInputs();
            startTimer();
        });
    }
    
    // Setup back button
    const backBtn = document.getElementById('backBtn');
    if (backBtn) {
        backBtn.addEventListener('click', closeOTPOverlay);
    }
}

async function handleOTPSubmission(e) {
    e.preventDefault();
    
    const inputs = document.querySelectorAll('.otp-input');
    const enteredOTP = Array.from(inputs).map(input => input.value).join('');
    const verifyBtn = document.getElementById('verifyOtpBtn');
    const email = document.getElementById('signupEmail').value;
    
    // Show loading
    if (verifyBtn) {
        verifyBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Verifying...';
        verifyBtn.disabled = true;
    }
    
    try {
        // Call backend to verify OTP
        const response = await fetch('/user/verify-otp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                email: email,
                otp: enteredOTP 
            })
        });

        const result = await response.json();

        if (result.success) {
            clearInterval(otpTimer);
            showAlert('Email verified successfully!', 'success');
            
            // Submit the original form
            submitOriginalForm();
        } else {
            showAlert(result.message || 'Invalid verification code', 'danger');
            
            // Clear inputs and show error
            inputs.forEach(input => {
                input.value = '';
                input.style.borderColor = '#dc3545';
                input.style.backgroundColor = 'rgba(220, 53, 69, 0.1)';
                input.style.animation = 'shake 0.5s ease-in-out';
            });
            
            setTimeout(() => {
                inputs.forEach(input => {
                    input.style.animation = '';
                    input.style.borderColor = '#e5e7eb';
                    input.style.backgroundColor = 'white';
                });
            }, 500);
        }

    } catch (error) {
        console.error('Error verifying OTP:', error);
        showAlert('Failed to verify OTP. Please try again.', 'danger');
    }
    
    // Reset button
    if (verifyBtn) {
        verifyBtn.innerHTML = '<i class="fas fa-check-circle me-2"></i>Verify & Complete Registration';
        verifyBtn.disabled = false;
    }
}

async function resendOTP() {
    const email = document.getElementById('signupEmail').value;
    
    try {
        showAlert('Sending new verification code...', 'info');
        
        const response = await fetch('/user/send-otp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email })
        });

        const result = await response.json();

        if (result.success) {
            // Clear OTP inputs
            clearOTPInputs();
            
            showAlert('New verification code sent!', 'success');
        } else {
            showAlert(result.message || 'Failed to resend code', 'danger');
        }

    } catch (error) {
        console.error('Error resending OTP:', error);
        showAlert('Failed to resend code. Please try again.', 'danger');
    }
}

function submitOriginalForm() {
    console.log('Submitting original form with data:', formData);
    
    // Validate we have form data
    if (!formData || Object.keys(formData).length === 0) {
        console.error('No form data to submit');
        showAlert('Form data missing. Please try signing up again.', 'danger');
        closeOTPOverlay();
        return;
    }
    
    // Create a new form with the stored data
    const newForm = document.createElement('form');
    newForm.method = 'POST';
    newForm.action = '/user/signup';
    newForm.style.display = 'none';
    
    // Add all form data as hidden inputs
    for (const [key, value] of Object.entries(formData)) {
        if (value) { // Only add non-empty values
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = value;
            newForm.appendChild(input);
            console.log(`Added field: ${key} = ${value}`);
        }
    }
    
    // Add email verified flag
    const verifiedInput = document.createElement('input');
    verifiedInput.type = 'hidden';
    verifiedInput.name = 'emailVerified';
    verifiedInput.value = 'true';
    newForm.appendChild(verifiedInput);
    
    document.body.appendChild(newForm);
    
    // Close OTP overlay
    closeOTPOverlay();
    
    // Show success message
    showAlert('Registration completed successfully!', 'success');
    
    // Submit the form
    setTimeout(() => {
        console.log('Submitting form to backend...');
        newForm.submit();
    }, 1000);
}

// ==================== UTILITY FUNCTIONS ====================

function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 10000; min-width: 300px;';
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

// Debug function - call this in console to check your form field IDs
function debugFormFields() {
    console.log('Form fields found:');
    console.log('Name field:', document.querySelector('input[name="name"]'));
    console.log('Username field:', document.querySelector('input[name="username"]'));
    console.log('Email field:', document.getElementById('signupEmail'));
    console.log('Mobile field:', document.getElementById('signupMobile'));
    console.log('Aadhar field:', document.getElementById('signupaadhar'));
    console.log('Password field:', document.getElementById('signupPassword'));
}

// Add shake animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-3px); }
        20%, 40%, 60%, 80% { transform: translateX(3px); }
    }
`;
document.head.appendChild(style);
