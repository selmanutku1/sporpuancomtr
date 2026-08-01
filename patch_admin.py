import re

with open('src/components/AdminPanel.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Add new states
filter_states = """
  // Event Filters
  const [eventSearchQuery, setEventSearchQuery] = useState('');
  const [eventCategoryFilter, setEventCategoryFilter] = useState('all');
  const [eventStatusFilter, setEventStatusFilter] = useState<'all' | 'active' | 'hidden'>('all');
"""
text = text.replace("  // Filters", filter_states + "\n  // Filters")

# Add filteredEvents
filtered_events = """
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
"""

text = text.replace("  const allReviews = useMemo(() => {", filtered_events + "\n  const allReviews = useMemo(() => {")

# Add reviewSearchQuery
text = text.replace("  const [reviewFilter, setReviewFilter] = useState<'all' | 'published' | 'pending' | 'hidden'>('all');", "  const [reviewFilter, setReviewFilter] = useState<'all' | 'published' | 'pending' | 'hidden'>('all');\n  const [reviewSearchQuery, setReviewSearchQuery] = useState('');")

# Add filteredReviews
filtered_reviews = """
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
"""
text = text.replace("  // Filters", filtered_reviews + "\n  // Filters")

with open('src/components/AdminPanel.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

