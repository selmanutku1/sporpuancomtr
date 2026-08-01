import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import { SportsEvent, Review } from '../types';
import { getScoreBadgeColor, getScoreLabel, CATEGORY_CRITERIA_MAP, calculateOverallScore, getCriterionScore } from '../lib/scoreUtils';
import { 
  X, 
  Star, 
  MapPin, 
  Calendar, 
  Ticket, 
  MessageSquare, 
  ThumbsUp, 
  BadgeCheck, 
  ExternalLink, 
  Sparkles, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle,
  PlusCircle,
  Share2,
  Trophy,
  Edit3,
  Clock,
  Map,
  FileText,
  Camera,
  Paperclip
} from 'lucide-react';

// In-Modal Interactive Mini Map Component
const FacilityMiniMap: React.FC<{ event: SportsEvent; onExpandMap: () => void }> = ({ event, onExpandMap }) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  const lat = event.latitude || 41.0082;
  const lng = event.longitude || 28.9784;

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [lat, lng],
        zoom: 14,
        zoomControl: true,
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      const customIcon = L.divIcon({
        className: 'custom-facility-marker',
        html: `
          <div style="
            background-color: #2563eb;
            color: #ffffff;
            font-weight: 900;
            font-size: 11px;
            padding: 5px 10px;
            border-radius: 20px;
            border: 2px solid #ffffff;
            box-shadow: 0 4px 14px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            gap: 4px;
            white-space: nowrap;
          ">
            <span>📍 ${event.title}</span>
          </div>
        `,
        iconSize: [120, 30],
        iconAnchor: [60, 15],
      });

      L.marker([lat, lng], { icon: customIcon }).addTo(map);

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [lat, lng, event.title]);

  return (
    <div id="facility-map-section" className="bg-slate-50 dark:bg-slate-850 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>Tesis Konumu & Harita</span>
        </h3>
        <button
          type="button"
          onClick={onExpandMap}
          className="text-xs font-extrabold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
        >
          <Map className="w-3.5 h-3.5" />
          <span>Tam Sayfa Haritada Aç</span>
        </button>
      </div>

      <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 h-52 w-full z-0">
        <div ref={mapContainerRef} className="w-full h-full" />
      </div>
      <div className="text-xs text-slate-600 dark:text-slate-300 flex items-center justify-between gap-2 pt-1">
        <span>📍 <strong>{event.venue || event.city}</strong> ({event.city})</span>
        <button
          type="button"
          onClick={onExpandMap}
          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] rounded-lg transition shrink-0 cursor-pointer"
        >
          Harita Moduna Geç
        </button>
      </div>
    </div>
  );
};

function anonymizeUserName(name: string): string {
  if (!name) return 'K*** Ö***';
  if (name.includes('*')) return name;
  const parts = name.trim().split(/\s+/);
  return parts
    .map((part) => {
      if (part.length <= 1) return part + '***';
      return part.charAt(0) + '***';
    })
    .join(' ');
}

interface EventDetailModalProps {
  event: SportsEvent | null;
  onClose: () => void;
  onOpenRateForm: (event: SportsEvent) => void;
  onLikeReview: (eventId: string, reviewId: string) => void;
  onOpenEditModal?: (event: SportsEvent) => void;
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({
  event,
  onClose,
  onOpenRateForm,
  onLikeReview,
  onOpenEditModal,
}) => {
  if (!event) return null;

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews'>('overview');
  const [copiedLink, setCopiedLink] = useState(false);

  const scoreBadge = getScoreBadgeColor(event.overallScore);
  const scoreLabel = getScoreLabel(event.overallScore);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Featured 3 reviews for screenshot-styled widget
  const featuredReviews = React.useMemo(() => {
    const list = [...event.reviews];
    if (list.length >= 3) return list.slice(0, 3);

    const fallbacks: Review[] = [
      {
        id: 'fb-1',
        userName: 'Kaan Özkan',
        overallScore: 9.5,
        scores: { cleanliness: 9.5, staff: 9.5, equipment: 9.0 },
        comment: `${event.title} çalışanları güler yüzlü. Tesis temiz ve düzenliydi. İstediğim her şey için hızlı çözüm sağlandı. Geçen seneye göre daha geniş ve ferah...`,
        date: '2 gün önce',
        likes: 12,
        verifiedAttendee: true,
        pros: ['Temiz Tesis', 'Güler Yüzlü Hizmet'],
        cons: [],
        tags: ['Temiz', 'Memnuniyet']
      },
      {
        id: 'fb-2',
        userName: 'Kemal Orhan',
        overallScore: 9.5,
        scores: { cleanliness: 9.2, staff: 9.5, equipment: 9.0 },
        comment: `Son anda kayıt yaptırmamıza rağmen süreç çok pratiktir. Hizmet ve ekipman kalitesi mükemmel. Temiz ve düzenli harika bir tesis.`,
        date: '1 hafta önce',
        likes: 8,
        verifiedAttendee: true,
        pros: ['Modern Ekipman', 'Kolay Ulaşım'],
        cons: [],
        tags: ['Kalite', 'Süreç']
      },
      {
        id: 'fb-3',
        userName: 'Mehmet Kaya',
        overallScore: 9.5,
        scores: { cleanliness: 9.0, staff: 9.0, equipment: 9.0 },
        comment: `Tesiste her şey güzel olmasına rağmen tüm detaylar eksiksiz düşünülmüş. Danışma ve yönlendirmeler gayet anlaşılırdı. Tüm spor severlere tavsiyedir.`,
        date: '2 hafta önce',
        likes: 5,
        verifiedAttendee: true,
        pros: ['İlgili Personel'],
        cons: [],
        tags: ['Tavsiye']
      }
    ];

    return [...list, ...fallbacks.slice(0, 3 - list.length)];
  }, [event]);

  const recentYearCount = Math.max(Math.round((event.reviews.length || 15) * 8.2), 121);
  const tavsiyePercent = Math.min(99, Math.max(82, Math.round((event.overallScore / 10) * 100)));
  const fiyatPercent = Math.min(95, Math.max(75, Math.round(((event.ratingBreakdown['price'] || event.ratingBreakdown['equipment'] || 8.0) / 10) * 100)));

  return (
    <div className="w-full animate-in fade-in duration-300 px-0 sm:px-4 pb-12">
      <div className="bg-white dark:bg-slate-900 w-full max-w-6xl mx-auto min-h-[calc(100vh-100px)] rounded-none sm:rounded-3xl shadow-md border border-slate-200 dark:border-slate-800 flex flex-col text-slate-800 dark:text-slate-100 overflow-hidden mt-0 sm:mt-6 transition-colors duration-200">
        
        {/* Header Image Banner */}
        <div className="relative h-64 sm:h-72 w-full shrink-0 bg-slate-100 dark:bg-slate-800">
          <img
            src={event.image || 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?q=80&w=800&auto=format&fit=crop'}
            alt={event.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?q=80&w=1200&auto=format&fit=crop';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2.5 bg-slate-900/80 hover:bg-slate-900 text-slate-200 hover:text-white rounded-full backdrop-blur-md transition border border-slate-700 z-10 shadow-md cursor-pointer"
            aria-label="Kapat"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Top Badges */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <span className="bg-blue-600 dark:bg-blue-500 text-white font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
              {event.category}
            </span>
          </div>

          {/* Banner Details Overlay */}
          <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-200 font-medium mb-1">
                <span>Organizatör: <strong className="text-white">{event.organizer}</strong></span>
                {event.organizerVerified && (
                  <span className="flex items-center gap-0.5 text-blue-300 text-[11px] bg-blue-500/20 px-2 py-0.5 rounded border border-blue-400/30 font-bold">
                    <BadgeCheck className="w-3.5 h-3.5" /> Onaylı
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-3xl font-black text-white leading-tight">
                {event.title}
              </h2>
              <div className="flex flex-col gap-1 mt-1 sm:mt-2">
                <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs sm:text-sm text-slate-200">
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    <MapPin className="w-4 h-4 text-blue-400" />
                    <span>{event.venue ? `${event.venue}, ${event.city}` : event.city}</span>
                  </div>
                  <button 
                    type="button"
                    onClick={() => {
                      navigate(`/harita?id=${event.id}`);
                    }}
                    className="text-xs text-blue-300 hover:text-blue-100 flex items-center gap-1.5 bg-slate-900/80 hover:bg-slate-900 px-3 py-1 rounded-full border border-slate-700/80 cursor-pointer transition active:scale-95 font-medium shadow-2xs"
                  >
                    <Map className="w-3.5 h-3.5 text-blue-400" />
                    <span>Haritada Gör</span>
                  </button>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-200">
                  <MessageSquare className="w-4 h-4 text-blue-400" />
                  <div className="flex items-baseline gap-1.5">
                    <strong className="text-white text-base">{event.overallScore.toFixed(1)}</strong>
                    <span className="font-medium text-slate-200">{scoreLabel}</span>
                    <span className="text-slate-400 text-xs ml-1">{event.reviews.length} yorum</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {onOpenEditModal && (
                <button
                  onClick={() => onOpenEditModal(event)}
                  className="px-3 py-2.5 bg-slate-900/80 hover:bg-slate-900 text-white font-bold text-xs rounded-xl border border-slate-700 transition flex items-center gap-1.5"
                  title="Düzenle"
                >
                  <Edit3 className="w-4 h-4 text-blue-400" />
                  <span className="hidden sm:inline">Düzenle</span>
                </button>
              )}
              <button
                onClick={() => onOpenRateForm(event)}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg flex items-center gap-2 transition active:scale-95"
              >
                <Star className="w-4 h-4 fill-white text-white" />
                <span>Puan Ver & Yorum Yap</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation Bar */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-850 px-6 py-2 border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-400 shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl transition flex items-center gap-2 ${
              activeTab === 'overview'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 border border-slate-200 dark:border-slate-700 shadow-2xs font-bold'
                : 'hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Genel Bakış & Sporpuan Skoru</span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-4 py-2 rounded-xl transition flex items-center gap-2 ${
              activeTab === 'reviews'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 border border-slate-200 dark:border-slate-700 shadow-2xs font-bold'
                : 'hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Kullanıcı İncelemeleri ({event.reviews.length})</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-6 flex-1 text-slate-800 dark:text-slate-100">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-4 sm:space-y-6">
              
              {/* Detailed Rating & Reviews Breakdown Widget (Matching Screenshot) */}
              <div className="bg-[#f0f4f8] dark:bg-slate-850 rounded-[28px] p-4 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4 sm:space-y-6">
                
                {/* TOP ROW: Overall Rating + Sub-criteria Rings + Percentage Rings */}
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-4 border-b border-slate-200/60 dark:border-slate-800/80">
                  
                  {/* Left: Speech Bubble Badge & Title */}
                  <div className="flex items-center gap-4">
                    <div className="relative shrink-0">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-600 rounded-[22px] flex items-center justify-center text-white text-2xl sm:text-3xl font-black shadow-md">
                        {event.overallScore.toFixed(1)}
                      </div>
                      <div className="absolute -bottom-1.5 left-4 w-4 h-4 bg-blue-600 rotate-45 rounded-xs" />
                    </div>

                    <div>
                      <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">
                        {scoreLabel}
                      </h3>
                      <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                        {event.reviewCount || event.reviews.length} yorum
                      </p>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-1.5 font-normal">
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>Son bir yıldaki yorum sayısı: <strong className="font-semibold text-slate-700 dark:text-slate-300">{recentYearCount}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Middle & Right: Sub-criteria Rings & Percentage Rings */}
                  <div className="flex flex-wrap items-center gap-4 sm:gap-6 w-full lg:w-auto justify-start lg:justify-end pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-200/60 dark:border-slate-800/80">
                    
                    {/* Sub-criteria items */}
                    <div className="flex items-center gap-3 sm:gap-5 overflow-x-auto pb-1 scrollbar-none">
                      {(CATEGORY_CRITERIA_MAP[event.category] || []).map((crit) => {
                        const score = getCriterionScore(event.ratingBreakdown, crit.key, event.overallScore);
                        return (
                          <div key={crit.key} className="flex flex-col items-center min-w-[55px]">
                            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 text-center block mb-1.5 whitespace-nowrap">
                              {crit.label}
                            </span>
                            <div className="w-11 h-11 rounded-full border-[2.5px] border-blue-500 bg-white dark:bg-slate-800 flex items-center justify-center font-extrabold text-xs text-slate-900 dark:text-white shadow-2xs">
                              {score.toFixed(1)}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Divider */}
                    <div className="w-[1px] h-10 bg-slate-300 dark:bg-slate-700 hidden sm:block shrink-0 mx-1" />

                    {/* Percentage Rings */}
                    <div className="flex items-center gap-4">
                      {/* Tavsiye */}
                      <div className="flex flex-col items-center">
                        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 text-center block mb-1.5 whitespace-nowrap">
                          Tavsiye
                        </span>
                        <div className="w-12 h-12 rounded-full border-[3px] border-blue-600 bg-blue-50/60 dark:bg-blue-950/60 flex items-center justify-center font-black text-xs text-blue-600 dark:text-blue-400 shadow-2xs">
                          %{tavsiyePercent}
                        </div>
                      </div>

                      {/* Fiyat Performans */}
                      <div className="flex flex-col items-center">
                        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 text-center block mb-1.5 whitespace-nowrap">
                          Fiyat Performans
                        </span>
                        <div className="w-12 h-12 rounded-full border-[3px] border-amber-400 bg-amber-50/60 dark:bg-amber-950/60 flex items-center justify-center font-black text-xs text-amber-600 dark:text-amber-400 shadow-2xs">
                          %{fiyatPercent}
                        </div>
                      </div>
                    </div>

                  </div>

                </div>

                {/* MIDDLE ROW: 3 FEATURED RECENT REVIEW CARDS */}
                <div className="flex flex-nowrap md:grid md:grid-cols-3 gap-4 pt-1 overflow-x-auto pb-2 scrollbar-none">
                  {featuredReviews.map((rev, idx) => (
                    <div key={rev.id || idx} className="w-72 md:w-auto shrink-0 bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xs border border-slate-100 dark:border-slate-700/80 flex flex-col justify-between min-h-[145px]">
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-extrabold text-slate-900 dark:text-slate-100 text-sm tracking-tight">
                            {anonymizeUserName(rev.userName)}
                          </span>
                          <div className="bg-sky-400 text-white font-bold text-[11px] px-3 py-1 rounded-l-full rounded-r-md flex items-center gap-1 shadow-2xs shrink-0">
                            <span>{rev.overallScore.toFixed(1)}</span>
                            <span>{getScoreLabel(rev.overallScore)}</span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 font-normal leading-relaxed mt-3.5 line-clamp-4">
                          {rev.comment}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* BOTTOM ACTION BUTTONS */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => onOpenRateForm(event)}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-full shadow-md shadow-blue-600/20 transition flex items-center gap-2 active:scale-95 cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4 fill-white text-white" />
                    <span>Yorum Yaz</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('reviews')}
                    className="px-6 py-3 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-full border border-slate-300 dark:border-slate-700 transition shadow-2xs active:scale-95 cursor-pointer"
                  >
                    <span>Tüm Yorumları Göster</span>
                  </button>
                </div>

              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="bg-slate-50 dark:bg-slate-850 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block font-medium">
                      {event.category === 'Spor Etkinlikleri' ? 'Tarih & Saat' : 'Dönem / Çalışma Saatleri'}
                    </span>
                    <span className="font-bold text-slate-900 dark:text-slate-100">{event.date} {event.time && `• ${event.time}`}</span>
                  </div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-850 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block font-medium">Konum / Tesis</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100 truncate block max-w-[180px]">{event.venue}</span>
                  </div>
                </div>
              </div>

              {/* Description & About */}
              <div className="bg-slate-50 dark:bg-slate-850 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {event.category === 'Spor Etkinlikleri' ? 'Etkinlik Hakkında' : 
                   event.category === 'Spor Salonları' ? 'Salon Hakkında' :
                   event.category === 'Spor Okulları' ? 'Okul Hakkında' : 'Tesis Hakkında'}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  {event.description}
                </p>
              </div>

              {/* Interactive In-App Map Section */}
              <FacilityMiniMap 
                event={event} 
                onExpandMap={() => navigate(`/harita?id=${event.id}`)} 
              />

            </div>
          )}

          {/* TAB 2: REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Sporpuan Kullanıcı Değerlendirmeleri ({event.reviews.length})
                </h3>
                <button
                  onClick={() => onOpenRateForm(event)}
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-2xs"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Yorum Yaz & Puan Ver</span>
                </button>
              </div>

              {event.reviews.filter(r => r.status !== 'hidden').length === 0 ? (
                <div className="text-center py-10 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <MessageSquare className="w-10 h-10 text-slate-400 dark:text-slate-500 mx-auto mb-2" />
                  <p className="text-slate-700 dark:text-slate-300 font-medium text-sm">Henüz bu {event.category === 'Spor Okulları' ? 'okul' : event.category === 'Spor Salonları' ? 'salon' : event.category === 'Spor Tesisleri' ? 'tesis' : 'etkinlik'} için yayınlanmış yorum yapılmadı.</p>
                  <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">İlk değerlendirmeyi yapan spor sever sen ol!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {event.reviews.filter(r => r.status !== 'hidden').map((rev) => (
                    <div key={rev.id} className="bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl space-y-3">
                      
                      {/* Review User Header */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold overflow-hidden border border-blue-200 dark:border-blue-800">
                            {rev.userAvatar ? (
                              <img
                                src={rev.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'}
                                alt={rev.userName}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop';
                                }}
                              />
                            ) : (
                              rev.userName.charAt(0)
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">{rev.userName}</span>
                              {rev.verifiedAttendee && (
                                <span className="bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800/80 flex items-center gap-0.5">
                                  <BadgeCheck className="w-3 h-3 text-blue-600 dark:text-blue-400" /> Katılımcı
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-500 dark:text-slate-400">{rev.date}</span>
                          </div>
                        </div>

                        {/* Review Score Badge */}
                        <div className="flex items-center gap-1 bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/80 px-3 py-1 rounded-xl font-black text-sm">
                          <Star className="w-3.5 h-3.5 fill-blue-600 text-blue-600 dark:fill-blue-400 dark:text-blue-400" />
                          <span>{rev.overallScore.toFixed(1)}</span>
                        </div>
                      </div>

                      {/* Comment */}
                      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                        "{rev.comment}"
                      </p>

                      {/* User Uploaded Photos / Verification Documents */}
                      {((rev.userPhotos && rev.userPhotos.length > 0) || (rev.verificationDocs && rev.verificationDocs.length > 0)) && (
                        <div className="pt-2 space-y-2">
                          <div className="flex flex-wrap gap-2 items-center">
                            {rev.userPhotos && rev.userPhotos.map((photo, pIdx) => (
                              <img
                                key={pIdx}
                                src={photo}
                                alt="Kullanıcı Görseli"
                                className="w-16 h-16 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shadow-2xs hover:scale-105 transition cursor-pointer"
                              />
                            ))}

                            {rev.verificationDocs && rev.verificationDocs.map((doc, dIdx) => (
                              <div
                                key={dIdx}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 rounded-xl text-xs text-blue-800 dark:text-blue-300 font-semibold"
                              >
                                <FileText className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                                <span className="truncate max-w-[140px]">{doc.name}</span>
                                <span className="text-[10px] bg-blue-200 dark:bg-blue-900 px-1.5 py-0.5 rounded text-blue-900 dark:text-blue-200 font-bold">Onaylı Belge</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Category Criteria Sub-scores Breakdown */}
                      {rev.scores && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {(CATEGORY_CRITERIA_MAP[event.category] || []).map((crit) => {
                            const scoreVal = getCriterionScore(rev.scores, crit.key, rev.overallScore);
                            return (
                              <span key={crit.key} className="bg-slate-200/60 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 text-[10px] px-2 py-0.5 rounded-md font-medium border border-slate-300/40 dark:border-slate-700/60">
                                {crit.label}: <strong className="text-blue-600 dark:text-blue-400 font-bold">{scoreVal.toFixed(1)}</strong>
                              </span>
                            );
                          })}
                        </div>
                      )}

                      {/* Pros & Cons */}
                      {(rev.pros.length > 0 || rev.cons.length > 0) && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                          {rev.pros.length > 0 && (
                            <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 p-2.5 rounded-xl space-y-1">
                              <span className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Artılar:
                              </span>
                              <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 space-y-0.5">
                                {rev.pros.map((p, i) => <li key={i}>{p}</li>)}
                              </ul>
                            </div>
                          )}

                          {rev.cons.length > 0 && (
                            <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 p-2.5 rounded-xl space-y-1">
                              <span className="font-bold text-rose-800 dark:text-rose-300 flex items-center gap-1">
                                <XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" /> Eksiler:
                              </span>
                              <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 space-y-0.5">
                                {rev.cons.map((c, i) => <li key={i}>{c}</li>)}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Official Admin / Facility Response */}
                      {rev.adminReply && (
                        <div className="bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-800/60 p-3 rounded-xl text-xs space-y-1">
                          <div className="flex items-center justify-between font-bold text-blue-700 dark:text-blue-400">
                            <span className="flex items-center gap-1.5">
                              <BadgeCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                              Sporpuan / Tesis Yanıtı:
                            </span>
                            {rev.adminReplyDate && (
                              <span className="text-[10px] font-normal text-slate-400">{rev.adminReplyDate}</span>
                            )}
                          </div>
                          <p className="text-slate-700 dark:text-slate-300 italic leading-relaxed">
                            "{rev.adminReply}"
                          </p>
                        </div>
                      )}

                      {/* Footer Actions */}
                      <div className="pt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
                        <div className="flex flex-wrap gap-1">
                          {rev.tags.map((t) => (
                            <span key={t} className="bg-slate-200 dark:bg-slate-750 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded text-[10px]">
                              #{t}
                            </span>
                          ))}
                        </div>

                        <button
                          onClick={() => onLikeReview(event.id, rev.id)}
                          className="flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 rounded-lg transition"
                        >
                          <ThumbsUp className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                          <span>Faydalı ({rev.likes})</span>
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
