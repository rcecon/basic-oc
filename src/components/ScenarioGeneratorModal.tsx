import React, { useState } from 'react';
import { X, Sparkles, BookOpen, Check } from 'lucide-react';
import { DSEQuestion, LevelId } from '../types/economics';
import { DSE_QUESTIONS } from '../data/dseQuestions';
import { generateNewScenario } from '../services/geminiService';

interface ScenarioGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLevel: LevelId;
  onSelectQuestion: (question: DSEQuestion) => void;
}

export const ScenarioGeneratorModal: React.FC<ScenarioGeneratorModalProps> = ({
  isOpen,
  onClose,
  currentLevel,
  onSelectQuestion
}) => {
  const [selectedLevel, setSelectedLevel] = useState<LevelId>(currentLevel);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  // Filter curated questions for this level
  const curatedForLevel = DSE_QUESTIONS.filter(q => q.level === selectedLevel);

  const handleGenerateAI = async () => {
    setIsGenerating(true);
    try {
      const generated = await generateNewScenario(selectedLevel);
      if (generated) {
        // Find a matching template to copy robust scaffolding and answerBuilder from
        const base = DSE_QUESTIONS.find(q => q.level === selectedLevel) || DSE_QUESTIONS[0];
        const completeQuestion: DSEQuestion = {
          ...base,
          ...generated,
          id: generated.id || `GEN-${Date.now()}`,
          level: selectedLevel,
          title: generated.title || `Custom Scenario: Level ${selectedLevel}`,
          scenario: generated.scenario || base.scenario,
          scenarioZh: generated.scenarioZh || base.scenarioZh,
          prompt: generated.prompt || base.prompt,
          promptZh: generated.promptZh || base.promptZh,
          options: (generated.options as any) || base.options,
          chosenOptionId: generated.chosenOptionId || base.chosenOptionId,
          affectedOptionId: generated.affectedOptionId || base.affectedOptionId,
          valueChange: generated.valueChange || base.valueChange,
          reasoningSummary: generated.reasoningSummary || base.reasoningSummary,
          modelAnswer: generated.modelAnswer || base.modelAnswer,
          modelAnswerZh: generated.modelAnswerZh || base.modelAnswerZh
        };
        onSelectQuestion(completeQuestion);
        onClose();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-[#FAF8F5] border border-stone-300 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-100/70">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-800" />
            <h2 className="text-base font-semibold text-stone-900">
              Select or Generate DSE Scenarios (情境題庫與生成)
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Level Filter Tabs */}
          <div>
            <label className="text-xs font-bold text-stone-600 uppercase tracking-wider block mb-2">
              Select DSE Level:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {([1, 2, 3, 4, 5] as LevelId[]).map(lvl => (
                <button
                  key={lvl}
                  onClick={() => setSelectedLevel(lvl)}
                  className={`p-2.5 rounded-lg border text-xs font-semibold transition-all text-center ${
                    selectedLevel === lvl
                      ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                      : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  Level {lvl}
                  <span className="block text-[10px] font-normal opacity-80 mt-0.5">
                    {lvl === 1 && 'Direct Forgone'}
                    {lvl === 2 && 'Chosen vs Forgone'}
                    {lvl === 3 && 'Non-1st Choice'}
                    {lvl === 4 && 'Third ("May")'}
                    {lvl === 5 && 'Necessarily'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Curated Questions in this level */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-stone-600 uppercase tracking-wider block">
              Curated Past-Paper Scenarios for Level {selectedLevel}:
            </span>
            <div className="space-y-2">
              {curatedForLevel.map(q => (
                <div
                  key={q.id}
                  onClick={() => {
                    onSelectQuestion(q);
                    onClose();
                  }}
                  className="p-3.5 bg-white border border-stone-200 rounded-xl hover:border-stone-400 hover:shadow-xs transition-all cursor-pointer flex items-center justify-between gap-3 group"
                >
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold text-stone-900 group-hover:text-amber-900 transition-colors">
                      {q.title}
                    </h4>
                    <p className="text-xs text-stone-500 line-clamp-1">
                      {q.prompt}
                    </p>
                  </div>
                  <button className="px-3 py-1 text-xs font-medium text-stone-700 bg-stone-100 group-hover:bg-stone-900 group-hover:text-white rounded-md transition-colors shrink-0">
                    Load
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* AI Generator CTA */}
          <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-700" />
                Want a fresh custom scenario?
              </span>
              <p className="text-xs text-amber-900/80 mt-0.5">
                Generate an unseen Form 4 situation calibrated strictly to Level {selectedLevel} standards.
              </p>
            </div>

            <button
              onClick={handleGenerateAI}
              disabled={isGenerating}
              className="px-4 py-2 text-xs font-semibold text-white bg-amber-900 hover:bg-amber-950 disabled:bg-stone-400 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              {isGenerating ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Generating Scenario...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate New Scenario</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
