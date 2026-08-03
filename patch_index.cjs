const fs = require('fs');

let content = fs.readFileSync('index.html', 'utf8');

content = content.replace(
  /<meta name="description" content=".*?" \/>/g,
  '<meta name="description" content="Türkiye\'nin tarafsız spor tesisleri puanlama ve inceleme platformu. Spor salonları, spor okulları ve etkinlikleri hijyen, ekipman ve lokasyon gibi boyutlarda keşfedin, objektif yorumları okuyun." />'
);

content = content.replace(
  /<meta property="og:description" content=".*?" \/>/g,
  '<meta property="og:description" content="Türkiye\'nin tarafsız spor tesisleri puanlama ve inceleme platformu. Spor salonları, spor okulları ve etkinlikleri hijyen, ekipman ve lokasyon gibi boyutlarda keşfedin, objektif yorumları okuyun." />'
);

content = content.replace(
  /<meta name="twitter:description" content=".*?" \/>/g,
  '<meta name="twitter:description" content="Türkiye\'nin tarafsız spor tesisleri puanlama ve inceleme platformu. Spor salonları, spor okulları ve etkinlikleri hijyen, ekipman ve lokasyon gibi boyutlarda keşfedin, objektif yorumları okuyun." />'
);

fs.writeFileSync('index.html', content);
console.log('Updated index.html');
