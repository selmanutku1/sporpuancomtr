const fs = require('fs');
const path = require('path');

function replaceEmptySrcs(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceEmptySrcs(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;
      const regex = /<img([^>]*?)src={([a-zA-Z0-9_.]+)}([^>]*?)>/g;
      content = content.replace(regex, (match, before, varName, after) => {
        changed = true;
        return `<img${before}src={${varName} || undefined}${after}>`;
      });
      if (changed) {
        fs.writeFileSync(fullPath, content);
        console.log('Fixed', fullPath);
      }
    }
  }
}

replaceEmptySrcs('src/components');
