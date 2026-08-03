const fs = require('fs');

let content = fs.readFileSync('src/components/AddReviewModal.tsx', 'utf8');

const oldSection = `<div className="space-y-4 bg-slate-50 dark:bg-slate-850 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                5 Boyutlu Değerlendirme Skalası (1 - 10 Puan):
              </h4>

              {(CATEGORY_CRITERIA_MAP[targetEvent?.category || 'Spor Etkinlikleri'] || []).map((crit) => {
                const val = (hoveredScores ? hoveredScores[crit.key] : scores[crit.key]) || 8;

                return (
                  <div key={crit.key} className="space-y-1">
                    <div className="flex justify-between items-center text-sm sm:text-xs mb-1 sm:mb-0">
                      <span className="font-bold text-sm sm:text-xs text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-blue-500 block"></span>
                        <span>{crit.label}</span>
                      </span>
                      <span className="font-black text-blue-600 dark:text-blue-400 text-sm bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 shadow-2xs">
                        {val} / 10
                      </span>
                    </div>

                    <HoverRatingBar 
                      onHoverChange={(newVal) => {
                        if (newVal === null) {
                          setHoveredScores(null);
                        } else {
                          setHoveredScores({ ...scores, [crit.key]: newVal });
                        }
                      }}
                      value={val} 
                      onChange={(newVal) => handleCriterionChange(crit.key, newVal)} 
                    />

                    <p className="text-[11px] sm:text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-snug">{crit.desc}</p>
                  </div>
                );
              })}
            </div>`;

const newSection = `<div className="space-y-5 bg-slate-50 dark:bg-slate-800/40 p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-slate-700/60">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 dark:border-slate-700/60 pb-2 gap-2">
                <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>5 Boyutlu Puanlama</span>
                </h4>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                  1 = Zayıf, 10 = Mükemmel
                </span>
              </div>

              <div className="grid grid-cols-1 gap-5">
                {(CATEGORY_CRITERIA_MAP[targetEvent?.category || 'Spor Etkinlikleri'] || []).map((crit) => {
                  const val = (hoveredScores ? hoveredScores[crit.key] : scores[crit.key]) || 8;

                  return (
                    <div key={crit.key} className="space-y-1.5">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-blue-500 block"></span>
                          <span>{crit.label}</span>
                        </span>
                        <span className="font-black text-blue-600 dark:text-blue-400 text-sm bg-white dark:bg-slate-900 px-2 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-2xs">
                          {val} / 10
                        </span>
                      </div>

                      <HoverRatingBar 
                        onHoverChange={(newVal) => {
                          if (newVal === null) {
                            setHoveredScores(null);
                          } else {
                            setHoveredScores({ ...scores, [crit.key]: newVal });
                          }
                        }}
                        value={val} 
                        onChange={(newVal) => handleCriterionChange(crit.key, newVal)} 
                      />

                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-snug">{crit.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>`;

if (content.includes('5 Boyutlu Değerlendirme Skalası (1 - 10 Puan):')) {
  content = content.replace(oldSection, newSection);
  fs.writeFileSync('src/components/AddReviewModal.tsx', content);
  console.log('Updated AddReviewModal layout.');
} else {
  console.log('Not found');
}
