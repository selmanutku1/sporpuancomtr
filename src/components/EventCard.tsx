import React from 'react';
import { SportsEvent } from '../types';
import { getScoreBadgeColor, getScoreLabel, CATEGORY_CRITERIA_MAP } from '../lib/scoreUtils';
import { 
  MapPin, 
  Calendar, 
  MessageSquare, 
  BadgeCheck, 
  Ticket, 
  Star, 
  ChevronRight,
  Sparkles,
  Trophy
} from 'lucide-react';

interface EventCardProps {
  event: SportsEvent;
  onSelectEvent: (event: SportsEvent) => void;
  onRateClick: (event: SportsEvent, e: React.MouseEvent) => void;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onSelectEvent,
  onRateClick,
}) => {
  const scoreBadge = getScoreBadgeColor(event.overallScore);

  return (
    <div
      onClick={() => onSelectEvent(event)}
      className="group bg-white hover:bg-slate-50/80 border border-slate-200 hover:border-blue-400 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col cursor-pointer transform hover:-translate-y-1"
    >
      {/* Top Image Banner */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/10 transition-colors" />

        {/* Category Badge Top Left */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-white/95 text-blue-800 border border-blue-200 px-2.5 py-1 rounded-lg text-xs font-bold shadow-sm">
          <Trophy className="w-3.5 h-3.5 text-blue-600" />
          <span>{event.category}</span>
        </div>

        {/* SporPuan Rating Badge Top Right */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          <div className="px-3 py-1.5 rounded-xl text-sm font-black tracking-tight shadow-md flex items-center gap-1 bg-blue-600 text-white border border-blue-500">
            <Star className="w-4 h-4 fill-amber-300 text-amber-300" />
            <span>{event.overallScore.toFixed(1)}</span>
            <span className="text-[10px] font-normal opacity-90">/10</span>
          </div>
        </div>

        {/* Featured Tag */}
        {event.featured && (
          <div className="absolute bottom-3 left-3 bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded shadow">
            Öne Çıkan {event.category === 'Spor Okulları' ? 'Okul' : event.category === 'Spor Salonları' ? 'Salon' : event.category === 'Spor Tesisleri' ? 'Tesis' : 'Etkinlik'}
          </div>
        )}

        {/* City & Venue Overlay Bottom */}
        <div className="absolute bottom-3 right-3 text-slate-800 text-xs font-bold flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md border border-slate-200/80 shadow-2xs">
          <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span className="truncate max-w-[140px]">{event.city}</span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        
        <div>
          {/* Organizer Info & Source Provider */}
          <div className="flex items-center justify-between gap-1.5 text-xs text-slate-500 mb-1.5">
            <div className="flex items-center gap-1.5">
              <span>Organizatör:</span>
              <span className="font-semibold text-slate-800">{event.organizer}</span>
              {event.organizerVerified && (
                <BadgeCheck className="w-4 h-4 text-blue-600 inline" title="Onaylı Organizatör" />
              )}
            </div>

            {event.sourceProvider && (
              <span className="text-[10px] font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.5 rounded shrink-0">
                ⚡ {event.sourceProvider}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
            {event.title}
          </h3>

          {/* Date & Venue */}
          <div className="mt-2.5 space-y-1 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span className="font-medium">{event.date} {event.time && `• ${event.time}`}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span className="truncate font-medium">{event.venue}</span>
            </div>
          </div>
        </div>

        {/* Dynamic Criteria Preview Bar */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2 text-[11px]">
          {(CATEGORY_CRITERIA_MAP[event.category] || []).slice(0, 3).map(crit => (
            <div key={crit.key} className="flex justify-between text-slate-700 font-medium">
              <span>{crit.label}:</span>
              <span className="font-bold text-blue-600">
                {(event.ratingBreakdown[crit.key] || 0).toFixed(1)}/10
              </span>
            </div>
          ))}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {event.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md border border-slate-200"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <div className="flex items-center gap-1 font-semibold text-slate-700">
              <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
              <span>{event.reviewCount} Yorum</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={(e) => onRateClick(event, e)}
              className="px-2.5 py-1.5 text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors shadow-2xs"
            >
              Puanla
            </button>
            <div className="p-1.5 text-slate-400 group-hover:text-blue-300 group-hover:translate-x-1 transition-all">
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
