const express = require('express');
const emailController = require('../controllers/emailController');
const router = express.Router();

// Remove the route that renders the old contact form
// router.get('/contact', (req, res) => {
//     res.render('contact'); // This should render the contact view if you have one
// });

// Handle form submission
router.post('/contact', emailController.sendEmail);

module.exports = router;
