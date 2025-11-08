let currentPropertyId = null;
let currentPropertyName = null;

document.addEventListener('DOMContentLoaded', function() {
    initEventListeners();
});

// ==================== EVENT LISTENERS ====================

function initEventListeners() {
    // Search functionality
    document.getElementById('searchListings').addEventListener('input', function() {
        const query = this.value.toLowerCase();
        const rows = document.querySelectorAll('#listingsBody tr');
        
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(query) ? '' : 'none';
        });
    });
}

// ==================== ASSIGN AGENT ====================

function openAssignModal(propId, propName) {
    currentPropertyId = propId;
    currentPropertyName = propName;
    document.getElementById('propertyNameDisplay').textContent = propName;
    
    // Reset radio selection
    document.querySelectorAll('.agent-radio').forEach(radio => radio.checked = false);
    
    new bootstrap.Modal(document.getElementById('assignAgentModal')).show();
}

function selectAgent(agentId, agentName) {
    document.querySelector(`input[name="agentSelect"][value="${agentId}"]`).checked = true;
}

function saveAgentAssignment() {
    const agentSelect = document.querySelector('input[name="agentSelect"]:checked');
    
    if (!agentSelect) {
        showAlert('Please select an agent', 'warning');
        return;
    }

    const agentId = agentSelect.value;
    const agentName = agentSelect.parentElement.querySelector('.agent-option-name').textContent;

    // Send AJAX request to backend
    makeAjaxRequest('POST', '/user/admin/assign-agent',
        { propertyId: currentPropertyId, agentId: agentId },
        function(response) {
            if (response.success) {
                // Update the table row with assigned agent
                const row = document.querySelector(`tr[data-prop-id="${currentPropertyId}"]`);
                if (row) {
                    const agentCell = row.querySelector('td:nth-child(5)');
                    agentCell.innerHTML = `
                        <span class="agent-status assigned">
                            <i class="fas fa-user-check me-1"></i>${agentName}
                        </span>
                    `;
                    
                    // Remove assign button from action buttons
                    const actionCell = row.querySelector('td:last-child');
                    const assignBtn = actionCell.querySelector('.assign-btn');
                    if (assignBtn) {
                        assignBtn.remove();
                    }
                }
                
                bootstrap.Modal.getInstance(document.getElementById('assignAgentModal')).hide();
                showAlert(`Agent "${agentName}" assigned successfully!`, 'success');
            } else {
                showAlert(response.message || 'Failed to assign agent', 'danger');
            }
        },
        function(error) {
            showAlert('Failed to assign agent', 'danger');
        }
    );
}

// ==================== EDIT PROPERTY ====================

function editProperty(propId) {
    currentPropertyId = propId;
    
    // Get the row data
    const row = document.querySelector(`tr[data-prop-id="${propId}"]`);
    
    if (row) {
        const cells = row.querySelectorAll('td');
        const title = cells[0].textContent.trim();
        const price = cells[2].textContent.trim();
        
        document.getElementById('editTitle').value = title;
        document.getElementById('editPrice').value = price;
        
        new bootstrap.Modal(document.getElementById('editPropertyModal')).show();
    }
}

function savePropertyEdit() {
    const title = document.getElementById('editTitle').value;
    const price = document.getElementById('editPrice').value;

    if (!title || !price) {
        showAlert('Please fill all fields', 'warning');
        return;
    }

    // Send AJAX request to backend
    makeAjaxRequest('POST', '/admin/update-property',
        { propertyId: currentPropertyId, title: title, price: price },
        function(response) {
            if (response.success) {
                // Update the table row
                const row = document.querySelector(`tr[data-prop-id="${currentPropertyId}"]`);
                if (row) {
                    row.querySelector('td:nth-child(1)').innerHTML = `<strong>${title}</strong>`;
                    row.querySelector('td:nth-child(3)').textContent = price;
                }
                
                bootstrap.Modal.getInstance(document.getElementById('editPropertyModal')).hide();
                showAlert('Property updated successfully!', 'success');
            } else {
                showAlert(response.message || 'Failed to update property', 'danger');
            }
        },
        function(error) {
            showAlert('Failed to update property', 'danger');
        }
    );
}

// ==================== DELETE PROPERTY ====================

function deleteProperty(propId) {
    if (confirm('Are you sure you want to delete this property?')) {
        // Send AJAX request to backend
        makeAjaxRequest('POST', '/admin/delete-property',
            { propertyId: propId },
            function(response) {
                if (response.success) {
                    // Remove the row from table
                    const row = document.querySelector(`tr[data-prop-id="${propId}"]`);
                    if (row) {
                        row.remove();
                    }
                    showAlert('Property deleted successfully!', 'success');
                } else {
                    showAlert(response.message || 'Failed to delete property', 'danger');
                }
            },
            function(error) {
                showAlert('Failed to delete property', 'danger');
            }
        );
    }
}

// ==================== AJAX UTILITY ====================

function makeAjaxRequest(method, url, data, callback, errorCallback) {
    const xhr = new XMLHttpRequest();
    
    xhr.open(method, url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                try {
                    const response = JSON.parse(xhr.responseText);
                    callback(response);
                } catch (e) {
                    console.error('JSON parse error:', e);
                    if (errorCallback) errorCallback('Invalid response format');
                }
            } else {
                if (errorCallback) errorCallback(`Server error: ${xhr.status}`);
            }
        }
    };
    
    xhr.onerror = function() {
        if (errorCallback) errorCallback('Network error');
    };
    
    if (data) {
        xhr.send(JSON.stringify(data));
    } else {
        xhr.send();
    }
}

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
