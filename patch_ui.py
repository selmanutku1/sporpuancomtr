import re

with open('src/components/AdminPanel.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

events_ui = """
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
"""
# Replace the top of events tab
text = text.replace('{activeTab === \'events\' && (\n        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">', "{activeTab === 'events' && (\n      <>\n" + events_ui)

text = text.replace('{events.map(ev => (', '{filteredEvents.map(ev => (')
text = text.replace('{events.length === 0 && (', '{filteredEvents.length === 0 && (')
# we also need to close the fragment for events tab
text = text.replace('          </div>\n        </div>\n      )}', '          </div>\n        </div>\n      </>\n      )}')


# REVIEWS TAB UI
reviews_ui = """
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
"""

text = text.replace('{activeTab === \'reviews\' && (\n        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">', "{activeTab === 'reviews' && (\n      <>\n" + reviews_ui)
text = text.replace('{allReviews.map(rev => (', '{filteredReviews.map(rev => (')
text = text.replace('{allReviews.length === 0 && (', '{filteredReviews.length === 0 && (')

with open('src/components/AdminPanel.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

