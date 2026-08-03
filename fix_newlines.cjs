const fs = require('fs');

let content = fs.readFileSync('src/components/EventDetailModal.tsx', 'utf8');
content = content.replace(/label=\{"Tavsiye\nOranı"\}/g, 'label={"Tavsiye\\nOranı"}');
content = content.replace(/label=\{"Fiyat\nPerformans"\}/g, 'label={"Fiyat\\nPerformans"}');

fs.writeFileSync('src/components/EventDetailModal.tsx', content);
console.log('Fixed newlines');
