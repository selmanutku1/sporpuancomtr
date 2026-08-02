const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(/const facilities = \[\];\s*for \(const p of rawPlaces\) \{([\s\S]*?)facilities\.push\(\{([\s\S]*?)\}\);\s*\}/, (match, body, pushBody) => {
    return `const facilities = await Promise.all(rawPlaces.map(async (p) => {${body}return {${pushBody}};\n      }));`;
});

fs.writeFileSync('server.ts', code);
