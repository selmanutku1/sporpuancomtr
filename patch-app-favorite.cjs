const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const newFunc = `
  const handleToggleFavorite = async (eventId: string) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    const currentFavorites = currentUser.favorites || [];
    const isFavorite = currentFavorites.includes(eventId);
    let newFavorites;
    if (isFavorite) {
      newFavorites = currentFavorites.filter(id => id !== eventId);
    } else {
      newFavorites = [...currentFavorites, eventId];
    }
    
    const updatedUser = { ...currentUser, favorites: newFavorites };
    setCurrentUser(updatedUser);
    try {
      localStorage.setItem('sporpuan_user', JSON.stringify(updatedUser));
      await updateDoc(doc(db, 'users', currentUser.id), {
        favorites: newFavorites
      });
    } catch (e) {
      console.error('Error updating favorites:', e);
    }
  };
`;

content = content.replace(
  "  const handleOpenAuthModal = () => {",
  newFunc + "\n  const handleOpenAuthModal = () => {"
);

fs.writeFileSync('src/App.tsx', content);
console.log('Patched App.tsx with handleToggleFavorite');
