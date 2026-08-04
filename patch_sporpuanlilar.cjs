const fs = require('fs');
let content = fs.readFileSync('src/components/SporpuanlilarNeDemis.tsx', 'utf8');

if (!content.includes('import { anonymizeUserName }')) {
  content = content.replace(
    "import { getScoreColorClass } from '../lib/scoreUtils';",
    "import { getScoreColorClass } from '../lib/scoreUtils';\nimport { anonymizeUserName } from '../lib/nameUtils';"
  );
  if (!content.includes("import { anonymizeUserName }")) {
      content = content.replace(
        "import React",
        "import { anonymizeUserName } from '../lib/nameUtils';\nimport React"
      );
  }
}

content = content.replace(
  /<h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base leading-tight">\{rev.userName\}<\/h4>/g,
  '<h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base leading-tight">{anonymizeUserName(rev.userName)}</h4>'
);

fs.writeFileSync('src/components/SporpuanlilarNeDemis.tsx', content);
console.log('Fixed SporpuanlilarNeDemis');
