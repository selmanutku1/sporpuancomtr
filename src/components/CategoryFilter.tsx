import React from 'react';
import { SportsCategory } from '../types';
import { 
  Trophy, 
  Activity, 
  Dumbbell, 
  Flame, 
  Zap, 
  Compass, 
  Flag, 
  Baby, 
  Layers,
  LayoutGrid,
  MapPin
} from 'lucide-react';

interface CategoryFilterProps {
  selectedCategory: SportsCategory;
  onSelectCategory: (cat: SportsCategory) => void;
  categoryCounts: Record<SportsCategory, number>;
  sortBy: string;
  setSortBy: (sort: string) => void;
  viewMode: 'grid' | 'map';
  setViewMode: (mode: 'grid' | 'map') => void;
}

const CATEGORIES_CONFIG: { category: SportsCategory; icon: React.ReactNode }[] = [
  { category: 'Tümü', icon: <Layers className="w-4 h-4" /> },
  { category: 'Futbol', icon: <Activity className="w-4 h-4" /> },
  { category: 'Basketbol', icon: <Trophy className="w-4 h-4" /> },
  { category: 'Maraton & Koşu', icon: <Flame className="w-4 h-4" /> },
  { category: 'Voleybol', icon: <Zap className="w-4 h-4" /> },
  { category: 'Doğa & Extreme', icon: <Compass className="w-4 h-4" /> },
  { category: 'Fitness & CrossFit', icon: <Dumbbell className="w-4 h-4" /> },
  { category: 'Motor Sporları', icon: <Flag className="w-4 h-4" /> },
  { category: 'Çocuk & Gençlik', icon: <Baby className="w-4 h-4" /> },
];

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
  categoryCounts,
  sortBy,
  setSortBy,
  viewMode,
  setViewMode,
}) => {
  return (
    <div className="bg-white border-b border-slate-200 py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        
        {/* Category Pills Slider */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none w-full md:w-auto">
          {CATEGORIES_CONFIG.map(({ category, icon }) => {
            const isSelected = selectedCategory === category;
            const count = categoryCounts[category] || 0;

            return (
              <button
                key={category}
                onClick={() => onSelectCategory(category)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 shrink-0 ${
                  isSelected
                    ? 'bg-blue-600 text-white font-bold shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:text-slate-900 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                <span className={isSelected ? 'text-white' : 'text-blue-600'}>
                  {icon}
                </span>
                <span>{category}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                    isSelected
                      ? 'bg-blue-800 text-white font-bold'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* View Mode Toggle & Sort dropdown */}
        <div className="flex items-center justify-between md:justify-end gap-3 text-xs text-slate-500 w-full md:w-auto shrink-0 flex-wrap sm:flex-nowrap pt-1 md:pt-0 border-t border-slate-100 md:border-t-0">
          
          {/* Grid vs Map Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs transition ${
                viewMode === 'grid'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Liste</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs transition ${
                viewMode === 'map'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Harita Modu</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-700 hidden sm:inline">Sıralama:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white text-slate-800 border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:border-blue-500 font-bold text-xs cursor-pointer shadow-2xs"
            >
              <option value="score-desc">En Yüksek Puan (SporPuan)</option>
              <option value="reviews-desc">En Çok Yorum Alanlar</option>
              <option value="date-asc">Yaklaşan Etkinlikler</option>
              <option value="title-asc">A-Z İsim</option>
            </select>
          </div>

        </div>

      </div>
    </div>
  );
};
