const fs = require('fs');
fetch('https://forbes.com.br/noticias-sobre/inovacao/')
  .then(r => r.text())
  .then(html => {
    fs.writeFileSync('forbes.html', html);
    console.log('Saved forbes.html');
  });
