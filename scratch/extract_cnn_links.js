const http = require('https');

http.get('https://www.cnnbrasil.com.br/tecnologia/', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    const urls = [];
    const regex = /href="(https:\/\/www\.cnnbrasil\.com\.br\/tecnologia\/[^"]+)"/g;
    let match;
    while ((match = regex.exec(data)) !== null) {
      if (!urls.includes(match[1])) {
        urls.push(match[1]);
      }
    }
    console.log('CNN TECH LINKS:', urls.slice(0, 10));
  });
}).on('error', (err) => {
  console.error('Error fetching CNN Tech page:', err);
});
