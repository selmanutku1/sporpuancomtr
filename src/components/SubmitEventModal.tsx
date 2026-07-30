import React, { useState, useRef } from 'react';
import { SportsEvent, SportsCategory, UserProfile } from '../types';
import { X, PlusCircle, CheckCircle2, Calendar, MapPin, Ticket, Trophy, Upload, Image as ImageIcon, Trash2, RefreshCw, Sparkles, Check, Building2, ShieldCheck } from 'lucide-react';

interface SubmitEventModalProps {
  onClose: () => void;
  onAddEvent: (newEvent: SportsEvent) => void;
  categories: SportsCategory[];
  currentUser?: UserProfile | null;
  onOpenAuthModal?: () => void;
}

const DEFAULT_EVENT_IMAGE = 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200&auto=format&fit=crop';

export const SubmitEventModal: React.FC<SubmitEventModalProps> = ({
  onClose,
  onAddEvent,
  categories,
  currentUser,
  onOpenAuthModal,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<SportsCategory>('Futbol');
  const [city, setCity] = useState('İstanbul');
  const [venue, setVenue] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [organizer, setOrganizer] = useState(
    currentUser?.role === 'organizer' ? (currentUser.organizationName || currentUser.name) : ''
  );
  const [description, setDescription] = useState('');
  const [ticketPriceRange, setTicketPriceRange] = useState('₺200 - ₺800');
  const [image, setImage] = useState(DEFAULT_EVENT_IMAGE);
  const [isCustomUploaded, setIsCustomUploaded] = useState(false);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Standardize uploaded image to fixed 16:9 ratio (1200x675 pixels) via HTML Canvas
  const processAndStandardizeImage = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Lütfen geçerli bir görsel dosyası (PNG, JPG, WEBP) seçiniz.');
      return;
    }

    setIsProcessingImage(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Standardize to 1200 x 675 pixels (16:9 standard event banner)
        const TARGET_WIDTH = 1200;
        const TARGET_HEIGHT = 675;

        const canvas = document.createElement('canvas');
        canvas.width = TARGET_WIDTH;
        canvas.height = TARGET_HEIGHT;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          // Calculate object-cover crop scale and placement
          const scale = Math.max(TARGET_WIDTH / img.width, TARGET_HEIGHT / img.height);
          const x = (TARGET_WIDTH - img.width * scale) / 2;
          const y = (TARGET_HEIGHT - img.height * scale) / 2;

          ctx.fillStyle = '#0f172a';
          ctx.fillRect(0, 0, TARGET_WIDTH, TARGET_HEIGHT);
          ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

          const standardizedDataUrl = canvas.toDataURL('image/jpeg', 0.88);
          setImage(standardizedDataUrl);
          setIsCustomUploaded(true);
        } else {
          setImage(e.target?.result as string);
          setIsCustomUploaded(true);
        }
        setIsProcessingImage(false);
      };
      img.onerror = () => {
        alert('Görsel yüklenirken bir hata oluştu.');
        setIsProcessingImage(false);
      };
      img.src = e.target?.result as string;
    };
    reader.onerror = () => {
      alert('Dosya okunamadı.');
      setIsProcessingImage(false);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processAndStandardizeImage(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processAndStandardizeImage(e.dataTransfer.files[0]);
    }
  };

  const handleResetImage = () => {
    setImage(DEFAULT_EVENT_IMAGE);
    setIsCustomUploaded(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !venue.trim() || !organizer.trim()) {
      alert('Lütfen gerekli tüm alanları doldurunuz.');
      return;
    }

    const CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
      'İstanbul': { lat: 41.0082, lng: 28.9784 },
      'Ankara': { lat: 39.9334, lng: 32.8597 },
      'İzmir': { lat: 38.4237, lng: 27.1428 },
      'Bursa': { lat: 40.1885, lng: 29.0610 },
      'Antalya': { lat: 36.8969, lng: 30.7133 },
      'Trabzon': { lat: 41.0027, lng: 39.7168 },
      'Eskişehir': { lat: 39.7667, lng: 30.5256 },
      'Kocaeli': { lat: 40.7654, lng: 29.9408 },
    };

    const cityCoords = CITY_COORDINATES[city] || { lat: 41.0082, lng: 28.9784 };
    const randomLatOffset = (Math.random() - 0.5) * 0.05;
    const randomLngOffset = (Math.random() - 0.5) * 0.05;

    const newEvent: SportsEvent = {
      id: 'event-' + Date.now(),
      title: title.trim(),
      slug: title.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      category,
      city,
      venue: venue.trim(),
      date: date || 'Yakında',
      time: time || '19:00',
      organizer: organizer.trim(),
      organizerVerified: true,
      image,
      description: description.trim() || 'SporPuan topluluğu için kayıt edilmiş yeni spor etkinliği.',
      ticketPriceRange,
      overallScore: 8.5,
      ratingBreakdown: {
        organization: 8.5,
        atmosphere: 8.5,
        valueForMoney: 8.5,
        amenities: 8.5,
        accessibility: 8.5,
      },
      reviewCount: 1,
      featured: false,
      latitude: cityCoords.lat + randomLatOffset,
      longitude: cityCoords.lng + randomLngOffset,
      tags: [category, city, 'Yeni Etkinlik'],
      reviews: [],
    };

    onAddEvent(newEvent);
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-xl overflow-hidden flex flex-col shadow-2xl my-auto text-slate-800 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-slate-50 p-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center font-bold shadow-2xs">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Yeni Spor Etkinliği Ekle</h3>
              <p className="text-xs text-slate-500 font-medium">Organizatör veya spor sever olarak sporpuan'a etkinlik ekleyin</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-10 text-center space-y-4">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 border border-blue-200 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-slate-900">Etkinlik Başarıyla Eklendi!</h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto font-medium">
              Etkinliğiniz SporPuan veritabanında yayınlandı. Kullanıcılar hemen puanlamaya ve değerlendirmeye başlayabilir.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[80vh] text-xs">
            
            {/* Organizer Status Banner */}
            {currentUser?.role === 'organizer' ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-bold text-emerald-900">
                    Onaylı Organizatör: {currentUser.organizationName || currentUser.name}
                  </span>
                </div>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                  Doğrulanmış Kulüp
                </span>
              </div>
            ) : (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span className="font-medium text-blue-900">
                    {currentUser ? `Giriş Yapıldı: ${currentUser.name}` : 'Organizatör hesabınızla oturum açarak doğrulama rozeti alabilirsiniz.'}
                  </span>
                </div>
                {onOpenAuthModal && (
                  <button
                    type="button"
                    onClick={onOpenAuthModal}
                    className="text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1.5 rounded-lg transition shrink-0"
                  >
                    Organizatör Girişi Yap
                  </button>
                )}
              </div>
            )}

            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Etkinlik Adı / Başlığı *</label>
              <input
                type="text"
                required
                placeholder="Örn: 2026 İstanbul Gece Koşusu & Festivali"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 font-normal"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Kategori *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as SportsCategory)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
                >
                  {categories.filter((c) => c !== 'Tümü').map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Şehir *</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
                >
                  {['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Trabzon', 'Eskişehir', 'Kocaeli'].map((ct) => (
                    <option key={ct} value={ct}>{ct}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Stadyum / Tesis / Parkur *</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Caddebostan Sahili & Etkinlik Alanı"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 font-normal"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Organizatör Kurum / Kulüp *</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Kadıköy Spor Kulübü"
                  value={organizer}
                  onChange={(e) => setOrganizer(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 font-normal"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Etkinlik Tarihi & Saat</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="22 Ekim 2026"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 font-normal"
                  />
                  <input
                    type="text"
                    placeholder="20:00"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-24 bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 font-normal"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Bilet Fiyat Aralığı</label>
                <input
                  type="text"
                  placeholder="Örn: ₺300 - ₺1.200 Veya Ücretsiz"
                  value={ticketPriceRange}
                  onChange={(e) => setTicketPriceRange(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 font-normal"
                />
              </div>
            </div>

            {/* Event Image Upload Section (Standardized 16:9 Aspect Ratio) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-700 block">
                  Etkinlik Görseli Yükle
                </label>
                <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  Otomatik Standart 16:9 (1200x675 px)
                </span>
              </div>

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              {/* Drag & Drop Upload Zone or Standardized Image Preview */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-2xl p-4 transition cursor-pointer text-center overflow-hidden flex flex-col items-center justify-center min-h-[160px] ${
                  isDragging
                    ? 'border-blue-600 bg-blue-50/80'
                    : 'border-slate-300 hover:border-blue-500 bg-slate-50 hover:bg-slate-100/80'
                }`}
              >
                {isProcessingImage ? (
                  <div className="py-6 flex flex-col items-center gap-2 text-blue-600">
                    <RefreshCw className="w-6 h-6 animate-spin" />
                    <span className="font-bold text-xs">Görsel İşleniyor & 16:9 Boyutlandırılıyor...</span>
                  </div>
                ) : (
                  <div className="w-full space-y-3">
                    {/* Standardized Preview Container (16:9 ratio) */}
                    <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden border border-slate-200 bg-slate-900 group shadow-2xs">
                      <img
                        src={image}
                        alt="Etkinlik Görseli Önizleme"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <span className="bg-white/90 text-slate-900 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 shadow-md">
                          <Upload className="w-3.5 h-3.5 text-blue-600" />
                          Görseli Değiştir
                        </span>
                      </div>

                      {/* Standart Dimension Badge */}
                      <div className="absolute bottom-2 right-2 bg-slate-950/80 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 rounded border border-slate-700 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-blue-400" />
                        <span>16:9 • Standart Boyut</span>
                      </div>

                      {isCustomUploaded && (
                        <div className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          Yüklendi & İşlendi
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between px-1 text-[11px]">
                      <span className="text-slate-500 font-medium flex items-center gap-1">
                        <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                        Tıkla veya görseli buraya sürükle (PNG, JPG, WEBP)
                      </span>

                      {isCustomUploaded && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleResetImage();
                          }}
                          className="text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1 bg-rose-50 hover:bg-rose-100 px-2 py-1 rounded-md transition"
                        >
                          <Trash2 className="w-3 h-3" />
                          Sıfırla
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Etkinlik Açıklaması</label>
              <textarea
                rows={3}
                placeholder="Etkinlik programı, yaş sınırı, stadyum kapı açılışı veya kurallar hakkında bilgi verin..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 font-normal"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm rounded-xl shadow-md transition active:scale-98"
            >
              Etkinliği Sisteme Kaydet
            </button>

          </form>
        )}

      </div>
    </div>
  );
};

