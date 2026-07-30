import { SportsEvent } from '../types';

export interface ExternalPortal {
  id: string;
  name: string;
  domain: string;
  category: string;
  status: 'active' | 'syncing' | 'idle' | 'error';
  lastSyncTime: string;
  eventsCount: number;
  logo: string;
}

export const EXTERNAL_PORTALS: ExternalPortal[] = [
  {
    id: 'passo',
    name: 'Passo.com.tr',
    domain: 'passo.com.tr',
    category: 'Futbol & Derbi',
    status: 'active',
    lastSyncTime: 'Az önce',
    eventsCount: 142,
    logo: '⚽'
  },
  {
    id: 'biletix',
    name: 'Biletix / Mobilet',
    domain: 'biletix.com',
    category: 'Basketbol & Uluslararası',
    status: 'active',
    lastSyncTime: '1 dk önce',
    eventsCount: 98,
    logo: '🏀'
  },
  {
    id: 'sporistanbul',
    name: 'Spor İstanbul Portal',
    domain: 'spor.istanbul',
    category: 'Maraton & Şehir Sporları',
    status: 'active',
    lastSyncTime: '3 dk önce',
    eventsCount: 56,
    logo: '🏃'
  },
  {
    id: 'tvf',
    name: 'TVF & Biletinial',
    domain: 'biletinial.com',
    category: 'Sultanlar Ligi Voleybol',
    status: 'active',
    lastSyncTime: 'Az önce',
    eventsCount: 41,
    logo: '🏐'
  },
  {
    id: 'redbull',
    name: 'Red Bull Extreme Events',
    domain: 'redbull.com/tr-tr',
    category: 'Doğa & Extreme Sporlar',
    status: 'active',
    lastSyncTime: '5 dk önce',
    eventsCount: 19,
    logo: '🚵'
  }
];

// Discoverable Live Events Pool ready to be synced into SporPuan
export const LIVE_WEB_EVENTS_POOL: Omit<SportsEvent, 'id'>[] = [
  {
    title: 'Fenerbahçe Beko vs Real Madrid - THY EuroLeague Play-Off',
    slug: 'fenerbahce-real-madrid-euroleague-2026',
    category: 'Basketbol',
    city: 'İstanbul',
    venue: 'Ülker Spor ve Etkinlik Salonu (Ataşehir)',
    date: '18 Mayıs 2026',
    time: '20:45',
    organizer: 'EuroLeague Basketball',
    organizerVerified: true,
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=1200&auto=format&fit=crop',
    description: 'THY EuroLeague Final Four yolunda nefes kesen dev karşılaşma! Fenerbahçe Beko, Ataşehir\'de İspanyol devi Real Madrid\'i konuk ediyor.',
    ticketPriceRange: '₺450 - ₺2.500 (Biletix Entegre)',
    ticketUrl: 'https://biletix.com',
    overallScore: 9.7,
    ratingBreakdown: {
      organization: 9.8,
      valueForMoney: 9.2,
      amenities: 9.6,
      atmosphere: 10.0,
      accessibility: 9.9
    },
    reviewCount: 189,
    featured: true,
    tags: ['EuroLeague', 'FenerbahçeBeko', 'Ataşehir', 'Dev Maç'],
    reviews: [],
    latitude: 40.9936,
    longitude: 29.1102,
    sourceProvider: 'Biletix / Mobilet',
    lastSyncedAt: new Date().toISOString()
  },
  {
    title: 'Galatasaray vs Beşiktaş - Trendyol Süper Lig Derbisi',
    slug: 'galatasaray-besiktas-derbisi-2026',
    category: 'Futbol',
    city: 'İstanbul',
    venue: 'RAMS Park Stadyumu (Seyrantepe)',
    date: '24 Mayıs 2026',
    time: '19:00',
    organizer: 'TFF & Passo',
    organizerVerified: true,
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200&auto=format&fit=crop',
    description: 'Şampiyonluk yarışını düğümleyecek dev derbi! RAMS Park\'ta 52 bin taraftarın önünde kıran kırana 90 dakika.',
    ticketPriceRange: '₺800 - ₺4.500 (Passo Otomatik Senkron)',
    ticketUrl: 'https://passo.com.tr',
    overallScore: 9.6,
    ratingBreakdown: {
      organization: 9.5,
      valueForMoney: 8.9,
      amenities: 9.4,
      atmosphere: 10.0,
      accessibility: 9.8
    },
    reviewCount: 312,
    featured: true,
    tags: ['Derbi', 'SüperLig', 'RAMSPark', 'PassoLive'],
    reviews: [],
    latitude: 41.1033,
    longitude: 28.9912,
    sourceProvider: 'Passo.com.tr',
    lastSyncedAt: new Date().toISOString()
  },
  {
    title: 'Eczacıbaşı Dynavit vs VakıfBank - Vodafone Sultanlar Ligi Finali',
    slug: 'eczacibasi-vakifbank-sultanlar-ligi-2026',
    category: 'Voleybol',
    city: 'İstanbul',
    venue: 'TVF Burhan Felek Vestel Voleybol Salonu',
    date: '12 Haziran 2026',
    time: '18:00',
    organizer: 'Türkiye Voleybol Federasyonu',
    organizerVerified: true,
    image: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?q=80&w=1200&auto=format&fit=crop',
    description: 'Dünya voleybolunun zirvesi Üsküdar\'da! Filenin Sultanlarının yıldızlarının sahada olacağı şampiyonluk serisi 3. maçı.',
    ticketPriceRange: '₺200 - ₺850 (Biletinial)',
    ticketUrl: 'https://biletinial.com',
    overallScore: 9.4,
    ratingBreakdown: {
      organization: 9.7,
      valueForMoney: 9.5,
      amenities: 9.1,
      atmosphere: 9.6,
      accessibility: 9.1
    },
    reviewCount: 94,
    featured: false,
    tags: ['SultanlarLigi', 'Voleybol', 'BurhanFelek', 'Şampiyonluk'],
    reviews: [],
    latitude: 41.0253,
    longitude: 29.0287,
    sourceProvider: 'TVF & Biletinial',
    lastSyncedAt: new Date().toISOString()
  },
  {
    title: 'Nkolay İstanbul Yarı Maratonu 2026',
    slug: 'istanbul-yari-maratonu-2026',
    category: 'Maraton & Koşu',
    city: 'İstanbul',
    venue: 'Yenikapı Etkinlik Alanı - Tarihi Yarımada',
    date: '26 Eylül 2026',
    time: '08:00',
    organizer: 'Spor İstanbul',
    organizerVerified: true,
    image: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?q=80&w=1200&auto=format&fit=crop',
    description: 'Tarihi Yarımada\'nın düz ve hızlı parkurunda rekor koşusu! 21K ve 10K parkurlarıyla binlerce koşucu bir arada.',
    ticketPriceRange: '₺300 - ₺600',
    ticketUrl: 'https://yarimaraton.istanbul',
    overallScore: 9.5,
    ratingBreakdown: {
      organization: 9.8,
      valueForMoney: 9.4,
      amenities: 9.2,
      atmosphere: 9.6,
      accessibility: 9.5
    },
    reviewCount: 165,
    featured: true,
    tags: ['21K', 'TarihiYarımada', 'Koşu', 'Sporİstanbul'],
    reviews: [],
    latitude: 41.0031,
    longitude: 28.9531,
    sourceProvider: 'Spor İstanbul Portal',
    lastSyncedAt: new Date().toISOString()
  },
  {
    title: 'Red Bull Sea to Sky Extreme Enduro 2026',
    slug: 'redbull-sea-to-sky-2026',
    category: 'Doğa & Extreme',
    city: 'Antalya',
    venue: 'Kemer - Tahtalı Dağı Zirvesi (2365m)',
    date: '10 Ekim 2026',
    time: '09:00',
    organizer: 'Red Bull Events',
    organizerVerified: true,
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?q=80&w=1200&auto=format&fit=crop',
    description: 'Dünyanın en zorlu motosiklet yarışı Kemer sahilinde başlayıp Tahtalı Dağı\'nın 2365 metre zirvesinde noktalanıyor.',
    ticketPriceRange: 'Ücretsiz Seyirci Alanları',
    ticketUrl: 'https://redbull.com',
    overallScore: 9.8,
    ratingBreakdown: {
      organization: 9.9,
      valueForMoney: 10.0,
      amenities: 9.3,
      atmosphere: 9.9,
      accessibility: 8.8
    },
    reviewCount: 88,
    featured: true,
    tags: ['Extreme', 'Enduro', 'Tahtalı', 'RedBull'],
    reviews: [],
    latitude: 36.5369,
    longitude: 30.4347,
    sourceProvider: 'Red Bull Extreme Events',
    lastSyncedAt: new Date().toISOString()
  }
];

export interface SyncResult {
  addedCount: number;
  updatedCount: number;
  newEvents: SportsEvent[];
  logMessages: string[];
}

export function performWebSync(existingEvents: SportsEvent[]): SyncResult {
  const existingTitles = new Set(existingEvents.map(e => e.title.toLowerCase()));
  const newEventsAdded: SportsEvent[] = [];
  const logMessages: string[] = [];

  LIVE_WEB_EVENTS_POOL.forEach((item, index) => {
    if (!existingTitles.has(item.title.toLowerCase())) {
      const newEvent: SportsEvent = {
        ...item,
        id: `web-sync-${Date.now()}-${index}`,
        lastSyncedAt: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
      };
      newEventsAdded.push(newEvent);
      logMessages.push(`[${item.sourceProvider}] "${item.title}" platformumuza başarıyla senkronize edildi.`);
    } else {
      logMessages.push(`[${item.sourceProvider}] "${item.title}" zaten güncel (Eşleşti).`);
    }
  });

  return {
    addedCount: newEventsAdded.length,
    updatedCount: existingEvents.length,
    newEvents: newEventsAdded,
    logMessages
  };
}
