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

// play by play API endpoint (need to pass an actual game ID)
app.get('/api/playbyplay/:gameId', async (req, res) => {
  try {
    const { gameId } = req.params;

    if (!/^\d{10}$/.test(gameId)) {
      return res.status(400).json({ error: 'Invalid game ID format' });
    }

    const url = `https://api-web.nhle.com/v1/gamecenter/${gameId}/play-by-play`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`NHL API returned ${response.status}`);
    }
    const data = await response.json();
    res.json(data);

  } catch (error) {
    console.error('Error fetching play-by-play:', error);
    res.status(500).json({ error: 'Failed to fetch play-by-play data' });
  }
});


//specific player api endpoint

app.get('/api/player/:playerId', async (req, res) => {
  try {
    const { playerId } = req.params;
    const response = await fetch(`https://api-web.nhle.com/v1/player/${playerId}/landing`);
    if (!response.ok) {
      throw new Error(`NHL API returned ${response.status}`);
    }

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