import { RatingCriterion, SportsCategory } from '../types';

export const COMMON_CRITERIA = [
  { key: 'kaliteIcerik', label: 'Kalite & İçerik', desc: 'Eğitim, ekipman, organizasyon ve altyapı', weight: 0.4 },
  { key: 'guvenlik', label: 'Güvenlik', desc: 'Sağlık, ilk yardım ve çevresel önlemler', weight: 0.2 },
  { key: 'fiyatDeger', label: 'Fiyat / Değer', desc: 'Şeffaflık, maliyet-fayda dengesi', weight: 0.2 },
  { key: 'deneyimIletisim', label: 'Deneyim & İletişim', desc: 'Personel ilgisi, geri bildirim ve atmosfer', weight: 0.2 }
];

export const CATEGORY_CRITERIA_MAP: Record<SportsCategory, { key: string; label: string; desc: string; weight: number }[]> = {
  'Tümü': [],
  'Spor Tesisleri': COMMON_CRITERIA,
  'Spor Salonları': COMMON_CRITERIA,
  'Spor Okulları': COMMON_CRITERIA,
  'Spor Etkinlikleri': COMMON_CRITERIA
};

export function calculateOverallScore(scores: RatingCriterion, category: SportsCategory = 'Spor Etkinlikleri'): number {
  const mapping = CATEGORY_CRITERIA_MAP[category] || COMMON_CRITERIA;
  let sum = 0;
  let totalWeight = 0;
  
  for (const crit of mapping) {
    if (scores[crit.key] !== undefined) {
      sum += scores[crit.key] * crit.weight;
      totalWeight += crit.weight;
    }
  }
  
  // Normalization if weights don't add up to 1 for some reason, or if scores are missing
  if (totalWeight === 0) return 0;
  return Math.round((sum / totalWeight) * 10) / 10;
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
