const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = `const EventDetailWrapper = ({
  events,
  onRateClick,
  onLikeReview,
  currentUser,
  setEditingEvent,
  onUpdateEvent,
  onToggleFavorite,
  isLoading
   onRateClick,
   onLikeReview,
   currentUser,
   setEditingEvent,
  onUpdateEvent,
  isLoading}: {
   events: SportsEvent[],
   onRateClick: (event: SportsEvent) => void,
   onLikeReview: (eventId: string, reviewId: string) => void,
   currentUser: UserProfile | null,
   setEditingEvent: (event: SportsEvent) => void,`;

const replacement = `const EventDetailWrapper = ({
  events,
  onRateClick,
  onLikeReview,
  currentUser,
  setEditingEvent,
  onUpdateEvent,
  onToggleFavorite,
  isLoading
}: {
  events: SportsEvent[],
  onRateClick: (event: SportsEvent) => void,
  onLikeReview: (eventId: string, reviewId: string) => void,
  currentUser: UserProfile | null,
  setEditingEvent: (event: SportsEvent) => void,
  onUpdateEvent: (event: SportsEvent) => void,
  onToggleFavorite: (eventId: string) => void,
  isLoading?: boolean
}) => {
`;

// Wait, I will just do a string search and replace from "const EventDetailWrapper = ({" down to "}) => {"
const startIdx = content.indexOf('const EventDetailWrapper = ({');
const endIdx = content.indexOf('}) => {', startIdx) + '}) => {'.length;
content = content.substring(0, startIdx) + replacement + content.substring(endIdx);

fs.writeFileSync('src/App.tsx', content);
