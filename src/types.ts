export type UserRole = 'user' | 'organizer' | 'admin';

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
  | 'Spor Tesisleri'
  | 'Spor Salonları'
  | 'Spor Okulları'
  | 'Spor Etkinlikleri';

export interface RatingCriterion {
  [key: string]: number;
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
  ticketPriceRange?: string;
  ticketUrl?: string;
  overallScore: number;
  ratingBreakdown: RatingCriterion;
  reviewCount: number;
  featured: boolean;
  tags: string[];
  reviews: Review[];
  latitude?: number;
  longitude?: number;
  sourceProvider?: string;
  lastSyncedAt?: string;
}
