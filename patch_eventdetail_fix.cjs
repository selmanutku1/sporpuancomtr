const fs = require('fs');
let content = fs.readFileSync('src/components/EventDetailModal.tsx', 'utf8');

content = content.replace(
  /\)\n    \.join\(' '\);\n\}/g,
  ''
);

fs.writeFileSync('src/components/EventDetailModal.tsx', content);
console.log('Fixed syntax error in EventDetailModal');
