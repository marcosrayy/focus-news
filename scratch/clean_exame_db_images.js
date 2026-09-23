const fs = require('fs');
const path = require('path');
const https = require('https');

const dbPath = path.join(__dirname, '../data/news_db.json');

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
    const imgRegex = /<img[^>]+alt="([^"]+)"[^>]+src="(https:\/\/classic\.exame\.com\/[^"]+)"/g;
    let imgMatch;
    while ((imgMatch = imgRegex.exec(html)) !== null) {
      const title = imgMatch[1].trim();
      const src = imgMatch[2].trim();
      imageMap.set(title, src);
    }
    
    console.log('Parsed Exame images:', imageMap.size);

    if (fs.existsSync(dbPath)) {
      const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
      let updated = 0;
      
      const cleanedDb = db.map(art => {
        if (art.source === 'Exame') {
          // Find if there is a real image for this article title
          const titleKey = art.title.trim();
          const realImg = imageMap.get(titleKey);
          
          // If the article currently has the mock image, replace it
          if (realImg && (art.image.includes('unsplash.com') || !art.image)) {
            updated++;
            return {
              ...art,
              image: realImg
            };
          }
        }
        return art;
      });
      
      fs.writeFileSync(dbPath, JSON.stringify(cleanedDb, null, 2), 'utf8');
      console.log(`Database cleaned. Updated ${updated} Exame articles with real cover images.`);
    }
  });
}).on('error', (err) => {
  console.error('Error cleaning database:', err);
});
