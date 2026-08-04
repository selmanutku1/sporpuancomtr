const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const regex = /app\.use\(async \(req, res, next\) => \{[\s\S]*?\}\);/g;

const newMiddleware = `app.use(async (req, res, next) => {
    if (req.method === 'GET' && (req.headers.accept || '').includes('text/html')) {
      const protocol = req.headers['x-forwarded-proto'] || 'https';
      const host = req.headers.host || 'localhost:3000';
      const baseUrl = \`\${protocol}://\${host}\`;

      if (process.env.NODE_ENV !== 'production') {
        next();
      } else {
        const indexPath = path.join(process.cwd(), 'dist', 'index.html');
        try {
          const fs = await import('fs/promises');
          let html = await fs.readFile(indexPath, 'utf-8');

          html = html.replace(/content="\\/og-image\\.svg"/g, \`content="\${baseUrl}/og-image.svg"\`);
          html = html.replace(/content="\\/sporpuan-logo\\.svg"/g, \`content="\${baseUrl}/sporpuan-logo.svg"\`);
          html = html.replace(/href="\\/favicon\\.svg"/g, \`href="\${baseUrl}/favicon.svg"\`);

          // Match dynamic facility routes
          const match = req.path.match(/^\\/(tesis|salon|okul|etkinlik|detay|tesisler|salonlar|spor-okulu|spor-okullari|etkinlikler)\\/([^\\/]+)\\/?$/);
          if (match) {
            const facilityId = match[2];
            let facilityData = null;

            // Try to find by slug first
            const q = query(collection(db, "facilities"), where("slug", "==", facilityId), limit(1));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
              facilityData = querySnapshot.docs[0].data();
            } else {
              // Try by document ID
              const docRef = doc(db, "facilities", facilityId);
              const docSnap = await getDoc(docRef);
              if (docSnap.exists()) {
                facilityData = docSnap.data();
              }
            }

            if (facilityData) {
              const catName = facilityData.category || 'Spor Tesisi';
              const scoreStr = facilityData.overallScore ? Number(facilityData.overallScore).toFixed(1) : '8.8';
              const cityStr = facilityData.city ? \`\${facilityData.city}\` : 'Türkiye';
              const reviewCountStr = facilityData.reviewCount || (facilityData.reviews ? facilityData.reviews.length : 0);
              
              const metaTitle = \`⭐ \${facilityData.title} Puanı & Yorumları (\${scoreStr}/10) | \${catName} - SporPuan\`;
              const metaDescription = \`\${facilityData.title} (\${cityStr}) için sporseverler tarafından verilen \${scoreStr}/10 puanı, \${reviewCountStr} gerçek kullanıcı yorumu, hijyen, ekipman, eğitmen kadrosu ve lokasyon detaylı kriter incelemesi.\`;
              const metaKeywords = \`\${facilityData.title}, \${facilityData.title} yorumları, \${facilityData.title} puanı, \${cityStr} \${catName}, \${facilityData.venue || ''}, spor salonu tavsiyesi, sporpuan\`;
              const metaImage = facilityData.image || \`\${baseUrl}/og-image.png\`;

              // Replace tags
              html = html.replace(/<title>.*?<\\/title>/i, \`<title>\${metaTitle}</title>\`);
              html = html.replace(/<meta name="title" content=".*?" \\/>/i, \`<meta name="title" content="\${metaTitle}" />\`);
              html = html.replace(/<meta name="description" content=".*?" \\/>/i, \`<meta name="description" content="\${metaDescription}" />\`);
              html = html.replace(/<meta name="keywords" content=".*?" \\/>/i, \`<meta name="keywords" content="\${metaKeywords}" />\`);
              
              html = html.replace(/<meta property="og:title" content=".*?" \\/>/i, \`<meta property="og:title" content="\${metaTitle}" />\`);
              html = html.replace(/<meta property="og:description" content=".*?" \\/>/i, \`<meta property="og:description" content="\${metaDescription}" />\`);
              html = html.replace(/<meta property="og:image" content=".*?" \\/>/i, \`<meta property="og:image" content="\${metaImage}" />\`);
              html = html.replace(/<meta property="og:url" content=".*?" \\/>/i, \`<meta property="og:url" content="\${baseUrl}\${req.path}" />\`);

              html = html.replace(/<meta name="twitter:title" content=".*?" \\/>/i, \`<meta name="twitter:title" content="\${metaTitle}" />\`);
              html = html.replace(/<meta name="twitter:description" content=".*?" \\/>/i, \`<meta name="twitter:description" content="\${metaDescription}" />\`);
              html = html.replace(/<meta name="twitter:image" content=".*?" \\/>/i, \`<meta name="twitter:image" content="\${metaImage}" />\`);
            }
          }

          res.setHeader('Content-Type', 'text/html');
          return res.send(html);
        } catch (e) {
          next();
        }
      }
    } else {
      next();
    }
  });`;

content = content.replace(regex, newMiddleware);
fs.writeFileSync('server.ts', content);
console.log('Patched og middleware');
