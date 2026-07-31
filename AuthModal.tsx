import { SportsEvent } from '../types';

export const INITIAL_EVENTS: SportsEvent[] = [
  {
    id: '1',
    title: 'Galatasaray - Fenerbahçe Derbisi',
    slug: 'gs-fb-derbi-2026',
    category: 'Spor Etkinlikleri',
    city: 'İstanbul',
    venue: 'RAMS Park',
    date: '20 Ekim 2026',
    time: '20:00',
    organizer: 'TFF',
    organizerVerified: true,
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200&auto=format&fit=crop',
    description: 'Süper Lig heyecanı dev derbi ile devam ediyor. İki ezeli rakip RAMS Park\'ta karşı karşıya geliyor.',
    ticketPriceRange: '₺1000 - ₺5000',
    ticketUrl: 'https://passo.com.tr',
    overallScore: 8.8,
    ratingBreakdown: {
      kaliteIcerik: 9.0,
      guvenlik: 8.5,
      fiyatDeger: 7.5,
      deneyimIletisim: 9.5
    },
    reviewCount: 450,
    featured: true,
    tags: ['Futbol', 'Süper Lig', 'Derbi'],
    reviews: [
      {
        id: 'r1',
        userName: 'Ahmet Yılmaz',
        verifiedAttendee: true,
        date: '21 Ekim 2026',
        overallScore: 8.8,
        scores: {
          kaliteIcerik: 9.0,
          guvenlik: 8.5,
          fiyatDeger: 7.5,
          deneyimIletisim: 9.5
        },
        comment: 'Atmosfer mükemmeldi, ancak stadyuma giriş çıkışlarda çok sıra bekledik.',
        pros: ['Harika Atmosfer', 'Stadyum Akustiği'],
        cons: ['Otopark Sorunu', 'Yüksek Bilet Fiyatı'],
        likes: 120,
        tags: ['Atmosfer', 'Trafik']
      }
    ],
    latitude: 41.1034,
    longitude: 28.9912,
  },
  {
    id: '2',
    title: 'MacFit Kanyon',
    slug: 'macfit-kanyon',
    category: 'Spor Salonları',
    city: 'İstanbul',
    venue: 'Kanyon AVM, Levent',
    date: 'Her Gün',
    time: '07:00 - 23:00',
    organizer: 'MacFit',
    organizerVerified: true,
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop',
    description: 'Levent\'in merkezinde, son teknoloji ekipmanlarla donatılmış ferah bir spor salonu deneyimi.',
    ticketPriceRange: '₺800 - ₺1200 (Aylık)',
    ticketUrl: 'https://macfit.com',
    overallScore: 7.8,
    ratingBreakdown: {
      kaliteIcerik: 8.0,
      guvenlik: 8.0,
      fiyatDeger: 7.0,
      deneyimIletisim: 7.5
    },
    reviewCount: 125,
    featured: true,
    tags: ['Fitness', 'Gym', 'Levent'],
    reviews: [
      {
        id: 'r2',
        userName: 'Zeynep K.',
        verifiedAttendee: true,
        date: '10 Ekim 2026',
        overallScore: 7.8,
        scores: {
          kaliteIcerik: 8.0,
          guvenlik: 8.0,
          fiyatDeger: 7.0,
          deneyimIletisim: 7.5
        },
        comment: 'Akşam saatlerinde çok kalabalık oluyor ama genel olarak temiz ve ekipmanlar yeterli.',
        pros: ['Merkezi Konum', 'Temizlik'],
        cons: ['Akşam Yoğunluğu', 'Eğitmen İlgisizliği'],
        likes: 45,
        tags: ['Kalabalık', 'Temiz']
      }
    ],
    latitude: 41.0772,
    longitude: 29.0116,
  },
  {
    id: '3',
    title: 'Fenerbahçe Futbol Okulu',
    slug: 'fb-futbol-okulu',
    category: 'Spor Okulları',
    city: 'İstanbul',
    venue: 'Dereağzı Lefter Küçükandonyadis Tesisleri',
    date: 'Hafta Sonu',
    time: '09:00 - 15:00',
    organizer: 'Fenerbahçe SK',
    organizerVerified: true,
    image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=1200&auto=format&fit=crop',
    description: 'Geleceğin yıldızları için profesyonel altyapı eğitimi.',
    ticketPriceRange: '₺2000 (Aylık)',
    ticketUrl: 'https://fenerbahce.org',
    overallScore: 9.1,
    ratingBreakdown: {
      kaliteIcerik: 9.5,
      guvenlik: 9.0,
      fiyatDeger: 8.5,
      deneyimIletisim: 9.0
    },
    reviewCount: 85,
    featured: false,
    tags: ['Futbol Okulu', 'Çocuk', 'Eğitim'],
    reviews: [
      {
        id: 'r3',
        userName: 'Can Yılmaz',
        verifiedAttendee: true,
        date: '02 Eylül 2026',
        overallScore: 9.1,
        scores: {
          kaliteIcerik: 9.5,
          guvenlik: 9.0,
          fiyatDeger: 8.5,
          deneyimIletisim: 9.0
        },
        comment: 'Çocuğum büyük bir keyifle gidiyor, hocalar gerçekten çok ilgili ve alanında uzman.',
        pros: ['Profesyonel Eğitmenler', 'Harika Tesisler'],
        cons: ['Biraz Uzak'],
        likes: 22,
        tags: ['Eğitim Kalitesi', 'İlgili Personel']
      }
    ],
    latitude: 40.9763,
    longitude: 28.7997,
  },
  {
    id: '4',
    title: 'Sinan Erdem Kapalı Spor Salonu',
    slug: 'sinan-erdem-salon',
    category: 'Spor Tesisleri',
    city: 'İstanbul',
    venue: 'Ataköy',
    date: 'Her Gün',
    time: '08:00 - 22:00',
    organizer: 'Spor İstanbul',
    organizerVerified: true,
    image: 'https://images.unsplash.com/photo-1574629810360-7efbc1969500?q=80&w=1200&auto=format&fit=crop',
    description: 'Türkiye\'nin en büyük kapalı spor salonlarından biri. Çok amaçlı saha kiralama imkanı.',
    ticketPriceRange: '₺500 - ₺1000 (Saatlik)',
    ticketUrl: 'https://spor.istanbul',
    overallScore: 8.2,
    ratingBreakdown: {
      kaliteIcerik: 9.0,
      guvenlik: 8.5,
      fiyatDeger: 8.0,
      deneyimIletisim: 7.5
    },
    reviewCount: 310,
    featured: false,
    tags: ['Basketbol', 'Tesis Kiralama', 'Kapalı Salon'],
    reviews: [
      {
        id: 'r4',
        userName: 'Mehmet Y.',
        verifiedAttendee: true,
        date: '15 Kasım 2026',
        overallScore: 8.2,
        scores: {
          kaliteIcerik: 9.0,
          guvenlik: 8.5,
          fiyatDeger: 8.0,
          deneyimIletisim: 7.5
        },
        comment: 'Tesis çok büyük ve imkanları güzel, ama otopark sorunu ciddi boyutta. Personel bazen ilgisiz.',
        pros: ['Tesis Büyüklüğü', 'Zemin Kalitesi'],
        cons: ['Otopark Yetersizliği', 'Personel İletişimi'],
        likes: 67,
        tags: ['Park Yeri Yok', 'Ferah Ortam']
      }
    ],
    latitude: 40.9902,
    longitude: 28.8507,
  },
  {
    id: '5',
    title: 'Olimpik Yüzme Havuzu Kompleksi',
    slug: 'ankara-olimpik-havuz',
    category: 'Spor Tesisleri',
    city: 'Ankara',
    venue: 'Eryaman',
    date: 'Her Gün',
    time: '06:00 - 22:00',
    organizer: 'Gençlik ve Spor Bakanlığı',
    organizerVerified: true,
    image: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?q=80&w=1200&auto=format&fit=crop',
    description: 'Olimpik standartlarda, her yaşa ve seviyeye uygun temiz ve modern yüzme tesisi.',
    ticketPriceRange: '₺150 - ₺300 (Günlük Giriş)',
    ticketUrl: 'https://gsb.gov.tr',
    overallScore: 8.9,
    ratingBreakdown: {
      kaliteIcerik: 9.5,
      guvenlik: 9.0,
      fiyatDeger: 8.5,
      deneyimIletisim: 8.6
    },
    reviewCount: 205,
    featured: true,
    tags: ['Yüzme', 'Olimpik Havuz', 'Su Sporları'],
    reviews: [
      {
        id: 'r5',
        userName: 'Aylin Ç.',
        verifiedAttendee: true,
        date: '12 Ağustos 2026',
        overallScore: 8.9,
        scores: {
          kaliteIcerik: 9.5,
          guvenlik: 9.0,
          fiyatDeger: 8.5,
          deneyimIletisim: 8.6
        },
        comment: 'Çok temiz bir havuz, su sıcaklığı ve klor oranı ideal. Sadece haftasonları çok çocuklu aile olduğu için kalabalık oluyor.',
        pros: ['Temizlik ve Hijyen', 'Uygun Fiyat'],
        cons: ['Haftasonu Kalabalığı'],
        likes: 88,
        tags: ['Temiz Su', 'Aile Ortamı']
      }
    ],
    latitude: 39.9575,
    longitude: 32.6105,
  },
  {
    id: '6',
    title: 'Iron Peak Gym',
    slug: 'iron-peak-gym-izmir',
    category: 'Spor Salonları',
    city: 'İzmir',
    venue: 'Karşıyaka',
    date: 'Her Gün',
    time: '06:30 - 00:00',
    organizer: 'Iron Peak',
    organizerVerified: false,
    image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1200&auto=format&fit=crop',
    description: 'Özellikle serbest ağırlık ve CrossFit meraklıları için tasarlanmış geniş donanımlı butik salon.',
    ticketPriceRange: '₺1000 (Aylık)',
    ticketUrl: '',
    overallScore: 9.3,
    ratingBreakdown: {
      kaliteIcerik: 9.5,
      guvenlik: 9.0,
      fiyatDeger: 9.5,
      deneyimIletisim: 9.2
    },
    reviewCount: 92,
    featured: false,
    tags: ['CrossFit', 'Vücut Geliştirme', 'Karşıyaka'],
    reviews: [
      {
        id: 'r6',
        userName: 'Mert T.',
        verifiedAttendee: true,
        date: '04 Eylül 2026',
        overallScore: 9.3,
        scores: {
          kaliteIcerik: 9.5,
          guvenlik: 9.0,
          fiyatDeger: 9.5,
          deneyimIletisim: 9.2
        },
        comment: 'Ekipmanlar mükemmel, gerçek bir hardcore spor salonu atmosferi var. Müzikler de harika!',
        pros: ['Serbest Ağırlık Çeşitliliği', 'Harika Atmosfer'],
        cons: ['Havalandırma Bazen Yetersiz'],
        likes: 31,
        tags: ['Hardcore Gym', 'Ağırlıklar']
      }
    ],
    latitude: 38.4550,
    longitude: 27.1141,
  },
  {
    id: '7',
    title: 'Göztepe Yelken Kulübü',
    slug: 'goztepe-yelken',
    category: 'Spor Tesisleri',
    city: 'İzmir',
    venue: 'Güzelyalı, Sahil Şeridi',
    date: 'Her Gün',
    time: '09:00 - 18:00',
    organizer: 'Göztepe SK',
    organizerVerified: true,
    image: 'https://images.unsplash.com/photo-1534125867375-7bc6bb8544d6?q=80&w=1200&auto=format&fit=crop',
    description: 'Ege\'nin sularında profesyonel yelken eğitimi ve tekne kiralama hizmeti sunan köklü tesis.',
    ticketPriceRange: '₺4000 (Aylık Kurs)',
    ticketUrl: 'https://goztepe.org.tr',
    overallScore: 8.5,
    ratingBreakdown: {
      kaliteIcerik: 8.5,
      guvenlik: 9.5,
      fiyatDeger: 7.5,
      deneyimIletisim: 8.5
    },
    reviewCount: 65,
    featured: true,
    tags: ['Yelken', 'Deniz Sporları', 'Kurs'],
    reviews: [
      {
        id: 'r7',
        userName: 'Burcu Y.',
        verifiedAttendee: true,
        date: '18 Mayıs 2026',
        overallScore: 8.5,
        scores: {
          kaliteIcerik: 8.5,
          guvenlik: 9.5,
          fiyatDeger: 7.5,
          deneyimIletisim: 8.5
        },
        comment: 'Hocalarımız çok yetkin. Ancak tekneler biraz eski, yenilenmesi gerekiyor.',
        pros: ['Uzman Eğitmen Kadrosu', 'Mükemmel Lokasyon'],
        cons: ['Eski Ekipmanlar', 'Fiyat Biraz Yüksek'],
        likes: 12,
        tags: ['Eğitim', 'Manzara']
      }
    ],
    latitude: 38.3965,
    longitude: 27.0864,
  }
];
