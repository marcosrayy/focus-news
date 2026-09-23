const fs = require('fs');

let code = fs.readFileSync('components/hero-article.tsx', 'utf8');

// Fix the corrupted lines
code = code.replace('title: "A Revolucaores",', 'title: "A Revolucao dos Semicondutores",');
code = code.replace('{displayACOESTAQUE TECH"}', '{displayArticle.category || "DESTAQUE TECH"}');

// Fix the height issue to make it stretch
// Skeleton wrapper
code = code.replace('className="group relative overflow-hidden rounded-2xl"', 'className="group relative overflow-hidden rounded-2xl h-full"');
// Skeleton inner
code = code.replace('className="relative aspect-[16/9] w-full lg:aspect-[2/1] bg-secondary/50 animate-pulse"', 'className="relative h-full min-h-[300px] w-full lg:aspect-auto lg:h-full bg-secondary/50 animate-pulse"');

// Article wrapper
code = code.replace('className="group relative overflow-hidden rounded-2xl cursor-pointer"', 'className="group relative overflow-hidden rounded-2xl cursor-pointer h-full"');
// Article inner
code = code.replace('className="relative aspect-[16/9] w-full lg:aspect-[2/1]"', 'className="relative h-full min-h-[300px] w-full lg:aspect-auto lg:h-full"');

fs.writeFileSync('components/hero-article.tsx', code, 'utf8');
console.log('Fixed hero-article');
