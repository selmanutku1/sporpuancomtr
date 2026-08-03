const fs = require('fs');
const glob = require('glob');
const path = require('path');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;
  content = content.replace(/<img([\s\S]*?)>/g, (match, p1) => {
    if (match.includes('referrerPolicy')) return match;
    return `<img referrerPolicy="no-referrer"${p1}>`;
  });
  if (original !== content) {
    fs.writeFileSync(filePath, content);
    console.log('Updated', filePath);
  }
}

glob.sync('src/**/*.tsx').forEach(processFile);
console.log('Done');
