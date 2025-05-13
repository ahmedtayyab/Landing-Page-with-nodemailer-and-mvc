// API endpoints
const API = {
    login: '/admin/login',
    users: '/admin/api/users',
    analytics: '/admin/api/analytics'
};

// Default fetch options with credentials
const defaultFetchOptions = {
    credentials: 'include',
    headers: {
        'Content-Type': 'application/json'
    }
};

// Check session status
async function checkSession() {
    try {
        const response = await fetch('/admin/api/users', defaultFetchOptions);
        if (response.ok) {
            document.getElementById('loginForm').style.display = 'none';
            document.getElementById('dashboard').style.display = 'block';
            return true;
        }
        return false;
    } catch (error) {
        console.error('Session check error:', error);
        return false;
    }
}

// Function to show different sections
function showSection(sectionId) {
    // Hide all sections first
    document.querySelectorAll('.section-content').forEach(section => {
        section.style.display = 'none';
    });
    
    // Show selected section
    document.getElementById(sectionId).style.display = 'block';
    
    // Update active state in sidebar
    document.querySelectorAll('.sidebar a').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelector(`[data-section="${sectionId}"]`).classList.add('active');
}

// Function to render users table
async function renderUsersTable() {
    try {
        const response = await fetch(API.users, defaultFetchOptions);
        if (!response.ok) {
            if (response.status === 401) {
                window.location.reload();
                return;
            }
            throw new Error('Failed to fetch users');
        }
        
        const data = await response.json();
        const usersTable = document.getElementById('usersTable');
        const tbody = usersTable.querySelector('tbody');
        tbody.innerHTML = '';
        
        data.users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.role}</td>
                <td><span class="badge ${user.status === 'Active' ? 'bg-success' : 'bg-danger'}">${user.status}</span></td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="editUser(${user.id})">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteUser(${user.id})">Delete</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error rendering users:', error);
        alert('Failed to load users. Please try again.');
    }
}

// Function to format time
function formatTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}:${mins.toString().padStart(2, '0')}`;
}

// Function to update analytics
async function updateAnalytics() {
    try {
        const response = await fetch(API.analytics, defaultFetchOptions);
        if (!response.ok) {
            if (response.status === 401) {
                window.location.reload();
                return;
            }
            throw new Error('Failed to fetch analytics');
        }
        
        const data = await response.json();
        
        // Update main stats
        document.getElementById('pageViews').textContent = data.pageViews.toLocaleString();
        document.getElementById('uniqueVisitors').textContent = data.uniqueVisitors.toLocaleString();
        document.getElementById('bounceRate').textContent = data.bounceRate;
        document.getElementById('avgTimeOnSite').textContent = data.avgTimeOnSite;
        
        // Update last updated time
        const lastUpdated = new Date(data.lastUpdated);
        document.getElementById('lastUpdated').textContent = lastUpdated.toLocaleString();
        
        // Update daily stats chart if it exists
        const dailyStatsChart = document.getElementById('dailyStatsChart');
        if (dailyStatsChart) {
            const ctx = dailyStatsChart.getContext('2d');
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: data.dailyStats.map(stat => stat.date),
                    datasets: [{
                        label: 'Page Views',
                        data: data.dailyStats.map(stat => stat.views),
                        borderColor: 'rgb(75, 192, 192)',
                        tension: 0.1
                    }, {
                        label: 'Unique Visitors',
                        data: data.dailyStats.map(stat => stat.visitors),
                        borderColor: 'rgb(255, 99, 132)',
                        tension: 0.1
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
        
        // Update visitor logs table if it exists
        const visitorLogsTable = document.getElementById('visitorLogsTable');
        if (visitorLogsTable) {
            const tbody = visitorLogsTable.querySelector('tbody');
            tbody.innerHTML = '';
            
            data.visitorLogs.forEach(log => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${new Date(log.timestamp).toLocaleString()}</td>
                    <td>${log.page}</td>
                    <td>${log.duration}</td>
                `;
                tbody.appendChild(row);
            });
        }
    } catch (error) {
        console.error('Error updating analytics:', error);
    }
}

// User management functions
async function editUser(id) {
    try {
        const response = await fetch(`${API.users}/${id}`, defaultFetchOptions);
        if (!response.ok) throw new Error('Failed to fetch user');
        
        const { user } = await response.json();
        const modal = document.getElementById('editUserModal');
        const form = document.getElementById('editUserForm');
        
        // Populate form with user data
        form.querySelector('#editName').value = user.name;
        form.querySelector('#editEmail').value = user.email;
        form.querySelector('#editRole').value = user.role;
        form.querySelector('#editStatus').value = user.status;
        form.dataset.userId = id;
        
        // Show modal
        const modalInstance = new bootstrap.Modal(modal);
        modalInstance.show();
    } catch (error) {
        console.error('Error editing user:', error);
        alert('Failed to load user data. Please try again.');
    }
}

async function saveEditedUser(event) {
    event.preventDefault();
    const form = event.target;
    const userId = form.dataset.userId;
    
    try {
        const response = await fetch(`${API.users}/${userId}`, {
            ...defaultFetchOptions,
            method: 'PUT',
            body: JSON.stringify({
                name: form.querySelector('#editName').value,
                email: form.querySelector('#editEmail').value,
                role: form.querySelector('#editRole').value,
                status: form.querySelector('#editStatus').value
            })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update user');
        }
        
        // Update table and close modal
        await renderUsersTable();
        const modal = bootstrap.Modal.getInstance(document.getElementById('editUserModal'));
        modal.hide();
        form.reset();
    } catch (error) {
        console.error('Error saving user:', error);
        alert(error.message || 'Failed to update user. Please try again.');
    }
}

async function deleteUser(id) {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
        const response = await fetch(`${API.users}/${id}`, {
            ...defaultFetchOptions,
            method: 'DELETE'
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to delete user');
        }
        
        await renderUsersTable();
    } catch (error) {
        console.error('Error deleting user:', error);
        alert(error.message || 'Failed to delete user. Please try again.');
    }
}

async function addNewUser(event) {
    event.preventDefault();
    const form = event.target;
    
    try {
        const response = await fetch(API.users, {
            ...defaultFetchOptions,
            method: 'POST',
            body: JSON.stringify({
                name: form.querySelector('#newName').value,
                email: form.querySelector('#newEmail').value,
                role: form.querySelector('#newRole').value,
                status: form.querySelector('#newStatus').value
            })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create user');
        }
        
        // Update table and close modal
        await renderUsersTable();
        const modal = bootstrap.Modal.getInstance(document.getElementById('addUserModal'));
        modal.hide();
        form.reset();
    } catch (error) {
        console.error('Error adding user:', error);
        alert(error.message || 'Failed to create user. Please try again.');
    }
}

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', async function() {
    // Check session status
    const isLoggedIn = await checkSession();
    if (!isLoggedIn) {
        document.getElementById('loginForm').style.display = 'block';
        document.getElementById('dashboard').style.display = 'none';
        return;
    }

    // Add click handlers for sidebar links
    document.querySelectorAll('.sidebar a[data-section]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            showSection(this.getAttribute('data-section'));
        });
    });

    // Add form submit handlers
    document.getElementById('addUserForm').addEventListener('submit', addNewUser);
    document.getElementById('editUserForm').addEventListener('submit', saveEditedUser);

    // Initial render of all sections
    renderUsersTable();
    updateAnalytics();

    // Update analytics every 30 seconds
    setInterval(updateAnalytics, 30000);
}); 