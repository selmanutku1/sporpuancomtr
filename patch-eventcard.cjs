const fs = require('fs');
let content = fs.readFileSync('src/components/EventCard.tsx', 'utf8');

if (!content.includes('Heart')) {
  content = content.replace(
    'Trophy\n} from \'lucide-react\';',
    'Trophy,\n  Heart\n} from \'lucide-react\';'
  );
}

content = content.replace(
  'interface EventCardProps {',
  'interface EventCardProps {\n  isFavorite?: boolean;\n  onToggleFavorite?: (event: SportsEvent, e: React.MouseEvent) => void;'
);

content = content.replace(
  'export const EventCard: React.FC<EventCardProps> = ({',
  'export const EventCard: React.FC<EventCardProps> = ({\n  isFavorite = false,\n  onToggleFavorite,'
);

// Add favorite button in the image container
const favButtonHTML = `
        {/* Favorite Button */}
        {onToggleFavorite && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleFavorite(event, e);
            }}
            className="absolute top-3 right-20 flex items-center justify-center w-8 h-8 rounded-full bg-white/90 dark:bg-slate-900/90 shadow-md transition-transform hover:scale-110 z-10"
            title={isFavorite ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
          >
            <Heart className={\`w-4 h-4 \${isFavorite ? 'fill-red-500 text-red-500' : 'text-slate-600 dark:text-slate-300'}\`} />
          </button>
        )}
`;

content = content.replace(
  '{/* Sporpuan Rating Badge Top Right */}',
  favButtonHTML + '\n        {/* Sporpuan Rating Badge Top Right */}'
);

fs.writeFileSync('src/components/EventCard.tsx', content);
console.log('Patched EventCard.tsx');
