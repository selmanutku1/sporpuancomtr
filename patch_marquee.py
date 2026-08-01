import re

with open('src/components/SporpuanlilarNeDemis.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Change section background
text = text.replace('className="w-full bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900 pt-20 pb-16 overflow-hidden relative z-10 border-t border-slate-200 dark:border-slate-800"', 
                    'className="w-full bg-white dark:bg-slate-950 pt-20 pb-16 overflow-hidden relative z-10"')

# Change Marquee Section
marquee_replacement = """      {/* Marquee Section */}
      <div className="relative py-10 w-full overflow-hidden bg-slate-50/50 dark:bg-slate-900/20 border-y border-slate-100 dark:border-slate-800/50">
        
        {/* Gradients for fading effect at edges */}
        <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-24 bg-gradient-to-r from-slate-50/50 dark:from-slate-950/20 to-transparent z-20 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-24 bg-gradient-to-l from-slate-50/50 dark:from-slate-950/20 to-transparent z-20 pointer-events-none"></div>

        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            animation: marquee 50s linear infinite;
            display: flex;
            width: max-content;
          }
          .animate-marquee:hover {
            animation-play-state: paused;
          }
          
          .flip-card {
            perspective: 1000px;
          }
          .flip-card-inner {
            transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            transform-style: preserve-3d;
          }
          .flip-card:hover .flip-card-inner {
            transform: rotateY(180deg);
          }
          .flip-card-front, .flip-card-back {
            backface-visibility: hidden;
            -webkit-backface-visibility: hidden;
          }
          .flip-card-back {
            transform: rotateY(180deg);
          }
        `}</style>
        
        <div className="relative z-10 animate-marquee gap-4 sm:gap-6 px-4">
          {repeatedReviews.map((rev, idx) => {
            const colors = [
              'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400', 
              'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400', 
              'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400', 
              'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400', 
              'bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400'
            ];
            const avatarColor = colors[idx % colors.length];
            
            return (
              <div key={`${rev.id}-${idx}`} className="flip-card w-[280px] sm:w-[340px] h-[180px] sm:h-[200px] flex-shrink-0 cursor-pointer">
                <div className="flip-card-inner w-full h-full relative">
                  
                  {/* Front */}
                  <div className="flip-card-front absolute w-full h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        {rev.userAvatar ? (
                          <img src={rev.userAvatar} alt="" className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border border-slate-100 dark:border-slate-700" />
                        ) : (
                          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full ${avatarColor} flex items-center justify-center font-bold text-sm sm:text-base`}>
                            {rev.userName.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base leading-tight">{rev.userName}</h4>
                          <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate max-w-[130px] sm:max-w-[160px]">{rev.eventTitle}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-500/10 px-2 py-1 rounded-lg">
                        <span className="text-yellow-600 dark:text-yellow-500 font-bold text-sm sm:text-base">{rev.overallScore || rev.rating || 9.0}</span>
                        <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-3 mt-3 sm:mt-4 leading-relaxed font-medium">
                      "{rev.comment}"
                    </p>
                  </div>

                  {/* Back */}
                  <div className="flip-card-back absolute w-full h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-center shadow-sm relative">
                     <Quote className="absolute top-4 right-4 w-12 h-12 text-slate-50 dark:text-slate-800/50 -rotate-6" />
                     
                     <div className="relative z-10 space-y-3 sm:space-y-4 w-full">
                       {Object.entries(rev.scores || { zemin: 9, aydinlatma: 9, ulasim: 9 }).slice(0, 3).map(([key, score]) => (
                         <div key={key} className="flex justify-between items-center text-xs sm:text-sm">
                           <span className="text-slate-600 dark:text-slate-400 capitalize font-medium">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                           <div className="flex items-center gap-2 sm:gap-3 flex-1 ml-4">
                             <div className="flex-1 h-1.5 sm:h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                               <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(score as number) * 10}%`}}></div>
                             </div>
                             <span className="text-slate-800 dark:text-slate-200 font-black w-5 text-right">{score as number}</span>
                           </div>
                         </div>
                       ))}
                     </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}"""

start_marker = "      {/* Marquee Section */}"
start_idx = text.find(start_marker)

if start_idx != -1:
    new_text = text[:start_idx] + marquee_replacement
    with open('src/components/SporpuanlilarNeDemis.tsx', 'w', encoding='utf-8') as f:
        f.write(new_text)
    print("Replaced marquee section successfully")
else:
    print("Could not find marker")
