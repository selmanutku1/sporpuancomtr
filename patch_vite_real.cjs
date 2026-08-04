const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

// The first patch didn't apply. Let's find the correct anchor.
const anchor = '  app.use(express.json());';
if (!content.includes('let vite;')) {
  content = content.replace(anchor, anchor + `
  let vite;
  if (process.env.NODE_ENV !== 'production') {
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom', // custom so it doesn't intercept HTML if we do it ourselves, but wait, 'spa' is better? If 'custom', we must handle HTML. Let's use 'custom' so Vite doesn't serve index.html directly.
    });
    app.use(vite.middlewares);
  }
`);
}

fs.writeFileSync('server.ts', content);
console.log('Patched vite init');
