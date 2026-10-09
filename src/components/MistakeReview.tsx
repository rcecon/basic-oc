import React from 'react';
import { AlertCircle, CheckCircle, Target, ArrowRight, RotateCcw, Brain, ShieldAlert } from 'lucide-react';
import { MistakeRecord } from '../types/economics';

interface MistakeReviewProps {
  mistakes: MistakeRecord[];
  onPracticeTopic: (level: number) => void;
  onClearMistakes: () => void;
}

export const MistakeReview: React.FC<MistakeReviewProps> = ({
  mistakes,
  onPracticeTopic,
  onClearMistakes
}) => {
  // Aggregate mistakes by misconception type
  const counts: Record<string, number> = {
    CHOSEN_OPTION_FALLACY: 0,
    THIRD_OPTION_AUTOMATIC_CHANGE: 0,
    WRONG_FORGONE_OPTION: 0,
    NECESSARILY_ONE_SIDED: 0,
    FORGOT_VALUE_LINK: 0
  };

  mistakes.forEach(m => {
    if (counts[m.misconceptionType] !== undefined) {
      counts[m.misconceptionType]++;
    }
  });

  const misconceptionCards = [
    {
      type: 'CHOSEN_OPTION_FALLACY',
      title: 'Chosen Option Fallacy (所選選項價值混淆)',
      description: 'Believing that if the chosen option becomes more or less enjoyable, its opportunity cost must change.',
      cure: 'Rule: Opportunity cost depends SOLELY on the highest-valued option forgone. The chosen option\'s own value change has ZERO effect on opportunity cost.',
      recommendedLevel: 2,
      count: counts.CHOSEN_OPTION_FALLACY
    },
    {
      type: 'WRONG_FORGONE_OPTION',
      title: 'Forgone Option Misidentification (放棄選項辨識錯誤)',
      description: 'Defaulting to "the 2nd option is always forgone" or confusing the chosen option with the forgone option.',
      cure: 'Rule: The chosen option is what you selected. The highest-valued option forgone is the single best alternative you gave up.',
      recommendedLevel: 3,
      count: counts.WRONG_FORGONE_OPTION
    },
    {
      type: 'THIRD_OPTION_AUTOMATIC_CHANGE',
      title: 'Third Option Automatic Change (第三選項直接影響謬誤)',
      description: 'Concluding that opportunity cost increases just because a 3rd option\'s value went up.',
      cure: 'Rule: Always check whether the 3rd option\'s value exceeds the current highest-valued option forgone. If not, opportunity cost is unchanged!',
      recommendedLevel: 4,
      count: counts.THIRD_OPTION_AUTOMATIC_CHANGE
    },
    {
      type: 'NECESSARILY_ONE_SIDED',
      title: 'Overlooking "Necessarily" Two-Branch Logic (忽視「必然」雙重條件)',
      description: 'Failing to test both possibilities when questions ask "Explain whether ... necessarily remains unchanged".',
      cure: 'Rule: To reject "necessarily", show that under one condition cost is unchanged, but under another condition it changes. Therefore, it does NOT necessarily remain unchanged.',
      recommendedLevel: 5,
      count: counts.NECESSARILY_ONE_SIDED
    }
  ];

  return (
    <div className="bg-white border border-stone-200/90 rounded-xl overflow-hidden shadow-xs">
      <div className="px-6 py-4 border-b border-stone-200 bg-stone-50/70 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-amber-800" />
          <div>
            <h3 className="text-sm font-semibold text-stone-900">
              DSE Misconception Diagnostic & Weak Point Review
            </h3>
            <p className="text-xs text-stone-500">
              Target the specific reasoning gaps holding back your DSE Level 5 grade
            </p>
          </div>
        </div>

        {mistakes.length > 0 && (
          <button
            onClick={onClearMistakes}
            className="text-xs text-stone-500 hover:text-stone-800 flex items-center gap-1 font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset History</span>
          </button>
        )}
      </div>

      <div className="p-6 space-y-6">
        {/* Status banner */}
        <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Diagnostic Summary
            </span>
            <div className="text-sm font-medium text-stone-900 mt-0.5">
              {mistakes.length === 0 ? (
                <span className="text-emerald-800 flex items-center gap-1.5 font-semibold">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  No recurring misconceptions detected yet! Keep practicing.
                </span>
              ) : (
                <span>
                  Recorded <strong>{mistakes.length}</strong> reasoning slip{mistakes.length > 1 ? 's' : ''} during your recent sessions.
                </span>
              )}
            </div>
          </div>
          <span className="text-xs text-stone-500">
            Form 4 DSE Focus
          </span>
        </div>

        {/* Misconception Diagnostic Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {misconceptionCards.map(item => (
            <div
              key={item.type}
              className={`p-5 rounded-xl border transition-all flex flex-col justify-between ${
                item.count > 0
                  ? 'bg-amber-50/40 border-amber-300 ring-1 ring-amber-300'
                  : 'bg-white border-stone-200'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-semibold text-stone-900 text-sm">
                    {item.title}
                  </h4>
                  {item.count > 0 ? (
                    <span className="text-[10px] font-bold text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded shrink-0">
                      {item.count} Mistake{item.count > 1 ? 's' : ''}
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium text-stone-400 bg-stone-100 px-2 py-0.5 rounded shrink-0">
                      Mastered
                    </span>
                  )}
                </div>

                <p className="text-xs text-stone-600 leading-relaxed">
                  {item.description}
                </p>

                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 text-xs text-stone-800 font-medium leading-relaxed">
                  {item.cure}
                </div>
              </div>

              <div className="pt-4 mt-3 border-t border-stone-100 flex items-center justify-between">
                <span className="text-xs text-stone-500">
                  Targeted at Level {item.recommendedLevel}
                </span>
                <button
                  onClick={() => onPracticeTopic(item.recommendedLevel)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-stone-900 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-lg transition-colors flex items-center gap-1"
                >
                  <span>Practice Level {item.recommendedLevel}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
