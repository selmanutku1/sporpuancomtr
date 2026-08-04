const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

if (!content.includes('import { FavoritesPage }')) {
  content = content.replace(
    'import { EventDetailModal } from',
    'import { FavoritesPage } from \'./pages/FavoritesPage\';\nimport { EventDetailModal } from'
  );
}

const favRoute = `
          <Route path="/favoriler" element={
            <FavoritesPage 
              events={events} 
              currentUser={currentUser} 
              onToggleFavorite={handleToggleFavorite} 
              onRateClick={(ev) => {
                if (!currentUser) {
                  setIsAuthModalOpen(true);
                  return;
                }
                window.scrollTo(0, 0);
                navigate(\`/yorum-yaz?id=\${ev.id}\`);
              }}
            />
          } />
`;

content = content.replace(
  '<Route path="/harita" element={',
  favRoute + '          <Route path="/harita" element={'
);

fs.writeFileSync('src/App.tsx', content);
console.log('Patched App.tsx with Favorites route');
