const fs = require('fs');
let content = fs.readFileSync('src/components/ReviewPage.tsx', 'utf8');

const targetStr = `<div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-1 font-normal">
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>Kaydırıcıları hareket ettirdikçe puanlar güncellenir</span>
                      </div>`;

if (content.includes(targetStr)) {
  content = content.replace(targetStr, '');
  fs.writeFileSync('src/components/ReviewPage.tsx', content);
  console.log('Removed target string');
} else {
  console.log('Target string not found');
}
