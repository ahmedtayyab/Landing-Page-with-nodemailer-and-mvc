const express = require('express');
const router = express.Router();
const users = require('../models/userModel'); // Import the user model

// Sign-Up Route
router.post('/signup', (req, res) => {
    const { username, password } = req.body; // Get username and password from request body
    // Check if user already exists
    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
        return res.status(400).send('User already exists');
    }
    // Add new user
    users.push({ username, password });
    res.status(201).send('User registered successfully');
});

// Sign-In Route
router.post('/signin', (req, res) => {
    const { username, password } = req.body; // Get username and password from request body
    // Check if user exists
    const user = users.find(user => user.username === username);
    if (!user || user.password !== password) {
        return res.status(401).send('Invalid username or password');
    }
    res.status(200).send('Sign-in successful');
});

module.exports = router;
