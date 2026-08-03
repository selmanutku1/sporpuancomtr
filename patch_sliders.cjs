const fs = require('fs');

// Patch HoverRatingBar.tsx to support onHoverChange
let hoverContent = fs.readFileSync('src/components/HoverRatingBar.tsx', 'utf8');

if (!hoverContent.includes('onHoverChange')) {
  hoverContent = hoverContent.replace(
    'onChange: (val: number) => void;',
    'onChange: (val: number) => void;\n  onHoverChange?: (val: number | null) => void;'
  );
  
  hoverContent = hoverContent.replace(
    'export const HoverRatingBar: React.FC<HoverRatingBarProps> = ({ value, onChange, max = 10 }) => {',
    'export const HoverRatingBar: React.FC<HoverRatingBarProps> = ({ value, onChange, onHoverChange, max = 10 }) => {'
  );

  hoverContent = hoverContent.replace(
    'const [hoverValue, setHoverValue] = useState<number | null>(null);',
    `const [hoverValue, setHoverValueState] = useState<number | null>(null);
  
  const setHoverValue = (val: number | null) => {
    setHoverValueState(val);
    if (onHoverChange) {
      onHoverChange(val);
    }
  };`
  );
  
  // Make the bar look continuous
  hoverContent = hoverContent.replace(
    'className="flex w-full gap-1 sm:gap-1.5 h-6 sm:h-8"',
    'className="flex w-full gap-0 h-6 sm:h-8 overflow-hidden rounded-md sm:rounded-lg"'
  );
  
  hoverContent = hoverContent.replace(
    'className={`flex-1 rounded-md sm:rounded-lg cursor-pointer transition-all duration-150 relative group ${colorClass}`}',
    'className={`flex-1 cursor-pointer transition-all duration-150 relative group ${colorClass} hover:opacity-90`}'
  );
  
  // Also fix tooltip style for better display
  hoverContent = hoverContent.replace(
    'className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-slate-800 dark:bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg whitespace-nowrap z-10 flex items-center gap-1"',
    'className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all pointer-events-none bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg whitespace-nowrap z-50 flex items-center gap-1"'
  );
  
  fs.writeFileSync('src/components/HoverRatingBar.tsx', hoverContent);
  console.log('HoverRatingBar.tsx patched');
}

// Patch AddReviewModal.tsx
let modalContent = fs.readFileSync('src/components/AddReviewModal.tsx', 'utf8');
if (!modalContent.includes('const [hoveredScores, setHoveredScores] = useState')) {
  modalContent = modalContent.replace(
    'const [scores, setScores] = useState<RatingCriterion>({});',
    'const [scores, setScores] = useState<RatingCriterion>({});\n  const [hoveredScores, setHoveredScores] = useState<RatingCriterion | null>(null);'
  );
  
  modalContent = modalContent.replace(
    "const currentScore = calculateOverallScore(scores, targetEvent?.category || 'Spor Etkinlikleri');",
    "const currentScore = calculateOverallScore(hoveredScores || scores, targetEvent?.category || 'Spor Etkinlikleri');"
  );
  
  modalContent = modalContent.replace(
    'const val = scores[crit.key] || 8;',
    'const val = (hoveredScores ? hoveredScores[crit.key] : scores[crit.key]) || 8;'
  );
  
  modalContent = modalContent.replace(
    '<HoverRatingBar ',
    `<HoverRatingBar 
                      onHoverChange={(newVal) => {
                        if (newVal === null) {
                          setHoveredScores(null);
                        } else {
                          setHoveredScores({ ...scores, [crit.key]: newVal });
                        }
                      }}`
  );
  
  fs.writeFileSync('src/components/AddReviewModal.tsx', modalContent);
  console.log('AddReviewModal.tsx patched');
}
