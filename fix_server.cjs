const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const regex = /if \(photosList\.length > 0\) \{[\s\S]*?\n\s*\} else if \(detectedCategory === 'Spor Okulları'\) \{[\s\S]*?\n\s*\}/;

const toRemove = `} else if (detectedCategory === 'Spor Okulları') {
          photoUrl = 'https://images.unsplash.com/photo-1515523110800-9415d13b84a8?q=80&w=1470&auto=format&fit=crop';
        } else if (detectedCategory === 'Spor Etkinlikleri') {
          photoUrl = 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=1470&auto=format&fit=crop';
        } else {
          photoUrl = 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1470&auto=format&fit=crop';
        }`;

content = content.replace(toRemove, '');
fs.writeFileSync('server.ts', content);
console.log('Fixed');
