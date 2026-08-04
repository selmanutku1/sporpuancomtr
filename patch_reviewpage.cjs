const fs = require('fs');
let content = fs.readFileSync('src/components/ReviewPage.tsx', 'utf8');

if (!content.includes('import { anonymizeUserName }')) {
  content = content.replace(
    "import { getScoreColorClass } from '../lib/scoreUtils';",
    "import { getScoreColorClass } from '../lib/scoreUtils';\nimport { anonymizeUserName } from '../lib/nameUtils';"
  );
}

content = content.replace(
  /<span className="text-sm font-bold text-slate-900 dark:text-white">\{submittedReview.userName\}<\/span>/g,
  '<span className="text-sm font-bold text-slate-900 dark:text-white">{anonymizeUserName(submittedReview.userName)}</span>'
);

fs.writeFileSync('src/components/ReviewPage.tsx', content);
console.log('Fixed ReviewPage');
