import React, { useState } from 'react';
import { CheckCircle2, XCircle, Clock, Send, Lightbulb, BookOpen, RotateCcw, AlertTriangle, ArrowRight, Languages } from 'lucide-react';
import { DSEQuestion, EvaluationResult } from '../types/economics';
import { evaluateWithAI } from '../services/geminiService';

interface DSEChallengeProps {
  question: DSEQuestion;
  onOpenChineseHint: () => void;
  onNextQuestion: () => void;
  onRecordMistake: (misconceptionType: any) => void;
}

export const DSEChallenge: React.FC<DSEChallengeProps> = ({
  question,
  onOpenChineseHint,
  onNextQuestion,
  onRecordMistake
}) => {
  const [studentText, setStudentText] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showModelAnswer, setShowModelAnswer] = useState(false);

  const handleSubmit = async () => {
    if (!studentText.trim() || isEvaluating) return;
    setIsEvaluating(true);

    try {
      const result = await evaluateWithAI(studentText, question);
      setEvaluation(result);

      if (result.score < question.markingRubric.points.length) {
        // Record mistake if missing key marks
        onRecordMistake(question.type === 'TYPE_C' ? 'CHOSEN_OPTION_FALLACY' : 'FORGOT_VALUE_LINK');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleReset = () => {
    setStudentText('');
    setEvaluation(null);
    setShowModelAnswer(false);
  };

  return (
    <div className="bg-white border border-stone-200/90 rounded-xl overflow-hidden shadow-xs">
      {/* Top Banner */}
      <div className="px-6 py-4 border-b border-stone-200 bg-stone-50/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-rose-900 bg-rose-100/70 px-2 py-0.5 rounded">
            DSE Exam Simulation (文憑試實戰挑戰)
          </span>
          <span className="text-xs text-stone-500 font-mono">
            Level {question.level} · {question.markingRubric.points.length} Marks
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenChineseHint}
            className="px-3 py-1.5 text-xs font-medium text-amber-900 bg-amber-50 hover:bg-amber-100/80 border border-amber-200/80 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Languages className="w-3.5 h-3.5 text-amber-700" />
            <span>中文提示 (Question Help)</span>
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Scenario Card */}
        <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
          <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">
            Scenario Background:
          </div>
          <p className="text-sm text-stone-800 whitespace-pre-line leading-relaxed font-sans">
            {question.scenario}
          </p>
        </div>

        {/* The Official Exam Question Prompt */}
        <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-200/90 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900">
            DSE Examination Question ({question.markingRubric.points.length} Marks):
          </span>
          <h3 className="text-base font-bold text-stone-900 leading-snug">
            {question.prompt}
          </h3>
          {question.promptZh && (
            <p className="text-xs text-stone-500 font-medium">
              {question.promptZh}
            </p>
          )}
        </div>

        {/* Minimal hint accordion */}
        <div>
          <button
            onClick={() => setShowHint(!showHint)}
            className="text-xs font-medium text-stone-600 hover:text-stone-900 flex items-center gap-1.5"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
            <span>{showHint ? 'Hide Economic Clue' : 'Need a small clue? (Smallest hint first)'}</span>
          </button>

          {showHint && (
            <div className="mt-2 p-3 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-700 space-y-1 animate-in fade-in duration-150">
              <p>
                <strong>Self-Check Questions:</strong>
              </p>
              <ul className="list-disc list-inside space-y-0.5 text-stone-600">
                <li>What is the chosen option?</li>
                <li>What is the highest-valued option forgone?</li>
                <li>Which option\'s value is altered by the event?</li>
                <li>Does the value of the highest-valued option forgone change?</li>
              </ul>
            </div>
          )}
        </div>

        {/* Student Writing Area */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <label htmlFor="student-answer-input" className="font-semibold text-stone-700">
              Your Written Response (in DSE Economic style):
            </label>
            <span>Word count: {studentText.trim().split(/\s+/).filter(Boolean).length}</span>
          </div>

          <textarea
            id="student-answer-input"
            rows={4}
            value={studentText}
            onChange={(e) => setStudentText(e.target.value)}
            disabled={!!evaluation}
            placeholder="Type your complete answer here. (e.g. 'The wage cut decreases the value of..., which is the highest-valued option forgone. Therefore...')"
            className="w-full p-3.5 text-sm rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-stone-400 focus:border-stone-500 bg-white leading-relaxed font-sans placeholder:text-stone-400"
          />
        </div>

        {/* Submit Bar */}
        {!evaluation ? (
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-stone-500">
              Aim for concise, logical sentences with exact economics terms.
            </span>
            <button
              onClick={handleSubmit}
              disabled={!studentText.trim() || isEvaluating}
              className="px-6 py-2.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 disabled:bg-stone-300 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-2"
            >
              {isEvaluating ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Evaluating against DSE Rubric...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit for DSE Marking</span>
                </>
              )}
            </button>
          </div>
        ) : (
          /* Evaluation Results Box */
          <div className="space-y-5 p-5 bg-stone-50/80 rounded-xl border border-stone-300 animate-in fade-in duration-200">
            {/* Score header */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-600">
                  DSE Rubric Evaluation:
                </span>
                <span className={`text-sm font-bold px-2 py-0.5 rounded ${
                  evaluation.score === evaluation.maxScore
                    ? 'bg-emerald-100 text-emerald-900'
                    : 'bg-amber-100 text-amber-900'
                }`}>
                  Score: {evaluation.score} / {evaluation.maxScore} Marks
                </span>
              </div>

              <button
                onClick={handleReset}
                className="text-xs font-medium text-stone-600 hover:text-stone-900 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Rewrite Answer</span>
              </button>
            </div>

            {/* Overall comment */}
            <p className="text-xs font-medium text-stone-800 leading-relaxed">
              {evaluation.overallFeedback}
            </p>

            {/* Rubric Checks Breakdown */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                Marking Point Verification:
              </span>
              <div className="space-y-2">
                {evaluation.checks.map((chk) => (
                  <div
                    key={chk.pointNumber}
                    className={`p-3 rounded-lg border text-xs flex items-start gap-2.5 ${
                      chk.awarded
                        ? 'bg-emerald-50/60 border-emerald-300 text-emerald-950'
                        : 'bg-rose-50/60 border-rose-300 text-rose-950'
                    }`}
                  >
                    {chk.awarded ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
                    )}
                    <div className="space-y-0.5">
                      <div className="font-semibold">
                        Point {chk.pointNumber}: {chk.title}
                      </div>
                      <p className="text-[11px] leading-relaxed">{chk.matchedFeedback}</p>
                      {chk.suggestion && (
                        <p className="text-[11px] text-rose-800 font-medium pt-1">
                          Requirement: {chk.suggestion}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Model Answer Toggle */}
            <div className="pt-2 border-t border-stone-200">
              <button
                onClick={() => setShowModelAnswer(!showModelAnswer)}
                className="text-xs font-semibold text-stone-800 hover:text-stone-950 flex items-center gap-1.5"
              >
                <BookOpen className="w-4 h-4 text-amber-700" />
                <span>{showModelAnswer ? 'Hide Official Model Answer' : 'Compare with Official DSE Model Answer'}</span>
              </button>

              {showModelAnswer && (
                <div className="mt-3 p-4 bg-amber-50/60 border border-amber-200 rounded-xl space-y-2 animate-in fade-in duration-200">
                  <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider">
                    Official HKEAA DSE Model Answer:
                  </span>
                  <p className="text-sm font-medium text-stone-900 leading-relaxed font-serif">
                    {question.modelAnswer}
                  </p>
                  {question.modelAnswerZh && (
                    <p className="text-xs text-stone-600 pt-2 border-t border-amber-200/60 leading-relaxed">
                      <strong>中文對照：</strong>{question.modelAnswerZh}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Next question button */}
            <div className="flex justify-end pt-2">
              <button
                onClick={onNextQuestion}
                className="px-5 py-2.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <span>Next DSE Scenario</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
