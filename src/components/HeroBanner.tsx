import React from 'react';
import { Trophy, ShieldCheck, Star, Sparkles, MapPin, Activity, CheckCircle2 } from 'lucide-react';

interface HeroBannerProps {
  onOpenAddReview: () => void;
  onOpenMapView: () => void;
  onSelectTopCategory: (cat: string) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onOpenAddReview,
  onOpenMapView,
  onSelectTopCategory,
}) => {
  return (
    <div className="relative bg-gradient-to-b from-blue-50/70 via-slate-50 to-white border-b border-slate-200 text-slate-800 pt-10 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
          
          {/* Left Text Content */}
          <div className="w-full lg:w-3/5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-100 border border-blue-200 text-blue-800 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Türkiye'nin Spor Değerlendirme Platformu</span>
            </div>

            <h1 className="font-['Red_Hat_Display',_sans-serif] font-bold text-[#23262f] text-[48px] sm:text-[54px] leading-[1.15]">
              Spor Tesislerini, Spor Okullarını, Etkinlikleri <br className="hidden sm:inline" />
              <span className="text-blue-600">
                Puanla, Yorumla, Keşfet!
              </span>
            </h1>

            <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl">
              <strong className="text-blue-700">sporpuan</strong> ile spor tesislerini, spor okullarını ve etkinlikleri gerçek kullanıcı deneyimleriyle şeffafça inceleyin, puanlayın ve size en uygununu keşfedin.
            </p>

            {/* CTAs */}
            <div className="grid grid-cols-1 sm:flex sm:flex-wrap items-center gap-2.5 pt-2">
              <button
                onClick={onOpenAddReview}
                className="w-full sm:w-auto px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition shadow-sm flex items-center justify-center gap-2 active:scale-95 min-h-[44px]"
              >
                <Star className="w-4 h-4 fill-white text-white" />
                <span>Puanla</span>
              </button>
              
              <button
                onClick={onOpenMapView}
                className="w-full sm:w-auto px-5 py-3.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-sm active:scale-95 min-h-[44px]"
              >
                <MapPin className="w-4 h-4 text-blue-600" />
                <span>Harita Görünümü</span>
              </button>
            </div>

            {/* Popular Topics Quick Filters */}
            <div className="flex items-center gap-2 text-xs text-slate-500 pt-3 overflow-x-auto pb-1 scrollbar-none">
              <span className="font-semibold text-slate-700 shrink-0">Popüler Aramalar:</span>
              {['İstanbul Maratonu', 'EuroLeague Derbisi', 'Süper Lig', 'Sultanlar Ligi', 'Uludağ Trail'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => onSelectTopCategory(tag)}
                  className="px-2.5 py-1 bg-white hover:bg-blue-50 border border-slate-200 rounded-md text-slate-600 hover:text-blue-600 transition shadow-2xs whitespace-nowrap shrink-0"
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>

          {/* Right Visual Decoration */}
          <div className="w-full lg:w-2/5 hidden md:flex justify-center relative">
            <div className="absolute inset-0 bg-blue-200/50 rounded-full blur-[80px] -z-10"></div>
            
            <div className="relative w-full max-w-sm aspect-square">
              
              {/* Main Card */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 p-5 transform rotate-[-2deg] z-20">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                      <Trophy className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-sm font-black text-slate-900">Merkez Spor Kompleksi</div>
                      <div className="flex items-center gap-1 mt-0.5">
                         <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                         <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                         <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                         <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                         <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                         <span className="text-xs font-bold text-slate-600 ml-1">5.0</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                    <div className="h-2 w-full bg-slate-100 rounded-full">
                      <div className="h-full w-[90%] bg-blue-500 rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                    <div className="h-2 w-full bg-slate-100 rounded-full">
                      <div className="h-full w-[95%] bg-emerald-500 rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                    <div className="h-2 w-full bg-slate-100 rounded-full">
                      <div className="h-full w-[85%] bg-amber-500 rounded-full"></div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Güvenilir Tesis Puanlaması</span>
                </div>
              </div>

              {/* Floating Element 1 */}
              <div className="absolute top-4 right-8 bg-white p-3.5 rounded-2xl shadow-lg border border-slate-100 transform rotate-[8deg] z-30 animate-pulse">
                 <div className="flex items-center gap-2">
                   <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center">
                     <MapPin className="w-4 h-4 text-rose-500" />
                   </div>
                   <div className="flex flex-col">
                     <span className="text-[10px] font-bold text-slate-400">Konum</span>
                     <span className="text-xs font-black text-slate-800">Kadıköy, İst</span>
                   </div>
                 </div>
              </div>

              {/* Floating Element 2 */}
              <div className="absolute bottom-4 left-4 bg-white p-3.5 rounded-2xl shadow-lg border border-slate-100 transform rotate-[-6deg] z-30">
                 <div className="flex items-center gap-2">
                   <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center">
                     <Activity className="w-4 h-4 text-indigo-600" />
                   </div>
                   <div className="flex flex-col">
                     <span className="text-[10px] font-bold text-slate-400">Tesis Puanı</span>
                     <span className="text-xs font-black text-slate-800">Harika (9.2)</span>
                   </div>
                 </div>
              </div>
              
              {/* Sparkles */}
              <Sparkles className="absolute -top-4 left-1/4 w-8 h-8 text-blue-400/60 z-10" />
              <Sparkles className="absolute bottom-1/4 right-0 w-6 h-6 text-amber-400/60 z-10" />
              
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
