const fs = require('fs');
let content = fs.readFileSync('src/components/ReviewPage.tsx', 'utf8');

const startStr = '{/* Criteria Circular Rings & Recommendation Rings */}';
const endStr = '{/* 1. CRITERIA SCORE SLIDERS */}';

const startIdx = content.indexOf(startStr);
const endIdx = content.indexOf(endStr);

if (startIdx !== -1 && endIdx !== -1) {
  const originalPart = content.substring(startIdx, endIdx);
  const newPart = `{/* Recommendation Rings */}
                  <div className="flex items-center gap-6 w-full md:w-auto justify-center md:justify-end pt-4 md:pt-0 border-t md:border-t-0 border-slate-200/60 dark:border-slate-800/80">
                    {/* Tavsiye Ring */}
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] font-extrabold text-slate-700 dark:text-slate-300 text-center block mb-1.5 whitespace-nowrap">
                        Tavsiye
                      </span>
                      <div className="w-14 h-14 rounded-full border-[3px] border-blue-600 bg-blue-50/60 dark:bg-blue-950/60 flex items-center justify-center font-black text-sm text-blue-600 dark:text-blue-400 shadow-2xs">
                        %{Math.min(99, Math.max(70, Math.round((currentOverall / 10) * 100)))}
                      </div>
                    </div>

                    {/* Fiyat Performans Ring */}
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] font-extrabold text-slate-700 dark:text-slate-300 text-center block mb-1.5 whitespace-nowrap">
                        Fiyat Perf.
                      </span>
                      <div className="w-14 h-14 rounded-full border-[3px] border-amber-400 bg-amber-50/60 dark:bg-amber-950/60 flex items-center justify-center font-black text-sm text-amber-600 dark:text-amber-400 shadow-2xs">
                        %{Math.min(95, Math.max(65, Math.round(((scores['price'] || scores['equipment'] || currentOverall) / 10) * 100)))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              `;
              
  content = content.replace(originalPart, newPart);
  fs.writeFileSync('src/components/ReviewPage.tsx', content);
  console.log('Successfully updated ReviewPage rings.');
} else {
  console.log('Start or end string not found in ReviewPage.tsx.');
}
