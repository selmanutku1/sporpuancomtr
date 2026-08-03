const fs = require('fs');

const content = `import React, { useState } from 'react';

interface HoverRatingBarProps {
  value: number;
  onChange: (val: number) => void;
  max?: number;
}

const getEmoji = (val: number) => {
  if (val === 0) return '😶';
  if (val <= 2) return '😠';
  if (val <= 4) return '😞';
  if (val <= 6) return '😐';
  if (val <= 8) return '🙂';
  return '🤩';
};

export const HoverRatingBar: React.FC<HoverRatingBarProps> = ({ value, onChange, max = 10 }) => {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const arr = Array.from({ length: max }, (_, i) => i + 1);
  const currentVal = hoverValue !== null ? hoverValue : value;

  return (
    <div className="flex items-center gap-3 w-full mt-2">
      <div 
        className="flex w-full gap-1 sm:gap-1.5 h-6 sm:h-8" 
        onMouseLeave={() => setHoverValue(null)}
      >
        {arr.map((i) => {
          const isActive = hoverValue !== null ? i <= hoverValue : i <= value;
          const colorClass = isActive 
            ? (i >= 8 ? 'bg-emerald-500 shadow-sm' : i >= 6 ? 'bg-blue-500 shadow-sm' : 'bg-amber-500 shadow-sm')
            : 'bg-slate-200 dark:bg-slate-700/80';

          return (
            <div
              key={i}
              className={\`flex-1 rounded-md sm:rounded-lg cursor-pointer transition-all duration-150 relative group \${colorClass}\`}
              onMouseEnter={() => setHoverValue(i)}
              onClick={() => onChange(i)}
              title={\`\${i} Puan\`}
            >
              {/* Tooltip on Hover */}
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-slate-800 dark:bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg whitespace-nowrap z-10 flex items-center gap-1">
                {i} / {max} <span className="text-xs">{getEmoji(i)}</span>
              </div>
            </div>
          );
        })}
      </div>
      <div 
        className="text-2xl transition-all duration-200 w-8 text-center flex-shrink-0 origin-center" 
        style={{ transform: hoverValue !== null ? 'scale(1.2)' : 'scale(1)' }}
        title="Değerlendirme Durumu"
      >
        {getEmoji(currentVal)}
      </div>
    </div>
  );
};
`;

fs.writeFileSync('src/components/HoverRatingBar.tsx', content);
console.log('HoverRatingBar.tsx Updated');
