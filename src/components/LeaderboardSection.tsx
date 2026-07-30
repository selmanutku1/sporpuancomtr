import React from 'react';
import { SportsEvent } from '../types';
import { Trophy, Star, Medal, Award, BadgeCheck, Flame, ChevronRight, X } from 'lucide-react';

interface LeaderboardSectionProps {
  events: SportsEvent[];
  onSelectEvent: (event: SportsEvent) => void;
  onCloseModal?: () => void;
  isModal?: boolean;
}

export const LeaderboardSection: React.FC<LeaderboardSectionProps> = ({
  events,
  onSelectEvent,
  onCloseModal,
  isModal = false,
}) => {
  const sortedByScore = [...events].sort((a, b) => b.overallScore - a.overallScore).slice(0, 5);

  // Group organizers
  const organizerStats: Record<string, { name: string; count: number; totalScore: number; verified: boolean }> = {};
  events.forEach((e) => {
    if (!organizerStats[e.organizer]) {
      organizerStats[e.organizer] = {
        name: e.organizer,
        count: 0,
        totalScore: 0,
        verified: e.organizerVerified,
      };
    }
    organizerStats[e.organizer].count += 1;
    organizerStats[e.organizer].totalScore += e.overallScore;
  });

  const topOrganizers = Object.values(organizerStats)
    .map((o) => ({ ...o, avgScore: o.totalScore / o.count }))
    .sort((a, b) => b.avgScore - a.avgScore)
    .slice(0, 5);

  const content = (
    <div className="space-y-8">
      
      {/* Title */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center font-bold shadow-2xs">
            <Trophy className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900">SporPuan Zirvedekiler & Liderlik Tablosu</h2>
            <p className="text-xs text-slate-500">Türkiye'nin en yüksek puan alan spor etkinlikleri ve organizatörleri</p>
          </div>
        </div>

        {isModal && onCloseModal && (
          <button
            onClick={onCloseModal}
            className="p-2 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Top Events Left */}
        <div className="lg:col-span-7 bg-white border border-slate-200 shadow-sm rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Medal className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold text-slate-800 uppercase tracking-wider">
              Ayın En Yüksek Puanlı Spor Etkinlikleri
            </h3>
          </div>

          <div className="space-y-3">
            {sortedByScore.map((event, index) => (
              <div
                key={event.id}
                onClick={() => onSelectEvent(event)}
                className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-blue-50/70 border border-slate-200 hover:border-blue-300 rounded-xl transition cursor-pointer group shadow-2xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-lg font-black text-sm flex items-center justify-center shrink-0 ${
                      index === 0
                        ? 'bg-amber-400 text-slate-950 shadow-sm'
                        : index === 1
                        ? 'bg-slate-300 text-slate-900'
                        : index === 2
                        ? 'bg-amber-700 text-white'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    #{index + 1}
                  </div>

                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-12 h-12 rounded-lg object-cover shrink-0 border border-slate-200"
                  />

                  <div className="min-w-0">
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm truncate group-hover:text-blue-600 transition-colors">
                      {event.title}
                    </h4>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {event.category} • {event.city}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 pl-2">
                  <div className="bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-lg font-black text-xs flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-blue-600 text-blue-600" />
                    <span>{event.overallScore.toFixed(1)}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Organizers Right */}
        <div className="lg:col-span-5 bg-white border border-slate-200 shadow-sm rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-800 uppercase tracking-wider">
              En Başarılı Organizatörler
            </h3>
          </div>

          <div className="space-y-3">
            {topOrganizers.map((org, idx) => (
              <div
                key={org.name}
                className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-slate-400 w-5">
                    0{idx + 1}.
                  </span>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-slate-800 text-xs sm:text-sm">{org.name}</span>
                      {org.verified && <BadgeCheck className="w-3.5 h-3.5 text-blue-600" />}
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium">{org.count} Etkinlik Kaydı</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-black text-blue-600 block">
                    {org.avgScore.toFixed(1)} / 10
                  </span>
                  <span className="text-[9px] text-slate-500 font-medium">Ort. Puan</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
        <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-4xl p-6 overflow-y-auto max-h-[90vh] shadow-2xl my-auto text-slate-800">
          {content}
        </div>
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {content}
    </section>
  );
};
