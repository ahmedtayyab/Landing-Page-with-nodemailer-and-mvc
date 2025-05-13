const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Handle user registration
router.post('/register', async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ success: false, message: 'Invalid email format' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Send welcome email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Welcome to NexivoTechs',
            html: `
                <h3>Welcome to NexivoTechs!</h3>
                <p>Dear ${fullName},</p>
                <p>Thank you for registering with us. We're excited to have you on board!</p>
                <p>Best regards,<br>NexivoTechs Team</p>
            `
        };

        await transporter.sendMail(mailOptions);

        res.json({ success: true, message: 'Registration successful!' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ success: false, message: 'Registration failed. Please try again.' });
    }
});

// Handle user login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // In a real application, you would verify against a database
        // For now, we'll just check if the email exists in our mock data
        const mockUser = {
            email: 'user@example.com',
            password: await bcrypt.hash('password123', 10)
        };

        if (email === mockUser.email) {
            const isValid = await bcrypt.compare(password, mockUser.password);
            if (isValid) {
                req.session.user = { email };
                res.json({ success: true });
            } else {
                res.status(401).json({ success: false, message: 'Invalid credentials' });
            }
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Login failed. Please try again.' });
    }
});

// Handle password reset request
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;

        // In a real application, you would generate a reset token and store it
        const resetToken = 'mock-reset-token';

        // Send password reset email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset Request',
            html: `
                <h3>Password Reset Request</h3>
                <p>You have requested to reset your password. Click the link below to proceed:</p>
                <p><a href="${process.env.BASE_URL}/reset-password?token=${resetToken}">Reset Password</a></p>
                <p>If you didn't request this, please ignore this email.</p>
            `
        };

        await transporter.sendMail(mailOptions);

        res.json({ success: true, message: 'Password reset instructions sent to your email.' });
    } catch (error) {
        console.error('Password reset error:', error);
        res.status(500).json({ success: false, message: 'Failed to process password reset request.' });
    }
});

module.exports = router; 