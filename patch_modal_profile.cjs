const fs = require('fs');

let addReviewContent = fs.readFileSync('src/components/AddReviewModal.tsx', 'utf8');

const oldProfile = `<div className="bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/80 rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img referrerPolicy="no-referrer"
                    src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full object-cover border border-blue-300 shrink-0"
                  />
                  <div>
                    <p className="text-xs font-extrabold text-blue-900 dark:text-blue-200">{currentUser.name}</p>
                    <span className="text-[10px] text-blue-700 dark:text-blue-300 font-medium">
                      {currentUser.title || 'Doğrulanmış Üye Sporsever'}
                    </span>
                  </div>
                </div>`;
                
const newProfile = `<div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800/80 border border-blue-200 dark:border-slate-700 rounded-xl p-4 sm:p-3 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <img referrerPolicy="no-referrer"
                    src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'}
                    alt={currentUser.name}
                    className="w-10 h-10 sm:w-8 sm:h-8 rounded-full object-cover border-2 border-white shadow-xs shrink-0"
                  />
                  <div>
                    <p className="text-sm sm:text-xs font-black text-slate-800 dark:text-slate-200">{currentUser.name}</p>
                    <span className="text-[11px] sm:text-[10px] text-blue-600 dark:text-blue-400 font-bold bg-blue-100/50 dark:bg-blue-900/30 px-1.5 py-0.5 rounded-md inline-block mt-0.5">
                      {currentUser.role === 'admin' ? 'Yönetici' : currentUser.role === 'organizer' ? 'Organizatör' : 'Sporsever'}
                    </span>
                  </div>
                </div>`;

addReviewContent = addReviewContent.replace(oldProfile, newProfile);
fs.writeFileSync('src/components/AddReviewModal.tsx', addReviewContent);
console.log('AddReviewModal profile updated.');
