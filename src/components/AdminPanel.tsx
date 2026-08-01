import React, { useEffect, useState, useMemo } from 'react';
import { UserProfile, SportsEvent, UserRole, Review, CorporateApplication, SportsCategory } from '../types';
import { db } from '../lib/firebase';
import { INITIAL_CORPORATE_APPS } from '../data/mockEvents';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc, setDoc } from 'firebase/firestore';
import { 
  Users, 
  ShieldCheck, 
  Mail, 
  Calendar, 
  Search, 
  Edit3, 
  Trash2, 
  CalendarDays, 
  LayoutDashboard, 
  Star, 
  Trophy, 
  MessageSquare,
  Building2,
  CheckCircle2,
  XCircle,
  Phone,
  Globe,
  MapPin,
  Clock,
  Eye,
  EyeOff,
  Check,
  X,
  FileText,
  MessageSquarePlus,
  BadgeCheck,
  RotateCcw,
  Plus,
  SlidersHorizontal,
  Sparkles,
  AlertCircle,
  Award,
  Copy,
  Zap
} from 'lucide-react';
import { calculateOverallScore, CATEGORY_CRITERIA_MAP, getCriterionScore } from '../lib/scoreUtils';

interface AdminPanelProps {
  events: SportsEvent[];
  onDeleteEvent: (id: string) => void;
  onEditEvent: (event: SportsEvent) => void;
  onUpdateEvent: (event: SportsEvent) => void;
  onAddEvent: (event: SportsEvent) => void;
}

const COMMON_AMENITIES = [
  'Otopark',
  'Soyunma Odası',
  'Kafeterya',
  'Klima & Havalandırma',
  'Wi-Fi',
  'Duş & Sıcak Su',
  'Antrenör / Eğitmen Desteği',
  'Çocuk Oyun Alanı',
  'Ekipman Kiralama',
  'Aydınlatmalı Saha / Salon',
  'Yüzme Havuzu',
  'Sauna & Buhar Odası',
  'Revir & İlk Yardım'
];

export const AdminPanel: React.FC<AdminPanelProps> = ({ events, onDeleteEvent, onEditEvent, onUpdateEvent, onAddEvent }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'events' | 'reviews' | 'corporate' | 'invite-requests'>('overview');
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [corporateApps, setCorporateApps] = useState<CorporateApplication[]>([]);
  const [inviteRequests, setInviteRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Event Filters
  const [eventSearchQuery, setEventSearchQuery] = useState('');
  const [eventCategoryFilter, setEventCategoryFilter] = useState('all');
  const [eventStatusFilter, setEventStatusFilter] = useState<'all' | 'active' | 'hidden'>('all');

  // Filters
  const [corporateFilter, setCorporateFilter] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'suspended'>('all');
  const [reviewFilter, setReviewFilter] = useState<'all' | 'published' | 'pending' | 'hidden'>('all');
  const [reviewSearchQuery, setReviewSearchQuery] = useState('');


  const filteredEvents = useMemo(() => {
    return events.filter(ev => {
      const matchSearch = ev.title.toLowerCase().includes(eventSearchQuery.toLowerCase()) || 
                          ev.city.toLowerCase().includes(eventSearchQuery.toLowerCase());
      const matchCategory = eventCategoryFilter === 'all' || ev.category === eventCategoryFilter;
      const matchStatus = eventStatusFilter === 'all' || 
                          (eventStatusFilter === 'active' && ev.isActive !== false) ||
                          (eventStatusFilter === 'hidden' && ev.isActive === false);
      return matchSearch && matchCategory && matchStatus;
    });
  }, [events, eventSearchQuery, eventCategoryFilter, eventStatusFilter]);

  const allReviews = useMemo(() => {
    const list: (Review & { eventTitle: string; eventId: string })[] = [];
    events.forEach(ev => {
      ev.reviews.forEach(rev => {
        list.push({ ...rev, eventTitle: ev.title, eventId: ev.id });
      });
    });
    list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return list;
  }, [events]);




  const filteredReviews = useMemo(() => {
    return allReviews.filter(rev => {
      const matchSearch = rev.userName.toLowerCase().includes(reviewSearchQuery.toLowerCase()) || 
                          rev.eventTitle.toLowerCase().includes(reviewSearchQuery.toLowerCase()) ||
                          rev.comment.toLowerCase().includes(reviewSearchQuery.toLowerCase());
      const matchStatus = reviewFilter === 'all' || 
                          (reviewFilter === 'published' && rev.status !== 'hidden') ||
                          (reviewFilter === 'hidden' && rev.status === 'hidden');
      return matchSearch && matchStatus;
    });
  }, [allReviews, reviewSearchQuery, reviewFilter]);


  // Modals state
  const [selectedAppDetail, setSelectedAppDetail] = useState<CorporateApplication | null>(null);
  const [editingApp, setEditingApp] = useState<CorporateApplication | null>(null);
  const [selectedReviewDetail, setSelectedReviewDetail] = useState<{ review: Review; event: SportsEvent } | null>(null);
  const [replyingReview, setReplyingReview] = useState<{ review: Review; event: SportsEvent } | null>(null);
  const [editingReview, setEditingReview] = useState<{ review: Review; event: SportsEvent } | null>(null);

  // Form states
  const [replyText, setReplyText] = useState('');
  const [inviteTargetName, setInviteTargetName] = useState('');
  const [invitePersonName, setInvitePersonName] = useState('');
  const [generatedInviteLink, setGeneratedInviteLink] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  // Custom Confirm/Prompt Dialog States
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    message: string;
    onConfirm: () => void;
  } | null>(null);
  
  const [promptDialog, setPromptDialog] = useState<{
    isOpen: boolean;
    message: string;
    defaultValue: string;
    onConfirm: (val: string) => void;
  } | null>(null);

  // Generate Invite Link function
  const handleGenerateInviteLink = () => {
    const randomCode = 'SP-INV-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    const baseUrl = window.location.origin + '/kurumsal-davet-formu';
    const params = new URLSearchParams();
    params.set('inviteCode', randomCode);
    params.set('sender', 'Yönetici Ekibi');
    if (inviteTargetName.trim()) {
      params.set('for', inviteTargetName.trim());
    }
    if (invitePersonName.trim()) {
      params.set('person', invitePersonName.trim());
    }

    const fullUrl = `${baseUrl}?${params.toString()}`;
    setGeneratedInviteLink(fullUrl);
  };

  const handleShareWhatsApp = () => {
    const text = `Merhaba${invitePersonName ? ' ' + invitePersonName : ''},

${inviteTargetName ? inviteTargetName + ' tesisinizi ' : 'Tesisinizi '}Türkiye'nin Spor Değerlendirme ve İnceleme Platformuna eklemek için özel davetiyeniz oluşturuldu. Aşağıdaki bağlantıya tıklayarak kurumsal başvurunuzu tamamlayabilir ve tesisinizi hemen yayınlayabilirsiniz:

${generatedInviteLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleShareEmail = () => {
    const subject = `Sporpuan Kurumsal Davetiyesi${inviteTargetName ? ' - ' + inviteTargetName : ''}`;
    const body = `Merhaba${invitePersonName ? ' ' + invitePersonName : ''},

${inviteTargetName ? inviteTargetName + ' tesisinizi ' : 'Tesisinizi '}Türkiye'nin Spor Değerlendirme ve İnceleme Platformuna eklemek için özel davetiyeniz oluşturuldu.

Aşağıdaki bağlantıya tıklayarak kurumsal başvurunuzu tamamlayabilir ve tesisinizi hemen yayınlayabilirsiniz:

${generatedInviteLink}

İyi çalışmalar,
Sporpuan Yönetimi`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  const handleCopyGeneratedLink = async () => {
    if (!generatedInviteLink) handleGenerateInviteLink();
    const targetLink = generatedInviteLink || `${window.location.origin}/kurumsal-davet-formu?inviteCode=SP-ADMIN-2026`;
    
    try {
      await navigator.clipboard.writeText(targetLink);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const q = query(collection(db, 'corporate_applications'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const apps: CorporateApplication[] = [];
      snapshot.forEach((doc) => {
        apps.push({ id: doc.id, ...doc.data() } as CorporateApplication);
      });
      try {
        const localSaved = localStorage.getItem('sporpuan_corporate_applications');
        if (localSaved) {
          const localApps: CorporateApplication[] = JSON.parse(localSaved);
          localApps.forEach(localApp => {
            if (!apps.some(a => a.id === localApp.id)) {
              apps.push(localApp);
            }
          });
        }
      } catch (e) {
        console.error(e);
      }
      if (apps.length === 0) {
        setCorporateApps(INITIAL_CORPORATE_APPS);
      } else {
        setCorporateApps(apps);
      }
    }, (error) => {
      console.warn("Firestore corporate applications error:", error);
      try {
        const localSaved = localStorage.getItem('sporpuan_corporate_applications');
        if (localSaved) {
          setCorporateApps(JSON.parse(localSaved));
        } else {
          setCorporateApps(INITIAL_CORPORATE_APPS);
        }
      } catch (e) {
        setCorporateApps(INITIAL_CORPORATE_APPS);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const q = query(collection(db, 'corporate_invite_requests'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const reqs: any[] = [];
      snapshot.forEach((doc) => {
        reqs.push({ id: doc.id, ...doc.data() });
      });
      setInviteRequests(reqs);
    }, (err) => {
      console.warn("Firestore invite requests listener error:", err);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const usersList: UserProfile[] = [];
      snapshot.forEach((doc) => {
        usersList.push({ uid: doc.id, ...doc.data() } as unknown as UserProfile);
      });
      setUsers(usersList);
      setLoading(false);
    }, (error) => {
      console.warn("Firestore users listener error:", error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const saveCorporateAppToStorageAndState = async (updatedApp: CorporateApplication) => {
    setCorporateApps(prev => prev.map(a => a.id === updatedApp.id ? updatedApp : a));
    try {
      await setDoc(doc(db, 'corporate_applications', updatedApp.id), updatedApp, { merge: true });
    } catch (e) {
      console.warn("Firestore application update warning:", e);
    }
    try {
      const localSaved = localStorage.getItem('sporpuan_corporate_applications');
      const localApps: CorporateApplication[] = localSaved ? JSON.parse(localSaved) : [];
      const index = localApps.findIndex(a => a.id === updatedApp.id);
      if (index >= 0) {
        localApps[index] = updatedApp;
      } else {
        localApps.unshift(updatedApp);
      }
      localStorage.setItem('sporpuan_corporate_applications', JSON.stringify(localApps));
    } catch (e) {
      console.error(e);
    }
  };

  const handleApproveCorporateApp = (app: CorporateApplication) => {
    setConfirmDialog({
      isOpen: true,
      message: `"${app.facilityName}" başvurusunu onaylayıp tesisi sisteme eklemek/yayınlamak istiyor musunuz?`,
      onConfirm: async () => {
        const approvedApp: CorporateApplication = { ...app, status: 'approved' };
        await saveCorporateAppToStorageAndState(approvedApp);
        
        const existingFacility = events.find(e => e.id === app.publishedFacilityId || e.title.toLowerCase() === app.facilityName.toLowerCase());
        const facilityId = existingFacility ? existingFacility.id : ('facility-' + Date.now());
        const publishedFacility: SportsEvent = {
          id: facilityId,
          title: app.facilityName,
          slug: app.facilityName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          category: app.category as any,
          city: app.city,
          venue: `${app.district}, ${app.city}` + (app.address ? ` (${app.address})` : ''),
          date: app.workingHours ? `Açık (${app.workingHours})` : 'Sürekli Açık (Tesis / Akademi)',
          time: app.workingHours || '08:00 - 23:00',
          organizer: `${app.facilityName} (${app.contactName})`,
          organizerVerified: true,
          image: app.imageUrl || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop',
          description: app.description || `${app.facilityName} - Sporpuan Kurumsal Doğrulanmış Tesis`,
          ticketPriceRange: app.membershipFeeRange || 'Kurumsal Tesis Üyeliği',
          ticketUrl: app.website || '',
          overallScore: existingFacility ? existingFacility.overallScore : 9.0,
          ratingBreakdown: existingFacility ? existingFacility.ratingBreakdown : {
            'zeminSaha': 9.0, 'soyunmaHijyen': 9.2, 'ekipmanAydinlatma': 8.8, 'ulasimOtopark': 8.5, 'fiyatHizmet': 8.7
          },
          reviewCount: existingFacility ? existingFacility.reviewCount : 1,
          featured: true,
          tags: ['Doğrulanmış Tesis', 'Mavi Rozet', ...(app.amenities || [])],
          reviews: existingFacility ? existingFacility.reviews : [
            {
              id: 'rev-init-' + Date.now(),
              userName: 'Sporpuan Editoryal',
              verifiedAttendee: true,
              date: new Date().toLocaleDateString('tr-TR'),
              overallScore: 9.0,
              scores: { 'zeminSaha': 9.0, 'soyunmaHijyen': 9.2, 'ekipmanAydinlatma': 8.8, 'ulasimOtopark': 8.5, 'fiyatHizmet': 8.7 } as any,
              comment: 'Kurumsal doğrulama süreci ve belge incelemeleri tamamlanmış, mavi rozet almış onaylı spor tesisimiz.',
              pros: ['Kurumsal Onaylı', 'Gelişmiş Ekipman & Hijyen'],
              cons: [],
              likes: 8,
              tags: ['Mavi Rozet', 'Resmi Onaylı'],
              status: 'published'
            }
          ],
          latitude: existingFacility ? existingFacility.latitude : 41.0,
          longitude: existingFacility ? existingFacility.longitude : 29.0
        };

        approvedApp.publishedFacilityId = facilityId;
        await saveCorporateAppToStorageAndState(approvedApp);

        if (existingFacility) {
          onUpdateEvent(publishedFacility);
        } else {
          onAddEvent(publishedFacility);
        }
      }
    });
  };

  const handleSuspendCorporateApp = (app: CorporateApplication) => {
    setConfirmDialog({
      isOpen: true,
      message: `"${app.facilityName}" tesisini pasife alıp yayından kaldırmak istediğinize emin misiniz?`,
      onConfirm: async () => {
        const suspendedApp: CorporateApplication = { ...app, status: 'suspended' };
        await saveCorporateAppToStorageAndState(suspendedApp);
      }
    });
  };

  const handleRejectCorporateApp = (app: CorporateApplication) => {
    setPromptDialog({
      isOpen: true,
      message: "Başvuruyu reddetme gerekçeniz (Opsiyonel):",
      defaultValue: "Gerekli kurumsal belgeler veya iletişim bilgileri doğrulanamadı.",
      onConfirm: async (reason: string) => {
        const rejectedApp: CorporateApplication = {
          ...app,
          status: 'rejected',
          adminNotes: reason ? `Red gerekçesi: ${reason}` : app.adminNotes
        };
        await saveCorporateAppToStorageAndState(rejectedApp);
      }
    });
  };

  const handleDeleteCorporateApp = (app: CorporateApplication) => {
    setConfirmDialog({
      isOpen: true,
      message: `"${app.facilityName}" başvurusunu TAMAMEN silmek istediğinize emin misiniz?`,
      onConfirm: async () => {
        setCorporateApps(prev => prev.filter(a => a.id !== app.id));
        try {
          await deleteDoc(doc(db, 'corporate_applications', app.id));
        } catch (e) {
          console.warn("Firestore application delete warning:", e);
        }
        try {
          const localSaved = localStorage.getItem('sporpuan_corporate_applications');
          const localApps: CorporateApplication[] = localSaved ? JSON.parse(localSaved) : [];
          const updatedApps = localApps.filter(a => a.id !== app.id);
          localStorage.setItem('sporpuan_corporate_applications', JSON.stringify(updatedApps));
        } catch (e) {
          console.error(e);
        }
      }
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-blue-600" />
            Yönetici Paneli
          </h1>
          <p className="text-slate-500 font-medium mt-1">Platforma kayıtlı tüm kullanıcıları, kurumsal başvuruları ve değerlendirmeleri yönetin.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto space-x-2 border-b border-slate-200 mb-6 pb-2">
        {(['overview', 'users', 'events', 'reviews', 'corporate', 'invite-requests'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${
              activeTab === tab 
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' 
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab === 'overview' && 'Genel Bakış'}
            {tab === 'users' && 'Kullanıcılar'}
            {tab === 'events' && 'Etkinlikler & Tesisler'}
            {tab === 'reviews' && 'Değerlendirmeler'}
            {tab === 'corporate' && 'Kurumsal Başvurular'}
            {tab === 'invite-requests' && 'Davetiye Talepleri'}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-slate-500 text-sm font-bold mb-1">Toplam Kullanıcı</h3>
            <p className="text-3xl font-black text-slate-900">{users.length}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-slate-500 text-sm font-bold mb-1">Kayıtlı Tesis/Etkinlik</h3>
            <p className="text-3xl font-black text-slate-900">{events.length}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-slate-500 text-sm font-bold mb-1">Bekleyen Kurumsal</h3>
            <p className="text-3xl font-black text-blue-600">{corporateApps.filter(a => a.status === 'pending').length}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-slate-500 text-sm font-bold mb-1">Onaylanan Kurumsal</h3>
            <p className="text-3xl font-black text-emerald-600">{corporateApps.filter(a => a.status === 'approved').length}</p>
          </div>
        </div>
      )}

      {activeTab === 'corporate' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-white p-4 rounded-2xl border border-slate-200">
            <div className="flex space-x-2 overflow-x-auto w-full sm:w-auto">
              {(['all', 'pending', 'approved', 'rejected', 'suspended'] as const).map(filter => (
                <button
                  key={filter}
                  onClick={() => setCorporateFilter(filter)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${
                    corporateFilter === filter ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {filter === 'all' && 'Tümü'}
                  {filter === 'pending' && 'Bekleyenler'}
                  {filter === 'approved' && 'Onaylananlar'}
                  {filter === 'rejected' && 'Reddedilenler'}
                  {filter === 'suspended' && 'Pasife Alınanlar'}
                </button>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto mt-4 sm:mt-0 p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="text-xs font-bold text-slate-700 w-full sm:w-auto">Özel Davet:</div>
              <input
                type="text"
                placeholder="Kişi Adı (Opsiyonel)"
                value={invitePersonName}
                onChange={(e) => setInvitePersonName(e.target.value)}
                className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none w-full sm:w-36"
              />
              <input
                type="text"
                placeholder="Tesis / İşletme Adı"
                value={inviteTargetName}
                onChange={(e) => setInviteTargetName(e.target.value)}
                className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none w-full sm:w-40"
              />
              <button
                onClick={handleGenerateInviteLink}
                className="w-full sm:w-auto px-4 py-1.5 bg-blue-600 text-white font-bold text-xs rounded-lg shadow-md hover:bg-blue-700 transition whitespace-nowrap"
              >
                Link Oluştur
              </button>
            </div>
          </div>

          {generatedInviteLink && (
            <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 flex flex-col gap-3">
              <div className="flex items-center justify-between gap-4">
                <input 
                  readOnly 
                  value={generatedInviteLink}
                  className="bg-slate-950 text-blue-300 font-mono text-xs p-2 rounded-lg w-full outline-none"
                />
                <button 
                  onClick={handleCopyGeneratedLink}
                  className="px-4 py-2 bg-white text-slate-900 font-bold text-xs rounded-xl whitespace-nowrap flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  {copiedLink ? 'Kopyalandı!' : 'Kopyala'}
                </button>
              </div>
              <div className="flex items-center gap-3 justify-end border-t border-slate-800 pt-3">
                <span className="text-slate-400 text-xs font-medium">Gönder:</span>
                <button 
                  onClick={handleShareWhatsApp}
                  className="px-4 py-2 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white font-bold text-xs rounded-xl whitespace-nowrap flex items-center gap-2 transition"
                >
                  <MessageSquare className="w-4 h-4" />
                  WhatsApp
                </button>
                <button 
                  onClick={handleShareEmail}
                  className="px-4 py-2 bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white font-bold text-xs rounded-xl whitespace-nowrap flex items-center gap-2 transition"
                >
                  <Mail className="w-4 h-4" />
                  E-Posta
                </button>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
                    <th className="p-4 font-bold">Tesis Adı</th>
                    <th className="p-4 font-bold">İletişim</th>
                    <th className="p-4 font-bold">Durum</th>
                    <th className="p-4 font-bold">Tarih</th>
                    <th className="p-4 font-bold text-right">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {corporateApps
                    .filter(app => corporateFilter === 'all' || app.status === corporateFilter)
                    .map(app => (
                      <tr key={app.id} className="hover:bg-slate-50 transition">
                        <td className="p-4">
                          <div className="font-bold text-slate-800 text-sm">{app.facilityName}</div>
                          <div className="text-xs text-slate-500">{app.category} - {app.city}</div>
                        </td>
                        <td className="p-4">
                          <div className="text-sm text-slate-700">{app.contactName}</div>
                          <div className="text-xs text-slate-500">{app.contactEmail}</div>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${
                            app.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                            app.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                            app.status === 'suspended' ? 'bg-slate-100 text-slate-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {app.status === 'pending' && 'Bekliyor'}
                            {app.status === 'approved' && 'Onaylandı'}
                            {app.status === 'suspended' && 'Pasif'}
                            {app.status === 'rejected' && 'Reddedildi'}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-slate-600">
                          {new Date(app.createdAt).toLocaleDateString('tr-TR')}
                        </td>
                        <td className="p-4 text-right space-x-2">
                          {app.status === 'pending' && (
                            <button 
                              onClick={() => handleApproveCorporateApp(app)}
                              className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold hover:bg-emerald-200"
                            >
                              Onayla
                            </button>
                          )}
                          {app.status === 'pending' && (
                            <button 
                              onClick={() => handleRejectCorporateApp(app)}
                              className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-bold hover:bg-red-200"
                            >
                              Reddet
                            </button>
                          )}
                          {app.status === 'approved' && (
                            <button 
                              onClick={() => handleSuspendCorporateApp(app)}
                              className="px-3 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-bold hover:bg-amber-200"
                            >
                              Yayından Kaldır
                            </button>
                          )}
                          <button 
                            onClick={() => handleDeleteCorporateApp(app)}
                            className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-200"
                          >
                            Sil
                          </button>
                        </td>
                      </tr>
                  ))}
                  {corporateApps.filter(app => corporateFilter === 'all' || app.status === corporateFilter).length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-500 text-sm">
                        Bu filtreye uygun kurumsal başvuru bulunamadı.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'invite-requests' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-white p-4 rounded-2xl border border-slate-200">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-600" />
              Hızlı Davetiye Talepleri
            </h2>
          </div>
          
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {inviteRequests.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                Henüz davetiye talebi bulunmuyor.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {inviteRequests.map((req) => (
                  <div key={req.id} className="p-4 hover:bg-slate-50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="font-bold text-slate-800 text-sm">İletişim: <span className="text-blue-600">{req.contact}</span></div>
                      <div className="text-xs text-slate-500 flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(req.createdAt).toLocaleString('tr-TR')}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-lg text-xs font-bold ${req.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {req.status === 'completed' ? 'Tamamlandı' : 'Bekliyor'}
                      </span>
                      {req.status !== 'completed' && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              const isEmail = req.contact.includes('@');
                              const randomCode = Math.random().toString(36).substring(2, 10).toUpperCase();
                              const baseUrl = window.location.origin + '/kurumsal';
                              const params = new URLSearchParams();
                              params.set('inviteCode', randomCode);
                              params.set('sender', 'Yönetici Ekibi');
                              const fullUrl = `${baseUrl}?${params.toString()}`;
                              
                              if (isEmail) {
                                const subject = `Sporpuan Kurumsal Davetiyesi`;
                                const body = `Merhaba,

Tesisinizi Türkiye'nin Spor Değerlendirme ve İnceleme Platformuna eklemek için özel davetiyeniz oluşturuldu.

Aşağıdaki bağlantıya tıklayarak kurumsal başvurunuzu tamamlayabilir ve tesisinizi hemen yayınlayabilirsiniz:

${fullUrl}

İyi çalışmalar,
Sporpuan Yönetimi`;
                                window.open(`mailto:${req.contact}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
                              } else {
                                let phone = req.contact.replace(/[^0-9]/g, '');
                                if (phone.length === 10) phone = '90' + phone;
                                if (phone.length === 11 && phone.startsWith('0')) phone = '90' + phone.substring(1);
                                
                                const text = `Merhaba,

Tesisinizi Türkiye'nin Spor Değerlendirme ve İnceleme Platformuna eklemek için özel davetiyeniz oluşturuldu. Aşağıdaki bağlantıya tıklayarak kurumsal başvurunuzu tamamlayabilir ve tesisinizi hemen yayınlayabilirsiniz:

${fullUrl}`;
                                window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
                              }
                            }}
                            className={`px-3 py-1.5 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 ${req.contact.includes('@') ? 'bg-blue-500 hover:bg-blue-600' : 'bg-emerald-500 hover:bg-emerald-600'}`}
                          >
                            {req.contact.includes('@') ? <Mail className="w-3.5 h-3.5" /> : <MessageSquare className="w-3.5 h-3.5" />}
                            Davetiye Gönder
                          </button>
                          <button
                            onClick={async () => {
                              try {
                                await updateDoc(doc(db, 'corporate_invite_requests', req.id), { status: 'completed' });
                              } catch (e) {
                                console.error(e);
                              }
                            }}
                            className="px-3 py-1.5 bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800 rounded-lg text-xs font-bold transition"
                          >
                            İşaretle
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Basic implementations for other tabs to keep it functional */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500">
          Kullanıcı yönetimi paneli (Basitleştirilmiş görünüm)
        </div>
      )}
      
      {activeTab === 'events' && (
      <>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tesis veya Şehir Ara..."
              value={eventSearchQuery}
              onChange={(e) => setEventSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <select
              value={eventCategoryFilter}
              onChange={(e) => setEventCategoryFilter(e.target.value)}
              className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 outline-none focus:border-blue-500"
            >
              <option value="all">Tüm Kategoriler</option>
              <option value="Spor Tesisleri">Spor Tesisleri</option>
              <option value="Spor Salonları">Spor Salonları</option>
              <option value="Spor Okulları">Spor Okulları</option>
              <option value="Spor Etkinlikleri">Spor Etkinlikleri</option>
            </select>
            <select
              value={eventStatusFilter}
              onChange={(e) => setEventStatusFilter(e.target.value as any)}
              className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 outline-none focus:border-blue-500"
            >
              <option value="all">Tüm Durumlar</option>
              <option value="active">Yayında</option>
              <option value="hidden">Gizli</option>
            </select>
            <button 
              onClick={() => onAddEvent({
                id: Math.random().toString(36).substr(2, 9),
                title: '',
                slug: '',
                category: 'Spor Tesisleri',
                city: '',
                venue: '',
                date: '',
                organizer: '',
                organizerVerified: false,
                image: '',
                description: '',
                overallScore: 0,
                ratingBreakdown: {},
                reviewCount: 0,
                featured: false,
                isActive: true,
                tags: [],
                reviews: []
              })} 
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold flex items-center gap-2 transition"
            >
              <Plus className="w-4 h-4" />
              Yeni Ekle
            </button>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 font-medium">Etkinlik/Tesis</th>
                  <th className="px-4 py-3 font-medium">Kategori</th>
                  <th className="px-4 py-3 font-medium">Şehir</th>
                  <th className="px-4 py-3 font-medium text-center">Durum</th>
                  <th className="px-4 py-3 font-medium text-center">Puan</th>
                  <th className="px-4 py-3 font-medium text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEvents.map(ev => (
                  <tr key={ev.id} className={`hover:bg-slate-50 ${ev.isActive === false ? 'opacity-60 bg-slate-50/50' : ''}`}>
                    <td className="px-4 py-3 font-medium text-slate-800">
                      <div className="flex items-center gap-3">
                        <img src={ev.image || 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?q=80&w=200&auto=format&fit=crop'} alt={ev.title} className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0" />
                        <span className="line-clamp-2">{ev.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{ev.category}</td>
                    <td className="px-4 py-3 text-slate-600">{ev.city}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 text-[10px] font-bold rounded-full ${ev.isActive !== false ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
                        {ev.isActive !== false ? 'Yayında' : 'Gizli'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600 text-center font-bold text-blue-600">
                      {ev.overallScore > 0 ? ev.overallScore.toFixed(1) : '-'}
                    </td>
                    <td className="px-4 py-3 text-right space-x-3">
                      <button 
                        onClick={() => onUpdateEvent({ ...ev, isActive: ev.isActive === false ? true : false })} 
                        className={`${ev.isActive !== false ? 'text-amber-500 hover:text-amber-700' : 'text-emerald-500 hover:text-emerald-700'} font-bold transition`}
                      >
                        {ev.isActive !== false ? 'Gizle' : 'Yayınla'}
                      </button>
                      <button 
                        onClick={() => onEditEvent(ev)} 
                        className="text-blue-500 hover:text-blue-700 font-bold transition"
                      >
                        Düzenle
                      </button>
                      <button 
                        onClick={() => {
                          setConfirmDialog({
                            isOpen: true,
                            message: `"${ev.title}" adlı tesisi silmek istediğinize emin misiniz?`,
                            onConfirm: () => onDeleteEvent(ev.id)
                          });
                        }} 
                        className="text-rose-500 hover:text-rose-700 font-bold transition"
                      >
                        Sil
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredEvents.length === 0 && (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-500">Kayıt bulunamadı.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </>
      )}
      
      {activeTab === 'reviews' && (
      <>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Yorum, Kullanıcı veya Tesis Ara..."
              value={reviewSearchQuery}
              onChange={(e) => setReviewSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <select
              value={reviewFilter}
              onChange={(e) => setReviewFilter(e.target.value as any)}
              className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 outline-none focus:border-blue-500"
            >
              <option value="all">Tüm Durumlar</option>
              <option value="published">Yayında</option>
              <option value="hidden">Gizli</option>
            </select>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 font-medium">Tarih</th>
                  <th className="px-4 py-3 font-medium">Kullanıcı</th>
                  <th className="px-4 py-3 font-medium">Tesis/Etkinlik</th>
                  <th className="px-4 py-3 font-medium text-center">Puan</th>
                  <th className="px-4 py-3 font-medium w-1/3">Yorum</th>
                  <th className="px-4 py-3 font-medium text-center">Durum</th>
                  <th className="px-4 py-3 font-medium text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredReviews.map(rev => (
                  <tr key={rev.id} className={`hover:bg-slate-50 ${rev.status === 'hidden' ? 'opacity-60 bg-slate-50/50' : ''}`}>
                    <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                      {new Date(rev.date).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      <div className="flex items-center gap-2">
                        <img src={rev.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'} alt={rev.userName} className="w-6 h-6 rounded-full object-cover" />
                        <span className="font-medium text-xs">{rev.userName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600 font-medium text-xs">{rev.eventTitle}</td>
                    <td className="px-4 py-3 text-slate-600 text-center font-bold text-amber-500">{rev.rating || rev.overallScore}</td>
                    <td className="px-4 py-3 text-slate-600 text-xs">
                       <p className="line-clamp-2" title={rev.comment}>{rev.comment}</p>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 text-[10px] font-bold rounded-full ${rev.status !== 'hidden' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
                        {rev.status !== 'hidden' ? 'Yayında' : 'Gizli'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button 
                        onClick={() => {
                           const parentEvent = events.find(e => e.id === rev.eventId);
                           if (parentEvent) {
                             const updatedReviews = parentEvent.reviews.map(r => 
                               r.id === rev.id ? { ...r, status: r.status === 'hidden' ? 'published' : 'hidden' } as Review : r
                             );
                             onUpdateEvent({ ...parentEvent, reviews: updatedReviews });
                           }
                        }} 
                        className={`${rev.status !== 'hidden' ? 'text-amber-500 hover:text-amber-700' : 'text-emerald-500 hover:text-emerald-700'} font-bold text-xs transition`}
                      >
                        {rev.status !== 'hidden' ? 'Gizle' : 'Yayınla'}
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredReviews.length === 0 && (
                  <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-500">Değerlendirme bulunamadı.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </>
      )}

      {/* Confirm Dialog Modal */}
      {confirmDialog && confirmDialog.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 relative">
            <h3 className="text-lg font-bold text-slate-800 mb-2">Onay Gerekiyor</h3>
            <p className="text-slate-600 text-sm mb-6">{confirmDialog.message}</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmDialog(null)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 font-bold text-xs hover:bg-slate-50 transition"
              >
                İptal
              </button>
              <button
                onClick={() => {
                  confirmDialog.onConfirm();
                  setConfirmDialog(null);
                }}
                className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold text-xs hover:bg-emerald-700 transition shadow-md shadow-emerald-600/20"
              >
                Onayla
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Prompt Dialog Modal */}
      {promptDialog && promptDialog.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 relative">
            <h3 className="text-lg font-bold text-slate-800 mb-2">Gerekçe / Bilgi</h3>
            <p className="text-slate-600 text-sm mb-4">{promptDialog.message}</p>
            <textarea
              className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"
              rows={3}
              defaultValue={promptDialog.defaultValue}
              id="prompt-input-field"
            ></textarea>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setPromptDialog(null)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 font-bold text-xs hover:bg-slate-50 transition"
              >
                İptal
              </button>
              <button
                onClick={() => {
                  const val = (document.getElementById('prompt-input-field') as HTMLTextAreaElement)?.value || '';
                  promptDialog.onConfirm(val);
                  setPromptDialog(null);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-xs hover:bg-blue-700 transition shadow-md shadow-blue-600/20"
              >
                Gönder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
