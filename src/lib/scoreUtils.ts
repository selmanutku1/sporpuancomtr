import { RatingCriterion } from '../types';

export function calculateOverallScore(scores: RatingCriterion): number {
  const sum = 
    scores.organization * 0.25 +
    scores.atmosphere * 0.25 +
    scores.valueForMoney * 0.20 +
    scores.amenities * 0.15 +
    scores.accessibility * 0.15;
  return Math.round(sum * 10) / 10;
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

export const RATING_CRITERIA_LABELS: Record<keyof RatingCriterion, { label: string; icon: string; desc: string }> = {
  organization: {
    label: 'Organizasyon & Tesis',
    icon: '🏟️',
    desc: 'Akış hızı, giriş turnikeleri, sporcu/seyirci yönlendirmesi ve zemin kalitesi',
  },
  atmosphere: {
    label: 'Tribün & Coşku Atmosferi',
    icon: '🔥',
    desc: 'Seyirci coşkusu, ses/ışık şovları, bando, desibel ve genel enerji',
  },
  valueForMoney: {
    label: 'Bilet / Fiyat-Performans',
    icon: '🎟️',
    desc: 'Bilet fiyatının sunulan seyir ve organizasyon kalitesini karşılama oranı',
  },
  amenities: {
    label: 'Yiyecek & İçecek / Sosyal Alan',
    icon: '🍔',
    desc: 'Kantin/büfe çeşitliliği, tuvalet hijyeni ve bekleme alanları',
  },
  accessibility: {
    label: 'Ulaşım, Güvenlik & Otopark',
    icon: '🚗',
    desc: 'Toplu taşıma bağlantısı, park imkanı, güvenlik personeli yaklaşımı ve tahliye hızı',
  },
};
