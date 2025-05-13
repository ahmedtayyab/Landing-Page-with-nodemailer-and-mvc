const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');
const nodemailer = require('nodemailer');

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Path to store subscriptions
const subscriptionsPath = path.join(__dirname, '../data/subscriptions.json');

// Ensure data directory exists
async function ensureDataDirectory() {
    const dataDir = path.join(__dirname, '../data');
    try {
        await fs.access(dataDir);
    } catch {
        await fs.mkdir(dataDir);
    }
}

// Initialize subscriptions file if it doesn't exist
async function initializeSubscriptionsFile() {
    try {
        await fs.access(subscriptionsPath);
    } catch {
        await fs.writeFile(subscriptionsPath, JSON.stringify([], null, 2));
    }
}

// Handle newsletter subscription
router.post('/subscribe', async (req, res) => {
    try {
        const { email } = req.body;

        // Validate email
        if (!email || !email.includes('@')) {
            return res.status(400).json({ error: 'Please provide a valid email address' });
        }

        // Ensure data directory and file exist
        await ensureDataDirectory();
        await initializeSubscriptionsFile();

        // Read existing subscriptions
        const subscriptions = JSON.parse(await fs.readFile(subscriptionsPath, 'utf8'));

        // Check if email is already subscribed
        if (subscriptions.includes(email)) {
            return res.status(400).json({ error: 'This email is already subscribed' });
        }

        // Add new subscription
        subscriptions.push(email);
        await fs.writeFile(subscriptionsPath, JSON.stringify(subscriptions, null, 2));

        // Send welcome email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Welcome to NexivoTechs Newsletter!',
            html: `
                <h2>Welcome to NexivoTechs Newsletter!</h2>
                <p>Thank you for subscribing to our newsletter. You'll now receive updates about:</p>
                <ul>
                    <li>Latest tech trends and innovations</li>
                    <li>Company news and updates</li>
                    <li>Special offers and promotions</li>
                    <li>Blog posts and articles</li>
                </ul>
                <p>Stay tuned for our next update!</p>
                <p>Best regards,<br>NexivoTechs Team</p>
            `
        };

        await transporter.sendMail(mailOptions);

        // Send success response
        res.status(200).json({ message: 'Successfully subscribed to newsletter!' });
    } catch (error) {
        console.error('Error processing newsletter subscription:', error);
        res.status(500).json({ error: 'Failed to process subscription. Please try again later.' });
    }
});

module.exports = router; 