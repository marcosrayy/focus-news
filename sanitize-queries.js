const fs = require('fs');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = dir + '/' + file;
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            if (file.endsWith('.tsx')) results.push(file);
        }
    });
    return results;
}

const files = walk('components').concat(['app/page.tsx']);

files.forEach(f => {
    let t = fs.readFileSync(f, 'utf8');

    // Clean useNews query
    t = t.replace(/useNews\("([^"]+)"/g, (match, query) => {
        // Remove accents and weird characters
        const cleaned = query
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .split('')
            .filter((char) => char.charCodeAt(0) <= 127)
            .join('');
        return 'useNews("' + cleaned + '"';
    });

    fs.writeFileSync(f, t, 'utf8');
});
console.log('Sanitized useNews queries');
