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
import { ChineseHintModal } from './components/ChineseHintModal';
import { ScenarioGeneratorModal } from './components/ScenarioGeneratorModal';
import { 
  Languages, 
  Sparkles,
  BookOpen,
  ArrowRight,
  CheckCircle,
  RotateCcw
} from 'lucide-react';

export default function App() {
  const [currentLevel, setCurrentLevel] = useState<LevelId>(1);
  const [currentMode, setCurrentMode] = useState<'practise' | 'builder' | 'challenge' | 'mistakes'>('practise');
  const [currentQuestion, setCurrentQuestion] = useState<DSEQuestion>(DSE_QUESTIONS[0]);
  
  // Modals
  const [isChineseHintOpen, setIsChineseHintOpen] = useState(false);

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
    const newRecord: MistakeRecord = {
      id: `m-${Date.now()}`,
      questionId: currentQuestion.id,
      questionTitle: currentQuestion.title,
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
      />

      {/* Main Container with 2-Column Side-by-Side Layout */}
      <main className="grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
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
          /* Side-by-Side Split: Left = Sticky Preferences & Scenario; Right = Interactive Questions */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT COLUMN: Sticky Case & 3 Preferences (Never need to scroll up and down!) */}
            <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
              <div className="bg-white border border-stone-200/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
                {/* Header: Title & Level Badge */}
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-stone-100">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 bg-amber-100/70 px-2 py-0.5 rounded">
                      Level {currentQuestion.level} Scenario
                    </span>
                    <h2 className="text-base font-bold text-stone-900 leading-snug">
                      {currentQuestion.title}
                    </h2>
                  </div>

                  <button
                    onClick={handleCycleScenarioInLevel}
                    className="px-2.5 py-1 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-lg transition-colors cursor-pointer shrink-0"
                  >
                    Switch
                  </button>
                </div>

                {/* Scenario & Event that happened */}
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-600 block">
                    Scenario & Event (情境與事件):
                  </span>
                  <div className="text-lg sm:text-[19px] font-normal text-stone-950 leading-relaxed bg-stone-50/90 p-5 rounded-xl border border-stone-200/80 shadow-2xs">
                    <p className="whitespace-pre-line font-sans leading-relaxed">
                      {currentQuestion.scenario}
                    </p>
                  </div>
                </div>

                {/* Official Exam Question to Answer */}
                <div className="p-4 bg-amber-50/80 rounded-xl border border-amber-200/90 space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 block">
                    Question to Answer (題目):
                  </span>
                  <p className="text-sm sm:text-base font-semibold text-stone-900 leading-snug">
                    "{currentQuestion.prompt}"
                  </p>
                </div>

                {/* Chinese Hint CTA Button */}
                <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                  <button
                    onClick={() => setIsChineseHintOpen(true)}
                    className="w-full py-2 text-xs font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100/80 border border-amber-200/80 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Languages className="w-3.5 h-3.5 text-amber-700" />
                    <span>中文提示 (Question Wording Clarification)</span>
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Interactive Activities & Reasoning Stream */}
            <div className="lg:col-span-7 space-y-4">
              {/* Mode Bar Tabs */}
              <div className="bg-white border border-stone-200/90 rounded-xl p-1.5 shadow-xs flex items-center justify-between overflow-x-auto gap-1">
                <button
                  onClick={() => setCurrentMode('practise')}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                    currentMode === 'practise'
                      ? 'bg-stone-900 text-white shadow-2xs font-bold'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  1. Practise (Step-by-Step Reasoning)
                </button>
                <button
                  onClick={() => setCurrentMode('builder')}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                    currentMode === 'builder'
                      ? 'bg-stone-900 text-white shadow-2xs font-bold'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  2. Answer Builder (Writing Script)
                </button>
                <button
                  onClick={() => setCurrentMode('challenge')}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                    currentMode === 'challenge'
                      ? 'bg-stone-900 text-white shadow-2xs font-bold'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  3. DSE Challenge (Exam Mode)
                </button>
              </div>

              {/* Dynamic Mode Content */}
              <div>
                {currentMode === 'practise' && (
                  <PractiseFadingFlow
                    question={currentQuestion}
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
                    onOpenChineseHint={() => setIsChineseHintOpen(true)}
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

      {/* Chinese Terms Clarification Modal */}
      <ChineseHintModal
        isOpen={isChineseHintOpen}
        onClose={() => setIsChineseHintOpen(false)}
        promptZh={currentQuestion.promptZh}
        hints={currentQuestion.chineseHints}
      />
    </div>
  );
}
