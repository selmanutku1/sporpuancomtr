const fs = require('fs');
let content = fs.readFileSync('src/components/HoverRatingBar.tsx', 'utf8');

// Increase height for better mobile touch target
content = content.replace('h-6 sm:h-8', 'h-10 sm:h-8');
// Increase emoji size
content = content.replace('text-2xl', 'text-3xl sm:text-2xl');

fs.writeFileSync('src/components/HoverRatingBar.tsx', content);
console.log('Hover sizes updated.');
