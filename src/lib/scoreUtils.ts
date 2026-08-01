import { RatingCriterion, SportsCategory } from '../types';

export const CATEGORY_CRITERIA_MAP: Record<SportsCategory, { key: string; label: string; desc: string; weight: number }[]> = {
  'Tümü': [],
  'Spor Tesisleri': [
    { key: 'zeminSaha', label: 'Zemin & Saha Kalitesi', desc: 'Zemin, çim/parke/halı kalitesi, düzgünlük ve saha bakımı', weight: 0.30 },
    { key: 'soyunmaHijyen', label: 'Soyunma Odası & Hijyen', desc: 'Duş temizliği, soyunma alanları, havalandırma ve hijyen', weight: 0.25 },
    { key: 'ekipmanAydinlatma', label: 'Aydınlatma & Ekipman', desc: 'Saha ışıklandırması, kale/file/potası ve altyapı sağlamlığı', weight: 0.20 },
    { key: 'ulasimOtopark', label: 'Ulaşım & Otopark', desc: 'Lokasyon erişilebilirliği, toplu taşıma ve park alanı kapasitesi', weight: 0.15 },
    { key: 'fiyatHizmet', label: 'Kiralama Ücreti & Personel', desc: 'Kiralama fiyatı/performansı ve tesis görevlilerinin ilgisi', weight: 0.10 },
  ],
  'Spor Salonları': [
    { key: 'ekipmanCesit', label: 'Ekipman & Alet Çeşitliliği', desc: 'Serbest ağırlık, kardiyo makineleri ve aletlerin güncelliği', weight: 0.30 },
    { key: 'hijyenFerahlik', label: 'Hijyen & İklimlendirme', desc: 'Salon temizliği, duşlar, klima/havalandırma ve koku yönetimi', weight: 0.25 },
    { key: 'antrenorDestegi', label: 'Antrenör & Eğitmen Desteği', desc: 'Salon koçlarının ilgisi, form yönlendirmesi ve profesyonelliği', weight: 0.20 },
    { key: 'yogunlukAtmosfer', label: 'Yoğunluk & Çalışma Alanı', desc: 'Yoğun saatlerdeki kalabalık, alet bekleme süresi ve motivasyon', weight: 0.15 },
    { key: 'fiyatUyelik', label: 'Üyelik Fiyatı & Koşulları', desc: 'Aylık/yıllık paket maliyeti ve üyelik dondurma/iptal esnekliği', weight: 0.10 },
  ],
  'Spor Okulları': [
    { key: 'egitmenKalitesi', label: 'Eğitmen & Pedagojik Kalite', desc: 'Antrenörlerin uzmanlığı, sabrı ve çocuk/öğrenci iletişimi', weight: 0.35 },
    { key: 'mufredatGelisim', label: 'Müfredat & Sporcu Gelişimi', desc: 'Sistematik antrenman programı, disiplin ve gelişim takibi', weight: 0.25 },
    { key: 'guvenlikDisiplin', label: 'Güvenlik & Sağlık Önlemleri', desc: 'İlk yardım hazırlığı, antrenman güvenliği ve veli bilgilendirmesi', weight: 0.20 },
    { key: 'tesisEkipman', label: 'Tesis & Yaşa Uygun Ekipman', desc: 'Öğrenci yaş grubuna uygun malzeme, saha boyutu ve soyunma alanı', weight: 0.10 },
    { key: 'fiyatIletisim', label: 'Fiyat & Veli İletişimi', desc: 'Eğitim ücretlerinin makullüğü ve düzenli bilgilendirme', weight: 0.10 },
  ],
  'Spor Etkinlikleri': [
    { key: 'organizasyonAkis', label: 'Organizasyon & Akış', desc: 'Kayıt/bilet kontrolü, zamanlama, yönlendirmeler ve alan düzeni', weight: 0.30 },
    { key: 'parkurGuvenlik', label: 'Parkur & Güvenlik Önlemleri', desc: 'Parkur/saha emniyeti, yön işaretleri, trafik kontrolü ve sağlık ekibi', weight: 0.25 },
    { key: 'kitIkram', label: 'Etkinlik Kiti & Su/İkramlar', desc: 'Tiştört/madalya kalitesi, parkur içi su/beslenme istasyonları', weight: 0.20 },
    { key: 'atmosferSeyir', label: 'Atmosfer & Seyir Zevki', desc: 'Sunum, ses/müzik sistemi, seyirci ve katılımcı coşkusu', weight: 0.15 },
    { key: 'biletFiyat', label: 'Katılım Ücreti / Değer', desc: 'Bilet/katılım ücretinin sunduğu organizasyon kalitesi ile uyumu', weight: 0.10 },
  ]
};

export const COMMON_CRITERIA = CATEGORY_CRITERIA_MAP['Spor Etkinlikleri'];

export function calculateOverallScore(scores: RatingCriterion, category: SportsCategory = 'Spor Etkinlikleri'): number {
  const mapping = CATEGORY_CRITERIA_MAP[category] || CATEGORY_CRITERIA_MAP['Spor Etkinlikleri'];
  let sum = 0;
  let totalWeight = 0;
  
  for (const crit of mapping) {
    if (scores[crit.key] !== undefined) {
      sum += scores[crit.key] * crit.weight;
      totalWeight += crit.weight;
    }
  }
  
  if (totalWeight === 0) {
    let legacySum = 0;
    let legacyCount = 0;
    for (const val of Object.values(scores)) {
      if (typeof val === 'number') {
        legacySum += val;
        legacyCount++;
      }
    }
    if (legacyCount > 0) {
      return Math.round((legacySum / legacyCount) * 10) / 10;
    }
    return 0;
  }
  
  return Math.round((sum / totalWeight) * 10) / 10;
}

export function getCriterionScore(ratingBreakdown: RatingCriterion, criterionKey: string, overallFallback = 8.5): number {
  if (ratingBreakdown && typeof ratingBreakdown[criterionKey] === 'number') {
    return ratingBreakdown[criterionKey];
  }
  const existingValues = Object.values(ratingBreakdown || {}).filter(v => typeof v === 'number');
  if (existingValues.length > 0) {
    const avg = existingValues.reduce((a, b) => a + b, 0) / existingValues.length;
    return Math.round(avg * 10) / 10;
  }
  return overallFallback;
}

export function getScoreBadgeColor(score: number): {
  bg: string;
  badge: string;
  border: string;
  text: string;
} {
  if (score >= 9.0) {
    return {
      bg: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300',
      badge: 'bg-emerald-600 text-white shadow-emerald-500/20',
      border: 'border-emerald-200 dark:border-emerald-800/60',
      text: 'text-emerald-600 dark:text-emerald-400',
    };
  } else if (score >= 8.0) {
    return {
      bg: 'bg-blue-50 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300',
      badge: 'bg-blue-600 text-white shadow-blue-500/20',
      border: 'border-blue-200 dark:border-blue-800/60',
      text: 'text-blue-600 dark:text-blue-400',
    };
  } else if (score >= 7.0) {
    return {
      bg: 'bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300',
      badge: 'bg-amber-500 text-white shadow-amber-500/20',
      border: 'border-amber-200 dark:border-amber-800/60',
      text: 'text-amber-600 dark:text-amber-400',
    };
  } else {
    return {
      bg: 'bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300',
      badge: 'bg-rose-600 text-white shadow-rose-500/20',
      border: 'border-rose-200 dark:border-rose-800/60',
      text: 'text-rose-600 dark:text-rose-400',
    };
  }
}

export function getScoreLabel(score: number): string {
  if (score >= 9.0) return 'Mükemmel';
  if (score >= 8.0) return 'Çok İyi';
  if (score >= 7.0) return 'Ortalama';
  return 'Geliştirilmeli';
}
