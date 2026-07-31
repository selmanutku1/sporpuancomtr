import React, { useState, useMemo } from 'react';
import { Routes, Route, useNavigate, useParams, useLocation } from 'react-router-dom';
import { INITIAL_EVENTS } from './data/mockEvents';
import { SportsEvent, SportsCategory, Review, UserProfile, UserRole } from './types';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { CategoryFilter } from './components/CategoryFilter';
import { EventCard } from './components/EventCard';
import { EventDetailModal } from './components/EventDetailModal';
import { AddReviewModal } from './components/AddReviewModal';
import { SubmitEventModal } from './components/SubmitEventModal';

import { EventMapView } from './components/EventMapView';
import { EditEventModal } from './components/EditEventModal';
import { AuthModal } from './components/AuthModal';
import { AdminPanel } from './components/AdminPanel';
import { Footer } from './components/Footer';
import { Trophy, SearchX, Sparkles, Filter, PlusCircle, MapPin } from 'lucide-react';
import { CATEGORY_CRITERIA_MAP, calculateOverallScore } from './lib/scoreUtils';

const EventDetailWrapper = ({ 
  events, 
  onRateClick, 
  onLikeReview, 
  currentUser, 
  setEditingEvent 
}: { 
  events: SportsEvent[], 
  onRateClick: (event: SportsEvent) => void, 
  onLikeReview: (eventId: string, reviewId: string) => void, 
  currentUser: UserProfile | null, 
  setEditingEvent: (event: SportsEvent) => void 
}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const event = events.find((e) => e.id === id);

  if (!event) return <div className="p-20 text-center text-xl font-bold">Etkinlik/Tesis bulunamadı.</div>;

  return (
    <EventDetailModal
      event={event}
      onClose={() => navigate('/')}
      onOpenRateForm={onRateClick}
      onLikeReview={onLikeReview}
      onOpenEditModal={
        currentUser?.role === 'admin'
          ? (ev) => setEditingEvent(ev)
          : undefined
      }
    />
  );
};

export default function App() {
  const navigate = useNavigate();

  const [events, setEvents] = useState<SportsEvent[]>(() => {
    const saved = localStorage.getItem('sporpuan_events_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_EVENTS;
      }
    }
    return INITIAL_EVENTS;
  });

  // Save changes to localStorage
  const updateEventsState = (newEvents: SportsEvent[]) => {
    setEvents(newEvents);
    localStorage.setItem('sporpuan_events_v2', JSON.stringify(newEvents));
  };

  // View Mode State
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

  // Filter & Search States
  const [selectedCategory, setSelectedCategory] = useState<SportsCategory>('Tümü');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('Tüm Şehirler');
  const [sortBy, setSortBy] = useState('score-desc');

  // Modal States
  const [rateModalEvent, setRateModalEvent] = useState<SportsEvent | null>(null);
  const [isRateModalOpen, setIsRateModalOpen] = useState(false);
  const [isSubmitEventOpen, setIsSubmitEventOpen] = useState(false);
  const [isMapViewModalOpen, setIsMapViewModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<SportsEvent | null>(null);

  // User Authentication State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('sporpuan_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return {
      id: 'demo-user-1',
      name: 'Ahmet Yılmaz',
      email: 'ahmet@sporsever.com',
      role: 'user',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
      title: 'Kıdemli Tribün Taraftarı',
      createdAt: '2025-01-15',
    };
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('sporpuan_user', JSON.stringify(user));
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('sporpuan_user');
    } catch (e) {
      console.error(e);
    }
  };

  const handleOpenAuthModal = () => {
    setIsAuthModalOpen(true);
  };

  const handleDeleteEvent = (eventId: string) => {
    const updated = events.filter((ev) => ev.id !== eventId);
    updateEventsState(updated);
  };

  const handleUpdateEvent = (updatedEvent: SportsEvent) => {
    const updatedList = events.map((ev) => (ev.id === updatedEvent.id ? updatedEvent : ev));
    updateEventsState(updatedList);
  };

  const handleResetEvents = () => {
    updateEventsState(INITIAL_EVENTS);
  };

  // Extract list of cities
  const cities = useMemo(() => {
    const citySet = new Set<string>();
    events.forEach((e) => citySet.add(e.city));
    return Array.from(citySet).sort();
  }, [events]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<SportsCategory, number> = {
      'Tümü': events.length,
      'Spor Tesisleri': 0,
      'Spor Salonları': 0,
      'Spor Okulları': 0,
      'Spor Etkinlikleri': 0,
    };

    events.forEach((e) => {
      if (counts[e.category] !== undefined) {
        counts[e.category] += 1;
      }
    });

    return counts;
  }, [events]);

  // Filtered & Sorted Events
  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      // Category match
      if (selectedCategory !== 'Tümü' && ev.category !== selectedCategory) {
        return false;
      }

      // City match
      if (selectedCity !== 'Tüm Şehirler' && ev.city !== selectedCity) {
        return false;
      }

      // Search match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const titleMatch = ev.title.toLowerCase().includes(query);
        const venueMatch = ev.venue.toLowerCase().includes(query);
        const orgMatch = ev.organizer.toLowerCase().includes(query);
        const cityMatch = ev.city.toLowerCase().includes(query);
        const catMatch = ev.category.toLowerCase().includes(query);
        const tagMatch = ev.tags.some((t) => t.toLowerCase().includes(query));

        if (!titleMatch && !venueMatch && !orgMatch && !cityMatch && !catMatch && !tagMatch) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'score-desc') return b.overallScore - a.overallScore;
      if (sortBy === 'reviews-desc') return b.reviewCount - a.reviewCount;
      if (sortBy === 'title-asc') return a.title.localeCompare(b.title, 'tr');
      return 0;
    });
  }, [events, selectedCategory, selectedCity, searchQuery, sortBy]);

  // Handle Review Submission
  const handleAddReview = (eventId: string, newReview: Review) => {
    const updated = events.map((ev) => {
      if (ev.id === eventId) {
        const newReviews = [newReview, ...ev.reviews];
        const newReviewCount = ev.reviewCount + 1;

        // Recalculate breakdown averages dynamically based on category
        const newBreakdown: Record<string, number> = {};
        const criteria = CATEGORY_CRITERIA_MAP[ev.category] || CATEGORY_CRITERIA_MAP['Spor Etkinlikleri'];
        
        criteria.forEach(crit => {
          const sum = newReviews.reduce((acc, r) => acc + (r.scores[crit.key] || 0), 0);
          newBreakdown[crit.key] = Math.round((sum / newReviews.length) * 10) / 10;
        });

        const newOverall = calculateOverallScore(newBreakdown, ev.category);

        const updatedEv = {
          ...ev,
          reviews: newReviews,
          reviewCount: newReviewCount,
          ratingBreakdown: newBreakdown,
          overallScore: newOverall,
        };

        return updatedEv;
      }
      return ev;
    });

    updateEventsState(updated);
  };

  // Handle New Event Submission
  const handleAddNewEvent = (newEvent: SportsEvent) => {
    const updated = [newEvent, ...events];
    updateEventsState(updated);
  };

  // Handle Like Review
  const handleLikeReview = (eventId: string, reviewId: string) => {
    const updated = events.map((ev) => {
      if (ev.id === eventId) {
        const newReviews = ev.reviews.map((r) => {
          if (r.id === reviewId) {
            return { ...r, likes: r.likes + 1 };
          }
          return r;
        });
        const updatedEv = { ...ev, reviews: newReviews };
        return updatedEv;
      }
      return ev;
    });
    updateEventsState(updated);
  };

  // Open Rate Modal for specific event
  const handleRateClick = (event: SportsEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    setRateModalEvent(event);
    setIsRateModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased flex flex-col pb-16 md:pb-0 selection:bg-blue-600 selection:text-white">
      
      {/* Navigation Header */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        onOpenAddReview={() => {
          setRateModalEvent(events[0] || null);
          setIsRateModalOpen(true);
        }}
        onOpenSubmitEvent={() => setIsSubmitEventOpen(true)}
        onOpenMapView={() => setIsMapViewModalOpen(true)}
        currentUser={currentUser}
        onOpenAuthModal={handleOpenAuthModal}
        onLogout={handleLogout}
        cities={cities}
      />

      {/* Main Content */}
      <main className="flex-1 w-full bg-slate-50 relative pt-2">
        <Routes>
          <Route path="/tesis/:id" element={
            <EventDetailWrapper 
              events={events}
              onRateClick={(ev) => {
                setRateModalEvent(ev);
                setIsRateModalOpen(true);
              }}
              onLikeReview={handleLikeReview}
              currentUser={currentUser}
              setEditingEvent={setEditingEvent}
            />
          } />
          
          <Route path="/admin" element={
            <AdminPanel 
              events={events}
              onDeleteEvent={handleDeleteEvent}
              onEditEvent={setEditingEvent}
              onUpdateEvent={handleUpdateEvent}
            />
          } />
          
          <Route path="/" element={
            <>
              {/* Hero Section */}
              <HeroBanner
                onOpenAddReview={() => {
                  setRateModalEvent(events[0] || null);
                  setIsRateModalOpen(true);
                }}
                onOpenMapView={() => setIsMapViewModalOpen(true)}
                onSelectTopCategory={(tag) => setSearchQuery(tag)}
              />

              {/* Categories Bar & Sorting */}
              <CategoryFilter
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                categoryCounts={categoryCounts}
                sortBy={sortBy}
                setSortBy={setSortBy}
                viewMode={viewMode}
                setViewMode={setViewMode}
              />

              {/* Render either Map View or Grid View based on viewMode */}
              {viewMode === 'map' ? (
                <div className="py-6">
                  <EventMapView
                    events={events}
                    onSelectEvent={(ev) => navigate('/tesis/' + ev.id)}
                    selectedCategory={selectedCategory}
                    onSelectCategory={setSelectedCategory}
                    selectedCity={selectedCity}
                    onSelectCity={setSelectedCity}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                  />
                </div>
              ) : (
                /* Events Grid Section */
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                  
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                        <span>
                          {selectedCategory === 'Tümü' ? 'Tüm Sonuçlar' : selectedCategory}
                        </span>
                        <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded-full font-mono font-bold">
                          {filteredEvents.length} Kayıt
                        </span>
                      </h2>
                    </div>

                    <button
                      onClick={() => setIsSubmitEventOpen(true)}
                      className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-3.5 py-2 rounded-lg transition shadow-sm"
                    >
                      <PlusCircle className="w-4 h-4 text-white" />
                      <span>Kayıt Ekle</span>
                    </button>
                  </div>

                  {filteredEvents.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
                      <SearchX className="w-12 h-12 text-slate-400 mx-auto" />
                      <h3 className="text-lg font-bold text-slate-800">Aradığınız kriterlere uygun sonuç bulunamadı</h3>
                      <p className="text-xs text-slate-500 max-w-md mx-auto">
                        Farklı bir arama kelimesi yazabilir, şehir filtresini değiştirebilir veya kendi spor kurumunuzu sporpuan'a ekleyebilirsiniz.
                      </p>
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedCategory('Tümü');
                          setSelectedCity('Tüm Şehirler');
                        }}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition"
                      >
                        Tüm Filtreleri Temizle
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredEvents.map((event) => (
                        <EventCard
                          key={event.id}
                          event={event}
                          onSelectEvent={(ev) => {
                            window.scrollTo(0, 0);
                            navigate('/tesis/' + ev.id);
                          }}
                          onRateClick={handleRateClick}
                        />
                      ))}
                    </div>
                  )}
                </section>
              )}
            </>
          } />
        </Routes>
      </main>

      {/* Footer */}
      <Footer />

      {/* MODALS */}
      {/* 2. Rate / Add Review Modal */}
      {isRateModalOpen && (
        <AddReviewModal
          events={events}
          selectedEvent={rateModalEvent}
          onClose={() => setIsRateModalOpen(false)}
          onSubmitReview={handleAddReview}
          currentUser={currentUser}
          onOpenAuthModal={() => handleOpenAuthModal()}
        />
      )}

      {/* 3. Submit New Event Modal */}
      {isSubmitEventOpen && (
        <SubmitEventModal
          categories={[
            'Tümü',
            'Spor Tesisleri',
            'Spor Salonları',
            'Spor Okulları',
            'Spor Etkinlikleri',
          ]}
          onClose={() => setIsSubmitEventOpen(false)}
          onAddEvent={handleAddNewEvent}
          currentUser={currentUser}
          onOpenAuthModal={() => handleOpenAuthModal()}
        />
      )}

      {/* 6. Standalone Map View Modal */}
      {isMapViewModalOpen && (
        <EventMapView
          events={events}
          onSelectEvent={(ev) => {
            setIsMapViewModalOpen(false);
            window.scrollTo(0, 0);
            navigate('/tesis/' + ev.id);
          }}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          selectedCity={selectedCity}
          onSelectCity={setSelectedCity}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isModal={true}
          onCloseModal={() => setIsMapViewModalOpen(false)}
        />
      )}


      {/* 9. Edit Event Modal */}
      {editingEvent && (
        <EditEventModal
          event={editingEvent}
          onClose={() => setEditingEvent(null)}
          onUpdateEvent={handleUpdateEvent}
          categories={[
            'Tümü',
            'Spor Tesisleri',
            'Spor Salonları',
            'Spor Okulları',
            'Spor Etkinlikleri',
          ]}
        />
      )}

      {/* 10. Auth Modal (Giriş & Kayıt) */}
      {isAuthModalOpen && (
        <AuthModal
          onClose={() => setIsAuthModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

    </div>
  );
}
