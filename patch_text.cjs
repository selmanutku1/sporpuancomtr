const fs = require('fs');

let addReview = fs.readFileSync('src/components/AddReviewModal.tsx', 'utf8');
addReview = addReview.replace(
  '<span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">\n                  1 = Zayıf, 10 = Mükemmel\n                </span>',
  ''
);
fs.writeFileSync('src/components/AddReviewModal.tsx', addReview);

let reviewPage = fs.readFileSync('src/components/ReviewPage.tsx', 'utf8');
reviewPage = reviewPage.replace(
  '<span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">\n                    1 = Zayıf, 10 = Mükemmel\n                  </span>',
  ''
);
fs.writeFileSync('src/components/ReviewPage.tsx', reviewPage);

console.log('Removed text');
