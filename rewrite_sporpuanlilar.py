import re

content = """import React, { useMemo } from 'react';
import { SportsEvent, Review } from '../types';
import { MessageCircle, Camera, Map, Star, Quote } from 'lucide-react';

interface Props {
  events: SportsEvent[];
}

const FALLBACK_REVIEWS: (Review & { eventTitle: string })[] = [
  {
    id: 'f1',
    userName: 'Elif K.',
    date: '2026-08-01',
    overallScore: 8.9,
    rating: 8.9,
    scores: { tesis: 9, egitmen: 8, hijyen: 9 },
    comment: 'Su sporları tutkunları için harika bir etkinlik.',
    pros: [],
    cons: [],
    likes: 0,
    tags: [],
    status: 'published',
    eventTitle: 'Kürek Kano Festivali',
    eventId: '1'
  },
  {
    id: 'f2',
    userName: 'Selin O.',
    date: '2026-08-01',
    overallScore: 9,
    rating: 9,
    scores: { zemin: 9, aydinlatma: 9, ulasim: 9 },
    comment: 'Organizasyon çok keyifliydi. Sporpuan üzerinden keşfetmem harika.',
    pros: [],
    cons: [],
    likes: 0,
    tags: [],
    status: 'published',
    eventTitle: 'Bisiklet Festivali',
    eventId: '2'
  },
  {
    id: 'f3',
    userName: 'Burak D.',
    date: '2026-08-01',
    overallScore: 9.1,
    rating: 9.1,
    scores: { parkurGuvenlik: 10, kitIkram: 8, atmosferSeyir: 9 },
    comment: 'Güzergah muhteşemdi, organizasyon mükemmeldi.',
    pros: [],
    cons: [],
    likes: 0,
    tags: [],
    status: 'published',
    eventTitle: 'İstanbul Maratonu',
    eventId: '3'
  },
  {
    id: 'f4',
    userName: 'Ayşe M.',
    date: '2026-08-01',
    overallScore: 8.8,
    rating: 8.8,
    scores: { egitmen: 9, fiyatPerformans: 8, hijyen: 9 },
    comment: 'Harika bir organizasyon, parkur çok güzeldi.',
    pros: [],
    cons: [],
    likes: 0,
    tags: [],
    status: 'published',
    eventTitle: 'Ankara Triatlon',
    eventId: '4'
  }
];

export const SporpuanlilarNeDemis: React.FC<Props> = ({ events }) => {
  const allReviews = useMemo(() => {
    let list: (Review & { eventTitle: string; eventId: string })[] = [];
    events.forEach(ev => {
      ev.reviews.forEach(rev => {
        list.push({ ...rev, eventTitle: ev.title, eventId: ev.id });
      });
    });
    const validReviews = list.filter(r => r.status !== 'hidden');
    if (validReviews.length < 4) {
      return [...validReviews, ...FALLBACK_REVIEWS];
    }
    return validReviews.sort(() => 0.5 - Math.random());
  }, [events]);

  const repeatedReviews = [...allReviews, ...allReviews, ...allReviews, ...allReviews].slice(0, 20);

  return (
    <section className="w-full bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900 pt-20 pb-16 overflow-hidden relative z-10 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-8">
          {/* Left: Stats */}
          <div className="w-full lg:w-5/12 space-y-12">
            <div>
              <h2 className="font-['Red_Hat_Display',_sans-serif] text-4xl sm:text-5xl lg:text-[54px] font-black text-slate-900 dark:text-white leading-[1.1] mb-6 tracking-tight">
                Sporpuanlılar Ne Demiş?
              </h2>
            </div>
            
            <div className="space-y-10">
              <div className="flex items-center gap-6 group">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-yellow-400 dark:bg-yellow-500 flex items-center justify-center shrink-0 shadow-sm relative">
                  <MessageCircle className="w-8 h-8 sm:w-10 sm:h-10 text-white fill-white stroke-2" />
                  <div className="absolute -top-1 -right-1 w-6 h-6 sm:w-8 sm:h-8 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-yellow-500 text-xs sm:text-sm font-black">10K</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-1">10 Bin+</h3>
                  <p className="text-slate-500 dark:text-slate-400 font-semibold text-lg sm:text-xl">Yorum Sayısı</p>
                </div>
              </div>
              
              <div className="flex items-center gap-6 group">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-400 dark:bg-emerald-500 flex items-center justify-center shrink-0 shadow-sm relative">
                  <Camera className="w-8 h-8 sm:w-10 sm:h-10 text-white fill-white stroke-2" />
                </div>
                <div>
                  <h3 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-1">5 Bin+</h3>
                  <p className="text-slate-500 dark:text-slate-400 font-semibold text-lg sm:text-xl">Fotoğraf Sayısı</p>
                </div>
              </div>

              <div className="flex items-center gap-6 group">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-sky-400 dark:bg-sky-500 flex items-center justify-center shrink-0 shadow-sm relative">
                  <Map className="w-8 h-8 sm:w-10 sm:h-10 text-white fill-white stroke-2" />
                </div>
                <div>
                  <h3 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-1">1000+</h3>
                  <p className="text-slate-500 dark:text-slate-400 font-semibold text-lg sm:text-xl">Spor Tesisi</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Visual */}
          <div className="w-full lg:w-7/12 relative mt-12 lg:mt-0 max-w-xl mx-auto lg:mx-0">
             <div className="absolute inset-0 bg-yellow-400 rounded-full scale-100 sm:scale-105 translate-x-4 -translate-y-4 hidden md:block aspect-square"></div>
             <div className="relative z-10 w-full aspect-square rounded-full overflow-hidden border-8 border-white dark:border-slate-800 shadow-2xl">
               <img 
                 src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1000&auto=format&fit=crop" 
                 alt="Mutlu Sporcu" 
                 className="w-full h-full object-cover"
               />
             </div>
             
             {/* Floating card 1 */}
             <div className="absolute -left-2 sm:-left-12 top-1/4 z-20 bg-slate-900 dark:bg-slate-800 p-4 sm:p-5 rounded-2xl shadow-xl w-60 sm:w-72 transform -rotate-3 transition-transform hover:rotate-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white flex items-center justify-center shadow-inner text-2xl">
                    🤩
                  </div>
                  <div>
                    <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Yorum bırakan</p>
                    <p className="text-sm sm:text-base font-black text-white leading-none">Umut B****</p>
                  </div>
                </div>
             </div>
             
             {/* Floating card 2 */}
             <div className="absolute -right-2 sm:-right-8 bottom-1/4 z-20 bg-white dark:bg-slate-800 p-5 sm:p-6 rounded-2xl shadow-2xl w-64 sm:w-80 transform rotate-3 transition-transform hover:rotate-0">
                <div className="absolute -top-4 -left-4 bg-red-500 w-8 h-8 rounded-full flex items-center justify-center shadow-lg">
                   <div className="w-4 h-4 bg-white rounded-full"></div>
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg mb-2 leading-tight">Yer kalmaz diye korkuyorum</h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  Her şeyi ile çok beğendik, bir o kadar da kaliteli hizmet... Tavsiye edeceğim de korkuyorum bize yer kalmazsa diye.
                </p>
             </div>
          </div>
        </div>
      </div>
      
      {/* Marquee Section */}
      <div className="relative py-10 w-full overflow-hidden">
        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            animation: marquee 40s linear infinite;
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
              'bg-red-500', 'bg-orange-500', 'bg-blue-500', 'bg-emerald-500', 
              'bg-purple-500', 'bg-pink-500', 'bg-indigo-500'
            ];
            const avatarColor = colors[idx % colors.length];
            
            return (
              <div key={`${rev.id}-${idx}`} className="flip-card w-[320px] sm:w-[380px] h-[200px] sm:h-[220px] flex-shrink-0 cursor-pointer">
                <div className="flip-card-inner w-full h-full relative">
                  
                  {/* Front */}
                  <div className="flip-card-front absolute w-full h-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 sm:p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3 sm:gap-4">
                        {rev.userAvatar ? (
                          <img src={rev.userAvatar} alt="" className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-slate-100 dark:border-slate-700" />
                        ) : (
                          <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full ${avatarColor} flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-inner`}>
                            {rev.userName.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <h4 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg leading-tight">{rev.userName}</h4>
                          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 truncate max-w-[150px] sm:max-w-[180px]">{rev.eventTitle}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-slate-800 dark:text-slate-200 font-bold text-base sm:text-lg">{rev.overallScore || rev.rating || 9.0}</span>
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      </div>
                    </div>
                    <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 line-clamp-3 mt-4 leading-relaxed font-medium">
                      "{rev.comment}"
                    </p>
                  </div>

                  {/* Back */}
                  <div className="flip-card-back absolute w-full h-full bg-slate-900 dark:bg-slate-800 border border-slate-800 dark:border-slate-700 rounded-2xl p-5 sm:p-6 flex flex-col shadow-xl overflow-hidden relative">
                     <Quote className="absolute -top-4 -right-4 w-24 h-24 text-slate-800/50 dark:text-slate-700/30 rotate-12" />
                     
                     <div className="relative z-10 flex-1 flex flex-col justify-center space-y-4">
                       {Object.entries(rev.scores || { zemin: 9, aydinlatma: 9, ulasim: 9 }).slice(0, 4).map(([key, score]) => (
                         <div key={key} className="flex justify-between items-center text-sm">
                           <span className="text-slate-300 capitalize font-medium">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                           <div className="flex items-center gap-3">
                             <div className="w-24 sm:w-32 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                               <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(score as number) * 10}%`}}></div>
                             </div>
                             <span className="text-white font-bold w-6 text-right">{score as number}</span>
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
}
"""

with open('src/components/SporpuanlilarNeDemis.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated SporpuanlilarNeDemis.tsx")
