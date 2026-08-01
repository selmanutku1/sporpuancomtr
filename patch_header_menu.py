import re

with open('src/components/Header.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

start_marker = "        {/* Mobile Dropdown / Drawer Menu */}"
end_marker = "      </header>"

start_idx = text.find(start_marker)
end_idx = text.find(end_marker)

if start_idx != -1 and end_idx != -1:
    replacement = """        {/* Mobile Dropdown / Drawer Menu */}
        <div className={`md:hidden absolute top-full left-0 right-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-2xl transition-all duration-300 origin-top overflow-hidden ${isMobileMenuOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0 pointer-events-none'}`}>
          <div className="p-4 space-y-6 max-h-[calc(100vh-80px)] overflow-y-auto pb-24">
            
            {/* User Section */}
            <div>
              {currentUser ? (
                 <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                      <img src={currentUser.avatar} alt={currentUser.name} className="w-12 h-12 rounded-xl object-cover border-2 border-white dark:border-slate-700 shadow-sm" />
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
                 </div>
              ) : (
                 <button
                    onClick={() => { onOpenAuthModal(); setIsMobileMenuOpen(false); }}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm rounded-2xl flex items-center justify-center gap-2 transition"
                 >
                    <User className="w-5 h-5" />
                    <span>Giriş Yap / Üye Ol</span>
                 </button>
              )}
            </div>

            {/* Menu Links */}
            <div className="space-y-1">
              <p className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 px-2">Hızlı Menü</p>
              
              <button
                onClick={() => { onOpenMapView(); setIsMobileMenuOpen(false); }}
                className="w-full flex items-center gap-3 p-3 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition font-semibold text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                  <Map className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="flex-1 text-base">Harita Modu</span>
              </button>

              <button
                onClick={() => { onOpenAddReview(); setIsMobileMenuOpen(false); }}
                className="w-full flex items-center gap-3 p-3 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition font-semibold text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                  <Star className="w-5 h-5 text-amber-500 dark:text-amber-400" />
                </div>
                <span className="flex-1 text-base">Değerlendir / Puanla</span>
              </button>

              <button
                onClick={() => { window.scrollTo(0,0); navigate('/kurumsal'); setIsMobileMenuOpen(false); }}
                className="w-full flex items-center gap-3 p-3 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition font-semibold text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <span className="flex-1 text-base">Kurumsal Üyelik</span>
              </button>

              {currentUser?.role === 'admin' && (
                <button
                  onClick={() => { window.scrollTo(0,0); navigate('/admin'); setIsMobileMenuOpen(false); }}
                  className="w-full flex items-center gap-3 p-3 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition font-semibold text-left"
                >
                  <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <span className="flex-1 text-base">Yönetici Paneli</span>
                </button>
              )}
            </div>

            {/* Contact */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
               <a
                  href="tel:02168501907"
                  className="flex items-center justify-between gap-4 p-4 bg-blue-50 dark:bg-slate-800 rounded-2xl transition active:scale-95 border border-blue-100 dark:border-slate-700 group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                      <Phone className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] text-blue-600 dark:text-blue-400 font-extrabold uppercase tracking-wider mb-0.5">Destek & İletişim</span>
                      <span className="text-lg font-black text-slate-900 dark:text-white">0216 850 19 07</span>
                    </div>
                  </div>
               </a>
            </div>

          </div>
        </div>
"""
    new_text = text[:start_idx] + replacement + "\n" + text[end_idx:]
    with open('src/components/Header.tsx', 'w', encoding='utf-8') as f:
        f.write(new_text)
    print("Replaced successfully")
else:
    print("Not found")

