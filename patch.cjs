const fs = require('fs');

function patchFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace `if (!image || image.includes('places.googleapis.com')) {` with `if (!image) {`
  content = content.replace(
    /if \(\!image \|\| image\.includes\(['"]places\.googleapis\.com['"]\)\) \{/g,
    'if (!image) {'
  );
  
  fs.writeFileSync(filePath, content);
}

patchFile('src/App.tsx');
patchFile('src/components/AdminPanel.tsx');

console.log('Patched places.googleapis.com image overrides.');
