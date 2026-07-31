import React from 'react';
import { Trophy, ShieldCheck, Star, Sparkles, MapPin } from 'lucide-react';

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
    <div className="relative bg-gradient-to-b from-blue-50/70 via-slate-50 to-white border-b border-slate-200 text-slate-800 pt-10 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="max-w-4xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-100 border border-blue-200 text-blue-800 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Türkiye'nin Spor Değerlendirme Platformu</span>
            </div>

            <h1 className="font-['Red_Hat_Display',_sans-serif] font-bold text-[#23262f] text-[54px] leading-[66px]">
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
      </div>
    </div>
  );
};

