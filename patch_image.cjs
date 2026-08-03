const fs = require('fs');
let content = fs.readFileSync('src/components/ReviewPage.tsx', 'utf8');
content = content.replace(/targetEvent\.imageUrl/g, 'targetEvent.image');
fs.writeFileSync('src/components/ReviewPage.tsx', content);
