const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');
if (!content.includes('toggleFavorite')) {
  console.log('toggleFavorite not found. We will add it.');
}
