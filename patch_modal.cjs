const fs = require('fs');

const svgHelper = `
const CircularProgress = ({ score, max = 10, label, colorClass, size = 52, stroke = 4 }) => {
  const radius = (size - stroke) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = (score / max) * 100;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center gap-1.5 shrink-0">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg height={size} width={size} className="transform -rotate-90">
          <circle
            stroke="currentColor"
            fill="transparent"
            strokeWidth={stroke}
            r={radius}
            cx={size / 2}
            cy={size / 2}
            className="text-slate-100 dark:text-slate-800"
          />
          <circle
            stroke="currentColor"
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset }}
            strokeLinecap="round"
            r={radius}
            cx={size / 2}
            cy={size / 2}
            className={\`transition-all duration-1000 ease-out \${colorClass}\`}
          />
        </svg>
        <span className="absolute font-black text-xs text-slate-800 dark:text-slate-100">
          {score.toFixed(1)}
        </span>
      </div>
      <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 text-center leading-tight whitespace-pre-wrap max-w-[60px]">
        {label}
      </span>
    </div>
  );
};
`;

let content = fs.readFileSync('src/components/EventDetailModal.tsx', 'utf8');

// Insert the helper after imports
if (!content.includes('CircularProgress =')) {
  content = content.replace(
    '// Helper to check for English words in review',
    svgHelper + '\n\n// Helper to check for English words in review'
  );
}

// Replace the rendering of sub-criteria items
const oldRingsBlock = `{/* Sub-criteria items */}
                    <div className="flex items-center gap-3 sm:gap-5 overflow-x-auto pb-1 scrollbar-none">
                      {(CATEGORY_CRITERIA_MAP[event.category] || []).map((crit) => {
                        const score = getCriterionScore(event.ratingBreakdown, crit.key, event.overallScore);
                        return (
                          <div key={crit.key} className="flex flex-col items-center min-w-[55px]">
                            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 text-center block mb-1.5 whitespace-nowrap">
                              {crit.label}
                            </span>
                            <div className="w-11 h-11 rounded-full border-[2.5px] border-blue-500 bg-white dark:bg-slate-800 flex items-center justify-center font-extrabold text-xs text-slate-900 dark:text-white shadow-2xs">
                              {score.toFixed(1)}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Divider */}
                    <div className="w-[1px] h-10 bg-slate-300 dark:bg-slate-700 hidden sm:block shrink-0 mx-1" />

                    {/* Percentage Rings */}
                    <div className="flex items-center gap-4">
                      {/* Tavsiye */}
                      <div className="flex flex-col items-center">
                        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 text-center block mb-1.5 whitespace-nowrap">
                          Tavsiye
                        </span>
                        <div className="w-12 h-12 rounded-full border-[3px] border-blue-600 bg-blue-50/60 dark:bg-blue-950/60 flex items-center justify-center font-black text-xs text-blue-600 dark:text-blue-400 shadow-2xs">
                          %{tavsiyePercent}
                        </div>
                      </div>

                      {/* Fiyat Performans */}
                      <div className="flex flex-col items-center">
                        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 text-center block mb-1.5 whitespace-nowrap">
                          Fiyat Performans
                        </span>
                        <div className="w-12 h-12 rounded-full border-[3px] border-amber-400 bg-amber-50/60 dark:bg-amber-950/60 flex items-center justify-center font-black text-xs text-amber-600 dark:text-amber-400 shadow-2xs">
                          %{fiyatPercent}
                        </div>
                      </div>
                    </div>`;

const newRingsBlock = `{/* Sub-criteria items */}
                    <div className="flex items-center gap-3 sm:gap-6 overflow-x-auto pb-2 scrollbar-none w-full lg:w-auto">
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

                      {/* Tavsiye */}
                      <CircularProgress 
                        score={tavsiyePercent} 
                        max={100} 
                        label={"Tavsiye\nOranı"} 
                        colorClass="text-emerald-500" 
                        size={56} 
                        stroke={4.5} 
                      />

                      {/* Fiyat Performans */}
                      <CircularProgress 
                        score={fiyatPercent} 
                        max={100} 
                        label={"Fiyat\nPerformans"} 
                        colorClass="text-amber-500" 
                        size={56} 
                        stroke={4.5} 
                      />
                    </div>`;

if (content.includes('{/* Sub-criteria items */}')) {
  content = content.replace(oldRingsBlock, newRingsBlock);
  fs.writeFileSync('src/components/EventDetailModal.tsx', content);
  console.log('Rings updated.');
} else {
  console.log('Rings block not found.');
}
