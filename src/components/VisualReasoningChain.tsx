import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, AlertCircle, ArrowDown, GitFork, Sparkles } from 'lucide-react';
import { DSEQuestion } from '../types/economics';

interface VisualReasoningChainProps {
  question: DSEQuestion;
  currentStepIndex?: number; // active step in guided mode
  interactiveMode?: boolean;
}

export const VisualReasoningChain: React.FC<VisualReasoningChainProps> = ({
  question,
  interactiveMode = true
}) => {
  const [activeBranch, setActiveBranch] = useState<'yes' | 'no'>('yes');
  const summary = question.reasoningSummary;
  const isThirdOptionCase = summary.affectsThird;

  return (
    <div className="bg-white border border-stone-200/80 rounded-xl p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-100">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-600" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-700">
            DSE Economic Reasoning Chain (經濟推論鏈)
          </h3>
        </div>
        <span className="text-[11px] text-stone-500">
          Opportunity Cost = Value of Highest-Valued Option Forgone
        </span>
      </div>

      {!isThirdOptionCase ? (
        /* STANDARD 4-STAGE REASONING CHAIN */
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 relative">
          {/* Stage 1: Chosen Option */}
          <div className="p-3.5 bg-stone-50 rounded-lg border border-stone-200 flex flex-col justify-between">
            <div>
              <div className="text-[10px] font-semibold uppercase text-stone-500 mb-1">
                1. Chosen Option (所選)
              </div>
              <div className="font-semibold text-stone-900 text-sm leading-snug">
                {summary.chosenOptionName}
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-stone-200/60 text-[11px] text-stone-600">
              {summary.affectsChosen ? (
                <span className="text-amber-800 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 text-amber-600 shrink-0" />
                  Value changed, but cost depends on forgone option!
                </span>
              ) : (
                <span className="text-stone-500">Subject of the question</span>
              )}
            </div>
          </div>

          {/* Stage 2: Highest-Valued Option Forgone */}
          <div className="p-3.5 bg-stone-50 rounded-lg border border-stone-200 flex flex-col justify-between relative">
            <div>
              <div className="text-[10px] font-semibold uppercase text-stone-500 mb-1">
                2. Highest-Valued Forgone (放棄)
              </div>
              <div className="font-semibold text-stone-900 text-sm leading-snug">
                {summary.initialForgoneOptionName}
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-stone-200/60 text-[11px] text-stone-600">
              The single best alternative surrendered
            </div>
          </div>

          {/* Stage 3: Value of Forgone Option */}
          <div className={`p-3.5 rounded-lg border flex flex-col justify-between ${
            summary.affectsForgone 
              ? 'bg-amber-50/60 border-amber-200' 
              : 'bg-stone-50 border-stone-200'
          }`}>
            <div>
              <div className="text-[10px] font-semibold uppercase text-stone-500 mb-1">
                3. Forgone Value Shift (價值變動)
              </div>
              <div className="font-semibold text-sm leading-snug text-stone-900">
                {summary.affectsForgone ? (
                  question.valueChange === 'increase' ? (
                    <span className="text-emerald-800 font-bold flex items-center gap-1">
                      Value Increases (價值 ↑)
                    </span>
                  ) : (
                    <span className="text-rose-800 font-bold flex items-center gap-1">
                      Value Decreases (價值 ↓)
                    </span>
                  )
                ) : (
                  <span className="text-stone-700 font-medium">
                    Remains Unchanged (價值不變)
                  </span>
                )}
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-stone-200/60 text-[11px] text-stone-600">
              {summary.affectsForgone
                ? `Directly affected by event`
                : `Forgone option is unaffected`}
            </div>
          </div>

          {/* Stage 4: Opportunity Cost Conclusion */}
          <div className="p-3.5 bg-stone-900 text-white rounded-lg border border-stone-900 flex flex-col justify-between">
            <div>
              <div className="text-[10px] font-semibold uppercase text-stone-400 mb-1">
                4. Opportunity Cost (機會成本)
              </div>
              <div className="font-bold text-sm leading-snug text-amber-200">
                {summary.finalCostChange === 'decreases' && 'Decreases (減少)'}
                {summary.finalCostChange === 'increases' && 'Increases (增加)'}
                {summary.finalCostChange === 'remains_unchanged' && 'Remains Unchanged (保持不變)'}
                {summary.finalCostChange === 'may_increase' && 'May Increase (可能增加)'}
                {summary.finalCostChange === 'not_necessarily_unchanged' && 'Does NOT necessarily remain unchanged'}
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-stone-800 text-[11px] text-stone-300">
              Matches forgone option value
            </div>
          </div>
        </div>
      ) : (
        /* THIRD OPTION BRANCHING REASONING CHAIN (LEVEL 3 & 4) */
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Box 1: Chosen */}
            <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
              <div className="text-[10px] font-semibold uppercase text-stone-500 mb-0.5">Chosen Option</div>
              <div className="font-semibold text-stone-900 text-sm">{summary.chosenOptionName}</div>
            </div>

            {/* Box 2: Current Forgone */}
            <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
              <div className="text-[10px] font-semibold uppercase text-stone-500 mb-0.5">Current Highest Forgone</div>
              <div className="font-semibold text-stone-900 text-sm">{summary.initialForgoneOptionName}</div>
            </div>

            {/* Box 3: Third Option Event */}
            <div className="p-3 bg-amber-50/70 rounded-lg border border-amber-200">
              <div className="text-[10px] font-semibold uppercase text-amber-900 mb-0.5">Third Option Value Shift</div>
              <div className="font-semibold text-stone-900 text-sm">{summary.affectedOptionName} (Value ↑)</div>
            </div>
          </div>

          {/* Decision Node */}
          <div className="p-4 bg-stone-50/80 rounded-xl border border-stone-300">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <GitFork className="w-4 h-4 text-stone-700" />
                <span className="text-xs font-semibold text-stone-800">
                  Critical Test: Does Third Option value exceed Current Forgone Option?
                </span>
              </div>
              {interactiveMode && (
                <div className="flex items-center gap-1 bg-stone-200 p-0.5 rounded-lg text-xs">
                  <button
                    onClick={() => setActiveBranch('yes')}
                    className={`px-3 py-1 font-medium rounded-md transition-colors ${
                      activeBranch === 'yes'
                        ? 'bg-white text-stone-900 shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    Condition YES (Exceeds)
                  </button>
                  <button
                    onClick={() => setActiveBranch('no')}
                    className={`px-3 py-1 font-medium rounded-md transition-colors ${
                      activeBranch === 'no'
                        ? 'bg-white text-stone-900 shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    Condition NO (Still Lower)
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-stone-200">
              {/* Branch YES */}
              <div className={`p-3 rounded-lg border transition-all ${
                activeBranch === 'yes' 
                  ? 'bg-emerald-50/90 border-emerald-300 ring-1 ring-emerald-300' 
                  : 'bg-white border-stone-200 opacity-60'
              }`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-emerald-900">Branch 1: Value &gt; Current Forgone</span>
                  <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">NEW FORGONE</span>
                </div>
                <p className="text-xs text-stone-700">
                  Third option becomes the <strong>new highest-valued option forgone</strong>.
                </p>
                <div className="mt-2 text-xs font-semibold text-emerald-800">
                  → Opportunity cost increases
                </div>
              </div>

              {/* Branch NO */}
              <div className={`p-3 rounded-lg border transition-all ${
                activeBranch === 'no' 
                  ? 'bg-stone-100 border-stone-400 ring-1 ring-stone-400' 
                  : 'bg-white border-stone-200 opacity-60'
              }`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-stone-900">Branch 2: Value ≤ Current Forgone</span>
                  <span className="text-[10px] font-semibold text-stone-700 bg-stone-200 px-1.5 py-0.5 rounded">UNCHANGED</span>
                </div>
                <p className="text-xs text-stone-700">
                  Current forgone option remains the highest-valued option forgone.
                </p>
                <div className="mt-2 text-xs font-semibold text-stone-800">
                  → Opportunity cost remains unchanged
                </div>
              </div>
            </div>

            {/* DSE Synthesis */}
            <div className="mt-3 pt-3 border-t border-stone-200 flex items-center justify-between text-xs">
              <span className="text-stone-600">
                Synthesis for DSE: Since both outcomes are possible depending on the exact value increase...
              </span>
              <span className="font-bold text-stone-900 bg-amber-100/70 px-2 py-0.5 rounded shrink-0">
                {question.type === 'TYPE_E' ? 'Cost MAY increase' : 'Does NOT necessarily remain unchanged'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Explanatory summary footer */}
      <div className="mt-3 pt-3 border-t border-stone-100 flex items-center gap-2 text-xs text-stone-600">
        <Sparkles className="w-3.5 h-3.5 text-amber-700 shrink-0" />
        <span><strong>Key Takeaway:</strong> {summary.explanationSummary}</span>
      </div>
    </div>
  );
};
