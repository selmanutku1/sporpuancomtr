const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const regex = /let photoUrl = null;\s*if \(detectedCategory === 'Spor Salonları'\) \{[\s\S]*?photoUrl = 'https:\/\/images\.unsplash\.com\/photo-[^']*';\s*\}/g;

const replacement = `let photoUrl = null;
      if (photosList.length > 0) {
        photoUrl = photosList[0];
      } else {
        if (detectedCategory === 'Spor Salonları') {
          photoUrl = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop';
        } else if (detectedCategory === 'Spor Okulları') {
          photoUrl = 'https://images.unsplash.com/photo-1515523110800-9415d13b84a8?q=80&w=1470&auto=format&fit=crop';
        } else if (detectedCategory === 'Spor Etkinlikleri') {
          photoUrl = 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=1470&auto=format&fit=crop';
        } else {
          photoUrl = 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1470&auto=format&fit=crop';
        }
      }`;

content = content.replace(regex, replacement);
fs.writeFileSync('server.ts', content);
console.log('Fixed');
