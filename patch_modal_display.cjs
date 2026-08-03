const fs = require('fs');

let content = fs.readFileSync('src/components/EventDetailModal.tsx', 'utf8');
content = content.replace(
  '{score.toFixed(1)}',
  '{max === 100 ? `%${Math.round(score)}` : score.toFixed(1)}'
);

fs.writeFileSync('src/components/EventDetailModal.tsx', content);
console.log('Fixed SVG rendering string for max 100');
