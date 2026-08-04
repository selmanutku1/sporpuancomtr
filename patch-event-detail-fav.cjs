const fs = require('fs');
let content = fs.readFileSync('src/components/EventDetailModal.tsx', 'utf8');

// The modal does not know about favorites easily unless we pass them or use currentUser
// Oh wait, EventDetailWrapper in App.tsx renders the EventDetailModal? 
// No, wait, EventDetailWrapper doesn't render a modal, it's a wrapper for the page!
// Let's check EventDetailModal.tsx
if (!content.includes('Heart')) {
  content = content.replace(
    'Trophy\n} from \'lucide-react\';',
    'Trophy,\n  Heart\n} from \'lucide-react\';'
  );
}

// Check props of EventDetailModal
if (!content.includes('isFavorite?: boolean;')) {
  content = content.replace(
    'interface EventDetailModalProps {',
    'interface EventDetailModalProps {\n  isFavorite?: boolean;\n  onToggleFavorite?: (eventId: string) => void;'
  );
  
  content = content.replace(
    'export const EventDetailModal: React.FC<EventDetailModalProps> = ({',
    'export const EventDetailModal: React.FC<EventDetailModalProps> = ({\n  isFavorite = false,\n  onToggleFavorite,'
  );
  
  const favBtnHtml = `
              <div className="flex flex-col gap-2 mt-2 sm:mt-3">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  {onToggleFavorite && (
                    <button 
                      onClick={() => onToggleFavorite(event.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                      title={isFavorite ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
                    >
                      <Heart className={\`w-4 h-4 \${isFavorite ? 'fill-red-500 text-red-500' : 'text-slate-500 dark:text-slate-400'}\`} />
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{isFavorite ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}</span>
                    </button>
                  )}
                  <button 
`;

  content = content.replace(
    /<div className="flex flex-col gap-2 mt-2 sm:mt-3">\s*<div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300">\s*<button/g,
    favBtnHtml
  );
  
  fs.writeFileSync('src/components/EventDetailModal.tsx', content);
  console.log('Patched EventDetailModal.tsx');
} else {
  console.log('Already patched EventDetailModal.tsx');
}
