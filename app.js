const express = require('express');
const bodyParser = require('body-parser');
const emailRoutes = require('./routes/emailRoutes');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public')); // For serving static files

// Serve index.html for the root URL
app.get('/', (req, res) => {
    console.log('Root route accessed');
    res.sendFile(path.join(__dirname, 'index.html')); // Serve the index.html file
});

app.use('/', emailRoutes); // Ensure this is after the root route

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
