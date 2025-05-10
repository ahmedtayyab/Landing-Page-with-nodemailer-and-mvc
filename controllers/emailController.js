const nodemailer = require('nodemailer');
const Email = require('../models/emailModel');
require('dotenv').config();

exports.sendEmail = async (req, res) => {
    const { name, email, message } = req.body;
    const emailData = new Email(name, email, message);

    // Configure Nodemailer
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: emailData.email,
        to: process.env.EMAIL_USER,
        subject: `New message from ${emailData.name}`,
        text: `You have received a new message from your contact form:\n\n` +
              `Name: ${emailData.name}\n` +
              `Email: ${emailData.email}\n` +
              `Message: ${emailData.message}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).send('Email sent successfully!');
    } catch (error) {
        res.status(500).send('Error sending email: ' + error.message);
    }
};
