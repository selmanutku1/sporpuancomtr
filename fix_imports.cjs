const fs = require('fs');

['src/components/EventDetailModal.tsx', 'src/components/ReviewPage.tsx'].forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('import { anonymizeUserName }')) {
    content = content.replace(
      "import { Avatar } from './Avatar';",
      "import { Avatar } from './Avatar';\nimport { anonymizeUserName } from '../lib/nameUtils';"
    );
    if (!content.includes('import { anonymizeUserName }')) {
      // Just append it after the first import React
      content = content.replace(
        /import React[\s\S]*?from 'react';/,
        match => `${match}\nimport { anonymizeUserName } from '../lib/nameUtils';`
      );
    }
    fs.writeFileSync(file, content);
  }
});
console.log('Fixed imports');
