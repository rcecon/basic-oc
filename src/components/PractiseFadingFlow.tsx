import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, PenTool, Sparkles, BookOpen } from 'lucide-react';
import { DSEQuestion } from '../types/economics';

interface PractiseFadingFlowProps {
  question: DSEQuestion;
  onProceedToBuilder: () => void;
  onRecordMistake: (misconceptionType: any) => void;
}

interface PracticeCompletedStep {
  stepNumber: string;
  title: string;
  questionZh?: string;
  selectedText: string;
}

export const PractiseFadingFlow: React.FC<PractiseFadingFlowProps> = ({
  question,
  onProceedToBuilder,
  onRecordMistake
}) => {
  // Practice Mode sub-mode: 'guided-fading' (step-by-step continuous flow) or 'exam-draft' (attempt 3 independent)
  const [practiceMode, setPracticeMode] = useState<'flow' | 'independent'>('flow');

  // Step index in the continuous practice flow:
  // 0: Chosen Option
  // 1: Highest-Valued Option Forgone
  // 2: Affected Option & Value Change
  // 3: (If Level 3 or 4) Bridge Condition
  // 4: Final Opportunity Cost Conclusion
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<PracticeCompletedStep[]>([]);
  const [wrongSelection, setWrongSelection] = useState<string | null>(null);
  const [wrongFeedback, setWrongFeedback] = useState<string | null>(null);

  // Independent attempt 3 state
  const [independentText, setIndependentText] = useState('');
  const [showIndependentClue, setShowIndependentClue] = useState(false);

  const activeStepRef = useRef<HTMLDivElement | null>(null);

  // Reset when question changes
  useEffect(() => {
    setCurrentStepIdx(0);
    setCompletedSteps([]);
    setWrongSelection(null);
    setWrongFeedback(null);
    setIndependentText('');
    setShowIndependentClue(false);
  }, [question.id]);

  const chosenOpt = question.options.find(o => o.id === question.chosenOptionId);
  const forgoneOptName = question.reasoningSummary.initialForgoneOptionName;
  const isThirdOptionCase = question.reasoningSummary.affectsThird;
  const isWhetherCase = question.level === 5;
  const expectedCostChange = question.reasoningSummary.finalCostChange;

  // Derive the action target string directly from question prompt or chosen option
  // e.g. "visiting the theme park", "watching the movie", "working part-time at the bookstore"
  const getActionTarget = () => {
    const promptMatch = question.prompt.match(/opportunity cost of (.+?) (?:will|changes|increases|decreases|remains|may|necessarily)/i);
    if (promptMatch && promptMatch[1]) {
      return promptMatch[1].trim();
    }
    const nameLower = chosenOpt?.name.toLowerCase() || '';
    if (nameLower.startsWith('visit ') || nameLower.startsWith('watch ') || nameLower.startsWith('work ') || nameLower.startsWith('help ') || nameLower.startsWith('tutor ')) {
      return nameLower.replace(/^visit /, 'visiting ')
        .replace(/^watch /, 'watching ')
        .replace(/^work /, 'working ')
        .replace(/^help /, 'helping ')
        .replace(/^tutor /, 'tutoring ');
    }
    return nameLower;
  };

  const actionTarget = getActionTarget();

  // Helper to derive the pedagogical "bridge" guidance
  const getBridgeGuidance = () => {
    const personMatch = question.prompt.match(/^Explain (?:how|why|whether) ([A-Za-z]+)'s/i);
    const person = personMatch ? personMatch[1] : '佢';

    const chosenName = chosenOpt ? chosenOpt.name : '所選選項';

    // Target forgone option: highest ranked option among those NOT chosen
    const forgoneOpt = [...question.options]
      .filter(o => o.id !== question.chosenOptionId)
      .sort((a, b) => a.originalRank - b.originalRank)[0];
    const forgoneName = forgoneOpt ? forgoneOpt.name : '放棄的最高價值選項';

    if (question.level === 1) {
      const isDecreased = question.valueChange === 'decrease';
      return {
        quote: `「即係話：${person} 為咗【${chosenName}】，放棄咗一個價值變【${isDecreased ? '低' : '高'}】咗嘅選項（${forgoneName}）！」`,
        deduction: `所以，${person} 為咗【${chosenName}】所犧牲的代價（機會成本）會點變？請在下方選出你的答案！`,
        hint: `💡 思考引導：很多同學會疑惑「事件無影響${chosenName}本身，點解${chosenName}的成本會變？」記住：機會成本是指「放棄的最高價值」——既然為了${chosenName}所犧牲掉的選項價值變${isDecreased ? '低' : '高'}了，為此付出的代價（機會成本）自然……？請在下方作答！`
      };
    } else if (question.level === 2) {
      return {
        quote: `「注意：事件只改變咗【${chosenName}】本身，但 ${person} 放棄嘅【${forgoneName}】價值完全無變！」`,
        deduction: `既然為咗做【${chosenName}】所放棄的代價完全無變，${person} 的機會成本有冇變？請在下方選出你的答案！`,
        hint: `💡 思考引導：千萬不要混淆自身價值與機會成本！只要放棄的最高價值選項價值不變，機會成本會……？請在下方作答！`
      };
    } else if (question.level === 3) {
      // Level 3: Chosen is Option 2 (Non-First Choice)
      if (question.reasoningSummary.affectsChosen) {
        return {
          quote: `「注意：${person} 選擇咗第二偏好【${chosenName}】，放棄嘅最高價值選項係第一偏好【${forgoneName}】！新事件只改變咗【${chosenName}】本身，但放棄嘅【${forgoneName}】價值完全無變！」`,
          deduction: `既然為咗做【${chosenName}】所放棄的代價（${forgoneName}）完全無變，${person} 的機會成本有冇變？請在下方選出你的答案！`,
          hint: `💡 思考引導：先分清誰是被選、誰是被放棄，再看事件影響哪一個！既然放棄的第一偏好價值不變，機會成本會……？`
        };
      }
      const isDecreased = question.valueChange === 'decrease';
      return {
        quote: `「注意：${person} 選擇咗做第二偏好【${chosenName}】，因此佢放棄嘅最高價值選項係第一偏好【${forgoneName}】！」`,
        deduction: `既然放棄嘅【${forgoneName}】價值變【${isDecreased ? '低' : '高'}】咗，${person} 做【${chosenName}】的機會成本會點變？請在下方選出你的答案！`,
        hint: `💡 思考引導：要分清誰是被選、誰是被放棄！因為${chosenName}是所選，${forgoneName}是放棄的選項。思考放棄選項的價值變化，並在下方完成結論！`
      };
    } else if (question.level === 4) {
      // Level 4: Third Option ("May")
      return {
        quote: `「注意：事件影響嘅係第三選項！只要第三選項價值仲低過【${forgoneName}】，放棄的代價就無變；但如果超越咗，放棄的代價先會變高！」`,
        deduction: `在未確定第三選項有否超越第二選項的情況下，機會成本係「必然改變」定「可能改變」？請在下方選出你的答案！`,
        hint: `💡 思考引導：第三選項價值上升，不一定超越第二選項；思考一下在甚麼情況下才會影響到放棄的最高價值選項，並在下方選出答案！`
      };
    } else {
      // Level 5: Necessarily (with 3rd Option affected)
      return {
        quote: `「注意：事件提升咗第三選項嘅價值！要回應『是否必然保持不變 (necessarily remains unchanged)』，必須分兩個情況討論：」`,
        deduction: `情況一：若第三選項價值仍低於【${forgoneName}】，成本不變；情況二：若超越【${forgoneName}】，成本增加！既然有機會增加，機會成本係咪「必然保持不變」？請在下方選出你的答案！`,
        hint: `💡 思考引導：只要存在一個情況令機會成本增加，它就「並非必然保持不變 (does not necessarily remain unchanged)」！請在下方選出答案！`
      };
    }
  };

  const bridge = getBridgeGuidance();

  // Define steps for this question
  interface StepDef {
    id: string;
    stepNumber: string;
    title: string;
    titleZh: string;
    hint?: string;
    options: { id: string; text: string; isCorrect: boolean; feedback: string }[];
  }

  const stepsList: StepDef[] = [
    // STEP 1: ALWAYS ASK CHOSEN OPTION FIRST!
    {
      id: 'step-chosen',
      stepNumber: '1',
      title: 'What is the chosen option?',
      titleZh: '第一步：先找出所選選項（題目問及哪一個選項的機會成本？）',
      hint: 'The chosen option is the option whose opportunity cost is being questioned.',
      options: question.options.map(opt => ({
        id: opt.id,
        text: opt.name,
        isCorrect: opt.id === question.chosenOptionId,
        feedback: opt.id === question.chosenOptionId
          ? `Correct! The question asks about the opportunity cost of ${actionTarget}.`
          : `Not this one. The question is specifically asking about the opportunity cost of ${actionTarget}.`
      }))
    },

    // STEP 2: HIGHEST-VALUED OPTION FORGONE
    {
      id: 'step-forgone',
      stepNumber: '2',
      title: `What is the cost of "${actionTarget}"?\n(i.e., what is the highest-valued option forgone?)`,
      titleZh: `第二步：甚麼是「${actionTarget}」的成本？（即：放棄的最高價值選項是什麼？）`,
      hint: `The opportunity cost of ${actionTarget} is the value of the highest-valued option forgone.`,
      options: question.options
        .filter(opt => opt.id !== question.chosenOptionId)
        .map(opt => ({
          id: opt.id,
          text: `${opt.name} (${opt.originalRank === 1 ? '1st' : opt.originalRank === 2 ? '2nd' : '3rd'} preference)`,
          isCorrect: opt.name.toLowerCase().includes(forgoneOptName.toLowerCase().slice(0, 10)) || forgoneOptName.toLowerCase().includes(opt.name.toLowerCase().slice(0, 10)),
          feedback: (opt.name.toLowerCase().includes(forgoneOptName.toLowerCase().slice(0, 10)) || forgoneOptName.toLowerCase().includes(opt.name.toLowerCase().slice(0, 10)))
            ? `Correct! ${opt.name} is the highest-ranked alternative forgone.`
            : `Incorrect. This alternative was ranked lower than ${forgoneOptName}.`
        }))
    },

    // STEP 3: AFFECTED OPTION & VALUE CHANGE
    {
      id: 'step-affected',
      stepNumber: '3',
      title: 'Which option is affected by the event, and what happens to its value?',
      titleZh: '第三步：新事件影響了哪一個選項？該選項的價值有何變化？',
      options: (() => {
        if (question.level === 1) {
          return [
            {
              id: 'aff-correct',
              text: `${forgoneOptName} (highest-valued option forgone), and its value ${question.valueChange}s`,
              isCorrect: true,
              feedback: `Spot on! The event changes the value of ${forgoneOptName}, which is the highest-valued option forgone.`
            },
            {
              id: 'aff-chosen',
              text: `${chosenOpt?.name} (chosen option), and its value changes`,
              isCorrect: false,
              feedback: 'The event did not affect the chosen option.'
            },
            {
              id: 'aff-opposite',
              text: `${forgoneOptName}, but its value ${question.valueChange === 'decrease' ? 'increases' : 'decreases'}`,
              isCorrect: false,
              feedback: `Look closely at the event: it ${question.valueChange}s the value, not ${question.valueChange === 'decrease' ? 'increases' : 'decreases'}.`
            }
          ];
        } else if (question.level === 2) {
          return [
            {
              id: 'aff-chosen-correct',
              text: `${chosenOpt?.name} (the chosen option), and its value ${question.valueChange}s`,
              isCorrect: true,
              feedback: `Correct! The event directly affects the chosen option (${chosenOpt?.name}), NOT the forgone option.`
            },
            {
              id: 'aff-forgone-wrong',
              text: `${forgoneOptName} (the forgone option), and its value decreases`,
              isCorrect: false,
              feedback: `The event affects ${chosenOpt?.name}, not ${forgoneOptName}.`
            }
          ];
        } else if (question.level === 3) {
          // Level 3: Non-First Choice
          if (question.reasoningSummary.affectsChosen) {
            return [
              {
                id: 'aff-l3-chosen-correct',
                text: `${chosenOpt?.name} (the chosen option), and its value ${question.valueChange}s`,
                isCorrect: true,
                feedback: `Correct! The event affects ${chosenOpt?.name} (the chosen option), leaving ${forgoneOptName} unchanged.`
              },
              {
                id: 'aff-l3-forgone-wrong',
                text: `${forgoneOptName} (highest-valued option forgone), and its value ${question.valueChange}s`,
                isCorrect: false,
                feedback: `${forgoneOptName} is completely unaffected by this event.`
              }
            ];
          }
          return [
            {
              id: 'aff-l3-forgone-correct',
              text: `${forgoneOptName} (highest-valued option forgone), and its value ${question.valueChange}s`,
              isCorrect: true,
              feedback: `Correct! The event affects ${forgoneOptName}, which is the highest-valued option forgone.`
            },
            {
              id: 'aff-l3-chosen-wrong',
              text: `${chosenOpt?.name} (the chosen option), and its value ${question.valueChange}s`,
              isCorrect: false,
              feedback: `${chosenOpt?.name} is completely unaffected by this event.`
            }
          ];
        } else {
          // Level 4 (Third Option "May") and Level 5 (Necessarily with 3rd Option affected)
          const thirdOpt = question.options.find(o => o.originalRank === 3);
          return [
            {
              id: 'aff-third-correct',
              text: `${thirdOpt?.name || 'The third option'} (the 3rd option), and its value increases`,
              isCorrect: true,
              feedback: 'Spot on! The event directly improves the value/enjoyment of the third option.'
            },
            {
              id: 'aff-forgone-wrong',
              text: `${forgoneOptName} (highest-valued option forgone), and its value increases`,
              isCorrect: false,
              feedback: `${forgoneOptName} is completely unaffected by this event.`
            },
            {
              id: 'aff-chosen-wrong',
              text: `${chosenOpt?.name} (chosen option), and its value decreases`,
              isCorrect: false,
              feedback: 'The chosen option is unaffected.'
            }
          ];
        }
      })()
    },

    // BRIDGE STEP FOR LEVEL 4 (Third Option "May")
    ...(question.level === 4 ? [{
      id: 'step-bridge-l4',
      stepNumber: '3b',
      title: 'Does this third option automatically become the new highest-valued option forgone?',
      titleZh: '第三步 (b)：第三選項價值增加，是否「必然」成為新的最高價值放棄選項？',
      options: [
        {
          id: 'bridge-cond-correct',
          text: `Only IF its value becomes higher than the current highest-valued option forgone (${forgoneOptName})`,
          isCorrect: true,
          feedback: `Crucial economic principle! It only replaces ${forgoneOptName} if its value exceeds ${forgoneOptName}. If it remains lower, ${forgoneOptName} remains the forgone option!`
        },
        {
          id: 'bridge-auto-wrong',
          text: `Yes, whenever any third option increases in value, it automatically becomes the new forgone option`,
          isCorrect: false,
          feedback: `Misconception! If the increase is not enough to surpass ${forgoneOptName}, ${forgoneOptName} is still the highest-valued forgone option.`
        }
      ]
    }] : []),

    // BRIDGE STEP FOR LEVEL 5 (Necessarily with Third Option affected -> Two-Branch Analysis)
    ...(question.level === 5 ? [{
      id: 'step-bridge-l5',
      stepNumber: '3b',
      title: 'Since the third option\'s value increases, what are the two possible outcomes for opportunity cost?',
      titleZh: '第三步 (b)：既然第三選項價值增加，機會成本有哪兩個可能結果（雙分支分析）？',
      options: [
        {
          id: 'bridge-l5-correct',
          text: `If its new value remains lower than ${forgoneOptName}, cost remains unchanged; if its new value exceeds ${forgoneOptName}, it becomes the new forgone option and cost increases.`,
          isCorrect: true,
          feedback: 'Bingo! Because there are two possible outcomes depending on whether the 3rd option surpasses the 2nd option, we must state both branches.'
        },
        {
          id: 'bridge-l5-wrong1',
          text: `Since ${forgoneOptName} was not affected, opportunity cost must remain unchanged under all circumstances.`,
          isCorrect: false,
          feedback: `Careful! If the 3rd option's new value exceeds ${forgoneOptName}, it replaces ${forgoneOptName} as the new highest-valued option forgone!`
        },
        {
          id: 'bridge-l5-wrong2',
          text: 'Since the third option\'s value increased, opportunity cost must increase under all circumstances.',
          isCorrect: false,
          feedback: `Careful! If the 3rd option's new value is still lower than ${forgoneOptName}, opportunity cost remains unchanged.`
        }
      ]
    }] : []),

    // FINAL STEP: CLEARLY WRITE "cost of [action]" FOLLOWING THE PROMPT!
    {
      id: 'step-cost',
      stepNumber: '4',
      title: `What happens to the opportunity cost of ${actionTarget}?`,
      titleZh: `第四步：因此，${actionTarget} 的機會成本最終結論是什麼？（依據題目）`,
      options: (() => {
        const baseOptions = [
          {
            id: 'decreases',
            text: `The opportunity cost of ${actionTarget} decreases`,
            isCorrect: expectedCostChange === 'decreases',
            feedback: expectedCostChange === 'decreases'
              ? `Correct! The value of the highest-valued option forgone decreased, so the opportunity cost of ${actionTarget} decreases.`
              : 'Incorrect conclusion.'
          },
          {
            id: 'increases',
            text: `The opportunity cost of ${actionTarget} increases`,
            isCorrect: expectedCostChange === 'increases',
            feedback: expectedCostChange === 'increases'
              ? `Correct! The value of the highest-valued option forgone increased, so the opportunity cost of ${actionTarget} increases.`
              : 'Incorrect conclusion.'
          },
          {
            id: 'remains_unchanged',
            text: `The opportunity cost of ${actionTarget} remains unchanged`,
            isCorrect: expectedCostChange === 'remains_unchanged',
            feedback: expectedCostChange === 'remains_unchanged'
              ? `Correct! The highest-valued option forgone and its value remained unchanged, so the opportunity cost of ${actionTarget} remains unchanged.`
              : 'Incorrect conclusion.'
          }
        ];

        if (question.level === 4) {
          baseOptions.push({
            id: 'may_increase',
            text: `The opportunity cost of ${actionTarget} may increase`,
            isCorrect: expectedCostChange === 'may_increase',
            feedback: `Correct! Because it only increases IF the value exceeds ${forgoneOptName}, it "may increase".`
          });
        }

        if (question.level === 5) {
          baseOptions.push({
            id: 'not_necessarily_unchanged',
            text: `No — the opportunity cost of ${actionTarget} does not necessarily remain unchanged (it may increase if the 3rd option exceeds ${forgoneOptName})`,
            isCorrect: true,
            feedback: `Spot on! Because the opportunity cost increases if the 3rd option's value exceeds ${forgoneOptName}, it does NOT necessarily remain unchanged.`
          });
        }

        return baseOptions;
      })()
    }
  ];

  const currentStep = stepsList[currentStepIdx];
  const isAllStepsFinished = currentStepIdx >= stepsList.length;

  const handleSelectOption = (optId: string) => {
    if (!currentStep || isAllStepsFinished) return;

    const selectedOption = currentStep.options.find(o => o.id === optId);
    if (!selectedOption) return;

    if (selectedOption.isCorrect) {
      // Correct!
      // Instantly mark as completed, keep visible in stream, and advance
      const newRecord: PracticeCompletedStep = {
        stepNumber: currentStep.stepNumber,
        title: currentStep.title,
        questionZh: currentStep.titleZh,
        selectedText: selectedOption.text
      };

      setCompletedSteps(prev => [...prev, newRecord]);
      setWrongSelection(null);
      setWrongFeedback(null);

      const nextIdx = currentStepIdx + 1;
      setCurrentStepIdx(nextIdx);

      // Smooth scroll
      setTimeout(() => {
        activeStepRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 60);
    } else {
      // Wrong option clicked: immediately highlight in red and provide feedback
      setWrongSelection(optId);
      setWrongFeedback(selectedOption.feedback);
      onRecordMistake(question.type === 'TYPE_C' ? 'CHOSEN_OPTION_FALLACY' : 'FORGOT_VALUE_LINK');
    }
  };

  const handleResetPractice = () => {
    setCurrentStepIdx(0);
    setCompletedSteps([]);
    setWrongSelection(null);
    setWrongFeedback(null);
  };

  return (
    <div className="bg-white border border-stone-200/90 rounded-2xl overflow-hidden shadow-xs space-y-0">
      {/* Header bar with Fading Practice Stage Switcher */}
      <div className="px-6 py-4 border-b border-stone-200 bg-stone-50/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 bg-amber-100/70 px-2 py-0.5 rounded">
            2. Practise Mode (漸減鷹架訓練)
          </span>
          <h3 className="text-sm font-semibold text-stone-900 mt-1">
            {practiceMode === 'flow'
              ? 'Attempt 2: Core Checkpoints (Instant progression & persistent train of thought)'
              : 'Attempt 3: Key Info Provided → Write Final Answer Independently'}
          </h3>
        </div>

        <div className="flex items-center gap-1 bg-stone-200/70 p-1 rounded-lg text-xs font-medium">
          <button
            onClick={() => {
              setPracticeMode('flow');
              handleResetPractice();
            }}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              practiceMode === 'flow'
                ? 'bg-white text-stone-900 shadow-xs font-bold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Attempt 2: Core Checkpoints
          </button>
          <button
            onClick={() => setPracticeMode('independent')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              practiceMode === 'independent'
                ? 'bg-white text-stone-900 shadow-xs font-bold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Attempt 3: Write Independently
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {practiceMode === 'flow' ? (
          /* CONTINUOUS STEP-BY-STEP FLOW */
          <div className="space-y-4">
            {/* Header info */}
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <span className="text-xs font-bold text-stone-700">
                {isAllStepsFinished
                  ? 'All Checkpoints Verified!'
                  : `Checkpoint ${currentStepIdx + 1} of ${stepsList.length}`}
              </span>
              {completedSteps.length > 0 && (
                <button
                  onClick={handleResetPractice}
                  className="text-xs text-stone-500 hover:text-stone-800 flex items-center gap-1 font-medium cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Restart Practice</span>
                </button>
              )}
            </div>

            {/* PREVIOUSLY COMPLETED CHECKPOINTS (KEPT VISIBLE SO STUDENTS SEE THE TRAIN OF THOUGHT) */}
            {completedSteps.map((comp) => (
              <div
                key={comp.stepNumber}
                className="p-4 bg-stone-50/90 border border-stone-200 rounded-xl space-y-1.5 relative animate-in fade-in duration-150"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-stone-700 whitespace-pre-line">
                    Step {comp.stepNumber}: {comp.title}
                  </span>
                  <span className="text-emerald-700 font-bold flex items-center gap-1 shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Verified</span>
                  </span>
                </div>
                {comp.questionZh && (
                  <p className="text-[11px] text-stone-500">
                    {comp.questionZh}
                  </p>
                )}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-emerald-300 text-emerald-950 font-bold text-xs rounded-lg shadow-2xs">
                  <span>Your selection:</span>
                  <span className="underline decoration-emerald-400">{comp.selectedText}</span>
                </div>
              </div>
            ))}

            {/* CURRENT ACTIVE STEP (USER PICKS ANSWER, INSTANTLY ADVANCES IF CORRECT) */}
            {!isAllStepsFinished && currentStep && (
              <div
                ref={activeStepRef}
                className="p-5 bg-white border-2 border-amber-300 rounded-xl space-y-4 shadow-xs animate-in fade-in slide-in-from-top-2 duration-200"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-900 font-bold text-xs rounded">
                      Step {currentStep.stepNumber}
                    </span>
                    <h4 className="text-sm font-bold text-stone-900 whitespace-pre-line">
                      {currentStep.title}
                    </h4>
                  </div>
                  <p className="text-xs text-stone-600">
                    {currentStep.titleZh}
                  </p>
                </div>

                {/* 關鍵思維銜接引導 (The Missing Link): 得出最終機會成本結論前的重要思考 */}
                {currentStep.id === 'step-cost' && (
                  <div className="p-4 bg-amber-50/95 border-2 border-amber-300 rounded-xl space-y-2.5 animate-in fade-in slide-in-from-top-1 duration-200">
                    <div className="flex items-center gap-2">
                      <span className="text-base">💡</span>
                      <span className="text-xs font-bold text-amber-950 uppercase tracking-wide">
                        關鍵思維銜接引導 (Think-Through Before Concluding):
                      </span>
                    </div>

                    <div className="bg-white/95 rounded-xl p-3.5 border border-amber-200 space-y-2 shadow-2xs">
                      <p className="text-sm sm:text-[15px] font-bold text-amber-950 leading-relaxed font-sans">
                        {bridge.quote}
                      </p>
                      <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-amber-950 bg-amber-100/80 px-3 py-2 rounded-lg border border-amber-300">
                        <span className="text-amber-800">👉</span>
                        <span>{bridge.deduction}</span>
                      </div>
                      <p className="text-xs text-stone-600 leading-relaxed pt-1.5 border-t border-amber-100">
                        {bridge.hint}
                      </p>
                    </div>
                  </div>
                )}

                {/* Option Buttons: instant selection with zero waiting */}
                <div className="space-y-2 pt-1">
                  {currentStep.options.map(opt => {
                    const isSelectedWrong = wrongSelection === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleSelectOption(opt.id)}
                        className={`w-full p-3.5 rounded-xl border text-xs text-left font-medium transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isSelectedWrong
                            ? 'bg-rose-50 border-rose-400 text-rose-950 ring-1 ring-rose-400'
                            : 'bg-stone-50/70 border-stone-200 text-stone-800 hover:bg-stone-100 hover:border-stone-300'
                        }`}
                      >
                        <span className="leading-snug">{opt.text}</span>
                        {isSelectedWrong && (
                          <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Instant Feedback on Wrong Choice */}
                {wrongFeedback && (
                  <div className="p-3 bg-rose-50/90 border border-rose-200 rounded-lg text-xs text-rose-900 font-medium flex items-start gap-2 animate-in fade-in duration-150">
                    <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <p>{wrongFeedback}</p>
                      <p className="text-[11px] text-rose-700 mt-0.5">Please try again with the correct economic principle.</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* COMPLETION BANNER & PROCEED BUTTON */}
            {isAllStepsFinished && (
              <div className="p-5 bg-emerald-50/80 border border-emerald-300 rounded-xl space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center gap-2.5 text-emerald-950 font-bold text-sm">
                  <div className="w-7 h-7 rounded-full bg-emerald-200 flex items-center justify-center text-emerald-800">
                    <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                  </div>
                  <div>
                    <h4>All Practice Checkpoints Completed Correctly!</h4>
                    <p className="text-xs text-emerald-800 font-normal">
                      Your reasoning chain for <span className="font-semibold underline">the opportunity cost of {actionTarget}</span> is solid.
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={onProceedToBuilder}
                    className="w-full sm:w-auto px-6 py-2.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <PenTool className="w-4 h-4" />
                    <span>Proceed to 3. Answer Builder</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ATTEMPT 3: INDEPENDENT WRITE MODE */
          <div className="space-y-4">
            <div className="p-4 bg-amber-50/70 rounded-xl border border-amber-200 space-y-2">
              <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider">
                Independent Reasoning Challenge (獨立推論作答)
              </span>
              <p className="text-xs text-amber-950 font-medium">
                Try writing a complete 3-mark DSE answer using the core formula:
                <br />
                <span className="font-mono text-amber-900">
                  Opportunity Cost = Value of the highest-valued option forgone
                </span>
              </p>
            </div>

            <textarea
              value={independentText}
              onChange={(e) => setIndependentText(e.target.value)}
              placeholder={`Write your answer here...\n\nExample structure:\n1. State what happens to the affected option...\n2. Identify ${forgoneOptName} as the highest-valued option forgone...\n3. Conclude on the opportunity cost of ${actionTarget}...`}
              rows={5}
              className="w-full p-4 text-xs font-mono bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-stone-900 leading-relaxed"
            />

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setShowIndependentClue(!showIndependentClue)}
                className="text-xs font-semibold text-stone-600 hover:text-stone-900 flex items-center gap-1 cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>{showIndependentClue ? 'Hide Clues' : 'Need Clues?'}</span>
              </button>

              <button
                onClick={onProceedToBuilder}
                className="px-5 py-2.5 text-xs font-bold text-white bg-stone-900 hover:bg-stone-800 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>Check in Answer Builder</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {showIndependentClue && (
              <div className="p-4 bg-stone-100/90 rounded-xl text-xs space-y-2 border border-stone-200">
                <span className="font-bold text-stone-800">Scaffolding Clues:</span>
                <ul className="list-disc list-inside space-y-1 text-stone-700">
                  <li><strong>Chosen Option:</strong> {chosenOpt?.name}</li>
                  <li><strong>Highest-Valued Option Forgone:</strong> {forgoneOptName}</li>
                  <li><strong>Target of question:</strong> Opportunity cost of {actionTarget}</li>
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
