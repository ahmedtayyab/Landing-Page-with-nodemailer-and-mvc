const express = require('express');
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files from root directory
app.use(express.static(__dirname));

// Session middleware
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
const indexRoutes = require('./routes/index');
const adminRoutes = require('./routes/admin');
const contactRoutes = require('./routes/contact');
const authRoutes = require('./routes/auth');
const newsletterRoutes = require('./routes/newsletter');

// API routes
app.use('/api', indexRoutes);
app.use('/admin', adminRoutes);
app.use('/contact', contactRoutes);
app.use('/auth', authRoutes);
app.use('/newsletter', newsletterRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
}); 