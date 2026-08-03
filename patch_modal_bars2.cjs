const fs = require('fs');
let content = fs.readFileSync('src/components/EventDetailModal.tsx', 'utf8');

const startIndex = content.indexOf('{/* TOP ROW: Overall Rating + Sub-criteria Rings + Percentage Rings */}');
if (startIndex !== -1) {
  const endIndex = content.indexOf('</div>', content.indexOf('{/* DUAL LANGUAGE REVIEW SUMMARY BOX */}')) - 6; // approximate search
  const topRowToReplace = content.substring(startIndex, content.indexOf('</div>', content.indexOf('Fiyat Performans')) + 60); 
  
  // Actually, let's just use regex or split on known strings
  
  const startStr = '{/* TOP ROW: Overall Rating + Sub-criteria Rings + Percentage Rings */}';
  const endStr = '{/* DUAL LANGUAGE REVIEW SUMMARY BOX */}';
  
  const startIdx = content.indexOf(startStr);
  const endIdx = content.indexOf(endStr);
  
  if (startIdx !== -1 && endIdx !== -1) {
    const originalPart = content.substring(startIdx, endIdx);
    const newPart = `{/* TOP ROW: Overall Rating + Percentage Rings */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-4 border-b border-slate-200/60 dark:border-slate-800/80">
                  
                  {/* Left: Speech Bubble Badge & Title */}
                  <div className="flex items-center gap-4">
                    <div className="relative shrink-0">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-600 rounded-[22px] flex items-center justify-center text-white text-2xl sm:text-3xl font-black shadow-md">
                        {event.overallScore.toFixed(1)}
                      </div>
                      <div className="absolute -bottom-1.5 left-4 w-4 h-4 bg-blue-600 rotate-45 rounded-xs" />
                    </div>

                    <div>
                      <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">
                        {scoreLabel}
                      </h3>
                      <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                        {totalReviewCount} yorum
                      </p>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-1.5 font-normal">
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>Son bir yıldaki yorum sayısı: <strong className="font-semibold text-slate-700 dark:text-slate-300">{recentYearCount}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Percentage Rings */}
                  <div className="flex items-center gap-6 w-full md:w-auto justify-center md:justify-end pt-4 md:pt-0 border-t md:border-t-0 border-slate-200/60 dark:border-slate-800/80">
                    <CircularProgress 
                      score={tavsiyePercent} 
                      max={100} 
                      label={"Tavsiye\\nOranı"} 
                      colorClass="text-emerald-500" 
                      size={60} 
                      stroke={5} 
                    />

                    <CircularProgress 
                      score={fiyatPercent} 
                      max={100} 
                      label={"Fiyat\\nPerformans"} 
                      colorClass="text-amber-500" 
                      size={60} 
                      stroke={5} 
                    />
                  </div>
                </div>

                {/* Sub-criteria Linear Bars */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 pt-1 pb-2">
                  {(CATEGORY_CRITERIA_MAP[event.category] || []).map((crit) => {
                    const score = getCriterionScore(event.ratingBreakdown, crit.key, event.overallScore);
                    return (
                      <div key={crit.key} className="flex flex-col gap-1.5">
                        <div className="flex justify-between items-center text-xs font-bold text-slate-700 dark:text-slate-300">
                          <span>{crit.label}</span>
                          <span className="font-black text-blue-600 dark:text-blue-400">{score.toFixed(1)}</span>
                        </div>
                        <div className="w-full bg-slate-200/80 dark:bg-slate-700 rounded-full h-2 overflow-hidden shadow-inner">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all duration-1000 ease-out" 
                            style={{ width: \`\${(score / 10) * 100}%\` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                `;
                
    content = content.replace(originalPart, newPart);
    fs.writeFileSync('src/components/EventDetailModal.tsx', content);
    console.log('Successfully updated modal layout to use linear bars via substring replacement.');
  } else {
    console.log('Start or end string not found.');
  }
} else {
  console.log('Not found');
}
