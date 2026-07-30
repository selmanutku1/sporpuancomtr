import React, { useState } from 'react';
import { SportsEvent, Review } from '../types';
import { getScoreBadgeColor, getScoreLabel, RATING_CRITERIA_LABELS } from '../lib/scoreUtils';
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
  Edit3
} from 'lucide-react';

interface EventDetailModalProps {
  event: SportsEvent | null;
  onClose: () => void;
  onOpenRateForm: (event: SportsEvent) => void;
  onLikeReview: (eventId: string, reviewId: string) => void;
  onOpenAiAdvisor: () => void;
  onOpenEditModal?: (event: SportsEvent) => void;
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({
  event,
  onClose,
  onOpenRateForm,
  onLikeReview,
  onOpenAiAdvisor,
  onOpenEditModal,
}) => {
  if (!event) return null;

  const [activeTab, setActiveTab] = useState<'overview' | 'reviews' | 'aiReport'>('overview');
  const [copiedLink, setCopiedLink] = useState(false);

  const scoreBadge = getScoreBadgeColor(event.overallScore);
  const scoreLabel = getScoreLabel(event.overallScore);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-4xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl my-auto text-slate-800 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Image Banner */}
        <div className="relative h-64 sm:h-72 w-full shrink-0 bg-slate-100">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-slate-900/80 hover:bg-slate-900 text-slate-200 hover:text-white rounded-full backdrop-blur-md transition border border-slate-700 z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Top Badges */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <span className="bg-blue-600 text-white font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
              {event.category}
            </span>
            <span className="bg-slate-900/80 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full border border-slate-700/80 flex items-center gap-1 font-bold">
              <MapPin className="w-3.5 h-3.5 text-blue-400" />
              {event.city}
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
              <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                {event.title}
              </h2>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {onOpenEditModal && (
                <button
                  onClick={() => onOpenEditModal(event)}
                  className="px-3 py-2.5 bg-slate-900/80 hover:bg-slate-900 text-white font-bold text-xs rounded-xl border border-slate-700 transition flex items-center gap-1.5"
                  title="Etkinliği Düzenle"
                >
                  <Edit3 className="w-4 h-4 text-blue-400" />
                  <span className="hidden sm:inline">Düzenle</span>
                </button>
              )}
              <button
                onClick={handleShare}
                className="p-2.5 bg-slate-900/80 hover:bg-slate-900 text-white rounded-xl border border-slate-700 transition"
                title="Paylaş"
              >
                {copiedLink ? <CheckCircle2 className="w-4 h-4 text-blue-400" /> : <Share2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => onOpenRateForm(event)}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg flex items-center gap-2 transition active:scale-95"
              >
                <Star className="w-4 h-4 fill-white text-white" />
                <span>Puan Ver & Yorum Yap</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation Bar */}
        <div className="flex items-center gap-2 bg-slate-100 px-6 py-2 border-b border-slate-200 text-xs font-bold text-slate-600 shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl transition flex items-center gap-2 ${
              activeTab === 'overview'
                ? 'bg-white text-blue-600 border border-slate-200 shadow-2xs font-bold'
                : 'hover:text-slate-900'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Genel Bakış & SporPuan Skoru</span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-4 py-2 rounded-xl transition flex items-center gap-2 ${
              activeTab === 'reviews'
                ? 'bg-white text-blue-600 border border-slate-200 shadow-2xs font-bold'
                : 'hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Kullanıcı İncelemeleri ({event.reviews.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('aiReport')}
            className={`px-4 py-2 rounded-xl transition flex items-center gap-2 ${
              activeTab === 'aiReport'
                ? 'bg-white text-blue-600 border border-slate-200 shadow-2xs font-bold'
                : 'hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>AI SporPuan Analiz Raporu</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* SporPuan Main Score Gauge Box */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-slate-50 border border-slate-200 rounded-2xl p-6">
                
                {/* Score Number Gauge Left */}
                <div className="md:col-span-5 flex flex-col items-center justify-center text-center p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
                    Genel SporPuan İndeksi
                  </span>
                  
                  <div className="my-3 relative flex items-center justify-center">
                    <div className="w-28 h-28 rounded-full border-4 border-blue-500 flex flex-col items-center justify-center bg-blue-50 shadow-inner">
                      <span className="text-4xl font-black text-blue-700">
                        {event.overallScore.toFixed(1)}
                      </span>
                      <span className="text-[10px] text-slate-500 font-bold">/ 10</span>
                    </div>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase ${scoreBadge.bg} ${scoreBadge.text}`}>
                    {scoreLabel}
                  </span>

                  <p className="text-[11px] text-slate-500 mt-2 font-medium">
                    Toplam {event.reviewCount} doğrulanmış kullanıcı puanının ortalamasıdır.
                  </p>
                </div>

                {/* 5-Dimension Breakdown Progress Bars Right */}
                <div className="md:col-span-7 space-y-3.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    5 Boyutlu Değerlendirme Analizi
                  </h4>

                  {Object.entries(event.ratingBreakdown).map(([key, val]) => {
                    const score = typeof val === 'number' ? val : Number(val) || 0;
                    const criterionKey = key as keyof typeof RATING_CRITERIA_LABELS;
                    const meta = RATING_CRITERIA_LABELS[criterionKey];
                    const percent = score * 10;

                    return (
                      <div key={key} className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="flex items-center gap-1.5 text-slate-700">
                            <span>{meta?.icon}</span>
                            <span>{meta?.label}</span>
                          </span>
                          <span className="font-bold text-blue-600">{score.toFixed(1)} / 10</span>
                        </div>
                        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-600 rounded-full transition-all duration-500"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>

              {/* Event Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-blue-600 shrink-0" />
                  <div>
                    <span className="text-slate-500 block font-medium">Tarih & Saat</span>
                    <span className="font-bold text-slate-900">{event.date} {event.time && `• ${event.time}`}</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-blue-600 shrink-0" />
                  <div>
                    <span className="text-slate-500 block font-medium">Saha / Tesis</span>
                    <span className="font-bold text-slate-900 truncate block max-w-[180px]">{event.venue}</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center gap-3">
                  <Ticket className="w-5 h-5 text-amber-500 shrink-0" />
                  <div>
                    <span className="text-slate-500 block font-medium">Bilet Fiyatı</span>
                    <span className="font-bold text-slate-900">{event.ticketPriceRange}</span>
                  </div>
                </div>
              </div>

              {/* Description & About */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
                <h3 className="text-sm font-bold text-slate-900">Etkinlik Hakkında</h3>
                <p className="text-sm text-slate-600 leading-relaxed font-normal">
                  {event.description}
                </p>
                {event.ticketUrl && (
                  <div className="pt-2">
                    <a
                      href={event.ticketUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      <span>Resmi Bilet Satış / Kayıt Sayfasına Git</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 2: REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900">
                  SporPuan Kullanıcı Değerlendirmeleri ({event.reviews.length})
                </h3>
                <button
                  onClick={() => onOpenRateForm(event)}
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-2xs"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Yorum Yaz & Puan Ver</span>
                </button>
              </div>

              {event.reviews.length === 0 ? (
                <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-200">
                  <MessageSquare className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                  <p className="text-slate-700 font-medium text-sm">Henüz bu etkinlik için yorum yapılmadı.</p>
                  <p className="text-slate-500 text-xs mt-1">İlk değerlendirmeyi yapan spor sever sen ol!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {event.reviews.map((rev) => (
                    <div key={rev.id} className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-3">
                      
                      {/* Review User Header */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold overflow-hidden border border-blue-200">
                            {rev.userAvatar ? (
                              <img src={rev.userAvatar} alt={rev.userName} className="w-full h-full object-cover" />
                            ) : (
                              rev.userName.charAt(0)
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-slate-900 text-sm">{rev.userName}</span>
                              {rev.verifiedAttendee && (
                                <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-200 flex items-center gap-0.5">
                                  <BadgeCheck className="w-3 h-3 text-blue-600" /> Katılımcı
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-500">{rev.date}</span>
                          </div>
                        </div>

                        {/* Review Score Badge */}
                        <div className="flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-xl font-black text-sm">
                          <Star className="w-3.5 h-3.5 fill-blue-600 text-blue-600" />
                          <span>{rev.overallScore.toFixed(1)}</span>
                        </div>
                      </div>

                      {/* Comment */}
                      <p className="text-sm text-slate-700 leading-relaxed font-normal">
                        "{rev.comment}"
                      </p>

                      {/* Pros & Cons */}
                      {(rev.pros.length > 0 || rev.cons.length > 0) && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                          {rev.pros.length > 0 && (
                            <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl space-y-1">
                              <span className="font-bold text-emerald-800 flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Artılar:
                              </span>
                              <ul className="list-disc list-inside text-slate-700 space-y-0.5">
                                {rev.pros.map((p, i) => <li key={i}>{p}</li>)}
                              </ul>
                            </div>
                          )}

                          {rev.cons.length > 0 && (
                            <div className="bg-rose-50 border border-rose-200 p-2.5 rounded-xl space-y-1">
                              <span className="font-bold text-rose-800 flex items-center gap-1">
                                <XCircle className="w-3.5 h-3.5 text-rose-600" /> Eksiler:
                              </span>
                              <ul className="list-disc list-inside text-slate-700 space-y-0.5">
                                {rev.cons.map((c, i) => <li key={i}>{c}</li>)}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Footer Actions */}
                      <div className="pt-2 flex items-center justify-between text-xs text-slate-500 font-medium">
                        <div className="flex flex-wrap gap-1">
                          {rev.tags.map((t) => (
                            <span key={t} className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded text-[10px]">
                              #{t}
                            </span>
                          ))}
                        </div>

                        <button
                          onClick={() => onLikeReview(event.id, rev.id)}
                          className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg transition"
                        >
                          <ThumbsUp className="w-3.5 h-3.5 text-blue-600" />
                          <span>Faydalı ({rev.likes})</span>
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: AI REPORT */}
          {activeTab === 'aiReport' && (
            <div className="space-y-6">
              
              <div className="bg-blue-50/60 border border-blue-200 p-6 rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-blue-200 pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-blue-600" />
                    <h3 className="text-base font-bold text-blue-950">
                      Gemini Yapay Zeka Etkinlik Analisti Raporu
                    </h3>
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full border border-blue-200 font-bold">
                    Objektif Veri Analizi
                  </span>
                </div>

                {event.aiAnalysis ? (
                  <div className="space-y-4 text-sm">
                    <p className="text-slate-800 leading-relaxed bg-white p-4 rounded-xl border border-slate-200 font-normal">
                      {event.aiAnalysis.summary}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl space-y-2">
                        <h4 className="font-bold text-emerald-900 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Öne Çıkan Artı Yönler
                        </h4>
                        <ul className="space-y-1 text-slate-700 text-xs list-disc list-inside font-medium">
                          {event.aiAnalysis.pros.map((p, i) => <li key={i}>{p}</li>)}
                        </ul>
                      </div>

                      <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl space-y-2">
                        <h4 className="font-bold text-rose-900 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                          <XCircle className="w-4 h-4 text-rose-600" /> Geliştirilebilir Noktalar
                        </h4>
                        <ul className="space-y-1 text-slate-700 text-xs list-disc list-inside font-medium">
                          {event.aiAnalysis.cons.map((c, i) => <li key={i}>{c}</li>)}
                        </ul>
                      </div>
                    </div>

                    <div className="p-4 bg-white border border-blue-200 rounded-xl space-y-1 text-xs">
                      <strong className="text-blue-900 block font-bold">💡 Taraftar & Katılımcı Tavsiyesi:</strong>
                      <p className="text-slate-700">{event.aiAnalysis.fanAdvice}</p>
                    </div>

                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-1 text-xs">
                      <strong className="text-amber-900 block font-bold">🛠️ Organizatör İyileştirme Tavsiyesi:</strong>
                      <p className="text-slate-700">{event.aiAnalysis.organizerAdvice}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 space-y-3">
                    <p className="text-slate-700 text-sm font-medium">
                      Bu etkinlik için yapay zeka analiz motorunu anlık çalıştırabilirsiniz.
                    </p>
                    <button
                      onClick={onOpenAiAdvisor}
                      className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl inline-flex items-center gap-2 transition shadow-sm"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>SporPuan AI Çalıştır</span>
                    </button>
                  </div>
                )}
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
