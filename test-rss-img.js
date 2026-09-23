const fetch = require('node-fetch');

async function check() {
  const urls = [
    'https://www.infomoney.com.br/feed/',
    'https://exame.com/feed/',
    'https://valor.globo.com/rss/'
  ];
  
  for (const u of urls) {
    console.log("Feed:", u);
    const res = await fetch('https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent(u));
    const data = await res.json();
    if (!data.items) {
      console.log("No items");
      continue;
    }
    data.items.slice(0, 2).forEach(i => {
      let descImg = null;
      const imgMatch = i.description && i.description.match(/<img[^>]+src="([^">]+)"/);
      if (imgMatch) descImg = imgMatch[1];
      
      let contentImg = null;
      const contentMatch = i.content && i.content.match(/<img[^>]+src="([^">]+)"/);
      if (contentMatch) contentImg = contentMatch[1];

      console.log("  Title:", i.title);
      console.log("  Thumbnail:", i.thumbnail);
      console.log("  Enclosure:", i.enclosure?.link);
      console.log("  Desc Img:", descImg);
      console.log("  Content Img:", contentImg);
      console.log("  --");
    });
  }
}
check();
