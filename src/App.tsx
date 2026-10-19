/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  DSEQuestion, 
  LevelId, 
  MistakeRecord 
} from './types/economics';
import { DSE_QUESTIONS } from './data/dseQuestions';
import { Header } from './components/Header';
import { AnswerBuilder } from './components/AnswerBuilder';
import { DSEChallenge } from './components/DSEChallenge';
import { PractiseFadingFlow } from './components/PractiseFadingFlow';
import { MistakeReview } from './components/MistakeReview';
import { 
  Sparkles,
  BookOpen,
  ArrowRight,
  CheckCircle,
  RotateCcw,
  FileText
} from 'lucide-react';

export default function App() {
  const [currentLevel, setCurrentLevel] = useState<LevelId>(1);
  const [currentMode, setCurrentMode] = useState<'practise' | 'builder' | 'challenge' | 'mistakes'>('practise');
  const [currentQuestion, setCurrentQuestion] = useState<DSEQuestion>(DSE_QUESTIONS[0]);
  const handleCycleScenarioInLevel = () => {
    const levelQuestions = DSE_QUESTIONS.filter(q => q.level === currentLevel);
    if (levelQuestions.length <= 1) return;
    const currentIdx = levelQuestions.findIndex(q => q.id === currentQuestion.id);
    const nextIdx = (currentIdx + 1) % levelQuestions.length;
    setCurrentQuestion(levelQuestions[nextIdx]);
  };

  // Gamification & Progress tracking
  const [completedQuestionIds, setCompletedQuestionIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('dse_completed_questions');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [mistakes, setMistakes] = useState<MistakeRecord[]>(() => {
    try {
      const saved = localStorage.getItem('dse_mistakes');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // When level changes, load the primary question for that level
  useEffect(() => {
    const qForLevel = DSE_QUESTIONS.find(q => q.level === currentLevel) || DSE_QUESTIONS[0];
    setCurrentQuestion(qForLevel);
  }, [currentLevel]);

  // Save progress
  useEffect(() => {
    try {
      localStorage.setItem('dse_completed_questions', JSON.stringify(completedQuestionIds));
    } catch {
      // ignore
    }
  }, [completedQuestionIds]);

  useEffect(() => {
    try {
      localStorage.setItem('dse_mistakes', JSON.stringify(mistakes));
    } catch {
      // ignore
    }
  }, [mistakes]);

  const handleRecordMistake = (stepIdOrMisconception: any, misconceptionTypeInput?: any) => {
    const misconceptionType = misconceptionTypeInput || stepIdOrMisconception || 'FORGOT_VALUE_LINK';
    const lqs = DSE_QUESTIONS.filter(q => q.level === currentLevel);
    const sIdx = lqs.findIndex(q => q.id === currentQuestion.id);
    const sNum = sIdx >= 0 ? sIdx + 1 : 1;
    const newRecord: MistakeRecord = {
      id: `m-${Date.now()}`,
      questionId: currentQuestion.id,
      questionTitle: `Scenario ${sNum}`,
      level: currentQuestion.level,
      type: currentQuestion.type,
      misconceptionType,
      date: new Date().toLocaleDateString()
    };
    setMistakes(prev => [newRecord, ...prev.slice(0, 49)]);
  };

  const handleCompleteQuestion = () => {
    if (!completedQuestionIds.includes(currentQuestion.id)) {
      setCompletedQuestionIds(prev => [...prev, currentQuestion.id]);
    }
  };

  const handleNextQuestion = () => {
    handleCompleteQuestion();
    const currentIndex = DSE_QUESTIONS.findIndex(q => q.id === currentQuestion.id);
    const nextQ = DSE_QUESTIONS[(currentIndex + 1) % DSE_QUESTIONS.length];
    setCurrentQuestion(nextQ);
    setCurrentLevel(nextQ.level);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900 selection:bg-amber-100 selection:text-amber-900">
      {/* 3-Zone Header compliant with Top Bar Contract */}
      <Header
        currentMode={currentMode}
        onChangeMode={setCurrentMode}
        currentLevel={currentLevel}
        onChangeLevel={(lvl) => {
          setCurrentLevel(lvl);
        }}
        onGenerateNew={handleCycleScenarioInLevel}
        mistakeCount={mistakes.length}
      />

      {/* Main Container with 2-Column Side-by-Side Layout */}
      <main className="grow max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-3 sm:py-6 w-full">
        {currentMode === 'mistakes' ? (
          /* Mistake Review Mode spans full width */
          <div className="max-w-4xl mx-auto space-y-6">
            <MistakeReview
              mistakes={mistakes}
              onPracticeTopic={(lvl) => {
                setCurrentLevel(lvl as LevelId);
                setCurrentMode('practise');
              }}
              onClearMistakes={() => setMistakes([])}
            />
          </div>
        ) : (
          /* Side-by-Side Split: Left = Sticky Scenario & Event; Right = Interactive Questions */
          <div className="grid grid-cols-12 gap-2 sm:gap-4 lg:gap-6 items-start">
            
            {/* LEFT COLUMN: Scenario & Question (Side-by-side on mobile, sticky) */}
            <div className="col-span-6 lg:col-span-5 sticky top-16 sm:top-20 max-h-[calc(100dvh-4.5rem)] overflow-y-auto space-y-2 sm:space-y-4 pr-0.5">
              <div className="bg-white border border-stone-200/90 rounded-xl sm:rounded-2xl p-2.5 sm:p-5 shadow-xs space-y-2 sm:space-y-4">
                {/* Header: Scenario 1 and Switch */}
                <div className="flex items-center justify-between gap-1 pb-2 border-b border-stone-100">
                  <h2 className="text-xs sm:text-base font-bold text-stone-900 leading-snug">
                    Scenario {(() => {
                      const lqs = DSE_QUESTIONS.filter(q => q.level === currentLevel);
                      const idx = lqs.findIndex(q => q.id === currentQuestion.id);
                      return idx >= 0 ? idx + 1 : 1;
                    })()}
                  </h2>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={handleCycleScenarioInLevel}
                      className="px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-lg transition-colors cursor-pointer"
                      title="Switch scenario"
                    >
                      Switch
                    </button>
                  </div>
                </div>

                {/* Question Prompt (Always visible side-by-side with questions) */}
                <div className="p-2 sm:p-3.5 bg-amber-50/90 rounded-lg sm:rounded-xl border border-amber-200/90 space-y-0.5 sm:space-y-1">
                  <span className="text-[9px] sm:text-[11px] font-bold uppercase tracking-wider text-amber-900 block">
                    Question to Answer (題目):
                  </span>
                  <p className="text-[11px] sm:text-base font-semibold text-stone-900 leading-snug">
                    "{currentQuestion.prompt}"
                  </p>
                </div>

                {/* Scenario & Event (Always visible next to questions) */}
                <div className="space-y-1 sm:space-y-1.5">
                  <span className="text-[9px] sm:text-xs font-bold uppercase tracking-wider text-stone-600 block">
                    Scenario & Event (情境):
                  </span>
                  <div className="text-[11px] sm:text-[16px] font-normal text-stone-950 leading-relaxed bg-stone-50/90 p-2 sm:p-4 rounded-lg sm:rounded-xl border border-stone-200/80 shadow-2xs">
                    <p className="whitespace-pre-line font-sans leading-relaxed">
                      {currentQuestion.scenario}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Interactive Activities & Reasoning Stream */}
            <div className="col-span-6 lg:col-span-7 space-y-2 sm:space-y-4">
              {/* Mode Bar Tabs */}
              <div className="bg-white border border-stone-200/90 rounded-xl p-1 shadow-xs flex items-center justify-between overflow-x-auto gap-1">
                <button
                  onClick={() => setCurrentMode('practise')}
                  className={`px-2 py-1 sm:px-4 sm:py-2 text-[10px] sm:text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                    currentMode === 'practise'
                      ? 'bg-stone-900 text-white shadow-2xs font-bold'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  <span className="hidden sm:inline">1. Practise (Step-by-Step)</span>
                  <span className="sm:hidden">1. Practise</span>
                </button>
                <button
                  onClick={() => setCurrentMode('builder')}
                  className={`px-2 py-1 sm:px-4 sm:py-2 text-[10px] sm:text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                    currentMode === 'builder'
                      ? 'bg-stone-900 text-white shadow-2xs font-bold'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  <span className="hidden sm:inline">2. Answer Builder</span>
                  <span className="sm:hidden">2. Builder</span>
                </button>
                <button
                  onClick={() => setCurrentMode('challenge')}
                  className={`px-2 py-1 sm:px-4 sm:py-2 text-[10px] sm:text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                    currentMode === 'challenge'
                      ? 'bg-stone-900 text-white shadow-2xs font-bold'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  <span className="hidden sm:inline">3. DSE Challenge</span>
                  <span className="sm:hidden">3. Challenge</span>
                </button>
              </div>

              {/* Dynamic Mode Content */}
              <div>
                {currentMode === 'practise' && (
                  <PractiseFadingFlow
                    question={currentQuestion}
                    currentLevel={currentLevel}
                    onChangeLevel={(lvl) => setCurrentLevel(lvl)}
                    onProceedToBuilder={() => {
                      handleCompleteQuestion();
                      setCurrentMode('builder');
                    }}
                    onRecordMistake={(misconception) => {
                      handleRecordMistake(misconception);
                    }}
                  />
                )}

                {currentMode === 'builder' && (
                  <AnswerBuilder
                    question={currentQuestion}
                    onFinishedBuilding={() => {
                      handleCompleteQuestion();
                      setCurrentMode('challenge');
                    }}
                  />
                )}

                {currentMode === 'challenge' && (
                  <DSEChallenge
                    question={currentQuestion}
                    onNextQuestion={handleNextQuestion}
                    onRecordMistake={(misconception) => {
                      handleRecordMistake(misconception);
                    }}
                  />
                )}
              </div>
            </div>

          </div>
        )}

        {/* Global Footer */}
        <footer className="pt-8 mt-8 border-t border-stone-200 text-xs text-stone-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-800">DSE Opportunity Cost Mastery</span>
            <span>·</span>
            <span>Hong Kong Form 4 Economics Curriculum</span>
          </div>
          <div>
            Opportunity Cost = Value of the Highest-Valued Option Forgone
          </div>
        </footer>
      </main>
    </div>
  );
}
