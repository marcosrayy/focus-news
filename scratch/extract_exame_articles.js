const https = require('https');

const options = {
  host: 'exame.com',
  path: '/noticias-sobre/Startups/1/',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html'
  }
};

https.get(options, (res) => {
  let html = '';
  res.on('data', (chunk) => {
    html += chunk;
  });
  res.on('end', () => {
    // Build image map
    const imageMap = new Map();
    // Regex matching alt and src
    const imgRegex = /<img[^>]+alt="([^"]+)"[^>]+src="(https:\/\/classic\.exame\.com\/[^"]+)"/g;
    let imgMatch;
    while ((imgMatch = imgRegex.exec(html)) !== null) {
      const title = imgMatch[1].trim();
      const src = imgMatch[2].trim();
      imageMap.set(title, src);
    }
    
    console.log('Image Map Size:', imageMap.size);
    
    // Parse articles
    const regex = /href="(https:\/\/exame\.com\/[^"]+)" class="touch-area">([^<]+)<\/a>/g;
    let match;
    const articles = [];
    
    while ((match = regex.exec(html)) !== null) {
      const url = match[1];
      const title = match[2].trim()
        .replace(/&#x27;/g, "'")
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>');
      
      // Look up image
      const image = imageMap.get(title) || imageMap.get(match[2].trim()) || 'PLACEHOLDER';
      articles.push({ title, url, image });
    }
    
    console.log('EXTRACTED ARTICLES WITH IMAGES:', articles.slice(0, 10));
  });
}).on('error', (err) => {
  console.error('Error:', err);
});
