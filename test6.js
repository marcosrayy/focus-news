const html = require('fs').readFileSync('forbes.html', 'utf8');
const m = html.match(/<a[^>]+href="([^"]+)"[^>]*>.*?<\/a>/g);
if(m) {
  const articles = m.filter(x => x.includes('forbes.com.br/') && !x.includes('category') && !x.includes('author') && !x.includes('page/'));
  console.log(articles.slice(0, 10));
}
