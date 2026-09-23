const http = require('https');

http.get('https://exame.com/noticias-sobre/startups/', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log('HTML LENGTH:', data.length);
    // Find some sample links to see structure
    const matches = data.match(/href="([^"]+exame\.com\/[^"]+)"/g);
    console.log('SAMPLE LINKS:', matches?.slice(0, 30));
  });
}).on('error', (err) => {
  console.error('Error fetching Exame Startups page:', err);
});
