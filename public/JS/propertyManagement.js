document.addEventListener('DOMContentLoaded', function() {
    initEventListeners();
});

// ==================== EVENT LISTENERS ====================

function initEventListeners() {
    // Search functionality
    document.getElementById('searchProperty').addEventListener('input', filterProperties);
    
    // Filter by status
    document.getElementById('filterStatus').addEventListener('change', filterProperties);
    
    // Filter by city
    document.getElementById('filterCity').addEventListener('change', filterProperties);
    
    // Form submission with AJAX
    document.querySelectorAll('.status-form').forEach(form => {
        form.addEventListener('submit', handleStatusUpdate);
    });
}

// ==================== FILTER PROPERTIES ====================

function filterProperties() {
    const searchQuery = document.getElementById('searchProperty').value.toLowerCase();
    const statusFilter = document.getElementById('filterStatus').value;
    const cityFilter = document.getElementById('filterCity').value;

    const cards = document.querySelectorAll('.status-card');

    cards.forEach(card => {
        const title = card.querySelector('.card-property-title').textContent.toLowerCase();
        const status = card.querySelector('.status-badge').className.split(' ').pop();
        const metaItems = card.querySelectorAll('.meta-item');
        const city = metaItems[0].textContent.toLowerCase();

        let isVisible = true;

        // Search filter
        if (searchQuery && !title.includes(searchQuery)) {
            isVisible = false;
        }

        // Status filter
        if (statusFilter && status !== statusFilter) {
            isVisible = false;
        }

        // City filter
        if (cityFilter && !city.includes(cityFilter)) {
            isVisible = false;
        }

        card.parentElement.style.display = isVisible ? 'block' : 'none';
    });
}

// ==================== HANDLE STATUS UPDATE ====================

// function handleStatusUpdate(e) {
//     e.preventDefault();

//     const form = e.target;
//     const listingId = form.action.split('/')[2];
//     const statusSelect = form.querySelector('.status-select');
//     const newStatus = statusSelect.value;

//     // Show loading state on button
//     const submitBtn = form.querySelector('button[type="submit"]');
//     const originalText = submitBtn.innerHTML;
//     submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i>Updating...';
//     submitBtn.disabled = true;

//     // Send AJAX request
//     makeAjaxRequest('POST', `/listings/${listingId}/update-status`,
//         { status: newStatus },
//         function(response) {
//             if (response.success) {
//                 // Update status badge
//                 const card = form.closest('.status-card');
//                 const badge = card.querySelector('.status-badge');
                
//                 // Remove old status class
//                 badge.classList.remove('in-progress', 'sold');
                
//                 // Add new status class
//                 badge.classList.add(newStatus);
                
//                 // Update badge text
//                 badge.textContent = newStatus === 'in-progress' ? 'In-Progress' : 'Sold';

//                 // Update last updated time
//                 const updatedTime = card.querySelector('.updated-time');
//                 updatedTime.textContent = new Date().toLocaleDateString();

//                 showAlert('Property status updated successfully!', 'success');
                
//                 // Reset button
//                 submitBtn.innerHTML = originalText;
//                 submitBtn.disabled = false;
//             } else {
//                 showAlert(response.message || 'Failed to update status', 'danger');
//                 submitBtn.innerHTML = originalText;
//                 submitBtn.disabled = false;
//             }
//         },
//         function(error) {
//             showAlert('Failed to update property status', 'danger');
//             submitBtn.innerHTML = originalText;
//             submitBtn.disabled = false;
//         }
//     );
// }

// ==================== AJAX UTILITY ====================

// function makeAjaxRequest(method, url, data, callback, errorCallback) {
//     const xhr = new XMLHttpRequest();
    
//     xhr.open(method, url, true);
//     xhr.setRequestHeader('Content-Type', 'application/json');
    
//     xhr.onreadystatechange = function() {
//         if (xhr.readyState === 4) {
//             if (xhr.status === 200) {
//                 try {
//                     const response = JSON.parse(xhr.responseText);
//                     callback(response);
//                 } catch (e) {
//                     console.error('JSON parse error:', e);
//                     if (errorCallback) errorCallback('Invalid response format');
//                 }
//             } else {
//                 if (errorCallback) errorCallback(`Server error: ${xhr.status}`);
//             }
//         }
//     };
    
//     xhr.onerror = function() {
//         if (errorCallback) errorCallback('Network error');
//     };
    
//     if (data) {
//         xhr.send(JSON.stringify(data));
//     } else {
//         xhr.send();
//     }
// }

// ==================== UTILITIES ====================

function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alertDiv.style.cssText = 'top: 100px; right: 20px; z-index: 9999; min-width: 300px;';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.parentNode.removeChild(alertDiv);
        }
    }, 4000);
}
