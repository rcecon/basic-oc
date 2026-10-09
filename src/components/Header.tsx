import React from 'react';
import { LevelId } from '../types/economics';

interface HeaderProps {
  currentMode: 'practise' | 'builder' | 'challenge' | 'mistakes';
  onChangeMode: (mode: 'practise' | 'builder' | 'challenge' | 'mistakes') => void;
  currentLevel: LevelId;
  onChangeLevel: (level: LevelId) => void;
  onGenerateNew: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentMode,
  onChangeMode,
  currentLevel,
  onChangeLevel,
  onGenerateNew
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-xs border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center">
          <button
            onClick={() => onChangeMode('practise')}
            className="text-left group cursor-pointer focus:outline-hidden"
          >
            <span className="text-base font-bold tracking-tight text-stone-900 group-hover:text-amber-900 transition-colors whitespace-nowrap">
              DSE Opportunity Cost Mastery
            </span>
          </button>
        </div>

        {/* Zone 2: 4 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600">
          <button
            onClick={() => onChangeMode('practise')}
            className={`transition-colors py-1 cursor-pointer ${
              currentMode === 'practise'
                ? 'text-stone-900 font-bold border-b-2 border-stone-900'
                : 'hover:text-stone-900'
            }`}
          >
            1. Practise
          </button>
          <button
            onClick={() => onChangeMode('builder')}
            className={`transition-colors py-1 cursor-pointer ${
              currentMode === 'builder'
                ? 'text-stone-900 font-bold border-b-2 border-stone-900'
                : 'hover:text-stone-900'
            }`}
          >
            2. Answer Builder
          </button>
          <button
            onClick={() => onChangeMode('challenge')}
            className={`transition-colors py-1 cursor-pointer ${
              currentMode === 'challenge'
                ? 'text-stone-900 font-bold border-b-2 border-stone-900'
                : 'hover:text-stone-900'
            }`}
          >
            3. DSE Challenge
          </button>
          <button
            onClick={() => onChangeMode('mistakes')}
            className={`transition-colors py-1 cursor-pointer ${
              currentMode === 'mistakes'
                ? 'text-stone-900 font-bold border-b-2 border-stone-900'
                : 'hover:text-stone-900'
            }`}
          >
            Review Mistakes
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          {/* Level selector */}
          <div className="flex items-center gap-1.5 bg-stone-100 border border-stone-300 rounded-lg px-2.5 py-1 text-xs">
            <span className="text-stone-500 font-medium whitespace-nowrap">Level:</span>
            <select
              value={currentLevel}
              onChange={(e) => onChangeLevel(Number(e.target.value) as LevelId)}
              className="bg-transparent font-bold text-stone-900 focus:outline-hidden cursor-pointer"
            >
              <option value={1}>1: Direct Forgone</option>
              <option value={2}>2: Chosen vs Forgone</option>
              <option value={3}>3: Non-First Chosen</option>
              <option value={4}>4: Third Option ("May")</option>
              <option value={5}>5: Necessarily</option>
            </select>
          </div>

          <button
            onClick={onGenerateNew}
            className="hidden sm:inline-flex px-3.5 py-1.5 text-xs font-semibold text-stone-800 bg-stone-200/80 hover:bg-stone-300 border border-stone-300 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
          >
            New Scenario
          </button>
        </div>
      </div>

      {/* Mobile nav bar */}
      <div className="flex md:hidden overflow-x-auto px-4 py-2 border-t border-stone-200 bg-stone-50/60 gap-4 text-xs font-medium text-stone-600 no-scrollbar">
        <button
          onClick={() => onChangeMode('practise')}
          className={`whitespace-nowrap ${currentMode === 'practise' ? 'font-bold text-stone-900' : ''}`}
        >
          1. Practise
        </button>
        <button
          onClick={() => onChangeMode('builder')}
          className={`whitespace-nowrap ${currentMode === 'builder' ? 'font-bold text-stone-900' : ''}`}
        >
          2. Answer Builder
        </button>
        <button
          onClick={() => onChangeMode('challenge')}
          className={`whitespace-nowrap ${currentMode === 'challenge' ? 'font-bold text-stone-900' : ''}`}
        >
          3. Challenge
        </button>
        <button
          onClick={() => onChangeMode('mistakes')}
          className={`whitespace-nowrap ${currentMode === 'mistakes' ? 'font-bold text-stone-900' : ''}`}
        >
          Review Mistakes
        </button>
      </div>
    </header>
  );
};
