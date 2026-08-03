const fs = require('fs');

let content = fs.readFileSync('src/components/ReviewPage.tsx', 'utf8');

const oldSection = `<div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                    <span>5 Boyutlu Değerlendirme Puanlarınız</span>
                  </h3>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    (1 = Zayıf, 10 = Mükemmel)
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  {criteriaList.map((criterion) => {
                    const val = scores[criterion.key] || 8;
                    return (
                      <div key={criterion.key} className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-2">
                        <div className="flex justify-between items-center">
                          <label className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                            {criterion.label}
                          </label>
                          <span className={\`px-2.5 py-0.5 rounded text-xs font-black \${
                            val >= 8 ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' :
                            val >= 6 ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300' :
                            'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                          }\`}>
                            {val} / 10
                          </span>
                        </div>

                        <HoverRatingBar 
                          value={val} 
                          onChange={(newVal) => setScores({ ...scores, [criterion.key]: newVal })} 
                        />
                      </div>
                    );
                  })}
                </div>
              </div>`;

const newSection = `<div className="space-y-4 bg-slate-50 dark:bg-slate-800/40 p-5 rounded-3xl border border-slate-200 dark:border-slate-700/60">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 dark:border-slate-700/60 pb-3 gap-2">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span>5 Boyutlu Değerlendirme Puanlarınız</span>
                  </h3>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                    1 = Zayıf, 10 = Mükemmel
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 pt-2">
                  {criteriaList.map((criterion) => {
                    const val = scores[criterion.key] || 8;
                    return (
                      <div key={criterion.key} className="space-y-1.5">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-500 block"></span>
                            {criterion.label}
                          </span>
                          <span className="font-black text-blue-600 dark:text-blue-400 text-sm bg-white dark:bg-slate-900 px-2 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-2xs">
                            {val} / 10
                          </span>
                        </div>

                        <HoverRatingBar 
                          value={val} 
                          onChange={(newVal) => setScores({ ...scores, [criterion.key]: newVal })} 
                        />
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-snug">{criterion.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>`;

if (content.includes('1. CRITERIA SCORE SLIDERS')) {
  content = content.replace(oldSection, newSection);
  fs.writeFileSync('src/components/ReviewPage.tsx', content);
  console.log('Updated ReviewPage rating layout.');
} else {
  console.log('Not found');
}
