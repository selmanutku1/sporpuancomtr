const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const sitemapRegex = /app\.get\('\/sitemap\.xml',\s*\(req,\s*res\)\s*=>\s*\{[\s\S]*?res\.send\(xml\);\n  \}\);/g;

const newSitemapHandler = `app.get('/sitemap.xml', async (req, res) => {
    const host = req.headers.host || 'sporpuan.com';
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const baseUrl = \`\${protocol}://\${host}\`;
    const today = new Date().toISOString().split('T')[0];

    const staticUrls = [
      { loc: \`\${baseUrl}/\`, priority: '1.0', changefreq: 'daily' },
      { loc: \`\${baseUrl}/harita\`, priority: '0.9', changefreq: 'daily' },
      { loc: \`\${baseUrl}/kurumsal\`, priority: '0.8', changefreq: 'weekly' },
      { loc: \`\${baseUrl}/yorum-yaz\`, priority: '0.8', changefreq: 'weekly' },
      { loc: \`\${baseUrl}/puanla\`, priority: '0.8', changefreq: 'weekly' }
    ];

    let xml = \`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\`;

    for (const item of staticUrls) {
      xml += \`  <url>
    <loc>\${item.loc}</loc>
    <lastmod>\${today}</lastmod>
    <changefreq>\${item.changefreq}</changefreq>
    <priority>\${item.priority}</priority>
  </url>\\n\`;
    }

    try {
      const querySnapshot = await getDocs(collection(db, "facilities"));
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const slug = data.slug || docSnap.id;
        // determine base path based on category (tesis, salon, okul, etkinlik)
        let prefix = 'tesis';
        if (data.category === 'Spor Salonları') prefix = 'salon';
        else if (data.category === 'Spor Okulları') prefix = 'okul';
        else if (data.category === 'Spor Etkinlikleri') prefix = 'etkinlik';
        
        xml += \`  <url>
    <loc>\${baseUrl}/\${prefix}/\${slug}</loc>
    <lastmod>\${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>\\n\`;
      });
    } catch (err) {
      console.error('Error fetching facilities for sitemap:', err);
    }

    xml += \`</urlset>\`;
    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    return res.send(xml);
  });`;

content = content.replace(sitemapRegex, newSitemapHandler);
fs.writeFileSync('server.ts', content);
console.log('Patched sitemap');
