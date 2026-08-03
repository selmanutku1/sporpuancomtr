const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const target = `  const handleUpdateEvent = async (updatedEvent: SportsEvent) => {
    const updatedList = events.map((ev) => (ev.id === updatedEvent.id ? updatedEvent : ev));
    updateEventsState(updatedList);

    try {`;

const replacement = `  const handleUpdateEvent = async (updatedEvent: SportsEvent) => {
    const isNew = !events.some(ev => ev.id === updatedEvent.id);
    const updatedList = isNew 
      ? [updatedEvent, ...events] 
      : events.map((ev) => (ev.id === updatedEvent.id ? updatedEvent : ev));
    updateEventsState(updatedList);

    try {`;

if (content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync('src/App.tsx', content);
  console.log('App.tsx Updated');
} else {
  console.log('Target not found in App.tsx');
}

let adminContent = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');
const adminTarget = `onClick={() => onAddEvent({
                  id: Math.random().toString(36).substr(2, 9),
                  title: '',
                  slug: '',
                  category: 'Spor Tesisleri',
                  city: '',
                  venue: '',
                  date: '',
                  organizer: 'Doğrulanmış Spor Tesisi',
                  organizerVerified: true,
                  image: '',
                  description: '',
                  overallScore: 0,
                  ratingBreakdown: {},
                  reviewCount: 0,
                  featured: false,
                  isActive: true,
                  tags: [],
                  reviews: []
                })}`;
const adminReplacement = `onClick={() => onEditEvent({
                  id: Math.random().toString(36).substr(2, 9),
                  title: '',
                  slug: '',
                  category: 'Spor Tesisleri',
                  city: '',
                  venue: '',
                  date: '',
                  organizer: 'Doğrulanmış Spor Tesisi',
                  organizerVerified: true,
                  image: '',
                  description: '',
                  overallScore: 0,
                  ratingBreakdown: {},
                  reviewCount: 0,
                  featured: false,
                  isActive: true,
                  tags: [],
                  reviews: []
                })}`;

if (adminContent.includes(adminTarget)) {
  adminContent = adminContent.replace(adminTarget, adminReplacement);
  fs.writeFileSync('src/components/AdminPanel.tsx', adminContent);
  console.log('AdminPanel.tsx Updated');
} else {
  console.log('Target not found in AdminPanel.tsx');
}
