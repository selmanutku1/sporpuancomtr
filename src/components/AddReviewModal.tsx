import React, { useState, useEffect, useMemo } from 'react';
import { SportsEvent, RatingCriterion, Review, UserProfile, SportsCategory } from '../types';
import { calculateOverallScore, CATEGORY_CRITERIA_MAP, getScoreBadgeColor, getScoreLabel } from '../lib/scoreUtils';
import { X, Star, CheckCircle2, Trophy, Upload, ShieldCheck, AlertCircle, User, LogIn } from 'lucide-react';

const PREDEFINED_PROS = [
  "Harika Atmosfer", "Hızlı Giriş", "Temiz Tesis", "Uygun Fiyat", "Kolay Ulaşım", "İlgili Personel", "Güvenli Ortam", "Aileye Uygun"
];

const PREDEFINED_CONS = [
  "Yetersiz Otopark", "Uzun Kuyruklar", "Pahalı", "Çok Kalabalık", "Ulaşım Zorluğu", "İlgisiz Personel", "Yetersiz Temizlik", "Kötü Ses Sistemi"
];

// Zıt/çelişen pro-con çiftleri (Biri seçildiğinde zıttı otomatik temizlenir)
const OPPOSING_PAIRS: Record<string, string> = {
  "Temiz Tesis": "Yetersiz Temizlik",
  "Yetersiz Temizlik": "Temiz Tesis",
  "Uygun Fiyat": "Pahalı",
  "Pahalı": "Uygun Fiyat",
  "Kolay Ulaşım": "Ulaşım Zorluğu",
  "Ulaşım Zorluğu": "Kolay Ulaşım",
  "İlgili Personel": "İlgisiz Personel",
  "İlgisiz Personel": "İlgili Personel",
  "Hızlı Giriş": "Uzun Kuyruklar",
  "Uzun Kuyruklar": "Hızlı Giriş",
};

interface AddReviewModalProps {
  events: SportsEvent[];
  selectedEvent: SportsEvent | null;
  onClose: () => void;
  onSubmitReview: (eventId: string, newReview: Review) => void;
  currentUser?: UserProfile | null;
  onOpenAuthModal?: () => void;
}

export const AddReviewModal: React.FC<AddReviewModalProps> = ({
  events,
  selectedEvent,
  onClose,
  onSubmitReview,
  currentUser,
  onOpenAuthModal,
}) => {
  const [targetEventId, setTargetEventId] = useState<string>(
    selectedEvent ? selectedEvent.id : events[0]?.id || ''
  );
  
  const targetEvent = useMemo(() => events.find((e) => e.id === targetEventId) || events[0], [events, targetEventId]);

  const [userName, setUserName] = useState(currentUser?.name || '');
  const [scores, setScores] = useState<RatingCriterion>({});
  
  // Initialize scores based on category
  useEffect(() => {
    if (targetEvent) {
      const criteria = CATEGORY_CRITERIA_MAP[targetEvent.category] || CATEGORY_CRITERIA_MAP['Spor Etkinlikleri'];
      const initialScores: RatingCriterion = {};
      criteria.forEach(c => initialScores[c.key] = 8); // Default 8
      setScores(initialScores);
    }
  }, [targetEvent]);

  const [comment, setComment] = useState('');
  const [selectedPros, setSelectedPros] = useState<string[]>([]);
  const [selectedCons, setSelectedCons] = useState<string[]>([]);
  const [verified, setVerified] = useState(true);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const togglePro = (pro: string) => {
    setSelectedPros(prev => {
      const isSelecting = !prev.includes(pro);
      if (isSelecting) {
        // Zıt eksiyi temizle (ör. "Temiz Tesis" seçilince "Yetersiz Temizlik" kaldırılır)
        const opposingCon = OPPOSING_PAIRS[pro];
        if (opposingCon) {
          setSelectedCons(cPrev => cPrev.filter(c => c !== opposingCon));
        }
        return [...prev, pro];
      }
      return prev.filter(p => p !== pro);
    });
  };

  const toggleCon = (con: string) => {
    setSelectedCons(prev => {
      const isSelecting = !prev.includes(con);
      if (isSelecting) {
        // Zıt artıyı temizle (ör. "Yetersiz Temizlik" seçilince "Temiz Tesis" kaldırılır)
        const opposingPro = OPPOSING_PAIRS[con];
        if (opposingPro) {
          setSelectedPros(pPrev => pPrev.filter(p => p !== opposingPro));
        }
        return [...prev, con];
      }
      return prev.filter(c => c !== con);
    });
  };

  useEffect(() => {
    if (currentUser?.name) {
      setUserName(currentUser.name);
    }
  }, [currentUser]);

  useEffect(() => {
    if (selectedEvent) {
      setTargetEventId(selectedEvent.id);
    }
  }, [selectedEvent]);

  const currentScore = calculateOverallScore(scores, targetEvent?.category || 'Spor Etkinlikleri');
  const scoreBadge = getScoreBadgeColor(currentScore);
  const scoreLabel = getScoreLabel(currentScore);

  const handleCriterionChange = (key: string, val: number) => {
    setScores((prev) => ({ ...prev, [key]: val }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!userName.trim() || !comment.trim()) {
      alert('Lütfen adınızı ve yorumunuzu giriniz.');
      return;
    }

    const pros = selectedPros;
    const cons = selectedCons;

    const newReview: Review = {
      id: 'rev-' + Date.now(),
      userName: userName.trim(),
      userAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
      verifiedAttendee: verified,
      date: 'Bugün',
      overallScore: currentScore,
      scores,
      comment: comment.trim(),
      pros: pros.length > 0 ? pros : ['Harika organizasyon'],
      cons: cons,
      likes: 0,
      tags: ['SporPuan İncelemesi'],
    };

    onSubmitReview(targetEventId, newReview);
    setSubmittedSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl max-h-[95vh] rounded-3xl shadow-2xl flex flex-col text-slate-800 animate-in zoom-in-95 duration-200 overflow-hidden">
        
        {/* Modal Header */}
        <div className="bg-slate-50 p-5 border-b border-slate-200 shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center font-bold shadow-2xs">
              <Star className="w-5 h-5 text-blue-600 fill-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Etkinlik veya Tesis Puanla</h3>
              <p className="text-xs text-slate-500 font-medium">sporpuan standartlarına uygun 5 boyutlu objektif değerlendirme</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submittedSuccess ? (
          <div className="p-10 text-center space-y-4 flex-1">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 border border-blue-200 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-slate-900">Puanınız Başarıyla Kaydedildi!</h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto font-medium">
              SporPuan topluluğuna katkınız için teşekkür ederiz. Değerlendirmeniz etkinliğin ortalama skorunu anında güncelledi.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6 flex-1 overflow-y-auto">
            
            {/* User Account Status Banner */}
            {currentUser ? (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full object-cover border border-blue-300 shrink-0"
                  />
                  <div>
                    <p className="text-xs font-extrabold text-blue-900">{currentUser.name}</p>
                    <span className="text-[10px] text-blue-700 font-medium">
                      {currentUser.title || 'Doğrulanmış Üye Sporsever'}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-blue-600" />
                  Doğrulanmış
                </span>
              </div>
            ) : (
              <div className="bg-slate-100 border border-slate-200 rounded-xl p-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs text-slate-700">
                  <User className="w-4 h-4 text-slate-500" />
                  <span>Yorumlarınızın doğrulanmış görünmesi için üye girişi yapabilirsiniz.</span>
                </div>
                {onOpenAuthModal && (
                  <button
                    type="button"
                    onClick={onOpenAuthModal}
                    className="text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1 rounded-lg transition shrink-0"
                  >
                    Giriş Yap
                  </button>
                )}
              </div>
            )}

            {/* Event Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Değerlendirilecek Etkinliği Seçin:
              </label>
              <select
                value={targetEventId}
                onChange={(e) => setTargetEventId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:border-blue-600 cursor-pointer"
              >
                {events.map((ev) => (
                  <option key={ev.id} value={ev.id}>
                    {ev.title} ({ev.city} - {ev.category})
                  </option>
                ))}
              </select>
            </div>

            {/* Calculated Score Live Preview Card */}
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  Hesaplanan SporPuan Skoru:
                </span>
                <span className={`text-xs font-extrabold uppercase mt-1 inline-block ${scoreBadge.text}`}>
                  {scoreLabel} Etkinlik Değerlendirmesi
                </span>
              </div>

              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-2xs">
                <Star className="w-6 h-6 text-blue-600 fill-blue-600" />
                <span className="text-3xl font-black text-slate-900">{currentScore.toFixed(1)}</span>
                <span className="text-xs text-slate-500 font-bold">/ 10</span>
              </div>
            </div>

            {/* 5 Criteria Sliders */}
            <div className="space-y-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                5 Boyutlu Değerlendirme Skalası (1 - 10 Puan):
              </h4>

              {(CATEGORY_CRITERIA_MAP[targetEvent?.category || 'Spor Etkinlikleri'] || []).map((crit) => {
                const val = scores[crit.key] || 8;

                return (
                  <div key={crit.key} className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-700 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-blue-500 block"></span>
                        <span>{crit.label}</span>
                      </span>
                      <span className="font-black text-blue-600 text-sm bg-white px-2 py-0.5 rounded border border-slate-200 shadow-2xs">
                        {val} / 10
                      </span>
                    </div>

                    <input
                      type="range"
                      min="1"
                      max="10"
                      step="1"
                      value={val}
                      onChange={(e) => handleCriterionChange(crit.key, parseInt(e.target.value))}
                      className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                    />

                    <p className="text-[10px] text-slate-500 font-medium">{crit.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* User Name & Comment */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Adınız & Soyadınız:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Mehmet Özkan"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 font-normal"
                />
              </div>

              <div className="flex items-center gap-2 pt-6">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200 w-full hover:border-blue-400 transition">
                  <input
                    type="checkbox"
                    checked={verified}
                    onChange={(e) => setVerified(e.target.checked)}
                    className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                  />
                  <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Etkinliğe Bizzat Katıldım (Onaylı Katılımcı)</span>
                </label>
              </div>
            </div>

            {/* Comment Text */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Detaylı Yorumunuz & Deneyiminiz:
              </label>
              <textarea
                required
                rows={3}
                placeholder="Etkinliğin organizasyonu, stadyum/tesis ortamı, ses/ışık kalitesi veya ulaşım hakkında deneyiminizi paylaşın..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 font-normal"
              />
            </div>

            {/* Pros & Cons Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              <div className="space-y-3">
                <label className="font-bold text-emerald-700 block">
                  (+) Öne Çıkan Artılar:
                </label>
                <div className="flex flex-wrap gap-2">
                  {PREDEFINED_PROS.map(pro => (
                    <button
                      key={pro}
                      type="button"
                      onClick={() => togglePro(pro)}
                      className={`px-3 py-1.5 rounded-full border transition font-semibold ${
                        selectedPros.includes(pro)
                          ? 'bg-emerald-100 border-emerald-300 text-emerald-800'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {pro}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="font-bold text-rose-700 block">
                  (-) Eleştiri / Eksiler:
                </label>
                <div className="flex flex-wrap gap-2">
                  {PREDEFINED_CONS.map(con => (
                    <button
                      key={con}
                      type="button"
                      onClick={() => toggleCon(con)}
                      className={`px-3 py-1.5 rounded-full border transition font-semibold ${
                        selectedCons.includes(con)
                          ? 'bg-rose-100 border-rose-300 text-rose-800'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {con}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm rounded-xl shadow-md transition active:scale-98"
            >
              Puanlamayı Gönder & Yayınla
            </button>

          </form>
        )}

      </div>
    </div>
  );
};
