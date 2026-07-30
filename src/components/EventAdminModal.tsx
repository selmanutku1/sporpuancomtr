import React, { useState } from 'react';
import { SportsEvent } from '../types';
import { X, Trash2, PlusCircle, RefreshCw, Search, Calendar, MapPin, Trophy, AlertTriangle, ShieldCheck, Check, Edit3 } from 'lucide-react';

interface EventAdminModalProps {
  onClose: () => void;
  events: SportsEvent[];
  onDeleteEvent: (eventId: string) => void;
  onEditEvent: (event: SportsEvent) => void;
  onResetEvents: () => void;
  onOpenSubmitEvent: () => void;
}

export const EventAdminModal: React.FC<EventAdminModalProps> = ({
  onClose,
  events,
  onDeleteEvent,
  onEditEvent,
  onResetEvents,
  onOpenSubmitEvent,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tümü');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const filteredEvents = events.filter((ev) => {
    const matchCat = selectedCategory === 'Tümü' || ev.category === selectedCategory;
    const matchSearch =
      ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.organizer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleDelete = (id: string) => {
    onDeleteEvent(id);
    setDeletingId(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold shadow-xs">
              <ShieldCheck className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                Etkinlik Yönetim Paneli
                <span className="text-xs font-mono font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                  {events.length} Etkinlik
                </span>
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Sistemdeki tüm spor etkinliklerini görüntüleyin, silin veya yenilerini ekleyin.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar Bar */}
        <div className="p-4 border-b border-slate-100 bg-white flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Sistemde etkinlik ara..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 font-medium"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => {
                onClose();
                onOpenSubmitEvent();
              }}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition shadow-xs"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Yeni Etkinlik Ekle</span>
            </button>

            {showResetConfirm ? (
              <div className="flex items-center gap-1.5 bg-rose-50 border border-rose-200 p-1 rounded-xl text-xs">
                <span className="text-rose-700 font-bold px-1 text-[11px]">Sıfırlansın mı?</span>
                <button
                  onClick={() => {
                    onResetEvents();
                    setShowResetConfirm(false);
                  }}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-2 py-1 rounded-lg transition"
                >
                  Evet
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="bg-slate-200 text-slate-700 font-bold px-2 py-1 rounded-lg hover:bg-slate-300 transition"
                >
                  İptal
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowResetConfirm(true)}
                title="Sistem verilerini varsayılan örnek etkinliklere sıfırla"
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition border border-slate-200"
              >
                <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                <span>Fabrika Ayarlarına Sıfırla</span>
              </button>
            )}
          </div>
        </div>

        {/* Events Table / List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-6 space-y-2">
              <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
              <h4 className="font-bold text-slate-800">Aramaya uygun etkinlik bulunamadı</h4>
              <p className="text-xs text-slate-500">
                Arama filtrenizi temizleyebilir veya yeni bir etkinlik oluşturabilirsiniz.
              </p>
            </div>
          ) : (
            filteredEvents.map((ev) => (
              <div
                key={ev.id}
                className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition shadow-2xs hover:shadow-xs"
              >
                {/* Event Info */}
                <div className="flex items-center gap-3.5 flex-1 min-w-0">
                  <div className="w-20 h-14 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 relative">
                    <img
                      src={ev.image}
                      alt={ev.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-1 right-1 bg-slate-900/80 text-white text-[9px] font-bold px-1 rounded">
                      {ev.category}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-slate-900 text-sm truncate">
                        {ev.title}
                      </h4>
                      <span className="text-[10px] font-extrabold bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.2 rounded-md">
                        ★ {ev.overallScore.toFixed(1)} / 10
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                      <span className="flex items-center gap-1 font-medium">
                        <MapPin className="w-3 h-3 text-blue-600" />
                        {ev.city} • {ev.venue}
                      </span>
                      <span className="flex items-center gap-1 font-medium">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {ev.date}
                      </span>
                      <span className="text-slate-400">
                        {ev.organizer}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Edit & Delete Actions */}
                <div className="flex items-center justify-end gap-2 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                  <button
                    onClick={() => onEditEvent(ev)}
                    title="Etkinlik Detaylarını Düzenle"
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Düzenle</span>
                  </button>

                  {deletingId === ev.id ? (
                    <div className="flex items-center gap-1.5 bg-rose-50 border border-rose-200 p-1 rounded-xl text-xs">
                      <span className="text-rose-700 font-bold text-[11px]">Emin misiniz?</span>
                      <button
                        onClick={() => handleDelete(ev.id)}
                        className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-2 py-1 rounded-lg transition"
                      >
                        Sil
                      </button>
                      <button
                        onClick={() => setDeletingId(null)}
                        className="bg-slate-200 text-slate-700 font-bold px-2 py-1 rounded-lg hover:bg-slate-300 transition"
                      >
                        İptal
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeletingId(ev.id)}
                      title="Etkinliği Sistemden Sil"
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Sil</span>
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-100 border-t border-slate-200 text-center text-xs text-slate-500 font-medium">
          Tüm değişiklikler tarayıcı yerel hafızanıza (localStorage) anında kaydedilmektedir.
        </div>
      </div>
    </div>
  );
};
