export type LevelId = 1 | 2 | 3 | 4 | 5;

export type QuestionTypeId = 
  | 'TYPE_A' // Highest-valued option forgone value decreases -> opportunity cost decreases
  | 'TYPE_B' // Highest-valued option forgone value increases -> opportunity cost increases
  | 'TYPE_C' // Chosen option value changes -> opportunity cost remains unchanged
  | 'TYPE_D' // Third option value changes -> check if it exceeds current forgone option
  | 'TYPE_E' // Third option may become new highest-valued option forgone -> opportunity cost may change
  | 'TYPE_F' // "Explain whether..." question
  | 'TYPE_G' // "Explain whether ... necessarily..." question
  | 'TYPE_H'; // Chosen option is not the first option (2nd or 3rd option chosen)

export interface OptionItem {
  id: string;
  name: string;
  originalRank: number; // 1 = 1st preference, 2 = 2nd preference, 3 = 3rd preference
  description?: string;
}

export interface ScaffoldingStep {
  id: number;
  question: string;
  questionZh?: string;
  explanation: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    feedback: string;
  }[];
}

export interface MarkingPoint {
  id: number;
  title: string;
  description: string;
  keywords: string[];
}

export interface DSEQuestion {
  id: string;
  level: LevelId;
  type: QuestionTypeId;
  title: string;
  scenario: string;
  scenarioZh?: string;
  options: OptionItem[];
  chosenOptionId: string;
  affectedOptionId: string;
  valueChange: 'increase' | 'decrease';
  
  // The actual question prompt as seen in exam
  prompt: string;
  promptZh?: string;
  
  chineseHints: {
    term: string;
    termZh: string;
    explanationZh: string;
  }[];

  // Scaffolding steps for Learn mode (revealed one-by-one)
  scaffoldingSteps: ScaffoldingStep[];

  // Answer Builder components
  answerBuilder: {
    stepA: {
      prompt: string;
      sentenceTemplate: string; // e.g. "The wage cut [change] the value of [option]."
      slots: {
        id: string;
        label: string;
        options: string[];
        correctAnswer: string;
      }[];
    };
    stepB: {
      prompt: string;
      sentenceTemplate: string;
      slots: {
        id: string;
        label: string;
        options: string[];
        correctAnswer: string;
      }[];
    };
    stepC: {
      prompt: string;
      sentenceTemplate: string;
      slots: {
        id: string;
        label: string;
        options: string[];
        correctAnswer: string;
      }[];
    };
  };

  // Full Model Answer (DSE Marking Scheme Style)
  modelAnswer: string;
  modelAnswerZh?: string;
  markingRubric: {
    points: {
      pointNumber: number;
      title: string;
      criterion: string;
      examplePhrase: string;
    }[];
  };

  // Key reasoning summary for visual chain
  reasoningSummary: {
    chosenOptionName: string;
    initialForgoneOptionName: string;
    affectedOptionName: string;
    affectsChosen: boolean;
    affectsForgone: boolean;
    affectsThird: boolean;
    finalForgoneOptionName: string;
    finalCostChange: 'increases' | 'decreases' | 'remains_unchanged' | 'may_increase' | 'not_necessarily_unchanged';
    explanationSummary: string;
  };
}

export interface RubricCheckResult {
  pointNumber: number;
  title: string;
  awarded: boolean;
  matchedFeedback: string;
  suggestion?: string;
}

export interface EvaluationResult {
  score: number;
  maxScore: number;
  checks: RubricCheckResult[];
  overallFeedback: string;
  strengths: string[];
  areasToImprove: string[];
}

export interface MistakeRecord {
  id: string;
  questionId: string;
  questionTitle: string;
  level: LevelId;
  type: QuestionTypeId;
  stepFailedIndex?: number;
  misconceptionType: 
    | 'CHOSEN_OPTION_FALLACY' // Thinking change in chosen option alters opportunity cost
    | 'THIRD_OPTION_AUTOMATIC_CHANGE' // Assuming 3rd option change immediately changes cost
    | 'WRONG_FORGONE_OPTION' // Picking 3rd option or chosen option as forgone option
    | 'NECESSARILY_ONE_SIDED' // Failing to evaluate both outcome branches
    | 'FORGOT_VALUE_LINK'; // Saying cost changes without stating forgone option value changed
  date: string;
}
