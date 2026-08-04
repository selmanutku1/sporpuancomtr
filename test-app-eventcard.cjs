const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// There are a few EventCard usages in App.tsx
// Let's replace <EventCard with <EventCard isFavorite={currentUser?.favorites?.includes(event.id)} onToggleFavorite={(ev, e) => handleToggleFavorite(ev.id)}
content = content.replace(
  /<EventCard\n/g,
  '<EventCard\n                            isFavorite={currentUser?.favorites?.includes(event.id)}\n                            onToggleFavorite={(ev, e) => handleToggleFavorite(ev.id)}\n'
);

fs.writeFileSync('src/App.tsx', content);
console.log('Patched App.tsx EventCard props');
