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
    console.log('HTML length:', html.length);
    // Find some img tags and print them
    const imgs = html.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/g) || [];
    console.log('Total img tags:', imgs.length);
    console.log('Sample img tags:', imgs.slice(0, 30));
    
    // Find if there is any image related to touch-area or next to it
    const cards = html.match(/<div class="[^"]*card[^"]*"[\s\S]*?<\/div>/g) || [];
    console.log('Possible cards count:', cards.length);
    
    // Let's print snippets around touch-area links
    let pos = 0;
    for (let i = 0; i < 3; i++) {
      pos = html.indexOf('class="touch-area"', pos);
      if (pos === -1) break;
      const start = Math.max(0, pos - 500);
      const end = Math.min(html.length, pos + 500);
      console.log(`SNIPPET ${i}:`, html.substring(start, end));
      console.log('==================================================');
      pos += 20;
    }
  });
}).on('error', (err) => {
  console.error('Error:', err);
});
