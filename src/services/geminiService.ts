import { GoogleGenAI } from '@google/genai';
import { DSEQuestion, EvaluationResult, LevelId } from '../types/economics';
import { evaluateStudentAnswer } from '../utils/answerEvaluator';

// Check if an API key is available in environment
const apiKey = typeof process !== 'undefined' && process.env ? process.env.GEMINI_API_KEY : undefined;

let aiClient: GoogleGenAI | null = null;
try {
  if (apiKey) {
    aiClient = new GoogleGenAI({ apiKey });
  }
} catch {
  aiClient = null;
}

/**
 * Evaluates student answer using rule-based rubric checker first,
 * and if Gemini is available, supplements with advanced personalized commentary.
 */
export async function evaluateWithAI(
  studentAnswer: string,
  question: DSEQuestion
): Promise<EvaluationResult> {
  // Always get rigorous rule-based evaluation baseline
  const baseResult = evaluateStudentAnswer(studentAnswer, question);

  if (!aiClient) {
    return baseResult;
  }

  try {
    const prompt = `
You are an expert Hong Kong DSE Economics senior marker.
Evaluate this Form 4 student's answer to the following Opportunity Cost question:

Scenario:
${question.scenario}

Question Prompt:
${question.prompt}

Official Model Answer:
${question.modelAnswer}

Official Marking Scheme Points:
${question.markingRubric.points.map(p => `Point ${p.pointNumber}: ${p.criterion}`).join('\n')}

Student's Written Answer:
"${studentAnswer}"

Evaluate strictly according to HKDSE standards:
- Point 1: Identified relevant change in value
- Point 2: Correctly identified / considered highest-valued option forgone
- Point 3: Correctly linked highest-valued option forgone to opportunity cost
- Point 4: Handled "may" / "necessarily" when applicable

Provide a concise JSON response with:
{
  "score": number, // out of ${question.markingRubric.points.length}
  "markerComment": "concise, supportive guidance in DSE style",
  "strengths": ["point 1", ...],
  "areasToImprove": ["point 1", ...]
}
Return ONLY valid JSON.
`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const text = response.text?.trim();
    if (text) {
      const parsed = JSON.parse(text);
      if (parsed.score !== undefined) {
        return {
          ...baseResult,
          score: Math.min(question.markingRubric.points.length, Math.max(0, parsed.score)),
          overallFeedback: parsed.markerComment || baseResult.overallFeedback,
          strengths: parsed.strengths && parsed.strengths.length > 0 ? parsed.strengths : baseResult.strengths,
          areasToImprove: parsed.areasToImprove && parsed.areasToImprove.length > 0 ? parsed.areasToImprove : baseResult.areasToImprove
        };
      }
    }
  } catch (err) {
    console.warn('AI evaluation fallback to rule-based evaluation:', err);
  }

  return baseResult;
}

/**
 * Generates a brand new custom DSE scenario for a given level
 */
export async function generateNewScenario(level: LevelId): Promise<Partial<DSEQuestion> | null> {
  const fallbackScenarios: Record<LevelId, Partial<DSEQuestion>> = {
    1: {
      id: `GEN-L1-${Date.now()}`,
      level: 1,
      type: 'TYPE_A',
      title: 'Guitar Lesson Fee Hike vs Gaming',
      scenario: 'Ken has 2 hours of leisure time on Sunday. His preferences are:\n1st preference: Play basketball with classmates\n2nd preference: Attend a private guitar lesson\n3rd preference: Play video games\n\nHis guitar tutor raises the lesson fee.',
      scenarioZh: 'Ken 週日有 2 小時空閒時間。他的偏好順序是：\n第一偏好：與同學打籃球\n第二偏好：上私人結他班\n第三偏好：打機\n\n結他導師加了學費。',
      options: [
        { id: 'opt-gen-bb', name: 'Play basketball with classmates', originalRank: 1 },
        { id: 'opt-gen-gt', name: 'Attend a private guitar lesson', originalRank: 2 },
        { id: 'opt-gen-gm', name: 'Play video games', originalRank: 3 },
      ],
      chosenOptionId: 'opt-gen-bb',
      affectedOptionId: 'opt-gen-gt',
      valueChange: 'decrease',
      prompt: 'Explain how Ken\'s opportunity cost of choosing to play basketball changes.',
      promptZh: '解釋 Ken 選擇打籃球的機會成本會如何改變。',
      modelAnswer: 'The increase in tuition fee decreases the net value of attending the guitar lesson, which is the highest-valued option forgone. Therefore, the opportunity cost of playing basketball decreases.',
      modelAnswerZh: '學費增加降低了上結他班（最高價值放棄選項）的淨價值。因此，打籃球的機會成本減少。'
    },
    2: {
      id: `GEN-L2-${Date.now()}`,
      level: 2,
      type: 'TYPE_C',
      title: 'Free Popcorn at Cinema',
      scenario: 'Mandy\'s ranked preferences for Friday evening are:\n1st preference: Watch a movie\n2nd preference: Work as a cafe barista\n3rd preference: Read at the library\n\nThe cinema surprises all moviegoers with free unlimited gourmet popcorn and drinks.',
      scenarioZh: 'Mandy 週五晚上的偏好是：\n第一偏好：看電影\n第二偏好：在咖啡店當咖啡師\n第三偏好：在圖書館閱讀\n\n戲院為所有觀眾免費提供無限量爆谷和飲品。',
      options: [
        { id: 'opt-gen-m', name: 'Watch a movie', originalRank: 1 },
        { id: 'opt-gen-c', name: 'Work as a cafe barista', originalRank: 2 },
        { id: 'opt-gen-l', name: 'Read at the library', originalRank: 3 },
      ],
      chosenOptionId: 'opt-gen-m',
      affectedOptionId: 'opt-gen-m',
      valueChange: 'increase',
      prompt: 'Explain whether Mandy\'s opportunity cost of choosing to watch the movie changes.',
      promptZh: '解釋 Mandy 選擇看電影的機會成本是否會改變。',
      modelAnswer: 'The free snacks increase the value of watching the movie (the chosen option). However, the highest-valued option forgone (working as a cafe barista) and its value remain unchanged. Therefore, Mandy\'s opportunity cost of watching the movie remains unchanged.',
      modelAnswerZh: '免費小食增加了看電影（所選選項）的價值。然而，最高價值放棄選項（在咖啡店工作）及其價值保持不變。因此，Mandy 選擇看電影的機會成本保持不變。'
    },
    3: {
      id: `GEN-L3-${Date.now()}`,
      level: 3,
      type: 'TYPE_H',
      title: 'Jason Chooses Option 2: Soccer Coaching',
      scenario: 'Jason has the following preferences for Saturday afternoon:\n1st preference: Watch an international soccer match live at the stadium\n2nd preference: Coach junior soccer students\n3rd preference: Rest at home\n\nThe ticket price for the stadium match is reduced by 50%.',
      scenarioZh: 'Jason 週六下午的偏好排序是：\n第一偏好：在球場現場觀看國際足球賽\n第二偏好：指導青少年足球班\n第三偏好：留在家中休息\n\n球場門票宣佈半價優惠。',
      options: [
        { id: 'opt-gen-st', name: 'Watch international soccer match at stadium', originalRank: 1 },
        { id: 'opt-gen-sc', name: 'Coach junior soccer students', originalRank: 2 },
        { id: 'opt-gen-rh', name: 'Rest at home', originalRank: 3 },
      ],
      chosenOptionId: 'opt-gen-sc',
      affectedOptionId: 'opt-gen-st',
      valueChange: 'increase',
      prompt: 'Explain how Jason\'s opportunity cost of choosing to coach junior soccer students changes.',
      promptZh: '解釋 Jason 選擇指導足球班的機會成本如何改變。',
      modelAnswer: 'Because Jason chooses to coach junior soccer students, his highest-valued option forgone is watching the soccer match at the stadium (his 1st preference). The 50% discount on tickets decreases the cost of watching the match, which increases its net value. Since the value of the highest-valued option forgone increases, the opportunity cost of coaching junior soccer students increases.',
      modelAnswerZh: '因為 Jason 選擇指導足球班，他放棄的最高價值選項是到球場看比賽（第一偏好）。門票半價降低了看比賽的支出，增加了其淨價值。由於最高價值放棄選項的價值增加，指導足球班的機會成本增加。'
    },
    4: {
      id: `GEN-L4-${Date.now()}`,
      level: 4,
      type: 'TYPE_E',
      title: 'Grandparent Gift for Helping at Home',
      scenario: 'Leo\'s ranked preferences for Saturday are:\n1st preference: Visit a science museum\n2nd preference: Work part-time in a convenience store\n3rd preference: Help his grandparents with garden work\n\nHis grandparents announce they will give a $500 reward to any grandchild who helps in the garden.',
      scenarioZh: 'Leo 週六的偏好是：\n第一偏好：參觀科學館\n第二偏好：在便利店做兼職\n第三偏好：幫爺爺奶奶打理花園\n\n爺爺奶奶宣佈會給幫忙打理花園的孫兒 500 元獎勵。',
      options: [
        { id: 'opt-gen-sm', name: 'Visit a science museum', originalRank: 1 },
        { id: 'opt-gen-cs', name: 'Work part-time in a convenience store', originalRank: 2 },
        { id: 'opt-gen-gw', name: 'Help grandparents with garden work', originalRank: 3 },
      ],
      chosenOptionId: 'opt-gen-sm',
      affectedOptionId: 'opt-gen-gw',
      valueChange: 'increase',
      prompt: 'Explain why Leo\'s opportunity cost of choosing to visit the science museum may increase.',
      promptZh: '解釋為什麼 Leo 選擇參觀科學館的機會成本「可能增加」。',
      modelAnswer: 'The reward increases the value of helping in the garden (the third option). If the value of helping in the garden becomes higher than the value of working in the convenience store (the current highest-valued option forgone), helping in the garden becomes the new highest-valued option forgone. Therefore, the opportunity cost of visiting the science museum may increase.',
      modelAnswerZh: '獎勵增加了打理花園（第三選項）的價值。若打理花園的價值高於在便利店工作（目前最高價值放棄選項），打理花園便會成為新的最高價值放棄選項。因此，參觀科學館的機會成本可能增加。'
    },
    5: {
      id: `GEN-L5-${Date.now()}`,
      level: 5,
      type: 'TYPE_G',
      title: 'Free Workshop for Third Option (Necessarily)',
      scenario: 'Emily\'s ranked preferences for Sunday morning are:\n1st preference: Attend an art exhibition\n2nd preference: Tutor a primary school student\n3rd preference: Join a pottery workshop\n\nThe pottery workshop suddenly offers a 50% discount and a complimentary pottery starter kit.',
      scenarioZh: 'Emily 週日早上的偏好是：\n第一偏好：參觀藝術展\n第二偏好：為小學生補習\n第三偏好：參加陶藝工作坊\n\n陶藝工作坊突然推出半價優惠並贈送陶藝套裝。',
      options: [
        { id: 'opt-gen-art', name: 'Attend an art exhibition', originalRank: 1 },
        { id: 'opt-gen-tut', name: 'Tutor a primary school student', originalRank: 2 },
        { id: 'opt-gen-pot', name: 'Join a pottery workshop', originalRank: 3 },
      ],
      chosenOptionId: 'opt-gen-art',
      affectedOptionId: 'opt-gen-pot',
      valueChange: 'increase',
      prompt: 'Explain whether Emily\'s opportunity cost of choosing to attend the art exhibition necessarily remains unchanged.',
      promptZh: '解釋 Emily 選擇參觀藝術展的機會成本是否「必然保持不變」。',
      modelAnswer: 'No. If the value of the pottery workshop remains lower than tutoring the primary student, tutoring remains the highest-valued option forgone and the opportunity cost remains unchanged. However, if the value of the pottery workshop becomes higher than tutoring, it becomes the new highest-valued option forgone and the opportunity cost increases. Therefore, the opportunity cost does not necessarily remain unchanged.',
      modelAnswerZh: '不是。如果陶藝工作坊的價值仍低於補習，補習仍是最高價值放棄選項，機會成本保持不變。然而，如果陶藝工作坊的價值超越補習，它將成為新的最高價值放棄選項，機會成本增加。因此，機會成本不必然保持不變。'
    }
  };

  return fallbackScenarios[level] || fallbackScenarios[1];
}
