export type UserRole = 'user' | 'organizer';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  organizationName?: string;
  title?: string;
  createdAt: string;
}

export type SportsCategory = 
  | 'Tümü'
  | 'Futbol'
  | 'Basketbol'
  | 'Maraton & Koşu'
  | 'Voleybol'
  | 'Doğa & Extreme'
  | 'Fitness & CrossFit'
  | 'Motor Sporları'
  | 'Çocuk & Gençlik';

export interface RatingCriterion {
  organization: number;   // Organizasyon & Tesis Kalitesi (1-10)
  valueForMoney: number;  // Bilet / Fiyat-Performans (1-10)
  amenities: number;      // Yiyecek, İçecek & Sosyal Alanlar (1-10)
  atmosphere: number;     // Tribün & Coşku Atmosferi (1-10)
  accessibility: number;  // Ulaşım, Otopark & Güvenlik (1-10)
}

export interface Review {
  id: string;
  userName: string;
  userAvatar?: string;
  verifiedAttendee: boolean;
  date: string;
  overallScore: number;
  scores: RatingCriterion;
  comment: string;
  pros: string[];
  cons: string[];
  likes: number;
  userPhotos?: string[];
  tags: string[];
}

export interface AiAnalysisData {
  overallScore: number;
  scoreCategory: 'Mükemmel' | 'Çok İyi' | 'Ortalama' | 'Geliştirilmeli';
  scores: RatingCriterion;
  summary: string;
  pros: string[];
  cons: string[];
  fanAdvice: string;
  organizerAdvice: string;
}

export interface SportsEvent {
  id: string;
  title: string;
  slug: string;
  category: SportsCategory;
  city: string;
  venue: string;
  date: string;
  time?: string;
  organizer: string;
  organizerVerified: boolean;
  image: string;
  description: string;
  ticketPriceRange: string;
  ticketUrl?: string;
  overallScore: number;
  ratingBreakdown: RatingCriterion;
  reviewCount: number;
  featured: boolean;
  tags: string[];
  reviews: Review[];
  latitude?: number;
  longitude?: number;
  aiAnalysis?: AiAnalysisData;
  sourceProvider?: string;
  lastSyncedAt?: string;
}
