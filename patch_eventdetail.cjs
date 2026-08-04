const fs = require('fs');

let content = fs.readFileSync('src/components/EventDetailModal.tsx', 'utf8');

// Add import
content = content.replace(
  "import { getScoreColorClass } from '../lib/scoreUtils';",
  "import { getScoreColorClass } from '../lib/scoreUtils';\nimport { anonymizeUserName } from '../lib/nameUtils';"
);

// Remove local anonymizeUserName
const localFuncRegex = /function anonymizeUserName\(name: string\): string {[\s\S]*?}/;
content = content.replace(localFuncRegex, '');

// Replace exact userName rendering with anonymized one in one place (line 699 context)
content = content.replace(
  /<span className="font-bold text-slate-900 dark:text-slate-100 text-sm">\{rev.userName\}<\/span>/g,
  '<span className="font-bold text-slate-900 dark:text-slate-100 text-sm">{anonymizeUserName(rev.userName)}</span>'
);

fs.writeFileSync('src/components/EventDetailModal.tsx', content);
console.log('Fixed EventDetailModal');
