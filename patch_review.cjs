const fs = require('fs');

let content = fs.readFileSync('src/components/ReviewPage.tsx', 'utf8');
const searchBlock = `        {/* PAGE TOP NAVIGATION BAR */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-black">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>Sporpuan Yorum & Değerlendirme</span>
            </span>
          </div>
        </div>`;

if (content.includes('Sporpuan Yorum & Değerlendirme')) {
  content = content.replace(searchBlock, '');
  fs.writeFileSync('src/components/ReviewPage.tsx', content);
  console.log('Removed top navigation bar');
} else {
  console.log('Not found');
}
