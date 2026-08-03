const fs = require('fs');

// --- 1. Fix ReviewPage.tsx ---
let reviewContent = fs.readFileSync('src/components/ReviewPage.tsx', 'utf8');

const reviewStartStr = '{/* Recommendation Rings */}';
const reviewEndStr = '</div>\n                </div>\n              </div>';

const reviewStartIdx = reviewContent.indexOf(reviewStartStr);
// Find the end properly
const reviewEndIdx = reviewContent.indexOf('</div>\n                </div>\n              </div>', reviewStartIdx) + 47;

if (reviewStartIdx !== -1) {
  const originalReviewPart = reviewContent.substring(reviewStartIdx, reviewEndIdx);
  
  const restoredReviewPart = `{/* Live Criteria Rings & Recommendation Rings */}
                  <div className="flex flex-wrap items-center gap-4 sm:gap-5 w-full pt-4 md:pt-0 border-t md:border-t-0 border-slate-200/60 dark:border-slate-800/80 justify-center lg:justify-end">
                    
                    {/* Live Criteria Rings */}
                    <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4">
                      {criteriaList.map((crit) => {
                        const scoreVal = scores[crit.key] || 8;
                        return (
                          <div key={crit.key} className="flex flex-col items-center min-w-[55px]">
                            <span className="text-[10px] font-extrabold text-slate-700 dark:text-slate-300 text-center block mb-1 whitespace-nowrap">
                              {crit.label}
                            </span>
                            <div className="w-11 h-11 rounded-full border-[2.5px] border-blue-500 bg-white dark:bg-slate-800 flex items-center justify-center font-extrabold text-xs text-slate-900 dark:text-white shadow-2xs">
                              {scoreVal.toFixed(1)}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Divider */}
                    <div className="w-[1px] h-10 bg-slate-300 dark:bg-slate-700 hidden sm:block shrink-0 mx-1" />

                    {/* Percentage Rings */}
                    <div className="flex items-center justify-center gap-4">
                      {/* Tavsiye Ring */}
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] font-extrabold text-slate-700 dark:text-slate-300 text-center block mb-1 whitespace-nowrap">
                          Tavsiye
                        </span>
                        <div className="w-12 h-12 rounded-full border-[3px] border-blue-600 bg-blue-50/60 dark:bg-blue-950/60 flex items-center justify-center font-black text-xs text-blue-600 dark:text-blue-400 shadow-2xs">
                          %{Math.min(99, Math.max(70, Math.round((currentOverall / 10) * 100)))}
                        </div>
                      </div>

                      {/* Fiyat Performans Ring */}
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] font-extrabold text-slate-700 dark:text-slate-300 text-center block mb-1 whitespace-nowrap">
                          Fiyat Perf.
                        </span>
                        <div className="w-12 h-12 rounded-full border-[3px] border-amber-400 bg-amber-50/60 dark:bg-amber-950/60 flex items-center justify-center font-black text-xs text-amber-600 dark:text-amber-400 shadow-2xs">
                          %{Math.min(95, Math.max(65, Math.round(((scores['price'] || scores['equipment'] || currentOverall) / 10) * 100)))}
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>`;
              
  reviewContent = reviewContent.replace(originalReviewPart, restoredReviewPart);
  fs.writeFileSync('src/components/ReviewPage.tsx', reviewContent);
  console.log('Restored ReviewPage rings.');
} else {
  console.log('Could not find replace string in ReviewPage');
}

// --- 2. Fix EventDetailModal.tsx ---
let modalContent = fs.readFileSync('src/components/EventDetailModal.tsx', 'utf8');

const modalStartStr = '{/* Right: Percentage Rings */}';
const modalEndStr = '{/* DUAL LANGUAGE REVIEW SUMMARY BOX */}';

const modalStartIdx = modalContent.indexOf(modalStartStr);
const modalEndIdx = modalContent.indexOf(modalEndStr);

if (modalStartIdx !== -1 && modalEndIdx !== -1) {
  const originalModalPart = modalContent.substring(modalStartIdx, modalEndIdx);
  
  const restoredModalPart = `{/* Right: Sub-criteria Rings & Percentage Rings */}
                  <div className="flex flex-wrap items-center justify-center lg:justify-end gap-4 sm:gap-6 w-full pt-4 md:pt-0 border-t md:border-t-0 border-slate-200/60 dark:border-slate-800/80">
                       
                    {/* Sub-criteria items (Wrap instead of overflow to prevent cut-off) */}
                    <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 w-full lg:w-auto">
                      {(CATEGORY_CRITERIA_MAP[event.category] || []).map((crit) => {
                        const score = getCriterionScore(event.ratingBreakdown, crit.key, event.overallScore);
                        return (
                          <CircularProgress 
                            key={crit.key} 
                            score={score} 
                            max={10} 
                            label={crit.label} 
                            colorClass="text-blue-500" 
                          />
                        );
                      })}

                      {/* Divider */}
                      <div className="w-[1px] h-12 bg-slate-200 dark:bg-slate-700/60 shrink-0 mx-1 hidden sm:block" />

                      <div className="flex items-center justify-center gap-4 sm:gap-6">
                        {/* Tavsiye */}
                        <CircularProgress 
                          score={tavsiyePercent} 
                          max={100} 
                          label={"Tavsiye\\nOranı"} 
                          colorClass="text-emerald-500" 
                          size={56} 
                          stroke={4.5} 
                        />

                        {/* Fiyat Performans */}
                        <CircularProgress 
                          score={fiyatPercent} 
                          max={100} 
                          label={"Fiyat\\nPerformans"} 
                          colorClass="text-amber-500" 
                          size={56} 
                          stroke={4.5} 
                        />
                      </div>
                    </div>

                  </div>
                </div>
                
                `;
                
  modalContent = modalContent.replace(originalModalPart, restoredModalPart);
  // Remove the '{/* TOP ROW: Overall Rating + Percentage Rings */}' and replace with '{/* TOP ROW: Overall Rating + Sub-criteria Rings + Percentage Rings */}'
  modalContent = modalContent.replace('{/* TOP ROW: Overall Rating + Percentage Rings */}', '{/* TOP ROW: Overall Rating + Sub-criteria Rings + Percentage Rings */}');
  
  fs.writeFileSync('src/components/EventDetailModal.tsx', modalContent);
  console.log('Restored EventDetailModal rings.');
} else {
  console.log('Could not find replace string in EventDetailModal');
}
