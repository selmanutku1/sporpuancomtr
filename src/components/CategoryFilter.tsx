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

const CATEGORIES_CONFIG: { category: SportsCategory; label: string; icon: React.ReactNode }[] = [
  { category: 'Tümü', label: 'Tümü', icon: <Layers className="w-3.5 h-3.5" /> },
  { category: 'Spor Tesisleri', label: 'Tesisler', icon: <MapPin className="w-3.5 h-3.5" /> },
  { category: 'Spor Salonları', label: 'Salonlar', icon: <Dumbbell className="w-3.5 h-3.5" /> },
  { category: 'Spor Okulları', label: 'Okullar', icon: <Baby className="w-3.5 h-3.5" /> },
  { category: 'Spor Etkinlikleri', label: 'Etkinlikler', icon: <Trophy className="w-3.5 h-3.5" /> },
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
    <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-1 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-1">
        
        {/* Category Pills Slider */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none w-full md:w-auto">
          {CATEGORIES_CONFIG.map(({ category, label, icon }) => {
            const isSelected = selectedCategory === category;
            const count = categoryCounts[category] || 0;

            return (
              <button
                key={category}
                onClick={() => onSelectCategory(category)}
                className={`group flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all duration-200 shrink-0 ${
                  isSelected
                    ? 'bg-blue-600 dark:bg-blue-500 text-white font-bold shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-blue-700 dark:hover:text-white hover:bg-blue-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                }`}
              >
                <span className={isSelected ? 'text-white' : 'text-blue-600 dark:text-blue-400'}>
                  {icon}
                </span>
                <span>{label}</span>
                <span
                  className={`text-[9px] px-1 py-0 rounded-full font-mono transition-colors ${
                    isSelected
                      ? 'bg-blue-800 dark:bg-blue-700 text-white font-bold'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 group-hover:bg-blue-200 group-hover:text-blue-800 dark:group-hover:bg-slate-600 dark:group-hover:text-white'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* View Mode Toggle & Sort dropdown */}
        <div className="flex items-center justify-between md:justify-end gap-3 text-xs text-slate-500 dark:text-slate-400 w-full md:w-auto shrink-0 flex-wrap sm:flex-nowrap pt-1 md:pt-0 border-t border-slate-100 dark:border-slate-800 md:border-t-0">
          
          {/* Grid vs Map Toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1 px-2 py-1 rounded-md font-semibold text-[11px] transition ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3 h-3" />
              <span>Liste</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-1 px-2 py-1 rounded-md font-semibold text-[11px] transition ${
                viewMode === 'map'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <MapPin className="w-3 h-3" />
              <span>Harita</span>
            </button>
          </div>

          <div className="flex items-center gap-1">
            <span className="font-semibold text-slate-700 dark:text-slate-300 hidden sm:inline text-[11px]">Sırala:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 focus:outline-none focus:border-blue-500 font-semibold text-[11px] cursor-pointer shadow-2xs"
            >
              <option value="score-desc" className="bg-white dark:bg-slate-800">En Yüksek Puan (Sporpuan)</option>
              <option value="reviews-desc" className="bg-white dark:bg-slate-800">En Çok Yorum Alanlar</option>
              <option value="date-asc" className="bg-white dark:bg-slate-800">Yaklaşan Etkinlikler</option>
              <option value="title-asc" className="bg-white dark:bg-slate-800">A-Z İsim</option>
            </select>
          </div>

        </div>

      </div>
    </div>
  );
};
