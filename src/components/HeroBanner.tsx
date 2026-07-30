import React from 'react';
import { Trophy, ShieldCheck, Star, Sparkles, MapPin } from 'lucide-react';

interface HeroBannerProps {
  onOpenAiAdvisor: () => void;
  onOpenAddReview: () => void;
  onOpenMapView: () => void;
  onSelectTopCategory: (cat: string) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onOpenAiAdvisor,
  onOpenAddReview,
  onOpenMapView,
  onSelectTopCategory,
}) => {
  return (
    <div className="relative bg-gradient-to-b from-blue-50/70 via-slate-50 to-white border-b border-slate-200 text-slate-800 pt-10 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Main Copy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-100 border border-blue-200 text-blue-800 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>5 Boyutlu Bağımsız Spor Etkinliği Puanlama Platformu</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-slate-900">
              Biletini Almadan Önce <br className="hidden sm:inline" />
              <span className="text-blue-600">
                Gerçek SporPuan Skoruna
              </span> Bak.
            </h1>

            <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl">
              <strong className="text-blue-700">sporpuan</strong>; maratonlardan derbilere tüm spor organizasyonlarını tribün atmosferi, ulaşım, bilet fiyatı ve kalite yönünden 10 üzerinden şeffafça puanlar.
            </p>

            {/* CTAs */}
            <div className="grid grid-cols-1 sm:flex sm:flex-wrap items-center gap-2.5 pt-2">
              <button
                onClick={onOpenAddReview}
                className="w-full sm:w-auto px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition shadow-sm flex items-center justify-center gap-2 active:scale-95 min-h-[44px]"
              >
                <Star className="w-4 h-4 fill-white text-white" />
                <span>Bir Etkinliği Puanla</span>
              </button>

              <button
                onClick={onOpenMapView}
                className="w-full sm:w-auto px-5 py-3.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-sm active:scale-95 min-h-[44px]"
              >
                <MapPin className="w-4 h-4 text-blue-600" />
                <span>Harita Görünümü</span>
              </button>

              <button
                onClick={onOpenAiAdvisor}
                className="w-full sm:w-auto px-5 py-3.5 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 font-bold text-sm rounded-xl transition flex items-center justify-center gap-2 min-h-[44px]"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Sporpuan AI</span>
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

          {/* Right Visual Card - SporPuan Index Badge */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-md relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-500" />
                  <span className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                    SporPuan Değerlendirme Kriterleri
                  </span>
                </div>
                <span className="text-xs font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200 font-bold">
                  v2.4
                </span>
              </div>

              {/* 5 Dimensions breakdown sample */}
              <div className="space-y-3.5 text-xs">
                <div>
                  <div className="flex justify-between font-semibold text-slate-700 mb-1">
                    <span>🏟️ Organizasyon & Tesis</span>
                    <span className="font-bold text-blue-600">9.6 / 10</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/60">
                    <div className="h-full bg-blue-600 rounded-full w-[96%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold text-slate-700 mb-1">
                    <span>🔥 Tribün & Coşku Atmosferi</span>
                    <span className="font-bold text-blue-600">9.8 / 10</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/60">
                    <div className="h-full bg-blue-600 rounded-full w-[98%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold text-slate-700 mb-1">
                    <span>🎟️ Bilet & Fiyat/Performans</span>
                    <span className="font-bold text-blue-600">9.1 / 10</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/60">
                    <div className="h-full bg-blue-600 rounded-full w-[91%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold text-slate-700 mb-1">
                    <span>🍔 Yiyecek & Sosyal Alanlar</span>
                    <span className="font-bold text-blue-600">8.9 / 10</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/60">
                    <div className="h-full bg-blue-600 rounded-full w-[89%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold text-slate-700 mb-1">
                    <span>🚗 Ulaşım, Otopark & Tahliye</span>
                    <span className="font-bold text-blue-600">8.7 / 10</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/60">
                    <div className="h-full bg-blue-600 rounded-full w-[87%]" />
                  </div>
                </div>
              </div>

              {/* Bottom Stat Footer */}
              <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-lg font-black text-slate-900">1,240+</p>
                  <p className="text-[10px] text-slate-500 font-medium">Etkinlik Kaydı</p>
                </div>
                <div>
                  <p className="text-lg font-black text-blue-600">48.5K+</p>
                  <p className="text-[10px] text-slate-500 font-medium">Kullanıcı İncelemesi</p>
                </div>
                <div>
                  <p className="text-lg font-black text-amber-500">9.2/10</p>
                  <p className="text-[10px] text-slate-500 font-medium">Ortalama Puan</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

