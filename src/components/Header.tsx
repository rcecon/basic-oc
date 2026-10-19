import React from 'react';
import { LevelId } from '../types/economics';

interface HeaderProps {
  currentMode: 'practise' | 'builder' | 'challenge' | 'mistakes';
  onChangeMode: (mode: 'practise' | 'builder' | 'challenge' | 'mistakes') => void;
  currentLevel: LevelId;
  onChangeLevel: (level: LevelId) => void;
  onGenerateNew: () => void;
  mistakeCount?: number;
}

export const LEVELS_CONFIG: { id: LevelId; label: string }[] = [
  { id: 1, label: 'Level 1' },
  { id: 2, label: 'Level 2' },
  { id: 3, label: 'Level 3' },
  { id: 4, label: 'Level 4' },
  { id: 5, label: 'Level 5' },
];

export const Header: React.FC<HeaderProps> = ({
  currentMode,
  onChangeMode,
  currentLevel,
  onChangeLevel,
  onGenerateNew,
  mistakeCount = 0
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-xs border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center shrink-0">
          <button
            onClick={() => {
              if (currentMode === 'mistakes') onChangeMode('practise');
            }}
            className="text-left group cursor-pointer focus:outline-hidden"
          >
            <span className="text-sm sm:text-base font-bold tracking-tight text-stone-900 group-hover:text-amber-900 transition-colors whitespace-nowrap">
              DSE Opportunity Cost
            </span>
          </button>
        </div>

        {/* Zone 2: 5 Level navigation buttons (Level 1 - 5) */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-1.5">
          {LEVELS_CONFIG.map((lvl) => {
            const isActive = currentLevel === lvl.id && currentMode !== 'mistakes';
            return (
              <button
                key={lvl.id}
                onClick={() => {
                  onChangeLevel(lvl.id);
                  if (currentMode === 'mistakes') {
                    onChangeMode('practise');
                  }
                }}
                className={`px-3 py-1.5 rounded-lg text-xs lg:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-stone-900 text-white font-bold shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
                title={lvl.label}
              >
                <span>{lvl.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Review Mistakes & New Scenario */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onChangeMode('mistakes')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              currentMode === 'mistakes'
                ? 'bg-amber-900 text-white font-bold shadow-xs'
                : 'text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-300'
            }`}
            title="Review mistakes and misconceptions"
          >
            <span>Review Mistakes</span>
            {mistakeCount > 0 && (
              <span className={`px-1.5 py-0.2 text-[10px] rounded-full font-bold ${
                currentMode === 'mistakes' ? 'bg-amber-800 text-white' : 'bg-red-500 text-white'
              }`}>
                {mistakeCount}
              </span>
            )}
          </button>

          <button
            onClick={onGenerateNew}
            className="hidden sm:inline-flex px-3.5 py-1.5 text-xs font-semibold text-stone-800 bg-amber-100/90 hover:bg-amber-200 border border-amber-300 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
            title="Switch to another scenario in this level"
          >
            New Scenario
          </button>
        </div>
      </div>

      {/* Mobile nav bar: Level 1 - 5 + Review Mistakes */}
      <div className="flex md:hidden overflow-x-auto px-4 py-2 border-t border-stone-200 bg-stone-50/80 gap-2 text-xs font-medium text-stone-600 no-scrollbar">
        {LEVELS_CONFIG.map((lvl) => {
          const isActive = currentLevel === lvl.id && currentMode !== 'mistakes';
          return (
            <button
              key={lvl.id}
              onClick={() => {
                onChangeLevel(lvl.id);
                if (currentMode === 'mistakes') {
                  onChangeMode('practise');
                }
              }}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer text-xs font-semibold ${
                isActive
                  ? 'bg-stone-900 text-white font-bold shadow-2xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-200'
              }`}
            >
              {lvl.label}
            </button>
          );
        })}
        <button
          onClick={() => onChangeMode('mistakes')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer text-xs font-semibold flex items-center gap-1 ${
            currentMode === 'mistakes'
              ? 'bg-amber-900 text-white font-bold shadow-2xs'
              : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-200'
          }`}
        >
          <span>Review Mistakes</span>
          {mistakeCount > 0 && (
            <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-red-500 text-white font-bold">
              {mistakeCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
