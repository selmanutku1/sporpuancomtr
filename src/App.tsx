import React, { useState, useMemo } from 'react';
import { INITIAL_EVENTS } from './data/mockEvents';
import { SportsEvent, SportsCategory, Review, AiAnalysisData, UserProfile, UserRole } from './types';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { CategoryFilter } from './components/CategoryFilter';
import { EventCard } from './components/EventCard';
import { EventDetailModal } from './components/EventDetailModal';
import { AddReviewModal } from './components/AddReviewModal';
import { SubmitEventModal } from './components/SubmitEventModal';
import { AiAdvisorModal } from './components/AiAdvisorModal';
import { LeaderboardSection } from './components/LeaderboardSection';
import { EventMapView } from './components/EventMapView';
import { AutoSyncModal } from './components/AutoSyncModal';
import { EventAdminModal } from './components/EventAdminModal';
import { EditEventModal } from './components/EditEventModal';
import { AuthModal } from './components/AuthModal';
import { performWebSync } from './services/syncEngine';
import { Footer } from './components/Footer';
import { Trophy, SearchX, Sparkles, Filter, PlusCircle, MapPin } from 'lucide-react';

export default function App() {
  const [events, setEvents] = useState<SportsEvent[]>(() => {
    const saved = localStorage.getItem('sporpuan_events');
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
    localStorage.setItem('sporpuan_events', JSON.stringify(newEvents));
  };

  // View Mode State
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

  // Filter & Search States
  const [selectedCategory, setSelectedCategory] = useState<SportsCategory>('Tümü');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('Tüm Şehirler');
  const [sortBy, setSortBy] = useState('score-desc');

  // Modal States
  const [activeDetailEvent, setActiveDetailEvent] = useState<SportsEvent | null>(null);
  const [rateModalEvent, setRateModalEvent] = useState<SportsEvent | null>(null);
  const [isRateModalOpen, setIsRateModalOpen] = useState(false);
  const [isSubmitEventOpen, setIsSubmitEventOpen] = useState(false);
  const [isAiAdvisorOpen, setIsAiAdvisorOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isMapViewModalOpen, setIsMapViewModalOpen] = useState(false);
  const [isAutoSyncOpen, setIsAutoSyncOpen] = useState(false);
  const [isAutoSyncEnabled, setIsAutoSyncEnabled] = useState(true);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
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
  const [authModalRole, setAuthModalRole] = useState<UserRole>('user');

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

  const handleOpenAuthModal = (role: UserRole = 'user') => {
    setAuthModalRole(role);
    setIsAuthModalOpen(true);
  };

  const handleDeleteEvent = (eventId: string) => {
    const updated = events.filter((ev) => ev.id !== eventId);
    updateEventsState(updated);
  };

  const handleUpdateEvent = (updatedEvent: SportsEvent) => {
    const updatedList = events.map((ev) => (ev.id === updatedEvent.id ? updatedEvent : ev));
    updateEventsState(updatedList);
    if (activeDetailEvent && activeDetailEvent.id === updatedEvent.id) {
      setActiveDetailEvent(updatedEvent);
    }
  };

  const handleResetEvents = () => {
    updateEventsState(INITIAL_EVENTS);
  };

  // Auto Sync Effect - Synchronizes live sports events automatically
  React.useEffect(() => {
    if (!isAutoSyncEnabled) return;

    const timer = setTimeout(() => {
      const result = performWebSync(events);
      if (result.addedCount > 0) {
        updateEventsState([...events, ...result.newEvents]);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [isAutoSyncEnabled]);

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
      'Futbol': 0,
      'Basketbol': 0,
      'Maraton & Koşu': 0,
      'Voleybol': 0,
      'Doğa & Extreme': 0,
      'Fitness & CrossFit': 0,
      'Motor Sporları': 0,
      'Çocuk & Gençlik': 0,
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

        // Recalculate breakdown averages
        const sumOrg = newReviews.reduce((acc, r) => acc + r.scores.organization, 0);
        const sumAtm = newReviews.reduce((acc, r) => acc + r.scores.atmosphere, 0);
        const sumVal = newReviews.reduce((acc, r) => acc + r.scores.valueForMoney, 0);
        const sumAme = newReviews.reduce((acc, r) => acc + r.scores.amenities, 0);
        const sumAcc = newReviews.reduce((acc, r) => acc + r.scores.accessibility, 0);

        const newBreakdown = {
          organization: Math.round((sumOrg / newReviews.length) * 10) / 10,
          atmosphere: Math.round((sumAtm / newReviews.length) * 10) / 10,
          valueForMoney: Math.round((sumVal / newReviews.length) * 10) / 10,
          amenities: Math.round((sumAme / newReviews.length) * 10) / 10,
          accessibility: Math.round((sumAcc / newReviews.length) * 10) / 10,
        };

        const newOverall = Math.round(
          (newBreakdown.organization * 0.25 +
            newBreakdown.atmosphere * 0.25 +
            newBreakdown.valueForMoney * 0.20 +
            newBreakdown.amenities * 0.15 +
            newBreakdown.accessibility * 0.15) * 10
        ) / 10;

        const updatedEv = {
          ...ev,
          reviews: newReviews,
          reviewCount: newReviewCount,
          ratingBreakdown: newBreakdown,
          overallScore: newOverall,
        };

        if (activeDetailEvent && activeDetailEvent.id === eventId) {
          setActiveDetailEvent(updatedEv);
        }

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
        if (activeDetailEvent && activeDetailEvent.id === eventId) {
          setActiveDetailEvent(updatedEv);
        }
        return updatedEv;
      }
      return ev;
    });
    updateEventsState(updated);
  };

  // Handle Apply AI Analysis
  const handleApplyAiAnalysis = (eventId: string, analysis: AiAnalysisData) => {
    const updated = events.map((ev) => {
      if (ev.id === eventId) {
        return {
          ...ev,
          overallScore: Math.round(analysis.overallScore * 10) / 10,
          ratingBreakdown: analysis.scores,
          aiAnalysis: analysis,
        };
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
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased flex flex-col selection:bg-blue-600 selection:text-white">
      
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
        onOpenAiAdvisor={() => setIsAiAdvisorOpen(true)}
        onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
        onOpenMapView={() => setIsMapViewModalOpen(true)}
        onOpenAutoSync={() => setIsAutoSyncOpen(true)}
        onOpenAdminPanel={() => setIsAdminPanelOpen(true)}
        currentUser={currentUser}
        onOpenAuthModal={handleOpenAuthModal}
        onLogout={handleLogout}
        cities={cities}
      />

      {/* Main Content */}
      <main className="flex-1">
        
        {/* Hero Section */}
        <HeroBanner
          onOpenAiAdvisor={() => setIsAiAdvisorOpen(true)}
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
              onSelectEvent={setActiveDetailEvent}
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
                  <Trophy className="w-5 h-5 text-amber-500" />
                  <span>
                    {selectedCategory === 'Tümü' ? 'Tüm Spor Etkinlikleri' : `${selectedCategory} Etkinlikleri`}
                  </span>
                  <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded-full font-mono font-bold">
                    {filteredEvents.length} Kayıt
                  </span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Kullanıcı oyları ve 5 boyutlu SporPuan skoruna göre sıralanmıştır
                </p>
              </div>

              <button
                onClick={() => setIsSubmitEventOpen(true)}
                className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-3.5 py-2 rounded-lg transition shadow-sm"
              >
                <PlusCircle className="w-4 h-4 text-white" />
                <span>Etkinlik Kaydet</span>
              </button>
            </div>

            {filteredEvents.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <SearchX className="w-12 h-12 text-slate-400 mx-auto" />
                <h3 className="text-lg font-bold text-slate-800">Aradığınız kriterlere uygun etkinlik bulunamadı</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Farklı bir arama kelimesi yazabilir, şehir filtresini değiştirebilir veya kendi spor etkinliğinizi sporpuan'a ekleyebilirsiniz.
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
                    onSelectEvent={setActiveDetailEvent}
                    onRateClick={handleRateClick}
                  />
                ))}
              </div>
            )}

          </section>
        )}

        {/* Leaderboard Section */}
        <LeaderboardSection
          events={events}
          onSelectEvent={setActiveDetailEvent}
        />

      </main>

      {/* Footer */}
      <Footer />

      {/* MODALS */}
      {/* 1. Detail Modal */}
      {activeDetailEvent && (
        <EventDetailModal
          event={activeDetailEvent}
          onClose={() => setActiveDetailEvent(null)}
          onOpenRateForm={(ev) => {
            setRateModalEvent(ev);
            setIsRateModalOpen(true);
          }}
          onLikeReview={handleLikeReview}
          onOpenAiAdvisor={() => setIsAiAdvisorOpen(true)}
          onOpenEditModal={(ev) => setEditingEvent(ev)}
        />
      )}

      {/* 2. Rate / Add Review Modal */}
      {isRateModalOpen && (
        <AddReviewModal
          events={events}
          selectedEvent={rateModalEvent}
          onClose={() => setIsRateModalOpen(false)}
          onSubmitReview={handleAddReview}
          currentUser={currentUser}
          onOpenAuthModal={() => handleOpenAuthModal('user')}
        />
      )}

      {/* 3. Submit New Event Modal */}
      {isSubmitEventOpen && (
        <SubmitEventModal
          categories={[
            'Tümü',
            'Futbol',
            'Basketbol',
            'Maraton & Koşu',
            'Voleybol',
            'Doğa & Extreme',
            'Fitness & CrossFit',
            'Motor Sporları',
            'Çocuk & Gençlik',
          ]}
          onClose={() => setIsSubmitEventOpen(false)}
          onAddEvent={handleAddNewEvent}
          currentUser={currentUser}
          onOpenAuthModal={() => handleOpenAuthModal('organizer')}
        />
      )}

      {/* 4. AI Advisor Modal */}
      {isAiAdvisorOpen && (
        <AiAdvisorModal
          events={events}
          onClose={() => setIsAiAdvisorOpen(false)}
          onApplyAiAnalysis={handleApplyAiAnalysis}
        />
      )}

      {/* 5. Standalone Leaderboard Modal */}
      {isLeaderboardOpen && (
        <LeaderboardSection
          events={events}
          onSelectEvent={(ev) => {
            setIsLeaderboardOpen(false);
            setActiveDetailEvent(ev);
          }}
          isModal={true}
          onCloseModal={() => setIsLeaderboardOpen(false)}
        />
      )}

      {/* 6. Standalone Map View Modal */}
      {isMapViewModalOpen && (
        <EventMapView
          events={events}
          onSelectEvent={(ev) => {
            setIsMapViewModalOpen(false);
            setActiveDetailEvent(ev);
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

      {/* 7. Auto Sync Modal */}
      <AutoSyncModal
        isOpen={isAutoSyncOpen}
        onClose={() => setIsAutoSyncOpen(false)}
        events={events}
        onSyncComplete={(newEvs) => updateEventsState([...events, ...newEvs])}
        isAutoSyncEnabled={isAutoSyncEnabled}
        setIsAutoSyncEnabled={setIsAutoSyncEnabled}
      />

      {/* 8. Event Management Admin Modal */}
      {isAdminPanelOpen && (
        <EventAdminModal
          onClose={() => setIsAdminPanelOpen(false)}
          events={events}
          onDeleteEvent={handleDeleteEvent}
          onEditEvent={(ev) => setEditingEvent(ev)}
          onResetEvents={handleResetEvents}
          onOpenSubmitEvent={() => setIsSubmitEventOpen(true)}
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
            'Futbol',
            'Basketbol',
            'Maraton & Koşu',
            'Voleybol',
            'Doğa & Extreme',
            'Fitness & CrossFit',
            'Motor Sporları',
            'Çocuk & Gençlik',
          ]}
        />
      )}

      {/* 10. Auth Modal (Giriş & Kayıt) */}
      {isAuthModalOpen && (
        <AuthModal
          onClose={() => setIsAuthModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
          initialRole={authModalRole}
        />
      )}

    </div>
  );
}
