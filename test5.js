const fs = require('fs');
const html = fs.readFileSync('g1.html', 'utf8');

const regex = /<a[^>]+href="([^"]+)"[^>]*>([^<]+)<\/a>/g;
let match;
let count = 0;
while ((match = regex.exec(html)) !== null && count < 20) {
  if (match[1].includes('g1.globo.com') && match[1].includes('.ghtml') && match[2].trim().length > 10) {
    console.log(match[1], match[2].trim());
    count++;
  }
}
