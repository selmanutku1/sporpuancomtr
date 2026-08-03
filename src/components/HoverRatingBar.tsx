import React, { useState } from 'react';

interface HoverRatingBarProps {
  value: number;
  onChange: (val: number) => void;
  max?: number;
}

export const HoverRatingBar: React.FC<HoverRatingBarProps> = ({ value, onChange, max = 10 }) => {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const arr = Array.from({ length: max }, (_, i) => i + 1);

  return (
    <div 
      className="flex w-full gap-1 sm:gap-1.5 h-6 sm:h-8 mt-2" 
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
            className={`flex-1 rounded-md sm:rounded-lg cursor-pointer transition-all duration-150 relative group ${colorClass}`}
            onMouseEnter={() => setHoverValue(i)}
            onClick={() => onChange(i)}
            title={`${i} Puan`}
          >
            {/* Tooltip on Hover */}
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-slate-800 dark:bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg whitespace-nowrap z-10">
              {i} / {max}
            </div>
          </div>
        );
      })}
    </div>
  );
};
