import React, { useEffect, useState, useMemo } from 'react';
import { UserProfile, SportsEvent, UserRole, Review } from '../types';
import { db } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Users, ShieldCheck, Mail, Calendar, Search, Edit3, Trash2, CalendarDays, LayoutDashboard, Star, Trophy, MessageSquare } from 'lucide-react';
import { calculateOverallScore } from '../lib/scoreUtils';

interface AdminPanelProps {
  events: SportsEvent[];
  onDeleteEvent: (id: string) => void;
  onEditEvent: (event: SportsEvent) => void;
  onUpdateEvent: (event: SportsEvent) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ events, onDeleteEvent, onEditEvent, onUpdateEvent }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'events' | 'reviews'>('overview');
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const usersData: UserProfile[] = [];
      querySnapshot.forEach((doc) => {
        usersData.push(doc.data() as UserProfile);
      });
      setUsers(usersData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching users:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      await updateDoc(doc(db, 'users', userId), { role: newRole });
    } catch (error) {
      console.error("Rol güncellenirken hata oluştu:", error);
      alert("Rol güncellenirken bir hata oluştu.");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Bu kullanıcıyı silmek istediğinize emin misiniz?')) {
      try {
        await deleteDoc(doc(db, 'users', userId));
        alert('Kullanıcı başarıyla silindi.');
      } catch (error) {
        console.error("Kullanıcı silinirken hata oluştu:", error);
        alert("Kullanıcı silinirken bir hata oluştu. Lütfen konsolu kontrol edin.");
      }
    }
  };

  const handleDeleteReview = (eventId: string, reviewId: string) => {
    if (window.confirm('Bu değerlendirmeyi silmek istediğinize emin misiniz?')) {
      const event = events.find(e => e.id === eventId);
      if (event) {
        const updatedReviews = event.reviews.filter(r => r.id !== reviewId);
        
        // Recalculate scores
        let newOverall = 0;
        let newBreakdown: any = {};
        
        if (updatedReviews.length > 0) {
          const allCriteria = new Set<string>();
          updatedReviews.forEach(r => Object.keys(r.scores).forEach(c => allCriteria.add(c)));
          
          allCriteria.forEach(criteria => {
            const sum = updatedReviews.reduce((acc, r) => acc + (r.scores[criteria] || 0), 0);
            newBreakdown[criteria] = Number((sum / updatedReviews.length).toFixed(1));
          });
          newOverall = calculateOverallScore(newBreakdown, event.category);
        }

        const updatedEvent = {
          ...event,
          reviews: updatedReviews,
          reviewCount: updatedReviews.length,
          overallScore: newOverall,
          ratingBreakdown: newBreakdown
        };

        onUpdateEvent(updatedEvent);
        alert('Değerlendirme başarıyla silindi.');
      }
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.venue.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const allReviews = useMemo(() => {
    const reviews: { review: Review, event: SportsEvent }[] = [];
    events.forEach(event => {
      if (event.reviews) {
        event.reviews.forEach(review => {
          reviews.push({ review, event });
        });
      }
    });
    return reviews.sort((a, b) => new Date(b.review.date).getTime() - new Date(a.review.date).getTime());
  }, [events]);

  const filteredReviews = allReviews.filter(item => 
    item.review.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.review.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.event.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Statistics
  const stats = useMemo(() => {
    const totalReviews = events.reduce((acc, event) => acc + (event.reviews?.length || 0), 0);
    const avgScore = events.length > 0 
      ? (events.reduce((acc, event) => acc + event.overallScore, 0) / events.length).toFixed(1) 
      : '0.0';
    const totalOrganizers = users.filter(u => u.role === 'organizer').length;

    return {
      totalUsers: users.length,
      totalOrganizers,
      totalEvents: events.length,
      totalReviews,
      avgScore
    };
  }, [users, events]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-blue-600" />
            Yönetici Paneli
          </h1>
          <p className="text-slate-500 font-medium mt-1">Platforma kayıtlı tüm kullanıcıları, etkinlikleri ve istatistikleri yönetin.</p>
        </div>
        
        {activeTab !== 'overview' && (
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={
                activeTab === 'users' ? "Kullanıcı ara..." : 
                activeTab === 'events' ? "Etkinlik ara..." : 
                "Değerlendirme ara..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
            />
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-slate-200 mb-8 overflow-x-auto pb-px">
        <button
          onClick={() => { setActiveTab('overview'); setSearchQuery(''); }}
          className={`flex items-center gap-2 px-4 py-3 font-bold text-sm transition-colors whitespace-nowrap border-b-2 ${
            activeTab === 'overview' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          Genel Bakış
        </button>
        <button
          onClick={() => { setActiveTab('users'); setSearchQuery(''); }}
          className={`flex items-center gap-2 px-4 py-3 font-bold text-sm transition-colors whitespace-nowrap border-b-2 ${
            activeTab === 'users' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          Kullanıcılar ({users.length})
        </button>
        <button
          onClick={() => { setActiveTab('events'); setSearchQuery(''); }}
          className={`flex items-center gap-2 px-4 py-3 font-bold text-sm transition-colors whitespace-nowrap border-b-2 ${
            activeTab === 'events' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <CalendarDays className="w-4 h-4" />
          Etkinlikler ({events.length})
        </button>
        <button
          onClick={() => { setActiveTab('reviews'); setSearchQuery(''); }}
          className={`flex items-center gap-2 px-4 py-3 font-bold text-sm transition-colors whitespace-nowrap border-b-2 ${
            activeTab === 'reviews' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          Değerlendirmeler ({allReviews.length})
        </button>
      </div>

      {/* Content */}
      <div className="animate-fade-in">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Toplam</span>
              </div>
              <div className="text-3xl font-black text-slate-900 mb-1">{stats.totalUsers}</div>
              <div className="text-sm text-slate-500 font-medium">Platform Kullanıcısı</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                  <Trophy className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Onaylı</span>
              </div>
              <div className="text-3xl font-black text-slate-900 mb-1">{stats.totalOrganizers}</div>
              <div className="text-sm text-slate-500 font-medium">Organizatör & Tesis</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <CalendarDays className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Kayıtlı</span>
              </div>
              <div className="text-3xl font-black text-slate-900 mb-1">{stats.totalEvents}</div>
              <div className="text-sm text-slate-500 font-medium">Etkinlik & Tesis</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Star className="w-6 h-6 fill-amber-600" />
                </div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sistem</span>
              </div>
              <div className="flex items-end gap-2 mb-1">
                <div className="text-3xl font-black text-slate-900">{stats.totalReviews}</div>
                <div className="text-sm font-bold text-slate-500 mb-1">/ {stats.avgScore} Ort.</div>
              </div>
              <div className="text-sm text-slate-500 font-medium">Toplam Değerlendirme</div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                  <tr>
                    <th className="px-6 py-4">Kullanıcı</th>
                    <th className="px-6 py-4">Rol / Ünvan</th>
                    <th className="px-6 py-4">Kayıt Tarihi</th>
                    <th className="px-6 py-4 text-right">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-slate-500 font-medium">
                        Kullanıcılar yükleniyor...
                      </td>
                    </tr>
                  ) : filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-slate-500 font-medium">
                        Kullanıcı bulunamadı.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img 
                              src={user.avatar} 
                              alt={user.name} 
                              className="w-10 h-10 rounded-full object-cover border border-slate-200"
                            />
                            <div>
                              <div className="font-bold text-slate-900">{user.name}</div>
                              <div className="text-slate-500 flex items-center gap-1 mt-0.5 text-xs">
                                <Mail className="w-3 h-3" />
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-2">
                            <select 
                              value={user.role}
                              onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                              className={`text-xs font-bold rounded-lg px-2 py-1 border outline-none cursor-pointer ${
                                user.role === 'admin' ? 'bg-purple-100 text-purple-700 border-purple-200' :
                                user.role === 'organizer' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                                'bg-blue-100 text-blue-700 border-blue-200'
                              }`}
                            >
                              <option value="user" className="bg-white text-slate-900">Sporsever</option>
                              <option value="organizer" className="bg-white text-slate-900">Organizatör</option>
                              <option value="admin" className="bg-white text-slate-900">Yönetici</option>
                            </select>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 text-slate-600 font-medium text-xs">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => handleDeleteUser(user.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Kullanıcıyı Sil"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'events' && (
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                  <tr>
                    <th className="px-6 py-4">Etkinlik/Tesis Adı</th>
                    <th className="px-6 py-4">Kategori</th>
                    <th className="px-6 py-4">Konum</th>
                    <th className="px-6 py-4">Puan / Yorum</th>
                    <th className="px-6 py-4 text-right">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredEvents.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-500 font-medium">
                        Etkinlik bulunamadı.
                      </td>
                    </tr>
                  ) : (
                    filteredEvents.map((event) => (
                      <tr key={event.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img 
                              src={event.image} 
                              alt={event.title} 
                              className="w-12 h-12 rounded-lg object-cover border border-slate-200"
                            />
                            <div>
                              <div className="font-bold text-slate-900 line-clamp-1">{event.title}</div>
                              <div className="text-slate-500 text-xs mt-0.5">Organizatör: {event.organizer}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                            {event.category}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            <span className="font-bold text-slate-700">{event.city}</span>
                            <span className="text-xs text-slate-500">{event.venue}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1.5 font-bold text-blue-600">
                              <span className="text-amber-500">★</span> {event.overallScore.toFixed(1)}
                            </div>
                            <span className="text-xs text-slate-500">{event.reviewCount} Değerlendirme</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => onEditEvent(event)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Düzenle"
                            >
                              <Edit3 className="w-5 h-5" />
                            </button>
                            <button 
                              onClick={() => {
                                if (window.confirm('Bu etkinliği silmek istediğinize emin misiniz?')) {
                                  onDeleteEvent(event.id);
                                  alert('Etkinlik başarıyla silindi.');
                                }
                              }}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              title="Sil"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {activeTab === 'reviews' && (
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                  <tr>
                    <th className="px-6 py-4">Kullanıcı</th>
                    <th className="px-6 py-4">Etkinlik/Tesis</th>
                    <th className="px-6 py-4">Yorum</th>
                    <th className="px-6 py-4">Puan / Tarih</th>
                    <th className="px-6 py-4 text-right">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredReviews.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-500 font-medium">
                        Değerlendirme bulunamadı.
                      </td>
                    </tr>
                  ) : (
                    filteredReviews.map(({review, event}) => (
                      <tr key={review.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img 
                              src={review.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'} 
                              alt={review.userName} 
                              className="w-10 h-10 rounded-full object-cover border border-slate-200"
                            />
                            <div className="font-bold text-slate-900">{review.userName}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1 max-w-[200px] overflow-hidden text-ellipsis">
                            <span className="font-bold text-slate-700 truncate">{event.title}</span>
                            <span className="text-xs text-slate-500 bg-slate-100 rounded px-1.5 py-0.5 w-fit">{event.category}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-slate-600 max-w-xs overflow-hidden text-ellipsis whitespace-normal line-clamp-2" title={review.comment}>
                            "{review.comment}"
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1.5 font-bold text-amber-600">
                              <Star className="w-3.5 h-3.5 fill-amber-500" /> {review.overallScore.toFixed(1)}
                            </div>
                            <span className="text-xs text-slate-500">{new Date(review.date).toLocaleDateString('tr-TR')}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => handleDeleteReview(event.id, review.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Yorumu Sil"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
