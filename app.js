// app.js
//require('dotenv').config();

// Drivers and modules
const express = require('express');
const path = require('path');
const connectDB = require('./config/db');
const fileUpload = require('express-fileupload');

// routes
const schemaRoutes = require('./routes/schemaRoutes');
const sectionRoutes = require('./routes/sectionRoutes');
const pageRoutes = require('./routes/pageRoutes');


const app = express();
const PORT = process.env.PORT || 8080;

// 1. Set up EJS View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 2. Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // REQUIRED to parse HTML Form submissions
app.use('/ui', express.static(path.join(__dirname, 'ui')));

// 2.1 Enable files upload with options
app.use(fileUpload({
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
    abortOnLimit: true,                    // Stop upload if file is too big
    responseOnLimit: 'File size limit exceeded (Max 5MB).',
    createParentPath: true                 // Create the directory if it doesn't exist
}));

// 3. Mount Routes
app.use('/', schemaRoutes);
app.use('/', sectionRoutes);
app.use('/', pageRoutes);

// 4. Start Server
async function startServer() {
    try {
        await connectDB(); // Establish connection pool [cite: 2, 4]
        app.listen(PORT, () => console.log(`Viewer running at http://localhost:${PORT}`));
    } catch (error) {
        console.error('Server startup failed:', error);
        process.exit(1);
    }
}
startServer();