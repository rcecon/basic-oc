import React, { useState } from 'react';
import { CheckCircle2, Sparkles, BookOpen, ArrowRight, RotateCcw, Copy, Check, Edit3, Award } from 'lucide-react';
import { DSEQuestion } from '../types/economics';

interface AnswerBuilderProps {
  question: DSEQuestion;
  onFinishedBuilding?: (finalAnswer: string) => void;
}

export const AnswerBuilder: React.FC<AnswerBuilderProps> = ({ question, onFinishedBuilding }) => {
  const ab = question.answerBuilder;

  // Track selections for each step's slots
  const [slotValues, setSlotValues] = useState<Record<string, string>>({});
  const [editingSentence, setEditingSentence] = useState<'A' | 'B' | 'C' | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [showModelAnswer, setShowModelAnswer] = useState(false);

  const handleSelectSlot = (slotId: string, value: string) => {
    setSlotValues(prev => ({ ...prev, [slotId]: value }));
  };

  const isStepAComplete = ab.stepA.slots.every(s => slotValues[s.id] === s.correctAnswer);
  const isStepBComplete = ab.stepB.slots.every(s => slotValues[s.id] === s.correctAnswer);
  const isStepCComplete = ab.stepC.slots.every(s => slotValues[s.id] === s.correctAnswer);
  const allSlotsFilledCorrectly = isStepAComplete && isStepBComplete && isStepCComplete;

  // Build assembled sentences
  const assembledSentenceA = replaceSlots(ab.stepA.sentenceTemplate, ab.stepA.slots, slotValues, true);
  const assembledSentenceB = replaceSlots(ab.stepB.sentenceTemplate, ab.stepB.slots, slotValues, true);
  const assembledSentenceC = replaceSlots(ab.stepC.sentenceTemplate, ab.stepC.slots, slotValues, true);
  const fullAssembledAnswer = `${assembledSentenceA} ${assembledSentenceB} ${assembledSentenceC}`.trim();

  // Helper to derive the pedagogical "bridge" guidance between Step 2 and Step 3
  const getBridgeGuidance = () => {
    const personMatch = question.prompt.match(/^Explain (?:how|why|whether) ([A-Za-z]+)'s/i);
    const person = personMatch ? personMatch[1] : '佢';

    const chosenOpt = question.options.find(o => o.id === question.chosenOptionId);
    const chosenName = chosenOpt ? chosenOpt.name : '所選選項';

    // Target forgone option: highest ranked option among those NOT chosen
    const forgoneOpt = [...question.options]
      .filter(o => o.id !== question.chosenOptionId)
      .sort((a, b) => a.originalRank - b.originalRank)[0];
    const forgoneName = forgoneOpt ? forgoneOpt.name : '放棄的最高價值選項';

    // Derive action target
    const promptMatch = question.prompt.match(/opportunity cost of (.+?) (?:will|changes|increases|decreases|remains|may|necessarily)/i);
    const actionTarget = promptMatch && promptMatch[1] ? promptMatch[1].trim() : (chosenOpt?.name.toLowerCase() || 'this option');

    if (question.level === 1) {
      const isDecreased = question.valueChange === 'decrease';
      return `${person}為了「${chosenName}」，放棄了一個價值變更「${isDecreased ? '低' : '高'}」的選項，即是opportunity cost of ${actionTarget} 會 ...`;
    } else if (question.level === 2) {
      return `事件只改變了「${chosenName}」本身，但 ${person} 放棄的「${forgoneName}」價值完全無變，即是opportunity cost of ${actionTarget} 會 ...`;
    } else if (question.level === 3) {
      if (question.reasoningSummary.affectsChosen) {
        return `${person}選擇了第二偏好「${chosenName}」，放棄的最高價值選項「${forgoneName}」價值完全無變，即是opportunity cost of ${actionTarget} 會 ...`;
      }
      const isDecreased = question.valueChange === 'decrease';
      return `${person}為了「${chosenName}」，放棄了一個價值變更「${isDecreased ? '低' : '高'}」的選項（${forgoneName}），即是opportunity cost of ${actionTarget} 會 ...`;
    } else if (question.level === 4) {
      return `事件影響的是第三選項，只要其價值未超越「${forgoneName}」，放棄的選項價值就不變；但若超越，即是opportunity cost of ${actionTarget} 會 ...`;
    } else {
      return `事件影響第三選項，若其價值仍低於「${forgoneName}」則成本不變，若超越則成本增加，即是opportunity cost of ${actionTarget} 會 ...`;
    }
  };

  const bridgeText = getBridgeGuidance();

  const handleCopy = () => {
    navigator.clipboard.writeText(fullAssembledAnswer);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleReset = () => {
    setSlotValues({});
    setEditingSentence(null);
  };

  // Helper to render interactive sentence slot selector
  const renderSentenceSlotPicker = (
    template: string,
    slots: { id: string; label: string; options: string[]; correctAnswer: string }[]
  ) => {
    const parts = template.split(/(\[[a-zA-Z0-9_-]+\])/g);

    return (
      <div className="text-xs sm:text-base text-stone-900 leading-normal sm:leading-loose p-2.5 sm:p-4 bg-amber-50/40 rounded-lg sm:rounded-xl border border-amber-200/80">
        {parts.map((part, idx) => {
          const match = part.match(/^\[([a-zA-Z0-9_-]+)\]$/);
          if (match) {
            const slotId = match[1];
            const slotConfig = slots.find(s => s.id === slotId);
            if (!slotConfig) return part;

            const selectedVal = slotValues[slotId];
            const isCorrect = selectedVal === slotConfig.correctAnswer;

            return (
              <span key={idx} className="inline-block mx-0.5 sm:mx-1 my-0.5">
                <select
                  value={selectedVal || ''}
                  onChange={(e) => handleSelectSlot(slotId, e.target.value)}
                  className={`text-[11px] sm:text-xs font-semibold py-1 px-1.5 sm:py-1.5 sm:px-3 rounded-lg border transition-all cursor-pointer max-w-full ${
                    !selectedVal
                      ? 'bg-amber-100/80 text-amber-950 border-amber-300 ring-1 ring-amber-400 animate-pulse'
                      : isCorrect
                      ? 'bg-emerald-50 text-emerald-950 border-emerald-400 font-bold'
                      : 'bg-rose-50 text-rose-950 border-rose-400'
                  }`}
                >
                  <option value="" disabled>
                    -- Select {slotConfig.label} --
                  </option>
                  {slotConfig.options.map(opt => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </span>
            );
          }
          return <span key={idx} className="font-medium text-stone-800">{part}</span>;
        })}
      </div>
    );
  };

  return (
    <div className="bg-white border border-stone-200/90 rounded-xl sm:rounded-2xl overflow-hidden shadow-xs space-y-0">
      {/* Top Bar Header */}
      <div className="px-3 sm:px-6 py-2.5 sm:py-4 border-b border-stone-200 bg-stone-50/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3">
        <div>
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-amber-900 bg-amber-100/70 px-1.5 sm:px-2 py-0.5 rounded">
            2. Answer Builder
          </span>
          <h3 className="text-xs sm:text-sm font-semibold text-stone-900 mt-0.5 sm:mt-1">
            Build answer sentence by sentence
          </h3>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {Object.keys(slotValues).length > 0 && (
            <button
              onClick={handleReset}
              className="text-[10px] sm:text-xs text-stone-500 hover:text-stone-800 flex items-center gap-1 font-medium cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
          <span className="text-[10px] sm:text-xs font-bold text-amber-900 bg-amber-100/60 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg">
            {allSlotsFilledCorrectly ? '3/3 滿分完成' : isStepBComplete ? '2/3 句' : isStepAComplete ? '1/3 句' : '開始第 1 句'}
          </span>
        </div>
      </div>

      <div className="p-2.5 sm:p-6 space-y-3 sm:space-y-6">
        {/* Mindset tip box: Remind student to identify chosen option and highest-valued option forgone first */}
        <div className="p-4 bg-amber-50/90 border border-amber-200/90 rounded-xl flex items-start gap-3">
          <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center shrink-0 text-amber-800 text-sm font-bold">
            💡
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wide">
              作答前思維準備 (Think First Before Writing):
            </h4>
            <p className="text-xs text-amber-900 leading-relaxed font-medium">
              在動筆組裝 DSE 句子前，請先在心中確認兩點：
              <br />
              <span className="text-amber-950 font-bold">① 所選選項 (Chosen Option)</span>：題目問的是哪一個選項的機會成本？
              <br />
              <span className="text-amber-950 font-bold">② 放棄的最高價值選項 (Highest-valued option forgone)</span>：除所選選項外，剩下的選項中價值最高的是哪一個？
            </p>
          </div>
        </div>

        {/* CONTINUOUS ANSWER SCRIPT CANVAS (像真實考卷一樣，逐句向下寫出完整答案) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
              <span>Your DSE Answer Script (你的作答紙):</span>
            </span>
            <span className="text-[11px] text-stone-500 font-medium">
              逐句完成，整段 DSE 官方答案即時自然生成
            </span>
          </div>

          <div className="bg-[#FAF9F5] border-2 border-stone-300 rounded-2xl p-5 sm:p-6 space-y-5 shadow-2xs font-sans">
            
            {/* SENTENCE 1 BLOCK: The Event & Value Shift */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-stone-700 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-stone-200 text-stone-800 flex items-center justify-center text-[11px] font-bold">
                    1
                  </span>
                  <span>第一句：寫事件對選項價值的影響 (Sentence 1)</span>
                </span>
                {isStepAComplete && (
                  <span className="text-emerald-700 text-xs font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>已完成 ✓</span>
                  </span>
                )}
              </div>

              {/* If completed and not editing: show written sentence */}
              {isStepAComplete && editingSentence !== 'A' ? (
                <div className="p-3.5 bg-white rounded-xl border border-stone-200 text-sm sm:text-[15px] font-medium text-stone-900 leading-relaxed flex items-start justify-between gap-3 animate-in fade-in duration-150">
                  <p className="text-stone-950 font-sans">
                    {assembledSentenceA}
                  </p>
                  <button
                    onClick={() => setEditingSentence('A')}
                    className="text-stone-400 hover:text-stone-700 p-1 rounded hover:bg-stone-100 cursor-pointer shrink-0"
                    title="修改第 1 句"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                /* Interactive slot builder for Sentence 1 */
                <div className="space-y-2 animate-in fade-in duration-200">
                  <p className="text-xs text-stone-600 font-medium">
                    {ab.stepA.prompt}
                  </p>
                  {renderSentenceSlotPicker(ab.stepA.sentenceTemplate, ab.stepA.slots)}
                  {isStepAComplete && editingSentence === 'A' && (
                    <button
                      onClick={() => setEditingSentence(null)}
                      className="text-xs font-bold text-emerald-800 hover:underline cursor-pointer"
                    >
                      完成修改 ✓
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* SENTENCE 2 BLOCK: Identifying Highest-Valued Option Forgone */}
            <div className="space-y-2 pt-2 border-t border-stone-200/80">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-stone-700 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-stone-200 text-stone-800 flex items-center justify-center text-[11px] font-bold">
                    2
                  </span>
                  <span>第二句：寫放棄的最高價值選項 (Sentence 2)</span>
                </span>
                {isStepBComplete && (
                  <span className="text-emerald-700 text-xs font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>已完成 ✓</span>
                  </span>
                )}
              </div>

              {!isStepAComplete ? (
                /* Locked placeholder until Sentence 1 is written */
                <div className="p-3.5 bg-stone-100/50 rounded-xl border border-dashed border-stone-300 text-xs text-stone-600 italic">
                  (先在上方完成第 1 句，繼續寫第 2 句……)
                </div>
              ) : isStepBComplete && editingSentence !== 'B' ? (
                /* Written Sentence 2 displayed in the flowing paragraph */
                <div className="p-3.5 bg-white rounded-xl border border-stone-200 text-sm sm:text-[15px] font-medium text-stone-900 leading-relaxed flex items-start justify-between gap-3 animate-in fade-in duration-150">
                  <p className="text-stone-950 font-sans">
                    {assembledSentenceB}
                  </p>
                  <button
                    onClick={() => setEditingSentence('B')}
                    className="text-stone-400 hover:text-stone-700 p-1 rounded hover:bg-stone-100 cursor-pointer shrink-0"
                    title="修改第 2 句"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                /* Interactive slot builder for Sentence 2 */
                <div className="space-y-2 animate-in fade-in duration-200">
                  <p className="text-xs text-stone-600 font-medium">
                    {ab.stepB.prompt}
                  </p>
                  {renderSentenceSlotPicker(ab.stepB.sentenceTemplate, ab.stepB.slots)}
                  {isStepBComplete && editingSentence === 'B' && (
                    <button
                      onClick={() => setEditingSentence(null)}
                      className="text-xs font-bold text-emerald-800 hover:underline cursor-pointer"
                    >
                      完成修改 ✓
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* 核心思維銜接橋樑: 2 與 3 之間簡潔引導 */}
            {isStepBComplete && (
              <div className="p-3.5 bg-amber-50/90 border border-amber-300/90 rounded-xl space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                <p className="text-xs sm:text-sm font-semibold text-amber-950 leading-relaxed font-sans">
                  {bridgeText}
                </p>
              </div>
            )}

            {/* SENTENCE 3 BLOCK: The Final Opportunity Cost Conclusion */}
            <div className="space-y-2 pt-2 border-t border-stone-200/80">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-stone-700 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-stone-200 text-stone-800 flex items-center justify-center text-[11px] font-bold">
                    3
                  </span>
                  <span>第三句：寫最終機會成本結論 (Sentence 3)</span>
                </span>
                {isStepCComplete && (
                  <span className="text-emerald-700 text-xs font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>已完成 ✓</span>
                  </span>
                )}
              </div>

              {!isStepBComplete ? (
                /* Locked placeholder until Sentence 2 is written */
                <div className="p-3.5 bg-stone-100/50 rounded-xl border border-dashed border-stone-300 text-xs text-stone-600 italic">
                  (先在上方完成第 2 句，即可得出第 3 句結論……)
                </div>
              ) : isStepCComplete && editingSentence !== 'C' ? (
                /* Written Sentence 3 displayed */
                <div className="p-3.5 bg-white rounded-xl border border-stone-200 text-sm sm:text-[15px] font-medium text-stone-900 leading-relaxed flex items-start justify-between gap-3 animate-in fade-in duration-150">
                  <p className="text-stone-950 font-sans">
                    {assembledSentenceC}
                  </p>
                  <button
                    onClick={() => setEditingSentence('C')}
                    className="text-stone-400 hover:text-stone-700 p-1 rounded hover:bg-stone-100 cursor-pointer shrink-0"
                    title="修改第 3 句"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                /* Interactive slot builder for Sentence 3 */
                <div className="space-y-2 animate-in fade-in duration-200">
                  <p className="text-xs text-stone-600 font-medium">
                    根據上述思維，得出最終機會成本結論：
                  </p>
                  {renderSentenceSlotPicker(ab.stepC.sentenceTemplate, ab.stepC.slots)}
                  {isStepCComplete && editingSentence === 'C' && (
                    <button
                      onClick={() => setEditingSentence(null)}
                      className="text-xs font-bold text-emerald-800 hover:underline cursor-pointer"
                    >
                      完成修改 ✓
                    </button>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>

        {/* FULL PARAGRAPH CELEBRATION & MARKS BREAKDOWN (WHEN ALL 3 ARE COMPLETED) */}
        {allSlotsFilledCorrectly && (
          <div className="p-5 sm:p-6 bg-emerald-50/90 border-2 border-emerald-300 rounded-2xl space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-emerald-950">
                    Full 3-Mark DSE Answer Constructed! (完整答案建構完成)
                  </h4>
                  <p className="text-xs text-emerald-800">
                    You have independently assembled the official marking-scheme paragraph.
                  </p>
                </div>
              </div>

              <button
                onClick={handleCopy}
                className="px-4 py-2 text-xs font-bold text-emerald-900 bg-white hover:bg-emerald-100 border border-emerald-300 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{isCopied ? 'Copied to Clipboard!' : 'Copy Answer Text'}</span>
              </button>
            </div>

            {/* Complete Unified Paragraph */}
            <div className="p-4 bg-white rounded-xl border border-emerald-200 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-900 block">
                Official Answer Script Output:
              </span>
              <p className="text-base font-medium text-stone-900 leading-relaxed font-sans select-all">
                "{fullAssembledAnswer}"
              </p>
            </div>

            {/* Rubric Points Checklist */}
            <div className="pt-2 border-t border-emerald-200/80 space-y-2">
              <span className="text-xs font-bold text-emerald-950 block">
                DSE Marking Scheme Points Breakdown (3 / 3 Marks):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="p-2.5 bg-white/80 rounded-lg border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>1 Mark:</strong> Event shifts value of affected option</span>
                </div>
                <div className="p-2.5 bg-white/80 rounded-lg border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>1 Mark:</strong> Highest-valued option forgone identified / condition</span>
                </div>
                <div className="p-2.5 bg-white/80 rounded-lg border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>1 Mark:</strong> Opportunity cost conclusion</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between pt-2 gap-3">
              <button
                onClick={() => setShowModelAnswer(!showModelAnswer)}
                className="text-xs font-semibold text-emerald-900 hover:underline flex items-center gap-1.5 cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>{showModelAnswer ? 'Hide Official Marking Reference' : 'Compare with Official Marking Scheme'}</span>
              </button>

              {onFinishedBuilding && (
                <button
                  onClick={() => onFinishedBuilding(fullAssembledAnswer)}
                  className="w-full sm:w-auto px-6 py-2.5 text-xs font-bold text-white bg-stone-900 hover:bg-stone-800 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <span>Proceed to 3. DSE Challenge</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Model answer toggle */}
            {showModelAnswer && (
              <div className="p-4 bg-white/95 rounded-xl border border-emerald-200 text-xs space-y-2 mt-2">
                <span className="font-bold text-stone-800">HKDSE Standard Marking Scheme:</span>
                <p className="text-stone-900 leading-relaxed font-sans">{question.modelAnswer}</p>
                {question.modelAnswerZh && (
                  <p className="text-stone-600 pt-1 border-t border-stone-100 leading-relaxed">
                    <strong>中文參考：</strong>{question.modelAnswerZh}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

function replaceSlots(
  template: string,
  slots: { id: string; label: string; options: string[]; correctAnswer: string }[],
  values: Record<string, string>,
  preferCorrect = false
): string {
  let result = template;
  for (const slot of slots) {
    const val = values[slot.id] || (preferCorrect ? slot.correctAnswer : `[${slot.label}]`);
    result = result.replace(`[${slot.id}]`, val);
  }
  return result;
}
