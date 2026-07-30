import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Search, 
  MapPin, 
  PlusCircle, 
  Sparkles, 
  BarChart3, 
  Star,
  CheckCircle2,
  Share2,
  Map,
  ShieldCheck,
  Maximize2,
  Minimize2,
  RefreshCw,
  Settings,
  Menu,
  X,
  Home
} from 'lucide-react';
import { SportsCategory, UserProfile, UserRole } from '../types';
import { User, LogOut, LogIn, UserPlus, Building2 } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCity: string;
  setSelectedCity: (c: string) => void;
  selectedCategory: SportsCategory;
  setSelectedCategory: (cat: SportsCategory) => void;
  onOpenAddReview: () => void;
  onOpenSubmitEvent: () => void;
  onOpenAiAdvisor: () => void;
  onOpenLeaderboard: () => void;
  onOpenMapView: () => void;
  onOpenAutoSync?: () => void;
  onOpenAdminPanel?: () => void;
  currentUser: UserProfile | null;
  onOpenAuthModal: (role?: UserRole) => void;
  onLogout: () => void;
  cities: string[];
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCity,
  setSelectedCity,
  setSelectedCategory,
  onOpenAddReview,
  onOpenSubmitEvent,
  onOpenAiAdvisor,
  onOpenLeaderboard,
  onOpenMapView,
  onOpenAutoSync,
  onOpenAdminPanel,
  currentUser,
  onOpenAuthModal,
  onLogout,
  cities,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error("Tam ekran başlatılamadı:", err);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const handleShareBrand = () => {
    navigator.clipboard.writeText('https://sporpuan.com');
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleResetHome = () => {
    setSearchQuery('');
    setSelectedCity('Tüm Şehirler');
    setSelectedCategory('Tümü');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 text-slate-800 shadow-sm">
        {/* Top Banner Notice - Soft Light Blue */}
        <div className="bg-blue-50 border-b border-blue-100 px-3 py-1.5 text-xs text-blue-900 text-center font-medium flex items-center justify-between sm:justify-center gap-1.5">
          <div className="flex items-center gap-1.5">
            <span className="bg-blue-100 text-blue-800 border border-blue-200 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide">
              sporpuan
            </span>
            <span className="hidden sm:inline">
              Türkiye'nin Bağımsız Spor Etkinliği Puanlama & İnceleme Platformu
            </span>
            <span className="sm:hidden text-[11px] font-semibold text-blue-950 truncate max-w-[170px]">
              Spor Etkinlik Puanlama
            </span>
          </div>

          <button 
            onClick={onOpenAiAdvisor}
            className="inline-flex items-center gap-1 bg-white hover:bg-blue-100 text-blue-700 border border-blue-200 px-2 py-0.5 rounded font-bold transition text-[11px] shadow-2xs shrink-0"
          >
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>Sporpuan AI</span>
          </button>
        </div>

        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-2">
            
            {/* Brand Logo - Clean Soft Logo */}
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={handleResetHome} className="flex items-center gap-2.5 group text-left">
                <img 
                  src="/sporpuan-logo.svg" 
                  alt="SporPuan Logo" 
                  className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl shadow-md group-hover:scale-105 transition-transform duration-200 object-cover"
                  onError={(e) => {
                    // Fallback to Icon if image load fails
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 font-sans">
                      spor<span className="text-blue-600">puan</span>
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 -mt-1 hidden sm:block tracking-wide">
                    ETKİNLİK PUANLAMA
                  </span>
                </div>
              </button>
            </div>

            {/* Desktop Search & City Filter Bar */}
            <div className="hidden md:flex items-center flex-1 max-w-lg bg-slate-100 border border-slate-200 rounded-xl p-1.5 gap-2 focus-within:border-blue-500 focus-within:bg-white transition-all">
              <div className="flex items-center flex-1 pl-2 gap-2 text-slate-400">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Etkinlik, stadyum, takım veya organizatör ara..."
                  className="w-full bg-transparent border-none text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
                />
              </div>

              <div className="h-6 w-px bg-slate-200" />

              <div className="flex items-center gap-1 pl-1 pr-2 shrink-0 text-slate-600 text-xs">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="bg-transparent border-none text-xs text-slate-700 font-medium focus:outline-none cursor-pointer pr-1"
                >
                  <option value="Tüm Şehirler" className="bg-white text-slate-800">Tüm Şehirler</option>
                  {cities.map((city) => (
                    <option key={city} value={city} className="bg-white text-slate-800">
                      {city}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Desktop Right Actions Buttons */}
            <div className="hidden md:flex items-center gap-2">
              
              {/* Fullscreen Toggle Button */}
              <button
                onClick={toggleFullscreen}
                title={isFullscreen ? 'Tam Ekrandan Çık' : 'Tam Ekran Moduna Geç'}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition"
              >
                {isFullscreen ? (
                  <>
                    <Minimize2 className="w-4 h-4 text-slate-600" />
                    <span className="hidden xl:inline">Normal Ekran</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-4 h-4 text-slate-600" />
                    <span className="hidden xl:inline">Tam Ekran</span>
                  </>
                )}
              </button>

              {/* AutoSync Button */}
              <button
                onClick={onOpenAutoSync}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition"
              >
                <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
                <span>Canlı Entegrasyon</span>
              </button>

              <button
                onClick={onOpenMapView}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition"
              >
                <Map className="w-3.5 h-3.5 text-blue-600" />
                <span>Harita</span>
              </button>

              <button
                onClick={onOpenLeaderboard}
                className="hidden lg:flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition"
              >
                <BarChart3 className="w-3.5 h-3.5 text-amber-500" />
                <span>Sıralama</span>
              </button>

              <button
                onClick={onOpenAddReview}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition shadow-sm active:scale-95"
              >
                <Star className="w-3.5 h-3.5 fill-white text-white" />
                <span>Puanla</span>
              </button>

              <button
                onClick={onOpenSubmitEvent}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition"
              >
                <PlusCircle className="w-3.5 h-3.5 text-blue-600" />
                <span>Etkinlik Ekle</span>
              </button>

              {onOpenAdminPanel && (
                <button
                  onClick={onOpenAdminPanel}
                  title="Sistem Etkinlik Yönetimi"
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition"
                >
                  <Settings className="w-3.5 h-3.5 text-slate-600" />
                  <span className="hidden xl:inline">Yönetim</span>
                </button>
              )}

              {/* Auth User Profile Section */}
              {currentUser ? (
                <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-xl p-1 pr-2">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-lg object-cover border border-slate-300 shrink-0"
                  />
                  <div className="hidden lg:flex flex-col min-w-0">
                    <span className="text-xs font-extrabold text-slate-900 truncate leading-tight">
                      {currentUser.name}
                    </span>
                    <span className="text-[9px] font-bold text-blue-700 uppercase tracking-wide">
                      {currentUser.role === 'organizer' ? 'Organizatör' : 'Sporsever'}
                    </span>
                  </div>
                  <button
                    onClick={onLogout}
                    title="Oturumu Kapat"
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onOpenAuthModal('user')}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 hover:border-blue-300 rounded-xl transition"
                  >
                    <User className="w-3.5 h-3.5 text-blue-600" />
                    <span>Giriş / Üyelik</span>
                  </button>
                </div>
              )}

              <button
                onClick={handleShareBrand}
                title="sporpuan Bağlantısını Kopyala"
                className="p-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition border border-slate-200"
              >
                {copiedLink ? <CheckCircle2 className="w-4 h-4 text-blue-600" /> : <Share2 className="w-4 h-4" />}
              </button>
            </div>

            {/* Mobile Header Actions */}
            <div className="flex md:hidden items-center gap-1.5">
              {/* Mobile Primary Action Button */}
              <button
                onClick={onOpenAddReview}
                className="flex items-center gap-1 px-3 py-2 text-xs font-extrabold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition shadow-xs"
              >
                <Star className="w-3.5 h-3.5 fill-white text-white" />
                <span>Puanla</span>
              </button>

              {/* Mobile Menu Drawer Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2.5 text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl transition flex items-center justify-center min-w-[42px] min-h-[42px]"
                aria-label="Menü"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5 text-slate-900" /> : <Menu className="w-5 h-5 text-slate-900" />}
              </button>
            </div>

          </div>

          {/* Mobile Search Bar */}
          <div className="md:hidden pb-3">
            <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl p-2 gap-2 text-xs shadow-2xs">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Etkinlik veya şehir ara..."
                className="w-full bg-transparent text-slate-800 placeholder-slate-400 focus:outline-none"
              />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="bg-white text-slate-700 font-bold text-xs px-2 py-1.5 rounded-lg border border-slate-200 focus:outline-none shrink-0"
              >
                <option value="Tüm Şehirler">Şehir</option>
                {cities.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>

        </div>

        {/* Mobile Dropdown / Drawer Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-slate-900 text-white border-t border-slate-800 p-4 space-y-3 animate-fade-in shadow-xl">
            {/* User status */}
            {currentUser ? (
              <div className="flex items-center justify-between bg-slate-800 p-3 rounded-xl border border-slate-700">
                <div className="flex items-center gap-2.5">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-9 h-9 rounded-lg object-cover border border-slate-600 shrink-0"
                  />
                  <div>
                    <p className="text-xs font-bold text-white">{currentUser.name}</p>
                    <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">
                      {currentUser.role === 'organizer' ? 'Organizatör Kulüp' : 'Sporsever'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    onLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="px-2.5 py-1.5 text-xs font-bold text-rose-400 hover:text-rose-300 bg-rose-950/50 rounded-lg border border-rose-800/60"
                >
                  Çıkış Yap
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  onOpenAuthModal('user');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 transition"
              >
                <User className="w-4 h-4 text-white" />
                <span>Giriş Yap / Üye Ol</span>
              </button>
            )}

            {/* Quick action grid */}
            <div className="grid grid-cols-2 gap-2 text-xs font-bold pt-1">
              <button
                onClick={() => {
                  onOpenMapView();
                  setIsMobileMenuOpen(false);
                }}
                className="p-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl flex items-center gap-2 text-slate-200"
              >
                <Map className="w-4 h-4 text-blue-400" />
                <span>Harita Modu</span>
              </button>

              <button
                onClick={() => {
                  onOpenLeaderboard();
                  setIsMobileMenuOpen(false);
                }}
                className="p-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl flex items-center gap-2 text-slate-200"
              >
                <BarChart3 className="w-4 h-4 text-amber-400" />
                <span>Sıralama</span>
              </button>

              <button
                onClick={() => {
                  onOpenSubmitEvent();
                  setIsMobileMenuOpen(false);
                }}
                className="p-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl flex items-center gap-2 text-slate-200"
              >
                <PlusCircle className="w-4 h-4 text-emerald-400" />
                <span>Etkinlik Ekle</span>
              </button>

              {onOpenAutoSync && (
                <button
                  onClick={() => {
                    onOpenAutoSync();
                    setIsMobileMenuOpen(false);
                  }}
                  className="p-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl flex items-center gap-2 text-slate-200"
                >
                  <RefreshCw className="w-4 h-4 text-cyan-400" />
                  <span>Canlı Senkron</span>
                </button>
              )}

              {onOpenAdminPanel && (
                <button
                  onClick={() => {
                    onOpenAdminPanel();
                    setIsMobileMenuOpen(false);
                  }}
                  className="p-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl flex items-center gap-2 text-slate-200 col-span-2"
                >
                  <Settings className="w-4 h-4 text-purple-400" />
                  <span>Sistem Yönetim Paneli</span>
                </button>
              )}
            </div>

            <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800">
              <button
                onClick={toggleFullscreen}
                className="flex items-center gap-1 text-slate-300 hover:text-white"
              >
                {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                <span>{isFullscreen ? 'Tam Ekrandan Çık' : 'Tam Ekran Yap'}</span>
              </button>

              <button
                onClick={handleShareBrand}
                className="flex items-center gap-1 text-slate-300 hover:text-white"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copiedLink ? 'Kopyalandı!' : 'Platformu Paylaş'}</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Sticky Mobile Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-xl md:hidden px-2 py-1.5 flex items-center justify-around">
        <button
          onClick={handleResetHome}
          className="flex flex-col items-center justify-center py-1 px-3 text-slate-600 hover:text-blue-600 transition"
        >
          <Home className="w-5 h-5 text-slate-700" />
          <span className="text-[10px] font-bold mt-0.5">Keşfet</span>
        </button>

        <button
          onClick={onOpenMapView}
          className="flex flex-col items-center justify-center py-1 px-3 text-slate-600 hover:text-blue-600 transition"
        >
          <Map className="w-5 h-5 text-slate-700" />
          <span className="text-[10px] font-bold mt-0.5">Harita</span>
        </button>

        <button
          onClick={onOpenAddReview}
          className="flex flex-col items-center justify-center py-1.5 px-4 bg-blue-600 text-white rounded-2xl shadow-md -mt-3 border-2 border-white transition active:scale-95"
        >
          <Star className="w-5 h-5 fill-white text-white" />
          <span className="text-[10px] font-extrabold mt-0.5">Puanla</span>
        </button>

        <button
          onClick={onOpenSubmitEvent}
          className="flex flex-col items-center justify-center py-1 px-3 text-slate-600 hover:text-blue-600 transition"
        >
          <PlusCircle className="w-5 h-5 text-slate-700" />
          <span className="text-[10px] font-bold mt-0.5">Ekle</span>
        </button>

        <button
          onClick={() => onOpenAuthModal(currentUser ? 'user' : 'user')}
          className="flex flex-col items-center justify-center py-1 px-3 text-slate-600 hover:text-blue-600 transition"
        >
          {currentUser ? (
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-5 h-5 rounded-full object-cover border border-blue-600"
            />
          ) : (
            <User className="w-5 h-5 text-slate-700" />
          )}
          <span className="text-[10px] font-bold mt-0.5">
            {currentUser ? 'Hesabım' : 'Giriş'}
          </span>
        </button>
      </nav>
    </>
  );
};


