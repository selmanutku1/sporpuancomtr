const fs = require('fs');
let content = fs.readFileSync('src/components/Header.tsx', 'utf8');

// For desktop
content = content.replace(
  '{currentUser.role === \'admin\' && (',
  `
                  <button
                    onClick={() => navigate('/favoriler')}
                    title="Favorilerim"
                    className="p-1.5 text-rose-500 dark:text-rose-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded-lg transition mr-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                  </button>
                  {currentUser.role === 'admin' && (`
);

// For mobile
content = content.replace(
  '<div className="w-full h-[1px] bg-slate-200 dark:bg-slate-700/50 my-1"></div>',
  `<div className="w-full h-[1px] bg-slate-200 dark:bg-slate-700/50 my-1"></div>
                    <button
                      onClick={() => { navigate('/favoriler'); setIsMobileMenuOpen(false); }}
                      className="w-full flex items-center justify-center gap-2 py-3 text-rose-600 bg-rose-50 dark:bg-rose-500/10 rounded-xl hover:bg-rose-100 dark:hover:bg-rose-500/20 transition font-bold text-sm mb-2"
                      aria-label="Favorilerim"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                      Favorilerim
                    </button>
                    <div className="w-full h-[1px] bg-slate-200 dark:bg-slate-700/50 my-1"></div>`
);


fs.writeFileSync('src/components/Header.tsx', content);
console.log('Patched Header.tsx');
