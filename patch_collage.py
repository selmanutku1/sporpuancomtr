import re

with open('src/components/SporpuanlilarNeDemis.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

replacement = """          {/* Right: Visual */}
          <div className="w-full lg:w-7/12 relative mt-12 lg:mt-0 max-w-xl mx-auto lg:mx-0">
             {/* Decorative Background */}
             <div className="absolute inset-0 bg-yellow-400 rounded-[3rem] scale-100 sm:scale-105 translate-x-2 -translate-y-2 sm:translate-x-4 sm:-translate-y-4 hidden md:block"></div>
             
             {/* Collage Container */}
             <div className="relative z-10 w-full h-[360px] sm:h-[480px] grid grid-cols-2 grid-rows-2 gap-3 sm:gap-4">
               {/* Large left image (Sports event) */}
               <div className="col-span-1 row-span-2 rounded-[2rem] overflow-hidden border-4 border-white dark:border-slate-800 shadow-xl group">
                 <img 
                   src="https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=800&auto=format&fit=crop" 
                   alt="Maraton" 
                   className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                 />
               </div>
               {/* Top right image (Swimming) */}
               <div className="col-span-1 row-span-1 rounded-[2rem] overflow-hidden border-4 border-white dark:border-slate-800 shadow-xl group">
                 <img 
                   src="https://images.unsplash.com/photo-1560090995-01632a28895b?q=80&w=600&auto=format&fit=crop" 
                   alt="Yüzme Tesisi" 
                   className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                 />
               </div>
               {/* Bottom right image (Sports school) */}
               <div className="col-span-1 row-span-1 rounded-[2rem] overflow-hidden border-4 border-white dark:border-slate-800 shadow-xl group">
                 <img 
                   src="https://images.unsplash.com/photo-1574629810360-7efbb928ac05?q=80&w=600&auto=format&fit=crop" 
                   alt="Spor Okulu" 
                   className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                 />
               </div>
             </div>
             
             {/* Floating card 1 */}
             <div className="absolute -left-2 sm:-left-8 top-1/4 z-20 bg-slate-900 dark:bg-slate-800 p-3 sm:p-4 rounded-2xl shadow-xl w-56 sm:w-64 transform -rotate-3 transition-transform hover:rotate-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-500 flex items-center justify-center shadow-inner text-white font-bold text-lg">
                    MK
                  </div>
                  <div>
                    <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Yorum bırakan</p>
                    <p className="text-sm sm:text-base font-black text-white leading-none">Murat K.</p>
                  </div>
                </div>
             </div>
             
             {/* Floating card 2 */}
             <div className="absolute -right-2 sm:-right-6 bottom-4 sm:bottom-8 z-20 bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-2xl shadow-2xl w-64 sm:w-72 transform rotate-3 transition-transform hover:rotate-0 border border-slate-100 dark:border-slate-700">
                <div className="absolute -top-3 -left-3 bg-emerald-500 w-8 h-8 rounded-full flex items-center justify-center shadow-lg">
                   <Star className="w-4 h-4 text-white fill-white" />
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base mb-1.5 leading-tight">Harika Tesis!</h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  Çocuğum için futbol okulu arıyordum. Antrenörler çok ilgili, tesis oldukça hijyenik ve güvenli. Kesinlikle tavsiye ederim.
                </p>
             </div>
          </div>"""

# Match the old right visual
start_marker = "          {/* Right: Visual */}"
end_marker = "        </div>\n      </div>\n      \n      {/* Marquee Section */}"

start_idx = text.find(start_marker)
end_idx = text.find(end_marker)

if start_idx != -1 and end_idx != -1:
    new_text = text[:start_idx] + replacement + "\n" + text[end_idx:]
    with open('src/components/SporpuanlilarNeDemis.tsx', 'w', encoding='utf-8') as f:
        f.write(new_text)
    print("Replaced visual section successfully")
else:
    print("Could not find markers")
