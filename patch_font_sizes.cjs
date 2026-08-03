const fs = require('fs');

let addReviewContent = fs.readFileSync('src/components/AddReviewModal.tsx', 'utf8');

// Increase criteria description size
addReviewContent = addReviewContent.replace(
  'className="text-[10px] text-slate-500 dark:text-slate-400 font-medium"',
  'className="text-[11px] sm:text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-snug"'
);

// Title of criteria
addReviewContent = addReviewContent.replace(
  'className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5"',
  'className="font-bold text-sm sm:text-xs text-slate-700 dark:text-slate-300 flex items-center gap-1.5"'
);

addReviewContent = addReviewContent.replace(
  'className="flex justify-between items-center text-xs"',
  'className="flex justify-between items-center text-sm sm:text-xs mb-1 sm:mb-0"'
);

fs.writeFileSync('src/components/AddReviewModal.tsx', addReviewContent);

let headerContent = fs.readFileSync('src/components/Header.tsx', 'utf8');
// Fix mobile user profile to look nicer
const oldMobileProfile = `<div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                      <img referrerPolicy="no-referrer" src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'} alt={currentUser.name} className="w-12 h-12 rounded-xl object-cover border-2 border-white dark:border-slate-700 shadow-sm" />
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white text-base">{currentUser.name}</p>
                        <p className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">{currentUser.role === 'organizer' ? 'Organizatör Kulüp' : currentUser.role === 'admin' ? 'Yönetici' : 'Sporsever'}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => { onLogout(); setIsMobileMenuOpen(false); }}
                      className="p-2 text-rose-500 bg-rose-50 dark:bg-rose-500/10 rounded-xl hover:bg-rose-100 dark:hover:bg-rose-500/20 transition"
                      aria-label="Çıkış Yap"
                    >
                      <LogOut className="w-5 h-5" />
                    </button>
                 </div>`;
                 
const newMobileProfile = `<div className="flex flex-col gap-3 bg-gradient-to-br from-blue-50/50 to-slate-50 dark:from-slate-800/80 dark:to-slate-800/50 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img referrerPolicy="no-referrer" src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'} alt={currentUser.name} className="w-16 h-16 rounded-2xl object-cover border-[3px] border-white dark:border-slate-700 shadow-md" />
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-white dark:border-slate-800 rounded-full"></div>
                      </div>
                      <div className="flex-1">
                        <p className="font-black text-slate-900 dark:text-white text-lg leading-tight mb-0.5">{currentUser.name}</p>
                        <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider bg-blue-100/50 dark:bg-blue-900/30 inline-block px-2.5 py-1 rounded-lg">
                          {currentUser.role === 'organizer' ? 'Organizatör' : currentUser.role === 'admin' ? 'Yönetici' : 'Sporsever'}
                        </p>
                      </div>
                    </div>
                    <div className="w-full h-[1px] bg-slate-200 dark:bg-slate-700/50 my-1"></div>
                    <button
                      onClick={() => { onLogout(); setIsMobileMenuOpen(false); }}
                      className="w-full flex items-center justify-center gap-2 py-3 text-rose-600 bg-rose-50 dark:bg-rose-500/10 rounded-xl hover:bg-rose-100 dark:hover:bg-rose-500/20 transition font-bold text-sm"
                      aria-label="Çıkış Yap"
                    >
                      <LogOut className="w-4.5 h-4.5" />
                      Çıkış Yap
                    </button>
                 </div>`;

headerContent = headerContent.replace(oldMobileProfile, newMobileProfile);
fs.writeFileSync('src/components/Header.tsx', headerContent);
console.log('Mobile profile and font sizes updated.');
