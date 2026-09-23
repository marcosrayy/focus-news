const fs = require('fs');
const html = fs.readFileSync('forbes.html', 'utf8');

const regex = /<a[^>]+href="([^"]+)"[^>]*>([^<]+)<\/a>/g;
let match;
let count = 0;
while ((match = regex.exec(html)) !== null && count < 20) {
  if (match[1].includes('forbes.com.br/forbes-tech/') || match[1].includes('/inovacao/')) {
    console.log(match[1], match[2].trim());
    count++;
  }
}
