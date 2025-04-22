const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files from current directory

// File path for storing responses
const responsesFile = path.join(__dirname, 'data/responses.json');

// Ensure data directory exists
if (!fs.existsSync(path.join(__dirname, 'data'))) {
    fs.mkdirSync(path.join(__dirname, 'data'));
}

// Initialize responses file if it doesn't exist
if (!fs.existsSync(responsesFile)) {
    fs.writeFileSync(responsesFile, JSON.stringify({ responses: [] }));
}

// Save response endpoint
app.post('/save-response', (req, res) => {
    try {
        const newResponse = req.body;
        
        // Read existing responses
        const existingData = JSON.parse(fs.readFileSync(responsesFile, 'utf8'));
        
        // Add new response
        existingData.responses.push(newResponse);
        
        // Save back to file
        fs.writeFileSync(responsesFile, JSON.stringify(existingData, null, 2));
        
        res.json({ success: true, message: 'Response saved successfully' });
    } catch (error) {
        console.error('Error saving response:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get all responses endpoint
app.get('/responses', (req, res) => {
    try {
        const data = JSON.parse(fs.readFileSync(responsesFile, 'utf8'));
        res.json(data);
    } catch (error) {
        console.error('Error reading responses:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}); 