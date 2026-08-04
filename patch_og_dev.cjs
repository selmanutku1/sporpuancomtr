const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const regex = /if \(process\.env\.NODE_ENV !== 'production'\) \{\s*next\(\);\s*\} else \{/g;
// We'll just remove the if/else and always process it, but in DEV we'll read from `index.html` not `dist/index.html`.

const fullRegex = /if \(process\.env\.NODE_ENV !== 'production'\) \{[\s\S]*?const indexPath = path\.join\(process\.cwd\(\), 'dist', 'index\.html'\);/g;

content = content.replace(fullRegex, `
        const isDev = process.env.NODE_ENV !== 'production';
        const indexPath = path.join(process.cwd(), isDev ? 'index.html' : 'dist/index.html');
`);

fs.writeFileSync('server.ts', content);
console.log('Patched server for dev og replacement');
