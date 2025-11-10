import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

app.use(cors());
app.use(express.static('.'));

//standings API endpoint
app.get('/api/standings', async (req, res) => {
    try {
        const response = await fetch('https://api-web.nhle.com/v1/standings/now');
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to fetch standings' });
    }
});

// habs API endpoint
app.get('/api/habs', async (req, res) => {
    try {
        
        const response = await fetch('https://api-web.nhle.com/v1/club-stats/MTL/now');
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to fetch habs stats' });
    }
});

// Serve index.html for the root route
app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});