const fs = require('fs');
let content = fs.readFileSync('src/components/HoverRatingBar.tsx', 'utf8');

// Decrease height for a thinner look
content = content.replace('h-10 sm:h-8', 'h-6 sm:h-5');
// Make emojis a bit more reasonable
content = content.replace('text-3xl sm:text-2xl', 'text-2xl');

fs.writeFileSync('src/components/HoverRatingBar.tsx', content);
console.log('Hover sizes updated.');
