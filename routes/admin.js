const express = require('express');
const router = express.Router();
const path = require('path');
const bcrypt = require('bcryptjs');
const fs = require('fs').promises;

// Helper function to read JSON file
async function readJsonFile(filePath) {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading ${filePath}:`, error);
        return null;
    }
}

// Helper function to write JSON file
async function writeJsonFile(filePath, data) {
    try {
        await fs.writeFile(filePath, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error(`Error writing ${filePath}:`, error);
        return false;
    }
}

// Admin authentication middleware
const isAdmin = (req, res, next) => {
    if (req.session && req.session.isAdmin) {
        next();
    } else {
        res.status(401).json({ success: false, message: 'Unauthorized' });
    }
};

// Serve admin login page
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../admin.html'));
});

// Handle admin login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    try {
        console.log('Login attempt:', { username });
        const usersData = await readJsonFile(path.join(__dirname, '../data/users.json'));
        
        if (!usersData || !usersData.users) {
            console.error('Invalid users data structure');
            return res.status(500).json({ success: false, message: 'Server configuration error' });
        }

        const user = usersData.users.find(u => u.email === username);
        console.log('User found:', user ? 'Yes' : 'No');
        
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        // Simple password comparison
        if (password === user.password) {
            req.session.isAdmin = true;
            req.session.userId = user.id;
            req.session.save((err) => {
                if (err) {
                    console.error('Session save error:', err);
                    return res.status(500).json({ success: false, message: 'Session error' });
                }
                res.json({ success: true });
            });
        } else {
            res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Admin logout
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err);
            return res.status(500).json({ success: false, message: 'Logout failed' });
        }
        res.redirect('/admin');
    });
});

// Protected admin routes
router.get('/dashboard', isAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, '../admin.html'));
});

// API endpoints for admin functionality
router.get('/api/users', isAdmin, async (req, res) => {
    try {
        console.log('Fetching users, session:', req.session);
        const usersData = await readJsonFile(path.join(__dirname, '../data/users.json'));
        if (!usersData || !usersData.users) {
            throw new Error('Invalid users data structure');
        }
        // Remove password from response
        const users = usersData.users.map(({ password, ...user }) => user);
        res.json({ users });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ success: false, message: 'Error fetching users' });
    }
});

router.post('/api/users', isAdmin, async (req, res) => {
    try {
        const { name, email, role, status } = req.body;
        const usersData = await readJsonFile(path.join(__dirname, '../data/users.json'));
        
        // Check if email already exists
        if (usersData.users.some(user => user.email === email)) {
            return res.status(400).json({ success: false, message: 'Email already exists' });
        }
        
        // Create new user
        const newUser = {
            id: usersData.users.length + 1,
            name,
            email,
            password: await bcrypt.hash('defaultPassword123', 10), // Default password
            role,
            status,
            createdAt: new Date().toISOString()
        };
        
        usersData.users.push(newUser);
        await writeJsonFile(path.join(__dirname, '../data/users.json'), usersData);
        
        const { password, ...userWithoutPassword } = newUser;
        res.json({ success: true, user: userWithoutPassword });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error creating user' });
    }
});

router.put('/api/users/:id', isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, role, status } = req.body;
        const usersData = await readJsonFile(path.join(__dirname, '../data/users.json'));
        
        const userIndex = usersData.users.findIndex(user => user.id === parseInt(id));
        if (userIndex === -1) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        
        // Check if email is being changed and if it already exists
        if (email !== usersData.users[userIndex].email && 
            usersData.users.some(user => user.email === email)) {
            return res.status(400).json({ success: false, message: 'Email already exists' });
        }
        
        // Update user
        usersData.users[userIndex] = {
            ...usersData.users[userIndex],
            name,
            email,
            role,
            status
        };
        
        await writeJsonFile(path.join(__dirname, '../data/users.json'), usersData);
        
        const { password, ...userWithoutPassword } = usersData.users[userIndex];
        res.json({ success: true, user: userWithoutPassword });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating user' });
    }
});

router.delete('/api/users/:id', isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const usersData = await readJsonFile(path.join(__dirname, '../data/users.json'));
        
        const userIndex = usersData.users.findIndex(user => user.id === parseInt(id));
        if (userIndex === -1) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        
        // Don't allow deleting the last admin
        const isLastAdmin = usersData.users[userIndex].role === 'Admin' &&
            usersData.users.filter(user => user.role === 'Admin').length === 1;
        
        if (isLastAdmin) {
            return res.status(400).json({ success: false, message: 'Cannot delete the last admin user' });
        }
        
        usersData.users.splice(userIndex, 1);
        await writeJsonFile(path.join(__dirname, '../data/users.json'), usersData);
        
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting user' });
    }
});

router.get('/api/analytics', isAdmin, async (req, res) => {
    try {
        console.log('Fetching analytics, session:', req.session);
        const analyticsData = await readJsonFile(path.join(__dirname, '../data/analytics.json'));
        if (!analyticsData) {
            throw new Error('Invalid analytics data structure');
        }
        res.json(analyticsData);
    } catch (error) {
        console.error('Error fetching analytics:', error);
        res.status(500).json({ success: false, message: 'Error fetching analytics' });
    }
});

module.exports = router; 