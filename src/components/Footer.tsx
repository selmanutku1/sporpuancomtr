import React from 'react';
import { Trophy, ShieldCheck, Heart, Github, Twitter, Instagram } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 text-slate-600 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">
        
        {/* Brand Left */}
        <div className="md:col-span-5 space-y-4">
          <div className="flex items-center gap-2.5">
            <img 
              src="/sporpuan-logo.svg" 
              alt="SporPuan Logo" 
              className="w-10 h-10 rounded-xl shadow object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="flex flex-col">
              <span className="text-2xl font-black text-slate-900 font-sans leading-none">
                spor<span className="text-blue-600">puan</span>
              </span>
              <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mt-0.5">
                BAĞIMSIZ SPOR PLATFORMU
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed max-w-md">
            <strong>sporpuan</strong>, Türkiye'deki tüm spor etkinliklerini organizasyon kalitesi, atmosfer, bilet fiyatı, ikramlar ve ulaşım kolaylığı yönünden 5 boyutta bağımsız şekilde değerlendiren taraftar ve spor topluluğu platformudur.
          </p>

          <div className="flex items-center gap-2 text-xs text-blue-700 font-semibold">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>%100 Bağımsız & Doğrulanmış Sporcu İncelemeleri</span>
          </div>
        </div>

        {/* Quick Links */}
        <div className="md:col-span-3 space-y-3 text-xs">
          <h4 className="font-bold text-slate-900 uppercase tracking-wider">Spor Kategorileri</h4>
          <ul className="space-y-2 text-slate-600 font-medium">
            <li><a href="#" className="hover:text-blue-600 transition">Futbol Derbileri & Süper Lig</a></li>
            <li><a href="#" className="hover:text-blue-600 transition">THY EuroLeague Basketbol</a></li>
            <li><a href="#" className="hover:text-blue-600 transition">Kıtalararası Maraton & Koşu</a></li>
            <li><a href="#" className="hover:text-blue-600 transition">Sultanlar Ligi Voleybol</a></li>
            <li><a href="#" className="hover:text-blue-600 transition">Uludağ Ultra Trail & Doğa</a></li>
          </ul>
        </div>

        {/* Corporate & Domain */}
        <div className="md:col-span-4 space-y-3 text-xs">
          <h4 className="font-bold text-slate-900 uppercase tracking-wider">sporpuan Hakkında</h4>
          <p className="text-slate-500">
            Spor etkinliği düzenliyor veya bir turnuvayı değerlendirmek mi istiyorsunuz? Organizatör paneline hemen katılın.
          </p>

          <div className="pt-2">
            <span className="text-[11px] text-slate-400 block">Telif Hakkı & Marka:</span>
            <span className="font-mono text-blue-600 font-bold">sporpuan © 2026 Tüm Hakları Saklıdır.</span>
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
        <span>sporpuan</span>
        <span className="flex items-center gap-1 font-medium">
          Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> by <a href="https://sporsepeti.com.tr" target="_blank" rel="noopener noreferrer" className="font-bold text-slate-700 hover:text-blue-600 transition">sporsepeti.com.tr</a>
        </span>
      </div>
    </footer>
  );
};
