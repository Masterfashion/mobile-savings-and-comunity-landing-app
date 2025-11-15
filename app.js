// Data storage using localStorage
const Storage = {
    get: (key) => {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('Error getting data:', e);
            return null;
        }
    },
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error('Error setting data:', e);
        }
    },
    remove: (key) => {
        localStorage.removeItem(key);
    }
};

// Application state
let currentUser = null;
let users = Storage.get('users') || [];
let groups = Storage.get('groups') || [];
let transactions = Storage.get('transactions') || [];

// Page navigation
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
}

// Notification system
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// User registration
document.getElementById('registration-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const id = document.getElementById('reg-id').value.trim();
    const phone = document.getElementById('reg-phone').value.trim();
    const name = document.getElementById('reg-name').value.trim();
    const password = document.getElementById('reg-password').value;
    
    // Validate phone number format
    if (!phone.match(/^\+?[0-9]{10,15}$/)) {
        showNotification('Please enter a valid phone number', 'error');
        return;
    }
    
    // Check if user already exists
    if (users.find(u => u.id === id)) {
        showNotification('User with this ID already exists', 'error');
        return;
    }
    
    if (users.find(u => u.phone === phone)) {
        showNotification('User with this phone number already exists', 'error');
        return;
    }
    
    // Create new user
    const newUser = {
        id,
        phone,
        name,
        password,
        balance: 0,
        groups: [],
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    Storage.set('users', users);
    
    showNotification('Registration successful! Please login.', 'success');
    
    // Clear form and show login page
    document.getElementById('registration-form').reset();
    setTimeout(() => showPage('login-page'), 1500);
});

// User login
document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const id = document.getElementById('login-id').value.trim();
    const password = document.getElementById('login-password').value;
    
    const user = users.find(u => u.id === id && u.password === password);
    
    if (!user) {
        showNotification('Invalid ID or password', 'error');
        return;
    }
    
    currentUser = user;
    Storage.set('currentUser', currentUser.id);
    
    showNotification(`Welcome back, ${user.name}!`, 'success');
    
    // Clear form and show dashboard
    document.getElementById('login-form').reset();
    loadDashboard();
    showPage('dashboard-page');
});

// Logout
document.getElementById('logout-btn').addEventListener('click', () => {
    currentUser = null;
    Storage.remove('currentUser');
    showNotification('Logged out successfully', 'success');
    showPage('login-page');
});

// Load dashboard
function loadDashboard() {
    if (!currentUser) return;
    
    document.getElementById('user-name').textContent = currentUser.name;
    document.getElementById('user-id').textContent = currentUser.id;
    document.getElementById('user-phone').textContent = currentUser.phone;
    
    // Calculate total balance
    const totalBalance = calculateUserBalance(currentUser.id);
    document.getElementById('total-balance').textContent = `${totalBalance.toLocaleString()} FC`;
}

// Calculate user balance
function calculateUserBalance(userId) {
    return transactions
        .filter(t => t.userId === userId)
        .reduce((sum, t) => {
            return t.type === 'deposit' ? sum + t.amount : sum - t.amount;
        }, 0);
}

// Create group
document.getElementById('create-group-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (!currentUser) return;
    
    const name = document.getElementById('group-name').value.trim();
    const description = document.getElementById('group-description').value.trim();
    const contributionAmount = parseFloat(document.getElementById('contribution-amount').value);
    
    // Check if group name already exists
    if (groups.find(g => g.name === name)) {
        showNotification('A group with this name already exists', 'error');
        return;
    }
    
    const newGroup = {
        id: Date.now().toString(),
        name,
        description,
        contributionAmount,
        creator: currentUser.id,
        members: [currentUser.id],
        createdAt: new Date().toISOString()
    };
    
    groups.push(newGroup);
    Storage.set('groups', groups);
    
    // Add group to user
    currentUser.groups.push(newGroup.id);
    updateUser(currentUser);
    
    showNotification('Group created successfully!', 'success');
    
    document.getElementById('create-group-form').reset();
    setTimeout(() => showPage('dashboard-page'), 1500);
});

// Update user in storage
function updateUser(user) {
    const index = users.findIndex(u => u.id === user.id);
    if (index !== -1) {
        users[index] = user;
        Storage.set('users', users);
    }
}

// Load available groups for joining
function loadAvailableGroups() {
    const container = document.getElementById('available-groups-list');
    const availableGroups = groups.filter(g => !g.members.includes(currentUser.id));
    
    if (availableGroups.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No groups available to join</p></div>';
        return;
    }
    
    container.innerHTML = availableGroups.map(group => `
        <div class="group-card" onclick="joinGroup('${group.id}')">
            <h4>${group.name}</h4>
            <p>${group.description}</p>
            <p><strong>Monthly Contribution:</strong> ${group.contributionAmount.toLocaleString()} FC</p>
            <p><strong>Members:</strong> ${group.members.length}</p>
        </div>
    `).join('');
}

// Join group
function joinGroup(groupId) {
    const group = groups.find(g => g.id === groupId);
    if (!group) return;
    
    if (group.members.includes(currentUser.id)) {
        showNotification('You are already a member of this group', 'warning');
        return;
    }
    
    group.members.push(currentUser.id);
    const groupIndex = groups.findIndex(g => g.id === groupId);
    groups[groupIndex] = group;
    Storage.set('groups', groups);
    
    currentUser.groups.push(groupId);
    updateUser(currentUser);
    
    showNotification(`Successfully joined ${group.name}!`, 'success');
    
    setTimeout(() => {
        showPage('dashboard-page');
    }, 1500);
}

// Load user groups
function loadUserGroups() {
    const container = document.getElementById('groups-list');
    const userGroups = groups.filter(g => g.members.includes(currentUser.id));
    
    if (userGroups.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>You are not a member of any groups yet</p></div>';
        return;
    }
    
    container.innerHTML = userGroups.map(group => {
        const groupBalance = calculateGroupBalance(currentUser.id, group.id);
        return `
            <div class="group-card" onclick="viewGroupDetails('${group.id}')">
                <h4>${group.name}</h4>
                <p>${group.description}</p>
                <p><strong>Monthly Contribution:</strong> ${group.contributionAmount.toLocaleString()} FC</p>
                <p><strong>Members:</strong> ${group.members.length}</p>
                <p><strong>Your Balance:</strong> ${groupBalance.toLocaleString()} FC</p>
            </div>
        `;
    }).join('');
}

// Calculate group balance for user
function calculateGroupBalance(userId, groupId) {
    return transactions
        .filter(t => t.userId === userId && t.groupId === groupId)
        .reduce((sum, t) => {
            return t.type === 'deposit' ? sum + t.amount : sum - t.amount;
        }, 0);
}

// View group details
function viewGroupDetails(groupId) {
    const group = groups.find(g => g.id === groupId);
    if (!group) return;
    
    document.getElementById('group-details-name').textContent = group.name;
    document.getElementById('group-details-description').textContent = group.description;
    document.getElementById('group-details-contribution').textContent = group.contributionAmount.toLocaleString();
    document.getElementById('group-details-members').textContent = group.members.length;
    
    const groupBalance = calculateGroupBalance(currentUser.id, groupId);
    document.getElementById('group-balance').textContent = `${groupBalance.toLocaleString()} FC`;
    
    // Load contributions
    const contributionsContainer = document.getElementById('group-contributions');
    const groupTransactions = transactions.filter(t => t.groupId === groupId);
    
    if (groupTransactions.length === 0) {
        contributionsContainer.innerHTML = '<div class="empty-state"><p>No contributions yet</p></div>';
    } else {
        contributionsContainer.innerHTML = groupTransactions.map(t => {
            const user = users.find(u => u.id === t.userId);
            return `
                <div class="contribution-item">
                    <div>
                        <div class="member-name">${user ? user.name : 'Unknown'}</div>
                        <div style="color: #999; font-size: 14px;">${new Date(t.date).toLocaleDateString()} - ${t.type}</div>
                    </div>
                    <div class="amount">${t.type === 'deposit' ? '+' : '-'}${t.amount.toLocaleString()} FC</div>
                </div>
            `;
        }).join('');
    }
    
    showPage('group-details-page');
}

// Load transaction form
function loadTransactionForm() {
    const groupSelect = document.getElementById('group-select');
    const userGroups = groups.filter(g => g.members.includes(currentUser.id));
    
    groupSelect.innerHTML = '<option value="">Select Group</option>' + 
        userGroups.map(group => `<option value="${group.id}">${group.name}</option>`).join('');
    
    loadTransactionHistory();
}

// Process transaction
document.getElementById('transaction-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (!currentUser) return;
    
    const type = document.getElementById('transaction-type').value;
    const paymentMethod = document.getElementById('payment-method').value;
    const groupId = document.getElementById('group-select').value;
    const amount = parseFloat(document.getElementById('amount').value);
    
    if (!groupId) {
        showNotification('Please select a group', 'error');
        return;
    }
    
    const group = groups.find(g => g.id === groupId);
    if (!group) {
        showNotification('Group not found', 'error');
        return;
    }
    
    // Check balance for withdrawal
    if (type === 'withdrawal') {
        const currentBalance = calculateGroupBalance(currentUser.id, groupId);
        if (amount > currentBalance) {
            showNotification('Insufficient balance', 'error');
            return;
        }
    }
    
    const transaction = {
        id: Date.now().toString(),
        userId: currentUser.id,
        groupId,
        type,
        paymentMethod,
        amount,
        date: new Date().toISOString()
    };
    
    transactions.push(transaction);
    Storage.set('transactions', transactions);
    
    showNotification(`${type === 'deposit' ? 'Deposit' : 'Withdrawal'} successful via ${paymentMethod}!`, 'success');
    
    document.getElementById('transaction-form').reset();
    loadTransactionForm();
    loadDashboard();
});

// Load transaction history
function loadTransactionHistory() {
    const container = document.getElementById('transactions-list');
    const userTransactions = transactions
        .filter(t => t.userId === currentUser.id)
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 10);
    
    if (userTransactions.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No transactions yet</p></div>';
        return;
    }
    
    container.innerHTML = userTransactions.map(t => {
        const group = groups.find(g => g.id === t.groupId);
        return `
            <div class="transaction-item ${t.type}">
                <p><strong>${t.type === 'deposit' ? 'Deposit' : 'Withdrawal'}</strong></p>
                <p>Amount: <strong>${t.amount.toLocaleString()} FC</strong></p>
                <p>Group: ${group ? group.name : 'Unknown'}</p>
                <p>Method: ${t.paymentMethod}</p>
                <p>Date: ${new Date(t.date).toLocaleString()}</p>
            </div>
        `;
    }).join('');
}

// Navigation event listeners
document.getElementById('show-login').addEventListener('click', (e) => {
    e.preventDefault();
    showPage('login-page');
});

document.getElementById('show-register').addEventListener('click', (e) => {
    e.preventDefault();
    showPage('registration-page');
});

document.getElementById('show-groups-btn').addEventListener('click', () => {
    loadUserGroups();
    showPage('groups-page');
});

document.getElementById('show-create-group-btn').addEventListener('click', () => {
    showPage('create-group-page');
});

document.getElementById('show-join-group-btn').addEventListener('click', () => {
    loadAvailableGroups();
    showPage('join-group-page');
});

document.getElementById('show-transaction-btn').addEventListener('click', () => {
    loadTransactionForm();
    showPage('transaction-page');
});

document.getElementById('back-to-dashboard-1').addEventListener('click', () => {
    showPage('dashboard-page');
});

document.getElementById('back-to-dashboard-2').addEventListener('click', () => {
    showPage('dashboard-page');
});

document.getElementById('back-to-dashboard-3').addEventListener('click', () => {
    showPage('dashboard-page');
});

document.getElementById('back-to-dashboard-4').addEventListener('click', () => {
    showPage('dashboard-page');
});

document.getElementById('back-to-groups').addEventListener('click', () => {
    loadUserGroups();
    showPage('groups-page');
});

// Initialize app
function initApp() {
    // Check if user is already logged in
    const savedUserId = Storage.get('currentUser');
    if (savedUserId) {
        currentUser = users.find(u => u.id === savedUserId);
        if (currentUser) {
            loadDashboard();
            showPage('dashboard-page');
        } else {
            showPage('registration-page');
        }
    } else {
        showPage('registration-page');
    }
}

// Start the app
initApp();
