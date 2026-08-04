const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// We need to pass onToggleFavorite down.
content = content.replace(
  'const EventDetailWrapper = ({',
  'const EventDetailWrapper = ({\n  events,\n  onRateClick,\n  onLikeReview,\n  currentUser,\n  setEditingEvent,\n  onUpdateEvent,\n  onToggleFavorite,\n  isLoading'
);

content = content.replace(
  'onUpdateEvent: (event: SportsEvent) => void,',
  'onUpdateEvent: (event: SportsEvent) => void,\n  onToggleFavorite: (eventId: string) => void,'
);

content = content.replace(
  '<EventDetailModal\n        event={event}',
  '<EventDetailModal\n        event={event}\n        isFavorite={currentUser?.favorites?.includes(event.id)}\n        onToggleFavorite={onToggleFavorite}'
);

// Where EventDetailWrapper is rendered
content = content.replace(
  '<EventDetailWrapper \n      events={events}',
  '<EventDetailWrapper \n      events={events}\n      onToggleFavorite={handleToggleFavorite}'
);

fs.writeFileSync('src/App.tsx', content);
console.log('Patched EventDetailWrapper props');
