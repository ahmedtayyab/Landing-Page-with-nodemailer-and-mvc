const express = require('express');
const router = express.Router();
const path = require('path');

// Serve the main landing page
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

// Serve other static pages
router.get('/signin', (req, res) => {
    res.sendFile(path.join(__dirname, '../signin.html'));
});

router.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, '../signup.html'));
});

router.get('/forgot-password', (req, res) => {
    res.sendFile(path.join(__dirname, '../forgot-password.html'));
});

module.exports = router; 