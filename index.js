const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = 5000;

app.use(express.json());

app.get('/', (req, res) => res.json({ message: 'working' }));

// Extract metadata from the given URL
app.post('/extract-metadata', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    // Fetch the page content using axios
    const { data: html } = await axios.get(url);

    // Load the HTML into cheerio
    const $ = cheerio.load(html);

    // Extract metadata
    const metadata = {
      title: $('head title').text(),
      description: $('meta[name="description"]').attr('content'),
      ogTitle: $('meta[property="og:title"]').attr('content'),
      ogDescription: $('meta[property="og:description"]').attr('content'),
      ogImage: $('meta[property="og:image"]').attr('content'),
      twitterTitle: $('meta[name="twitter:title"]').attr('content'),
      twitterDescription: $('meta[name="twitter:description"]').attr('content'),
      twitterImage: $('meta[name="twitter:image"]').attr('content'),
    };

    res.json(metadata);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to extract metadata' });
  }
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
