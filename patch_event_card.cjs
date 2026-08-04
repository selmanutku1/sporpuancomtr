const fs = require('fs');
let content = fs.readFileSync('src/components/EventCard.tsx', 'utf8');

// Import Link and getEventDetailUrl
if (!content.includes('import { Link }')) {
  content = content.replace(
    "import React from 'react';",
    "import React from 'react';\nimport { Link } from 'react-router-dom';\nimport { getEventDetailUrl } from '../lib/categoryUtils';"
  );
}

// Replace top-level div with Link
content = content.replace(
  /<div\s+onClick=\{\(\) => onSelectEvent\(event\)\}\s+className="group bg-white dark:bg-slate-900/g,
  '<Link\n      to={getEventDetailUrl(event)}\n      className="group bg-white dark:bg-slate-900'
);
content = content.replace(
  /<\/div>\n  \);\n\};/g,
  '</Link>\n  );\n};'
);

// We need to make sure onRateClick stops propagation since it's inside a Link
content = content.replace(
  /onClick=\{\(e\) => onRateClick\(event, e\)\}/g,
  'onClick={(e) => {\n                e.preventDefault();\n                e.stopPropagation();\n                onRateClick(event, e);\n              }}'
);

fs.writeFileSync('src/components/EventCard.tsx', content);
console.log('Patched EventCard.tsx');
