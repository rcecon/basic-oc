import { DSEQuestion } from '../types/economics';

export const DSE_QUESTIONS: DSEQuestion[] = [
  // ----------------------------------------------------
  // LEVEL 1: Direct Highest-Valued Option Forgone -> Opportunity Cost
  // ----------------------------------------------------
  {
    id: 'L1-Q1',
    level: 1,
    type: 'TYPE_A',
    title: 'Theme Park vs Part-time Wage Cut',
    scenario: 'Mary is planning her Saturday. Her ranked preferences are:\n1st preference: Visit a theme park\n2nd preference: Work part-time in a restaurant\n3rd preference: Go hiking with friends\n\nLater, the restaurant announces a wage cut for part-time staff.',
    scenarioZh: 'Mary 正在計劃週六的安排。她的偏好排列為：\n第一偏好：去主題公園\n第二偏好：在餐廳做兼職\n第三偏好：與朋友行山\n\n後來，餐廳宣佈削減兼職員工的工資。',
    options: [
      { id: 'opt-theme-park', name: 'Visit a theme park', originalRank: 1 },
      { id: 'opt-restaurant', name: 'Work part-time in a restaurant', originalRank: 2 },
      { id: 'opt-hiking', name: 'Go hiking with friends', originalRank: 3 },
    ],
    chosenOptionId: 'opt-theme-park',
    affectedOptionId: 'opt-restaurant',
    valueChange: 'decrease',
    prompt: 'Explain how Mary\'s opportunity cost of visiting the theme park changes.',
    promptZh: '解釋 Mary 去主題公園的機會成本會如何改變。',
    chineseHints: [
      {
        term: 'Explain how ... changes',
        termZh: '解釋...如何改變',
        explanationZh: '題目要求說明機會成本是「增加」、「減少」還是「保持不變」，並交代背後的經濟學推論。'
      },
      {
        term: 'Opportunity cost',
        termZh: '機會成本',
        explanationZh: '指在放棄的所有選項中，價值最高的一個（highest-valued option forgone 的價值）。'
      }
    ],
    scaffoldingSteps: [
      {
        id: 1,
        question: 'Step 1: What is Mary\'s chosen option?',
        questionZh: '第一步：Mary 選擇的選項是什麼？',
        explanation: 'The chosen option is the option whose opportunity cost is being questioned.',
        options: [
          { id: 's1-a', text: 'Visit a theme park', isCorrect: true, feedback: 'Correct! The question asks about her cost of visiting the theme park.' },
          { id: 's1-b', text: 'Work part-time in a restaurant', isCorrect: false, feedback: 'Working part-time is an alternative she gave up, not what she chose.' },
          { id: 's1-c', text: 'Go hiking with friends', isCorrect: false, feedback: 'Hiking is her 3rd preference, not her chosen option.' }
        ]
      },
      {
        id: 2,
        question: 'Step 2: What is her highest-valued option forgone?',
        questionZh: '第二步：她放棄的最高價值選項是什麼？',
        explanation: 'Among all forgone alternatives, it is the one ranked highest.',
        options: [
          { id: 's2-a', text: 'Work part-time in a restaurant (2nd preference)', isCorrect: true, feedback: 'Correct! Since she chose option 1, option 2 is her highest-valued option forgone.' },
          { id: 's2-b', text: 'Go hiking with friends (3rd preference)', isCorrect: false, feedback: 'Hiking is valued lower than working part-time, so it is not the highest-valued option forgone.' },
          { id: 's2-c', text: 'Both working part-time and hiking combined', isCorrect: false, feedback: 'Misconception! Opportunity cost is ONLY the single highest-valued option forgone, not the sum of all alternatives.' }
        ]
      },
      {
        id: 3,
        question: 'Step 3: Which option is affected by the wage cut, and how does its value change?',
        questionZh: '第三步：工資削減影響了哪個選項？該選項的價值有何變化？',
        explanation: 'The restaurant cut wages for part-time staff, reducing the earnings/value of that option.',
        options: [
          { id: 's3-a', text: 'Working part-time in the restaurant, and its value decreases', isCorrect: true, feedback: 'Correct! Lower wages mean the value of working part-time decreases.' },
          { id: 's3-b', text: 'Visiting the theme park, and its value decreases', isCorrect: false, feedback: 'Theme park ticket prices or fun did not change.' },
          { id: 's3-c', text: 'Working part-time in the restaurant, and its value increases', isCorrect: false, feedback: 'A wage cut reduces income, so value decreases, not increases.' },
          { id: 's3-d', text: 'Going hiking, and its value decreases', isCorrect: false, feedback: 'Hiking is completely unaffected by the restaurant wage cut.' }
        ]
      },
      {
        id: 4,
        question: 'Step 4: Is this affected option the highest-valued option forgone, and does its value change?',
        questionZh: '第四步：這個受影響的選項是否正是最高價值放棄選項？其價值有何變化？',
        explanation: 'Working part-time was identified as the highest-valued option forgone in Step 2.',
        options: [
          { id: 's4-a', text: 'Yes, working part-time is the highest-valued option forgone, and its value decreases.', isCorrect: true, feedback: 'Correct! The value of the highest-valued option forgone decreases.' },
          { id: 's4-b', text: 'No, it is the chosen option.', isCorrect: false, feedback: 'Working part-time was forgone, not chosen.' },
          { id: 's4-c', text: 'Yes, but its value remains unchanged.', isCorrect: false, feedback: 'Its value decreased due to the wage cut.' }
        ]
      },
      {
        id: 5,
        question: 'Step 5: So what happens to Mary\'s opportunity cost of visiting the theme park?',
        questionZh: '第五步：因此，Mary 去主題公園的機會成本會如何？',
        explanation: 'Since Opportunity Cost = Value of the highest-valued option forgone, when that value decreases, opportunity cost decreases.',
        options: [
          { id: 's7-a', text: 'It decreases', isCorrect: true, feedback: 'Spot on! Opportunity cost decreases because the value of the highest-valued option forgone decreases.' },
          { id: 's7-b', text: 'It increases', isCorrect: false, feedback: 'Remember: Opportunity cost moves in the SAME direction as the value of the highest-valued option forgone.' },
          { id: 's7-c', text: 'It remains unchanged', isCorrect: false, feedback: 'The value of the highest-valued option forgone changed, so cost cannot remain unchanged.' }
        ]
      }
    ],
    answerBuilder: {
      stepA: {
        prompt: '1. Describe the effect of the event on the affected option:',
        sentenceTemplate: 'The wage cut [change] the value of [option].',
        slots: [
          {
            id: 'change',
            label: 'value change',
            options: ['decreases', 'increases', 'does not change'],
            correctAnswer: 'decreases'
          },
          {
            id: 'option',
            label: 'affected option',
            options: ['working part-time in the restaurant', 'visiting the theme park', 'going hiking'],
            correctAnswer: 'working part-time in the restaurant'
          }
        ]
      },
      stepB: {
        prompt: '2. Identify the economic status of this option:',
        sentenceTemplate: 'Working part-time in the restaurant is the [status].',
        slots: [
          {
            id: 'status',
            label: 'option status',
            options: ['highest-valued option forgone', 'chosen option', 'least preferred option'],
            correctAnswer: 'highest-valued option forgone'
          }
        ]
      },
      stepC: {
        prompt: '3. State the final conclusion on opportunity cost:',
        sentenceTemplate: 'Therefore, the opportunity cost of visiting the theme park [conclusion].',
        slots: [
          {
            id: 'conclusion',
            label: 'cost conclusion',
            options: ['decreases', 'increases', 'remains unchanged'],
            correctAnswer: 'decreases'
          }
        ]
      }
    },
    modelAnswer: 'The wage cut decreases the value of working part-time in the restaurant, which is the highest-valued option forgone. Therefore, the opportunity cost of visiting the theme park decreases.',
    modelAnswerZh: '減薪降低了在餐廳做兼職（即最高價值的放棄選項）的價值。因此，選擇去主題公園的機會成本減少。',
    markingRubric: {
      points: [
        {
          pointNumber: 1,
          title: 'Value change identified',
          criterion: 'States that the wage cut decreases the value of working part-time.',
          examplePhrase: 'decreases the value of working part-time'
        },
        {
          pointNumber: 2,
          title: 'Highest-valued option forgone identified',
          criterion: 'Explicitly identifies working part-time as the highest-valued option forgone.',
          examplePhrase: 'which is the highest-valued option forgone'
        },
        {
          pointNumber: 3,
          title: 'Correct conclusion on opportunity cost',
          criterion: 'Concludes that the opportunity cost of visiting the theme park decreases.',
          examplePhrase: 'opportunity cost ... decreases'
        }
      ]
    },
    reasoningSummary: {
      chosenOptionName: 'Visit a theme park',
      initialForgoneOptionName: 'Work part-time in a restaurant',
      affectedOptionName: 'Work part-time in a restaurant',
      affectsChosen: false,
      affectsForgone: true,
      affectsThird: false,
      finalForgoneOptionName: 'Work part-time in a restaurant',
      finalCostChange: 'decreases',
      explanationSummary: 'Value of highest-valued option forgone decreases → Opportunity cost decreases.'
    }
  },
  {
    id: 'L1-Q2',
    level: 1,
    type: 'TYPE_B',
    title: 'Tutoring Wage Increase vs Movie',
    scenario: 'Alex has 3 hours of free time on Sunday afternoon. His ranked preferences are:\n1st preference: Watch a movie\n2nd preference: Tutor a primary school student\n3rd preference: Sleep at home\n\nThe primary student\'s parent offers a higher hourly tutoring wage to Alex.',
    scenarioZh: 'Alex 週日下午有 3 小時空閒時間。他的偏好順序是：\n第一偏好：看電影\n第二偏好：為小學生補習\n第三偏好：在家睡覺\n\n小學生的家長提出提高給 Alex 的補習時薪。',
    options: [
      { id: 'opt-movie', name: 'Watch a movie', originalRank: 1 },
      { id: 'opt-tutor', name: 'Tutor a primary school student', originalRank: 2 },
      { id: 'opt-sleep', name: 'Sleep at home', originalRank: 3 },
    ],
    chosenOptionId: 'opt-movie',
    affectedOptionId: 'opt-tutor',
    valueChange: 'increase',
    prompt: 'Explain how Alex\'s opportunity cost of watching the movie changes.',
    promptZh: '解釋 Alex 看電影的機會成本會如何改變。',
    chineseHints: [
      {
        term: 'Opportunity cost of choosing...',
        termZh: '選擇...的機會成本',
        explanationZh: '題目要求評估所選選項（看電影）的成本。成本是放棄選項中最高者。'
      }
    ],
    scaffoldingSteps: [
      {
        id: 1,
        question: 'Step 1: What is Alex\'s chosen option?',
        questionZh: '第一步：Alex 選擇了什麼？',
        explanation: 'He chose to watch the movie.',
        options: [
          { id: 's1-a', text: 'Watch a movie', isCorrect: true, feedback: 'Correct!' },
          { id: 's1-b', text: 'Tutor a student', isCorrect: false, feedback: 'Tutoring was his 2nd preference that he gave up.' }
        ]
      },
      {
        id: 2,
        question: 'Step 2: What is the highest-valued option forgone?',
        questionZh: '第二步：最高價值放棄選項是什麼？',
        explanation: 'Tutoring is ranked second, so it is the highest-valued alternative forgone.',
        options: [
          { id: 's2-a', text: 'Tutoring the primary student', isCorrect: true, feedback: 'Correct!' },
          { id: 's2-b', text: 'Sleeping at home', isCorrect: false, feedback: 'Sleeping is ranked 3rd.' }
        ]
      },
      {
        id: 3,
        question: 'Step 3: Which option\'s value is affected by the higher wage offer?',
        questionZh: '第三步：提高時薪影響了哪個選項的價值？',
        explanation: 'The offer is for tutoring.',
        options: [
          { id: 's3-a', text: 'Tutoring the primary student (highest-valued option forgone)', isCorrect: true, feedback: 'Correct! The higher hourly wage increases the value of tutoring.' },
          { id: 's3-b', text: 'Watching the movie (chosen option)', isCorrect: false, feedback: 'The movie itself is unaffected.' }
        ]
      },
      {
        id: 4,
        question: 'Step 4: How does the value of the highest-valued option forgone change?',
        questionZh: '第四步：最高價值放棄選項的價值有何改變？',
        explanation: 'Higher wage means higher monetary return.',
        options: [
          { id: 's4-a', text: 'Increases', isCorrect: true, feedback: 'Correct! The value of tutoring increases.' },
          { id: 's4-b', text: 'Decreases', isCorrect: false, feedback: 'Higher wage increases benefits.' }
        ]
      },
      {
        id: 5,
        question: 'Step 5: Therefore, what happens to Alex\'s opportunity cost of watching the movie?',
        questionZh: '第五步：因此，看電影的機會成本如何變化？',
        explanation: 'Opportunity cost is the value of the highest-valued option forgone.',
        options: [
          { id: 's5-a', text: 'Increases', isCorrect: true, feedback: 'Spot on! Value of forgone option increases → Opportunity cost increases.' },
          { id: 's5-b', text: 'Decreases', isCorrect: false, feedback: 'Incorrect direction.' },
          { id: 's5-c', text: 'Remains unchanged', isCorrect: false, feedback: 'The forgone option\'s value changed.' }
        ]
      }
    ],
    answerBuilder: {
      stepA: {
        prompt: '1. State the effect of higher wage on tutoring:',
        sentenceTemplate: 'The higher hourly wage [change] the value of [option].',
        slots: [
          {
            id: 'change',
            label: 'change',
            options: ['increases', 'decreases', 'does not change'],
            correctAnswer: 'increases'
          },
          {
            id: 'option',
            label: 'option',
            options: ['tutoring the primary student', 'watching the movie', 'sleeping at home'],
            correctAnswer: 'tutoring the primary student'
          }
        ]
      },
      stepB: {
        prompt: '2. Link tutoring to the economic term:',
        sentenceTemplate: 'Tutoring the primary student is Alex\'s [status].',
        slots: [
          {
            id: 'status',
            label: 'status',
            options: ['highest-valued option forgone', 'chosen option', 'third preference'],
            correctAnswer: 'highest-valued option forgone'
          }
        ]
      },
      stepC: {
        prompt: '3. State the conclusion on opportunity cost:',
        sentenceTemplate: 'Therefore, the opportunity cost of watching the movie [conclusion].',
        slots: [
          {
            id: 'conclusion',
            label: 'conclusion',
            options: ['increases', 'decreases', 'remains unchanged'],
            correctAnswer: 'increases'
          }
        ]
      }
    },
    modelAnswer: 'The higher hourly wage increases the value of tutoring the primary student, which is the highest-valued option forgone. Therefore, the opportunity cost of watching the movie increases.',
    modelAnswerZh: '提高時薪增加了補習（即最高價值的放棄選項）的價值。因此，選擇看電影的機會成本增加。',
    markingRubric: {
      points: [
        {
          pointNumber: 1,
          title: 'Value change identified',
          criterion: 'Identifies that the higher wage increases the value of tutoring.',
          examplePhrase: 'increases the value of tutoring'
        },
        {
          pointNumber: 2,
          title: 'Forgone option identified',
          criterion: 'Identifies tutoring as the highest-valued option forgone.',
          examplePhrase: 'highest-valued option forgone'
        },
        {
          pointNumber: 3,
          title: 'Conclusion stated',
          criterion: 'Concludes opportunity cost increases.',
          examplePhrase: 'opportunity cost ... increases'
        }
      ]
    },
    reasoningSummary: {
      chosenOptionName: 'Watch a movie',
      initialForgoneOptionName: 'Tutor a primary school student',
      affectedOptionName: 'Tutor a primary school student',
      affectsChosen: false,
      affectsForgone: true,
      affectsThird: false,
      finalForgoneOptionName: 'Tutor a primary school student',
      finalCostChange: 'increases',
      explanationSummary: 'Value of highest-valued option forgone increases → Opportunity cost increases.'
    }
  },

  // ----------------------------------------------------
  // LEVEL 2: Chosen Option vs Highest-Valued Option Forgone (The Classic Misconception)
  // ----------------------------------------------------
  {
    id: 'L2-Q1',
    level: 2,
    type: 'TYPE_C',
    title: 'New Roller Coaster at Theme Park',
    scenario: 'Mary\'s ranked preferences for Saturday afternoon are:\n1st preference: Visit a theme park\n2nd preference: Work part-time in a restaurant\n3rd preference: Go hiking\n\nOn that day, the theme park opens a world-class new roller coaster.',
    scenarioZh: 'Mary 週六下午的偏好順序是：\n第一偏好：去主題公園\n第二偏好：在餐廳做兼職\n第三偏好：去行山\n\n當天，主題公園開放了世界級新過山車。',
    options: [
      { id: 'opt-tp', name: 'Visit a theme park', originalRank: 1 },
      { id: 'opt-rest', name: 'Work part-time in a restaurant', originalRank: 2 },
      { id: 'opt-hike', name: 'Go hiking', originalRank: 3 },
    ],
    chosenOptionId: 'opt-tp',
    affectedOptionId: 'opt-tp',
    valueChange: 'increase',
    prompt: 'Explain whether Mary\'s opportunity cost of visiting the theme park changes.',
    promptZh: '解釋 Mary 去主題公園的機會成本是否會改變。',
    chineseHints: [
      {
        term: 'Explain whether ... changes',
        termZh: '解釋...是否會改變',
        explanationZh: '題目要求判斷並解釋機會成本是「會改變」還是「保持不變」。'
      },
      {
        term: 'Common Misconception alert',
        termZh: '常見謬誤提示',
        explanationZh: '注意：所選選項的價值改變，並不等於機會成本改變！機會成本只取決於「最高價值放棄選項」的價值。'
      }
    ],
    scaffoldingSteps: [
      {
        id: 1,
        question: 'Step 1: What is the chosen option?',
        questionZh: '第一步：所選的選項是什麼？',
        explanation: 'Mary chose to visit the theme park.',
        options: [
          { id: 's1-a', text: 'Visit the theme park', isCorrect: true, feedback: 'Correct!' },
          { id: 's1-b', text: 'Work part-time', isCorrect: false, feedback: 'Working part-time was forgone.' }
        ]
      },
      {
        id: 2,
        question: 'Step 2: What is the highest-valued option forgone?',
        questionZh: '第二步：最高價值放棄選項是什麼？',
        explanation: 'Her 2nd preference is working part-time.',
        options: [
          { id: 's2-a', text: 'Work part-time in the restaurant', isCorrect: true, feedback: 'Correct!' },
          { id: 's2-b', text: 'Visit the theme park', isCorrect: false, feedback: 'Theme park was chosen, not forgone!' },
          { id: 's2-c', text: 'Go hiking', isCorrect: false, feedback: 'Hiking is 3rd preference.' }
        ]
      },
      {
        id: 3,
        question: 'Step 3: Which option does the new roller coaster affect?',
        questionZh: '第三步：新過山車影響了哪個選項？',
        explanation: 'The roller coaster is inside the theme park.',
        options: [
          { id: 's3-a', text: 'Visiting the theme park (the chosen option)', isCorrect: true, feedback: 'Correct! It increases the enjoyment/value of the chosen option.' },
          { id: 's3-b', text: 'Working part-time (the forgone option)', isCorrect: false, feedback: 'The restaurant work is completely unaffected.' }
        ]
      },
      {
        id: 4,
        question: 'Step 4: Does the value of the highest-valued option forgone (working part-time) change?',
        questionZh: '第四步：最高價值放棄選項（兼職）的價值有沒有改變？',
        explanation: 'Check if anything changed about the restaurant job.',
        options: [
          { id: 's4-a', text: 'No, it remains unchanged.', isCorrect: true, feedback: 'Spot on! The restaurant job conditions and wage are completely unchanged.' },
          { id: 's4-b', text: 'Yes, it increases.', isCorrect: false, feedback: 'The roller coaster is at the theme park, not the restaurant.' }
        ]
      },
      {
        id: 5,
        question: 'Step 5: What is the golden rule of opportunity cost?',
        questionZh: '第五步：機會成本的黃金法則是什麼？',
        explanation: 'Opportunity cost is the value of the highest-valued option forgone.',
        options: [
          { id: 's5-a', text: 'Opportunity cost depends ONLY on the highest-valued option forgone, not the chosen option.', isCorrect: true, feedback: 'Crucial insight! Changes in the chosen option\'s own value do NOT affect opportunity cost.' },
          { id: 's5-b', text: 'Whenever any option\'s value changes, opportunity cost must change.', isCorrect: false, feedback: 'This is the most common DSE mistake!' }
        ]
      },
      {
        id: 6,
        question: 'Step 6: Therefore, what happens to Mary\'s opportunity cost of visiting the theme park?',
        questionZh: '第六步：因此，Mary 去主題公園的機會成本如何？',
        explanation: 'Since the value of the highest-valued option forgone is unchanged, opportunity cost remains unchanged.',
        options: [
          { id: 's6-a', text: 'Remains unchanged', isCorrect: true, feedback: 'Excellent! Opportunity cost remains unchanged.' },
          { id: 's6-b', text: 'Increases', isCorrect: false, feedback: 'No! The chosen option is more valuable, but opportunity cost is what you give up!' },
          { id: 's6-c', text: 'Decreases', isCorrect: false, feedback: 'No.' }
        ]
      }
    ],
    answerBuilder: {
      stepA: {
        prompt: '1. State which option\'s value changed:',
        sentenceTemplate: 'The new roller coaster increases the value of [option], which is the [role].',
        slots: [
          {
            id: 'option',
            label: 'option',
            options: ['visiting the theme park', 'working part-time in the restaurant', 'going hiking'],
            correctAnswer: 'visiting the theme park'
          },
          {
            id: 'role',
            label: 'role',
            options: ['chosen option', 'highest-valued option forgone', 'third option'],
            correctAnswer: 'chosen option'
          }
        ]
      },
      stepB: {
        prompt: '2. State what happens to the highest-valued option forgone:',
        sentenceTemplate: 'However, the highest-valued option forgone ([forgoneOption]) and its value [forgoneState].',
        slots: [
          {
            id: 'forgoneOption',
            label: 'forgone option',
            options: ['working part-time in the restaurant', 'visiting the theme park', 'going hiking'],
            correctAnswer: 'working part-time in the restaurant'
          },
          {
            id: 'forgoneState',
            label: 'state of forgone option',
            options: ['remain unchanged', 'increase', 'decrease'],
            correctAnswer: 'remain unchanged'
          }
        ]
      },
      stepC: {
        prompt: '3. Conclude on opportunity cost:',
        sentenceTemplate: 'Therefore, Mary\'s opportunity cost of visiting the theme park [conclusion].',
        slots: [
          {
            id: 'conclusion',
            label: 'cost conclusion',
            options: ['remains unchanged', 'increases', 'decreases'],
            correctAnswer: 'remains unchanged'
          }
        ]
      }
    },
    modelAnswer: 'The new roller coaster increases the value of visiting the theme park (the chosen option). However, the highest-valued option forgone (working part-time in the restaurant) and its value remain unchanged. Therefore, Mary\'s opportunity cost of visiting the theme park remains unchanged.',
    modelAnswerZh: '新過山車增加了去主題公園（所選選項）的價值。然而，最高價值放棄選項（在餐廳做兼職）及其價值保持不變。因此，Mary 選擇去主題公園的機會成本保持不變。',
    markingRubric: {
      points: [
        {
          pointNumber: 1,
          title: 'Identifies affected option is the chosen option',
          criterion: 'Recognizes that the event affects the value of visiting the theme park (the chosen option).',
          examplePhrase: 'increases the value of the chosen option'
        },
        {
          pointNumber: 2,
          title: 'Highest-valued option forgone unchanged',
          criterion: 'States that working part-time is the highest-valued option forgone and its value remains unchanged.',
          examplePhrase: 'highest-valued option forgone remains unchanged'
        },
        {
          pointNumber: 3,
          title: 'Correct conclusion',
          criterion: 'Concludes that opportunity cost remains unchanged.',
          examplePhrase: 'opportunity cost remains unchanged'
        }
      ]
    },
    reasoningSummary: {
      chosenOptionName: 'Visit a theme park',
      initialForgoneOptionName: 'Work part-time in a restaurant',
      affectedOptionName: 'Visit a theme park',
      affectsChosen: true,
      affectsForgone: false,
      affectsThird: false,
      finalForgoneOptionName: 'Work part-time in a restaurant',
      finalCostChange: 'remains_unchanged',
      explanationSummary: 'Chosen option value changes, but highest-valued option forgone is unchanged → Opportunity cost remains unchanged.'
    }
  },
  {
    id: 'L2-Q2',
    level: 2,
    type: 'TYPE_C',
    title: 'Cinema Air-Conditioning Breakdown',
    scenario: 'Chris has the following preferences for Saturday night:\n1st preference: Watch a movie in a cinema\n2nd preference: Visit Ocean Park\n3rd preference: Help with housework\n\nThe cinema\'s air-conditioning breaks down, making the auditorium uncomfortably hot.',
    scenarioZh: 'Chris 週六晚上的偏好順序為：\n第一偏好：在戲院看電影\n第二偏好：去海洋公園\n第三偏好：幫忙做家務\n\n放映期間，戲院冷氣故障，院內悶熱難耐。',
    options: [
      { id: 'opt-movie-c', name: 'Watch a movie in a cinema', originalRank: 1 },
      { id: 'opt-ocean-c', name: 'Visit Ocean Park', originalRank: 2 },
      { id: 'opt-housework-c', name: 'Help with housework', originalRank: 3 },
    ],
    chosenOptionId: 'opt-movie-c',
    affectedOptionId: 'opt-movie-c',
    valueChange: 'decrease',
    prompt: 'Explain whether Chris\'s opportunity cost of watching the movie changes.',
    promptZh: '解釋 Chris 看電影的機會成本是否會改變。',
    chineseHints: [
      {
        term: 'Explain whether ... changes',
        termZh: '解釋...是否會改變',
        explanationZh: '需清楚指出機會成本「會改變」或「不會改變 / 保持不變」，並提供理由。'
      }
    ],
    scaffoldingSteps: [
      {
        id: 1,
        question: 'Step 1: What is Chris\'s chosen option?',
        questionZh: '第一步：Chris 選擇了什麼？',
        explanation: 'He chose to watch the movie.',
        options: [
          { id: 's1-a', text: 'Watch a movie in a cinema', isCorrect: true, feedback: 'Correct!' },
          { id: 's1-b', text: 'Visit Ocean Park', isCorrect: false, feedback: 'This was his 2nd preference.' }
        ]
      },
      {
        id: 2,
        question: 'Step 2: What is the highest-valued option forgone?',
        questionZh: '第二步：最高價值放棄選項是什麼？',
        explanation: 'His 2nd choice is visiting Ocean Park.',
        options: [
          { id: 's2-a', text: 'Visiting Ocean Park', isCorrect: true, feedback: 'Correct!' },
          { id: 's2-b', text: 'Helping with housework', isCorrect: false, feedback: 'Housework is 3rd preference.' }
        ]
      },
      {
        id: 3,
        question: 'Step 3: Which option does the air-conditioning breakdown affect?',
        questionZh: '第三步：冷氣故障影響了哪一個選項？',
        explanation: 'It makes watching the movie less enjoyable.',
        options: [
          { id: 's3-a', text: 'Watching the movie (the chosen option)', isCorrect: true, feedback: 'Correct! It decreases the value of the chosen option.' },
          { id: 's3-b', text: 'Visiting Ocean Park (the forgone option)', isCorrect: false, feedback: 'Ocean Park is unaffected.' }
        ]
      },
      {
        id: 4,
        question: 'Step 4: Does the value of the highest-valued option forgone change?',
        questionZh: '第四步：最高價值放棄選項（海洋公園）的價值改變了嗎？',
        explanation: 'Ocean Park is completely unaffected.',
        options: [
          { id: 's4-a', text: 'No, it remains unchanged.', isCorrect: true, feedback: 'Correct!' },
          { id: 's4-b', text: 'Yes, it decreases.', isCorrect: false, feedback: 'Ocean Park did not change.' }
        ]
      },
      {
        id: 5,
        question: 'Step 5: Therefore, does Chris\'s opportunity cost of watching the movie change?',
        questionZh: '第五步：因此，看電影的機會成本有否改變？',
        explanation: 'Since the forgone option and its value are unchanged, cost is unchanged.',
        options: [
          { id: 's5-a', text: 'No, the opportunity cost remains unchanged.', isCorrect: true, feedback: 'Correct! The value of the chosen option fell, but the opportunity cost is unchanged.' },
          { id: 's5-b', text: 'Yes, the opportunity cost decreases.', isCorrect: false, feedback: 'Misconception! Do not confuse the value of the chosen option with opportunity cost.' }
        ]
      }
    ],
    answerBuilder: {
      stepA: {
        prompt: '1. Describe the effect of the air-conditioning breakdown:',
        sentenceTemplate: 'The air-conditioning breakdown [effect] the value of [option], which is the [role].',
        slots: [
          {
            id: 'effect',
            label: 'effect',
            options: ['decreases', 'increases', 'does not affect'],
            correctAnswer: 'decreases'
          },
          {
            id: 'option',
            label: 'option',
            options: ['watching the movie', 'visiting Ocean Park', 'helping with housework'],
            correctAnswer: 'watching the movie'
          },
          {
            id: 'role',
            label: 'role',
            options: ['chosen option', 'highest-valued option forgone', 'third option'],
            correctAnswer: 'chosen option'
          }
        ]
      },
      stepB: {
        prompt: '2. State the condition of the highest-valued option forgone:',
        sentenceTemplate: 'However, the highest-valued option forgone ([forgone]) and its value [state].',
        slots: [
          {
            id: 'forgone',
            label: 'forgone option',
            options: ['visiting Ocean Park', 'helping with housework', 'watching the movie'],
            correctAnswer: 'visiting Ocean Park'
          },
          {
            id: 'state',
            label: 'state',
            options: ['remain unchanged', 'increase', 'decrease'],
            correctAnswer: 'remain unchanged'
          }
        ]
      },
      stepC: {
        prompt: '3. State the final conclusion:',
        sentenceTemplate: 'Therefore, the opportunity cost of watching the movie [conclusion].',
        slots: [
          {
            id: 'conclusion',
            label: 'conclusion',
            options: ['remains unchanged', 'decreases', 'increases'],
            correctAnswer: 'remains unchanged'
          }
        ]
      }
    },
    modelAnswer: 'The air-conditioning breakdown decreases the value of watching the movie (the chosen option). However, the highest-valued option forgone (visiting Ocean Park) and its value remain unchanged. Therefore, Chris\'s opportunity cost of watching the movie remains unchanged.',
    modelAnswerZh: '冷氣故障降低了看電影（所選選項）的價值。然而，最高價值放棄選項（去海洋公園）及其價值保持不變。因此，Chris 選擇看電影的機會成本保持不變。',
    markingRubric: {
      points: [
        {
          pointNumber: 1,
          title: 'Identifies change in chosen option value',
          criterion: 'States that the event decreases the value of watching the movie (the chosen option).',
          examplePhrase: 'decreases value of chosen option'
        },
        {
          pointNumber: 2,
          title: 'Highest-valued option forgone unchanged',
          criterion: 'Explicitly identifies visiting Ocean Park as the highest-valued option forgone and that its value is unchanged.',
          examplePhrase: 'highest-valued option forgone remains unchanged'
        },
        {
          pointNumber: 3,
          title: 'Correct conclusion',
          criterion: 'Concludes that opportunity cost remains unchanged.',
          examplePhrase: 'opportunity cost remains unchanged'
        }
      ]
    },
    reasoningSummary: {
      chosenOptionName: 'Watch a movie in a cinema',
      initialForgoneOptionName: 'Visit Ocean Park',
      affectedOptionName: 'Watch a movie in a cinema',
      affectsChosen: true,
      affectsForgone: false,
      affectsThird: false,
      finalForgoneOptionName: 'Visit Ocean Park',
      finalCostChange: 'remains_unchanged',
      explanationSummary: 'Chosen option value decreases, but forgone option value is unchanged → Opportunity cost remains unchanged.'
    }
  },

  // ----------------------------------------------------
  // LEVEL 3: Chosen Option is NOT the First Option (Non-First Choice)
  // ----------------------------------------------------
  {
    id: 'L3-Q1',
    level: 3,
    type: 'TYPE_H',
    title: 'Kelvin Chooses Option 2: Thrill Rides Closed at Theme Park',
    scenario: 'Kelvin has the following ranked preferences for Sunday afternoon:\n1st preference: Visit a theme park\n2nd preference: Work part-time at a bookstore\n3rd preference: Go hiking with friends\n\nLater that day, the theme park announces that several popular thrill rides are closed for annual maintenance.',
    scenarioZh: 'Kelvin 週日下午的偏好排序為：\n第一偏好：去主題公園\n第二偏好：在書店做兼職\n第三偏好：與朋友去行山\n\n當天晚些時候，主題公園宣佈多個熱門機動遊戲設施因年檢維修而暫停開放。',
    options: [
      { id: 'opt-k-tp', name: 'Visit a theme park', originalRank: 1 },
      { id: 'opt-k-bs', name: 'Work part-time at a bookstore', originalRank: 2 },
      { id: 'opt-k-hk', name: 'Go hiking with friends', originalRank: 3 },
    ],
    chosenOptionId: 'opt-k-bs', // NOTE: Chosen option is 2nd preference!
    affectedOptionId: 'opt-k-tp',
    valueChange: 'decrease',
    prompt: 'Explain how Kelvin\'s opportunity cost of working part-time at the bookstore changes.',
    promptZh: '解釋 Kelvin 在書店做兼職的機會成本會如何改變。',
    chineseHints: [
      {
        term: 'Chosen option is NOT the 1st option',
        termZh: '所選選項不是第一偏好',
        explanationZh: '重要關鍵：題目問的是「選擇在書店做兼職」的機會成本！所選選項是兼職，那麼放棄選項中價值最高的是哪一個？是「去主題公園」（第一偏好），而不是行山！'
      },
      {
        term: 'Thrill rides closed',
        termZh: '設施暫停開放',
        explanationZh: '熱門機動遊戲設施暫停開放，直接降低了去主題公園的樂趣與價值（value）。'
      }
    ],
    scaffoldingSteps: [
      {
        id: 1,
        question: 'Step 1: CAREFUL READ: What is Kelvin\'s CHOSEN option in this question?',
        questionZh: '第一步：細心閱讀：本題中 Kelvin 選擇的選項是什麼？',
        explanation: 'Check whose opportunity cost is being asked about in the question.',
        options: [
          { id: 's1-a', text: 'Working part-time at the bookstore (his 2nd preference)', isCorrect: true, feedback: 'Correct! The question asks about his cost of working part-time.' },
          { id: 's1-b', text: 'Visiting the theme park', isCorrect: false, feedback: 'The question asks about working at the bookstore.' }
        ]
      },
      {
        id: 2,
        question: 'Step 2: What is Kelvin\'s highest-valued option forgone?',
        questionZh: '第二步：Kelvin 放棄的最高價值選項是什麼？',
        explanation: 'Since he chose option 2, the options forgone are option 1 and option 3. Between them, option 1 has higher value.',
        options: [
          { id: 's2-a', text: 'Visiting the theme park (1st preference)', isCorrect: true, feedback: 'Crucial breakthrough! Since he chose option 2, option 1 is his highest-valued option forgone!' },
          { id: 's2-b', text: 'Going hiking with friends (3rd preference)', isCorrect: false, feedback: 'Hiking is valued lower than the theme park.' },
          { id: 's2-c', text: 'Working part-time at the bookstore', isCorrect: false, feedback: 'That is what he chose!' }
        ]
      },
      {
        id: 3,
        question: 'Step 3: Which option does the closure of thrill rides affect, and how does its value change?',
        questionZh: '第三步：機動遊戲設施暫停開放影響了哪一個選項？該選項的價值有何變化？',
        explanation: 'Rides being closed decreases the enjoyment/value of visiting the theme park.',
        options: [
          { id: 's3-a', text: 'Visiting the theme park (highest-valued option forgone), and its value decreases', isCorrect: true, feedback: 'Correct! With rides closed, the value of visiting the theme park decreases.' },
          { id: 's3-b', text: 'Working at the bookstore, and its value decreases', isCorrect: false, feedback: 'Bookstore work is completely unaffected.' },
          { id: 's3-c', text: 'Visiting the theme park, and its value increases', isCorrect: false, feedback: 'Closed rides reduce value, not increase it.' }
        ]
      },
      {
        id: 4,
        question: 'Step 4: Therefore, how does Kelvin\'s opportunity cost of working at the bookstore change?',
        questionZh: '第四步：因此，在書店兼職的機會成本如何改變？',
        explanation: 'Value of highest-valued option forgone decreases → Opportunity cost decreases.',
        options: [
          { id: 's4-a', text: 'It decreases', isCorrect: true, feedback: 'Brilliant! Opportunity cost of working at the bookstore decreases.' },
          { id: 's4-b', text: 'It increases', isCorrect: false, feedback: 'Value of forgone option decreased, not increased.' },
          { id: 's4-c', text: 'It remains unchanged', isCorrect: false, feedback: 'The forgone option was the theme park, whose value changed.' }
        ]
      }
    ],
    answerBuilder: {
      stepA: {
        prompt: '1. Identify the chosen option and highest-valued option forgone:',
        sentenceTemplate: 'Since Kelvin chooses to work part-time at the bookstore, his highest-valued option forgone is [forgone].',
        slots: [
          {
            id: 'forgone',
            label: 'forgone option',
            options: ['visiting the theme park', 'going hiking with friends'],
            correctAnswer: 'visiting the theme park'
          }
        ]
      },
      stepB: {
        prompt: '2. State the effect of rides being closed on that forgone option:',
        sentenceTemplate: 'The closure of thrill rides [effect] the value of [option].',
        slots: [
          {
            id: 'effect',
            label: 'value effect',
            options: ['decreases', 'increases', 'does not change'],
            correctAnswer: 'decreases'
          },
          {
            id: 'option',
            label: 'affected option',
            options: ['visiting the theme park', 'working at the bookstore'],
            correctAnswer: 'visiting the theme park'
          }
        ]
      },
      stepC: {
        prompt: '3. State the conclusion on opportunity cost:',
        sentenceTemplate: 'Therefore, Kelvin\'s opportunity cost of working part-time at the bookstore [conclusion].',
        slots: [
          {
            id: 'conclusion',
            label: 'cost conclusion',
            options: ['decreases', 'increases', 'remains unchanged'],
            correctAnswer: 'decreases'
          }
        ]
      }
    },
    modelAnswer: 'Because Kelvin chooses to work part-time at the bookstore, his highest-valued option forgone is visiting the theme park. The closure of thrill rides decreases the value of visiting the theme park. Since the value of the highest-valued option forgone decreases, the opportunity cost of working part-time at the bookstore decreases.',
    modelAnswerZh: '因為 Kelvin 選擇在書店做兼職，他放棄的最高價值選項是去主題公園。機動遊戲暫停開放降低了去主題公園的價值。由於最高價值放棄選項的價值減少，在書店做兼職的機會成本減少。',
    markingRubric: {
      points: [
        {
          pointNumber: 1,
          title: 'Correctly identifies highest-valued option forgone as option 1',
          criterion: 'Recognizes that visiting the theme park (1st preference) is the highest-valued option forgone when option 2 is chosen.',
          examplePhrase: 'highest-valued option forgone is visiting the theme park'
        },
        {
          pointNumber: 2,
          title: 'Identifies decrease in value of forgone option',
          criterion: 'States that the closure of rides decreases the value of visiting the theme park.',
          examplePhrase: 'decreases the value of visiting the theme park'
        },
        {
          pointNumber: 3,
          title: 'Concludes opportunity cost decreases',
          criterion: 'Correctly concludes that the opportunity cost of working at the bookstore decreases.',
          examplePhrase: 'opportunity cost ... decreases'
        }
      ]
    },
    reasoningSummary: {
      chosenOptionName: 'Work part-time at a bookstore (2nd preference)',
      initialForgoneOptionName: 'Visit a theme park (1st preference)',
      affectedOptionName: 'Visit a theme park',
      affectsChosen: false,
      affectsForgone: true,
      affectsThird: false,
      finalForgoneOptionName: 'Visit a theme park',
      finalCostChange: 'decreases',
      explanationSummary: 'Chosen is 2nd option → 1st option is forgone option! Value of 1st option decreases → Opportunity cost decreases.'
    }
  },
  {
    id: 'L3-Q2',
    level: 3,
    type: 'TYPE_H',
    title: 'Comfortable Environment at Family Store (Option 2 Chosen)',
    scenario: 'Chloe has the following ranked preferences for Friday evening:\n1st preference: Attend a music concert\n2nd preference: Help at her family\'s grocery store\n3rd preference: Rest at home\n\nHer family installs brand-new air-conditioning and plays pleasant music at the grocery store, making helping there much more comfortable.',
    scenarioZh: 'Chloe 週五晚上的偏好排序為：\n第一偏好：去聽音樂會\n第二偏好：在家族雜貨店幫忙\n第三偏好：留在家中休息\n\n雜貨店新安裝了舒適冷氣並播放悠揚音樂，令在雜貨店幫忙變得格外舒適宜人。',
    options: [
      { id: 'opt-chloe-c', name: 'Attend a music concert', originalRank: 1 },
      { id: 'opt-chloe-s', name: 'Help at her family\'s grocery store', originalRank: 2 },
      { id: 'opt-chloe-r', name: 'Rest at home', originalRank: 3 },
    ],
    chosenOptionId: 'opt-chloe-s', // Option 2 chosen
    affectedOptionId: 'opt-chloe-s', // Event affects Option 2 (chosen option)
    valueChange: 'increase',
    prompt: 'Explain whether Chloe\'s opportunity cost of helping at her family\'s grocery store changes.',
    promptZh: '解釋 Chloe 在家族雜貨店幫忙的機會成本是否會改變。',
    chineseHints: [
      {
        term: 'Opportunity cost of helping at grocery store',
        termZh: '在雜貨店幫忙的機會成本',
        explanationZh: '雜貨店幫忙是「所選選項」。更舒適的環境增加了所選選項的價值。但最高價值放棄選項是音樂會，音樂會的價值有沒有受影響？'
      }
    ],
    scaffoldingSteps: [
      {
        id: 1,
        question: 'Step 1: What is Chloe\'s chosen option and what is her highest-valued option forgone?',
        questionZh: '第一步：Chloe 所選選項是什麼？最高價值放棄選項是什麼？',
        explanation: 'Check carefully which option she chose.',
        options: [
          { id: 's1-a', text: 'Chosen: Help at grocery store; Highest-valued forgone: Attend music concert', isCorrect: true, feedback: 'Correct!' },
          { id: 's1-b', text: 'Chosen: Attend music concert; Highest-valued forgone: Help at grocery store', isCorrect: false, feedback: 'She chose to help at the grocery store.' }
        ]
      },
      {
        id: 2,
        question: 'Step 2: Which option does the new comfortable environment affect?',
        questionZh: '第二步：更舒適的工作環境影響了哪一個選項？',
        explanation: 'It makes helping at the grocery store more pleasant.',
        options: [
          { id: 's2-a', text: 'Helping at the grocery store (the chosen option)', isCorrect: true, feedback: 'Correct! It increases the value/satisfaction of the chosen option.' },
          { id: 's2-b', text: 'Attending the music concert (the forgone option)', isCorrect: false, feedback: 'The concert is unaffected.' }
        ]
      },
      {
        id: 3,
        question: 'Step 3: Does the value of the highest-valued option forgone (attending the concert) change?',
        questionZh: '第三步：最高價值放棄選項（音樂會）的價值有否改變？',
        explanation: 'The concert has nothing to do with the grocery store air-conditioning.',
        options: [
          { id: 's3-a', text: 'No, it remains unchanged.', isCorrect: true, feedback: 'Correct!' },
          { id: 's3-b', text: 'Yes, it increases.', isCorrect: false, feedback: 'The concert did not change.' }
        ]
      },
      {
        id: 4,
        question: 'Step 4: Therefore, does Chloe\'s opportunity cost of helping at the grocery store change?',
        questionZh: '第四步：因此，在雜貨店幫忙的機會成本有否改變？',
        explanation: 'Since the forgone option and its value are unchanged, cost is unchanged.',
        options: [
          { id: 's4-a', text: 'No, it remains unchanged.', isCorrect: true, feedback: 'Spot on! Changes in the chosen option\'s value never alter opportunity cost.' },
          { id: 's4-b', text: 'Yes, it decreases.', isCorrect: false, feedback: 'Do not confuse net benefit with opportunity cost.' }
        ]
      }
    ],
    answerBuilder: {
      stepA: {
        prompt: '1. State which option is chosen and which is the highest-valued option forgone:',
        sentenceTemplate: 'Helping at the family grocery store is Chloe\'s chosen option, and [forgone] is her highest-valued option forgone.',
        slots: [
          {
            id: 'forgone',
            label: 'forgone option',
            options: ['attending the music concert', 'resting at home'],
            correctAnswer: 'attending the music concert'
          }
        ]
      },
      stepB: {
        prompt: '2. State how the pleasant environment affects the options:',
        sentenceTemplate: 'The comfortable environment increases the value of the [affected], but the highest-valued option forgone and its value [state].',
        slots: [
          {
            id: 'affected',
            label: 'affected option',
            options: ['chosen option (helping at the grocery store)', 'music concert'],
            correctAnswer: 'chosen option (helping at the grocery store)'
          },
          {
            id: 'state',
            label: 'state of forgone option',
            options: ['remain unchanged', 'increase', 'decrease'],
            correctAnswer: 'remain unchanged'
          }
        ]
      },
      stepC: {
        prompt: '3. State the conclusion on opportunity cost:',
        sentenceTemplate: 'Therefore, Chloe\'s opportunity cost of helping at the grocery store [conclusion].',
        slots: [
          {
            id: 'conclusion',
            label: 'conclusion',
            options: ['remains unchanged', 'increases', 'decreases'],
            correctAnswer: 'remains unchanged'
          }
        ]
      }
    },
    modelAnswer: 'Helping at the family grocery store is Chloe\'s chosen option, and attending the music concert is her highest-valued option forgone. The comfortable environment increases the value of the chosen option, but the highest-valued option forgone (attending the music concert) and its value remain unchanged. Therefore, Chloe\'s opportunity cost of helping at the grocery store remains unchanged.',
    modelAnswerZh: '在家族雜貨店幫忙是 Chloe 的所選選項，而參加音樂會是她的最高價值放棄選項。更舒適的環境增加了所選選項的價值，但最高價值放棄選項（參加音樂會）及其價值保持不變。因此，Chloe 在雜貨店幫忙的機會成本保持不變。',
    markingRubric: {
      points: [
        {
          pointNumber: 1,
          title: 'Identifies chosen option & highest-valued option forgone',
          criterion: 'Clarifies that grocery store is chosen option and music concert is the highest-valued option forgone.',
          examplePhrase: 'music concert is the highest-valued option forgone'
        },
        {
          pointNumber: 2,
          title: 'Recognizes event affects chosen option only',
          criterion: 'Explains that the comfortable environment affects the chosen option, leaving the forgone option and its value unchanged.',
          examplePhrase: 'highest-valued option forgone remains unchanged'
        },
        {
          pointNumber: 3,
          title: 'Concludes opportunity cost remains unchanged',
          criterion: 'Concludes that opportunity cost remains unchanged.',
          examplePhrase: 'opportunity cost remains unchanged'
        }
      ]
    },
    reasoningSummary: {
      chosenOptionName: 'Help at family grocery store (2nd preference)',
      initialForgoneOptionName: 'Attend a music concert (1st preference)',
      affectedOptionName: 'Help at family grocery store',
      affectsChosen: true,
      affectsForgone: false,
      affectsThird: false,
      finalForgoneOptionName: 'Attend a music concert',
      finalCostChange: 'remains_unchanged',
      explanationSummary: 'Event affects chosen option only → Highest-valued option forgone unchanged → Opportunity cost remains unchanged.'
    }
  },

  // ----------------------------------------------------
  // LEVEL 4: Third Option and Possible New Highest-Valued Option Forgone ("May" Questions)
  // ----------------------------------------------------
  {
    id: 'L4-Q1',
    level: 4,
    type: 'TYPE_E',
    title: 'Country Park Hiking Trail Renovation',
    scenario: 'Mary\'s ranked preferences for Saturday afternoon are:\n1st preference: Visit a theme park\n2nd preference: Work part-time in a restaurant\n3rd preference: Go hiking with her family\n\nLater, the government completes a major renovation of the country park\'s hiking trails, adding beautiful scenic viewpoints and free shuttle buses.',
    scenarioZh: 'Mary 週六下午的偏好順序是：\n第一偏好：去主題公園\n第二偏好：在餐廳做兼職\n第三偏好：與家人去行山\n\n後來，政府完成了郊野公園行山徑的重大翻新，增設了優美景觀台和免費穿梭巴士。',
    options: [
      { id: 'opt-tp-3', name: 'Visit a theme park', originalRank: 1 },
      { id: 'opt-rest-3', name: 'Work part-time in a restaurant', originalRank: 2 },
      { id: 'opt-hike-3', name: 'Go hiking with her family', originalRank: 3 },
    ],
    chosenOptionId: 'opt-tp-3',
    affectedOptionId: 'opt-hike-3',
    valueChange: 'increase',
    prompt: 'Explain why Mary\'s opportunity cost of visiting the theme park may increase.',
    promptZh: '解釋為什麼 Mary 去主題公園的機會成本「可能增加」（may increase）。',
    chineseHints: [
      {
        term: 'may increase',
        termZh: '可能增加',
        explanationZh: '「may」（可能）意味著結果取決於一個條件！你需要說明：在什麼條件下機會成本會增加，在什麼條件下不會。'
      },
      {
        term: 'Third option logic',
        termZh: '第三選項邏輯',
        explanationZh: '第三選項價值增加，不等於機會成本立刻增加。必須看它增加後的價值是否超越原本的最高價值放棄選項！'
      }
    ],
    scaffoldingSteps: [
      {
        id: 1,
        question: 'Step 1: What is Mary\'s chosen option and her current highest-valued option forgone?',
        questionZh: '第一步：Mary 選擇的選項是什麼？目前放棄的最高價值選項是什麼？',
        explanation: 'Check Mary\'s original preferences.',
        options: [
          { id: 's1-a', text: 'Chosen: Visit theme park; Current forgone: Work part-time in restaurant', isCorrect: true, feedback: 'Correct! The question asks about her cost of visiting the theme park, so working part-time is her initial forgone option.' },
          { id: 's1-b', text: 'Chosen: Work part-time; Current forgone: Hiking', isCorrect: false, feedback: 'Theme park is her 1st preference, which is what she chooses.' }
        ]
      },
      {
        id: 2,
        question: 'Step 2: Which option is affected by the trail renovation, and how does its value change?',
        questionZh: '第二步：行山徑翻新影響了哪一個選項？該選項的價值有何變化？',
        explanation: 'The renovation adds scenic viewpoints and free shuttles, making hiking more enjoyable.',
        options: [
          { id: 's2-a', text: 'Going hiking with family (the 3rd option), and its value increases', isCorrect: true, feedback: 'Correct! The renovation increases the value/enjoyment of hiking (the 3rd option).' },
          { id: 's2-b', text: 'Working part-time in the restaurant (the 2nd option), and its value increases', isCorrect: false, feedback: 'Working part-time in the restaurant is completely unaffected by the hiking trail renovation.' },
          { id: 's2-c', text: 'Visiting the theme park (the chosen option), and its value decreases', isCorrect: false, feedback: 'The theme park is unaffected.' }
        ]
      },
      {
        id: 3,
        question: 'Step 3: Since the value of the 3rd option increases, does it automatically replace the 2nd option as the highest-valued option forgone?',
        questionZh: '第三步：既然第三選項價值增加，它是否必然取代第二選項成為新的最高價值放棄選項？',
        explanation: 'Remember: It only replaces the current forgone option if its new value actually exceeds it.',
        options: [
          { id: 's3-a', text: 'No. It only becomes the new highest-valued option forgone IF its value becomes HIGHER than working part-time.', isCorrect: true, feedback: 'Spot on! If its value is still lower than working part-time, working part-time remains the forgone option and cost does not change.' },
          { id: 's3-b', text: 'Yes, any increase in a 3rd option automatically makes it the highest-valued forgone option.', isCorrect: false, feedback: 'Misconception! If the increase is small and hiking is still worth less than working part-time, working part-time is still the forgone option.' }
        ]
      },
      {
        id: 4,
        question: 'Step 4: Under what condition will Mary\'s opportunity cost of visiting the theme park increase?',
        questionZh: '第四步：在什麼條件下，Mary 去主題公園的機會成本才會增加？',
        explanation: 'It must replace the 2nd option as the highest-valued alternative.',
        options: [
          { id: 's4-a', text: 'Only IF the value of hiking becomes higher than working part-time, hiking becomes the NEW forgone option, so opportunity cost increases.', isCorrect: true, feedback: 'Exactly! When hiking becomes the new highest-valued option forgone, opportunity cost increases.' },
          { id: 's4-b', text: 'It will increase under all conditions without exception.', isCorrect: false, feedback: 'If the value of hiking remains below working part-time, opportunity cost does not increase.' }
        ]
      },
      {
        id: 5,
        question: 'Step 5: Therefore, what happens to Mary\'s opportunity cost of visiting the theme park?',
        questionZh: '第五步：因此，Mary 去主題公園的機會成本會如何？',
        explanation: '"May increase" reflects that the increase is conditional.',
        options: [
          { id: 's5-a', text: 'It may increase', isCorrect: true, feedback: 'Bingo! Since it depends on whether the value of hiking exceeds working part-time, the opportunity cost may increase.' },
          { id: 's5-b', text: 'It necessarily increases', isCorrect: false, feedback: 'It is not guaranteed to increase if the value change is insufficient.' },
          { id: 's5-c', text: 'It remains unchanged', isCorrect: false, feedback: 'It can increase if the condition is met, so it may increase.' }
        ]
      }
    ],
    answerBuilder: {
      stepA: {
        prompt: '1. State which option is affected and how its value changes:',
        sentenceTemplate: 'The renovation increases the value of [option], which is the [rank].',
        slots: [
          {
            id: 'option',
            label: 'option',
            options: ['going hiking with her family', 'working part-time in the restaurant', 'visiting the theme park'],
            correctAnswer: 'going hiking with her family'
          },
          {
            id: 'rank',
            label: 'rank',
            options: ['third option', 'second option', 'chosen option'],
            correctAnswer: 'third option'
          }
        ]
      },
      stepB: {
        prompt: '2. State the condition for becoming the new highest-valued option forgone:',
        sentenceTemplate: 'If the value of hiking becomes [comparison] the value of working part-time, hiking becomes the [newStatus].',
        slots: [
          {
            id: 'comparison',
            label: 'comparison',
            options: ['higher than', 'lower than', 'equal to'],
            correctAnswer: 'higher than'
          },
          {
            id: 'newStatus',
            label: 'new status',
            options: ['new highest-valued option forgone', 'chosen option', 'least valued option'],
            correctAnswer: 'new highest-valued option forgone'
          }
        ]
      },
      stepC: {
        prompt: '3. State the conclusion using "may":',
        sentenceTemplate: 'Therefore, the opportunity cost of visiting the theme park [conclusion].',
        slots: [
          {
            id: 'conclusion',
            label: 'conclusion',
            options: ['may increase', 'must remain unchanged', 'decreases'],
            correctAnswer: 'may increase'
          }
        ]
      }
    },
    modelAnswer: 'The renovation increases the value of the third option (going hiking with her family). If the value of hiking becomes higher than the value of working part-time, hiking becomes the new highest-valued option forgone. Therefore, the opportunity cost of visiting the theme park may increase.',
    modelAnswerZh: '翻新增加了第三選項（與家人行山）的價值。若行山的價值超越兼職的價值，行山便會成為新的最高價值放棄選項。因此，去主題公園的機會成本可能增加。',
    markingRubric: {
      points: [
        {
          pointNumber: 1,
          title: 'Identifies value change of third option',
          criterion: 'States that the renovation increases the value of the third option (hiking).',
          examplePhrase: 'increases the value of the third option'
        },
        {
          pointNumber: 2,
          title: 'States condition for new highest-valued option forgone',
          criterion: 'Explains that IF hiking\'s value becomes higher than working part-time, it becomes the new highest-valued option forgone.',
          examplePhrase: 'if value becomes higher ... becomes new highest-valued option forgone'
        },
        {
          pointNumber: 3,
          title: 'Correctly concludes with "may increase"',
          criterion: 'Concludes that opportunity cost may increase.',
          examplePhrase: 'opportunity cost may increase'
        }
      ]
    },
    reasoningSummary: {
      chosenOptionName: 'Visit a theme park',
      initialForgoneOptionName: 'Work part-time in a restaurant',
      affectedOptionName: 'Go hiking with her family',
      affectsChosen: false,
      affectsForgone: false,
      affectsThird: true,
      finalForgoneOptionName: 'Go hiking (if > working part-time) or Work part-time (if not)',
      finalCostChange: 'may_increase',
      explanationSummary: 'Third option value increases → If it exceeds current forgone option, it becomes new forgone option → Opportunity cost may increase.'
    }
  },
  {
    id: 'L4-Q2',
    level: 4,
    type: 'TYPE_E',
    title: 'Smart Cleaning Robot vs Part-time Work',
    scenario: 'Chris\'s ranked preferences for his free time are:\n1st preference: Work part-time at a convenience store\n2nd preference: Visit Ocean Park with friends\n3rd preference: Help with housework at home\n\nHis family purchases a smart cleaning robot, making helping with housework effortless and enjoyable.',
    scenarioZh: 'Chris 對空閒時間的偏好排序為：\n第一偏好：在便利店做兼職\n第二偏好：與朋友去海洋公園\n第三偏好：在家幫忙做家務\n\n他的家人購入了一部智能清潔機械人，使做家務變得輕鬆有趣。',
    options: [
      { id: 'opt-work-c', name: 'Work part-time at a convenience store', originalRank: 1 },
      { id: 'opt-ocean-c2', name: 'Visit Ocean Park with friends', originalRank: 2 },
      { id: 'opt-housework-c2', name: 'Help with housework at home', originalRank: 3 },
    ],
    chosenOptionId: 'opt-work-c',
    affectedOptionId: 'opt-housework-c2',
    valueChange: 'increase',
    prompt: 'Explain why Chris\'s opportunity cost of working part-time at the convenience store may increase.',
    promptZh: '解釋為什麼 Chris 在便利店兼職的機會成本「可能增加」。',
    chineseHints: [
      {
        term: 'may increase',
        termZh: '可能增加',
        explanationZh: '需闡述條件：只有當做家務的價值超越去海洋公園的價值時，它才會成為新的最高價值放棄選項，使成本增加。'
      }
    ],
    scaffoldingSteps: [
      {
        id: 1,
        question: 'Step 1: What is Chris\'s chosen option and what is his current highest-valued option forgone?',
        questionZh: '第一步：Chris 選擇了什麼？目前最高價值的放棄選項是什麼？',
        explanation: 'Check 1st and 2nd preferences.',
        options: [
          { id: 's1-a', text: 'Chosen: Work part-time; Current forgone: Visit Ocean Park', isCorrect: true, feedback: 'Correct!' },
          { id: 's1-b', text: 'Chosen: Visit Ocean Park; Current forgone: Help with housework', isCorrect: false, feedback: 'He chose to work part-time.' }
        ]
      },
      {
        id: 2,
        question: 'Step 2: Which option is affected by the smart cleaning robot, and how does its value change?',
        questionZh: '第二步：智能清潔機械人影響了哪一個選項？該選項的價值有何變化？',
        explanation: 'The robot makes housework enjoyable and easy, increasing its value/satisfaction.',
        options: [
          { id: 's2-a', text: 'Helping with housework (the 3rd option), and its value increases', isCorrect: true, feedback: 'Correct! The smart robot increases the satisfaction and value of helping with housework.' },
          { id: 's2-b', text: 'Visiting Ocean Park (the 2nd option), and its value increases', isCorrect: false, feedback: 'Ocean Park is unaffected.' },
          { id: 's2-c', text: 'Working part-time at the convenience store (the chosen option), and its value decreases', isCorrect: false, feedback: 'Working part-time is unaffected.' }
        ]
      },
      {
        id: 3,
        question: 'Step 3: Since the value of helping with housework increases, when does it become the new highest-valued option forgone?',
        questionZh: '第三步：既然做家務的價值增加，它何時會成為新的「最高價值放棄選項」？',
        explanation: 'It must surpass the current highest-valued forgone option (visiting Ocean Park).',
        options: [
          { id: 's3-a', text: 'Only IF its value becomes higher than the value of visiting Ocean Park.', isCorrect: true, feedback: 'Correct! If the total value of housework exceeds Ocean Park, it replaces Ocean Park as the forgone option.' },
          { id: 's3-b', text: 'Whenever any cleaning tool is introduced, it immediately replaces Ocean Park.', isCorrect: false, feedback: 'If the value increase is small, Ocean Park may still be valued higher.' }
        ]
      },
      {
        id: 4,
        question: 'Step 4: Therefore, what happens to Chris\'s opportunity cost of working part-time at the convenience store?',
        questionZh: '第四步：因此，Chris 在便利店兼職的機會成本會如何？',
        explanation: 'Because it is conditional on whether the value exceeds Ocean Park, cost may increase.',
        options: [
          { id: 's4-a', text: 'The opportunity cost may increase.', isCorrect: true, feedback: 'Spot on! It only increases if housework becomes more valuable than Ocean Park.' },
          { id: 's4-b', text: 'The opportunity cost must remain unchanged.', isCorrect: false, feedback: 'It could increase if housework becomes more valuable than Ocean Park.' }
        ]
      }
    ],
    answerBuilder: {
      stepA: {
        prompt: '1. State the effect of the smart cleaning robot on the third option:',
        sentenceTemplate: 'The smart cleaning robot increases the value of [option], which is the [rank].',
        slots: [
          {
            id: 'option',
            label: 'option',
            options: ['helping with housework', 'visiting Ocean Park', 'working part-time'],
            correctAnswer: 'helping with housework'
          },
          {
            id: 'rank',
            label: 'rank',
            options: ['third option', 'second option', 'chosen option'],
            correctAnswer: 'third option'
          }
        ]
      },
      stepB: {
        prompt: '2. State the condition for becoming the new forgone option:',
        sentenceTemplate: 'If the value of helping with housework becomes [comparison] the value of visiting Ocean Park (the current highest-valued option forgone), housework becomes the [status].',
        slots: [
          {
            id: 'comparison',
            label: 'comparison',
            options: ['higher than', 'lower than', 'equal to'],
            correctAnswer: 'higher than'
          },
          {
            id: 'status',
            label: 'status',
            options: ['new highest-valued option forgone', 'chosen option', 'least preferred option'],
            correctAnswer: 'new highest-valued option forgone'
          }
        ]
      },
      stepC: {
        prompt: '3. Conclude on opportunity cost:',
        sentenceTemplate: 'Therefore, the opportunity cost of working part-time [conclusion].',
        slots: [
          {
            id: 'conclusion',
            label: 'conclusion',
            options: ['may increase', 'decreases', 'must remain unchanged'],
            correctAnswer: 'may increase'
          }
        ]
      }
    },
    modelAnswer: 'The smart cleaning robot increases the value of helping with housework (the third option). If the value of helping with housework becomes higher than the value of visiting Ocean Park (the current highest-valued option forgone), helping with housework becomes the new highest-valued option forgone. Therefore, the opportunity cost of working part-time may increase.',
    modelAnswerZh: '智能清潔機械人增加了做家務（第三選項）的價值。若做家務的價值超越去海洋公園（目前最高價值的放棄選項）的價值，做家務便會成為新的最高價值放棄選項。因此，做兼職的機會成本可能增加。',
    markingRubric: {
      points: [
        {
          pointNumber: 1,
          title: 'Value of third option increases',
          criterion: 'Identifies that the smart cleaning robot increases the value of helping with housework (the third option).',
          examplePhrase: 'increases the value of the third option'
        },
        {
          pointNumber: 2,
          title: 'Condition for new highest-valued option forgone',
          criterion: 'Explains that if its value becomes higher than visiting Ocean Park, it becomes the new highest-valued option forgone.',
          examplePhrase: 'if value becomes higher than current forgone option ... becomes new forgone option'
        },
        {
          pointNumber: 3,
          title: 'Conclusion with "may increase"',
          criterion: 'Concludes that opportunity cost may increase.',
          examplePhrase: 'opportunity cost may increase'
        }
      ]
    },
    reasoningSummary: {
      chosenOptionName: 'Work part-time at a convenience store',
      initialForgoneOptionName: 'Visit Ocean Park with friends',
      affectedOptionName: 'Help with housework at home',
      affectsChosen: false,
      affectsForgone: false,
      affectsThird: true,
      finalForgoneOptionName: 'Housework (if > Ocean Park) or Ocean Park (if not)',
      finalCostChange: 'may_increase',
      explanationSummary: 'Third option value increases → If it exceeds Ocean Park, it becomes new forgone option → Opportunity cost may increase.'
    }
  },

  // ----------------------------------------------------
  // LEVEL 5: WHETHER / NECESSARILY (Third Option Affected -> Two-Branch Analysis)
  // ----------------------------------------------------
  {
    id: 'L5-Q1',
    level: 5,
    type: 'TYPE_G',
    title: 'Master Pastry Chef Workshop vs Ocean Park (Necessarily)',
    scenario: 'Sarah\'s ranked preferences for Saturday afternoon are:\n1st preference: Visit Ocean Park\n2nd preference: Study at the library\n3rd preference: Attend a bakery workshop\n\nLater, the bakery workshop invites a renowned master pastry chef to guide participants in baking special desserts.',
    scenarioZh: 'Sarah 週六下午的偏好排序是：\n第一偏好：去海洋公園\n第二偏好：在圖書館溫習\n第三偏好：參加烘焙工作坊\n\n後來，烘焙工作坊邀請了著名星級甜品大師親自指導學員製作特色甜品。',
    options: [
      { id: 'opt-sarah-op', name: 'Visit Ocean Park', originalRank: 1 },
      { id: 'opt-sarah-lib', name: 'Study at the library', originalRank: 2 },
      { id: 'opt-sarah-bake', name: 'Attend a bakery workshop', originalRank: 3 },
    ],
    chosenOptionId: 'opt-sarah-op',
    affectedOptionId: 'opt-sarah-bake',
    valueChange: 'increase',
    prompt: 'Explain whether Sarah\'s opportunity cost of visiting Ocean Park necessarily remains unchanged.',
    promptZh: '解釋 Sarah 去海洋公園的機會成本是否「必然保持不變」（necessarily remains unchanged）。',
    chineseHints: [
      {
        term: 'necessarily remains unchanged',
        termZh: '必然保持不變',
        explanationZh: '「必然」= 在所有可能情況下都保持不變。由於受影響的是第三選項（烘焙工作坊），要反駁「必然保持不變」，需要分析兩種可能性：如果烘焙價值超越圖書館溫習，成本就會增加！因此不是「必然」保持不變。'
      },
      {
        term: 'Two-branch analysis',
        termZh: '雙分支分析',
        explanationZh: '分支一：若烘焙價值仍低於溫習，成本不變；分支二：若烘焙價值高於溫習，成為新放棄選項，成本增加。結論：不必然不變。'
      }
    ],
    scaffoldingSteps: [
      {
        id: 1,
        question: 'Step 1: What is the chosen option, and which option does the event affect?',
        questionZh: '第一步：所選選項是什麼？事件影響了哪個選項？',
        explanation: 'Sarah chose Ocean Park. The workshop is her 3rd option.',
        options: [
          { id: 's1-a', text: 'Chosen: Ocean Park; Affected: Bakery workshop (the 3rd option)', isCorrect: true, feedback: 'Correct!' },
          { id: 's1-b', text: 'Chosen: Bakery workshop; Affected: Library', isCorrect: false, feedback: 'She chose Ocean Park.' }
        ]
      },
      {
        id: 2,
        question: 'Step 2: Possibility 1: What if the increase in value of the bakery workshop is SMALL (remains lower than studying at the library)?',
        questionZh: '第二步：情況一：如果烘焙工作坊價值的增加幅度較小（價值仍低於在圖書館溫習）？',
        explanation: 'Analyze branch 1.',
        options: [
          { id: 's2-a', text: 'Studying at the library remains the highest-valued option forgone, so opportunity cost remains unchanged.', isCorrect: true, feedback: 'Correct! Under this condition, cost is unchanged.' },
          { id: 's2-b', text: 'Opportunity cost immediately increases.', isCorrect: false, feedback: 'If it remains lower than studying, studying is still the highest-valued alternative.' }
        ]
      },
      {
        id: 3,
        question: 'Step 3: Possibility 2: What if the value of the bakery workshop becomes HIGHER than studying at the library?',
        questionZh: '第三步：情況二：如果烘焙工作坊的價值變得「高於」在圖書館溫習？',
        explanation: 'Analyze branch 2.',
        options: [
          { id: 's3-a', text: 'The bakery workshop becomes the NEW highest-valued option forgone, and opportunity cost increases.', isCorrect: true, feedback: 'Correct! A new highest-valued option forgone emerges.' },
          { id: 's3-b', text: 'Opportunity cost still remains unchanged.', isCorrect: false, feedback: 'The highest-valued forgone option replaced by a higher one increases cost.' }
        ]
      },
      {
        id: 4,
        question: 'Step 4: Combining both possibilities, does the opportunity cost "necessarily" remain unchanged?',
        questionZh: '第四步：綜合兩種情況，機會成本是否「必然」保持不變？',
        explanation: 'Since there is a valid possibility where cost changes, it is NOT necessarily unchanged.',
        options: [
          { id: 's4-a', text: 'No. Because there is a possibility that the opportunity cost increases, it does NOT necessarily remain unchanged.', isCorrect: true, feedback: 'Spot on! This is the exact DSE level 5 distinction.' },
          { id: 's4-b', text: 'Yes, it must remain unchanged.', isCorrect: false, feedback: 'You just proved it could increase!' }
        ]
      }
    ],
    answerBuilder: {
      stepA: {
        prompt: '1. State direct conclusion and the effect on the 3rd option:',
        sentenceTemplate: '[conclusion]. The master pastry chef\'s guidance increases the value of the third option ([option3]).',
        slots: [
          {
            id: 'conclusion',
            label: 'direct answer',
            options: ['No', 'Yes'],
            correctAnswer: 'No'
          },
          {
            id: 'option3',
            label: 'third option',
            options: ['attending the bakery workshop', 'studying at the library', 'visiting Ocean Park'],
            correctAnswer: 'attending the bakery workshop'
          }
        ]
      },
      stepB: {
        prompt: '2. State Branch 1 (if value remains lower) vs Branch 2 (if value exceeds):',
        sentenceTemplate: 'If its value remains lower than studying at the library (the current forgone option), opportunity cost [branch1]. However, if its value becomes higher than studying at the library, it becomes the [newStatus] and opportunity cost [branch2].',
        slots: [
          {
            id: 'branch1',
            label: 'branch 1 cost',
            options: ['remains unchanged', 'increases', 'decreases'],
            correctAnswer: 'remains unchanged'
          },
          {
            id: 'newStatus',
            label: 'new status',
            options: ['new highest-valued option forgone', 'chosen option'],
            correctAnswer: 'new highest-valued option forgone'
          },
          {
            id: 'branch2',
            label: 'branch 2 cost',
            options: ['increases', 'remains unchanged', 'decreases'],
            correctAnswer: 'increases'
          }
        ]
      },
      stepC: {
        prompt: '3. State the concluding sentence on "necessarily":',
        sentenceTemplate: 'Therefore, the opportunity cost of visiting Ocean Park [finalConclusion].',
        slots: [
          {
            id: 'finalConclusion',
            label: 'final conclusion',
            options: [
              'does not necessarily remain unchanged',
              'necessarily remains unchanged',
              'must decrease'
            ],
            correctAnswer: 'does not necessarily remain unchanged'
          }
        ]
      }
    },
    modelAnswer: 'No. If the value of attending the bakery workshop (the third option) remains lower than the value of studying at the library, studying remains the highest-valued option forgone and the opportunity cost remains unchanged. However, if the value of the bakery workshop becomes higher than that of studying at the library, it becomes the new highest-valued option forgone and the opportunity cost increases. Therefore, the opportunity cost does not necessarily remain unchanged.',
    modelAnswerZh: '不是。如果參加烘焙工作坊（第三選項）的價值仍低於在圖書館溫習，溫習仍是最高價值放棄選項，機會成本保持不變。然而，如果烘焙工作坊的價值超越在圖書館溫習，它將成為新的最高價值放棄選項，機會成本增加。因此，機會成本不必然保持不變。',
    markingRubric: {
      points: [
        {
          pointNumber: 1,
          title: 'Direct conclusion stated',
          criterion: 'Explicitly states "No" / does not necessarily remain unchanged.',
          examplePhrase: 'No / does not necessarily remain unchanged'
        },
        {
          pointNumber: 2,
          title: 'Explains unchanged branch',
          criterion: 'Explains that if the 3rd option value remains lower than the current forgone option, cost is unchanged.',
          examplePhrase: 'if value remains lower ... remains unchanged'
        },
        {
          pointNumber: 3,
          title: 'Explains increased branch',
          criterion: 'Explains that if the 3rd option value exceeds the current forgone option, it becomes the new forgone option and cost increases.',
          examplePhrase: 'if value becomes higher ... becomes new highest-valued option forgone ... increases'
        },
        {
          pointNumber: 4,
          title: 'Addresses "necessarily"',
          criterion: 'Synthesizes both branches to conclude that the cost does not necessarily remain unchanged.',
          examplePhrase: 'therefore does not necessarily remain unchanged'
        }
      ]
    },
    reasoningSummary: {
      chosenOptionName: 'Visit Ocean Park',
      initialForgoneOptionName: 'Study at the library',
      affectedOptionName: 'Attend a bakery workshop',
      affectsChosen: false,
      affectsForgone: false,
      affectsThird: true,
      finalForgoneOptionName: 'Bakery workshop (if > Library) or Library (if not)',
      finalCostChange: 'not_necessarily_unchanged',
      explanationSummary: 'Possibility 1 (cost unchanged) + Possibility 2 (cost increases) → Does NOT necessarily remain unchanged.'
    }
  },
  {
    id: 'L5-Q2',
    level: 5,
    type: 'TYPE_G',
    title: 'Online Game Limited-Time Reward vs Movie (Necessarily)',
    scenario: 'Davis has 3 hours of free time on Saturday. His ranked preferences are:\n1st preference: Watch a movie\n2nd preference: Tutor a primary school student\n3rd preference: Stay home and play video games\n\nLater, his favourite online game launches a limited-time event giving out free exclusive skins and rewards to players.',
    scenarioZh: 'Davis 週六有 3 小時空閒時間。他的偏好排列如下：\n第一偏好：看電影\n第二偏好：為小學生補習\n第三偏好：留在家中打機\n\n後來，他最喜愛的網上遊戲推出限時活動，免費向玩家派發限定造型與獎勵。',
    options: [
      { id: 'opt-davis-movie', name: 'Watch a movie', originalRank: 1 },
      { id: 'opt-davis-tutor', name: 'Tutor a primary school student', originalRank: 2 },
      { id: 'opt-davis-games', name: 'Stay home and play video games', originalRank: 3 },
    ],
    chosenOptionId: 'opt-davis-movie',
    affectedOptionId: 'opt-davis-games',
    valueChange: 'increase',
    prompt: 'Explain whether Davis\'s opportunity cost of watching the movie necessarily remains unchanged.',
    promptZh: '解釋 Davis 看電影的機會成本是否「必然保持不變」（necessarily remains unchanged）。',
    chineseHints: [
      {
        term: 'Explain whether ... necessarily remains unchanged',
        termZh: '解釋...是否必然保持不變',
        explanationZh: '「necessarily」指「一定 / 必然」。受影響的是第三選項（留在家中打機），因此必須分兩個情況分析：若打機價值仍低於補習，成本不變；若打機價值超越補習，打機成為新的最高價值放棄選項，成本增加！因此並非「必然保持不變」。'
      },
      {
        term: 'Two-branch analysis',
        termZh: '雙分支分析',
        explanationZh: '分支一：若打機價值仍低於補習，成本不變；分支二：若打機價值高於補習，成為新放棄選項，成本增加。結論：不必然保持不變。'
      }
    ],
    scaffoldingSteps: [
      {
        id: 1,
        question: 'Step 1: What is Davis\'s chosen option, and which option does the game event affect?',
        questionZh: '第一步：Davis 選擇了什麼？遊戲限時活動影響了哪個選項？',
        explanation: 'Check 1st, 2nd, and 3rd preferences.',
        options: [
          { id: 's1-a', text: 'Chosen: Watch movie; Affected: Stay home and play video games (the 3rd option)', isCorrect: true, feedback: 'Correct! The game event increases the value of his 3rd option.' },
          { id: 's1-b', text: 'Chosen: Watch movie; Affected: Tutor a primary school student (the 2nd option)', isCorrect: false, feedback: 'The event affects playing video games (the 3rd option), not tutoring.' }
        ]
      },
      {
        id: 2,
        question: 'Step 2: Possibility 1: What if the new value of playing video games remains LOWER than tutoring the primary student?',
        questionZh: '第二步：情況一：如果打機的新價值仍然「低於」為小學生補習？',
        explanation: 'Analyze branch 1.',
        options: [
          { id: 's2-a', text: 'Tutoring remains the highest-valued option forgone, so opportunity cost remains unchanged.', isCorrect: true, feedback: 'Correct! Under this condition, opportunity cost remains unchanged.' },
          { id: 's2-b', text: 'Opportunity cost immediately increases.', isCorrect: false, feedback: 'If playing video games is still worth less than tutoring, tutoring remains the forgone option.' }
        ]
      },
      {
        id: 3,
        question: 'Step 3: Possibility 2: What if the new value of playing video games becomes HIGHER than tutoring the primary student?',
        questionZh: '第三步：情況二：如果打機的新價值變得「高於」為小學生補習？',
        explanation: 'Analyze branch 2.',
        options: [
          { id: 's3-a', text: 'Playing video games becomes the NEW highest-valued option forgone, and opportunity cost increases.', isCorrect: true, feedback: 'Correct! When the 3rd option surpasses the 2nd option, opportunity cost increases.' },
          { id: 's3-b', text: 'Opportunity cost still remains unchanged.', isCorrect: false, feedback: 'When the highest-valued option forgone is replaced by a higher-valued option, cost increases.' }
        ]
      },
      {
        id: 4,
        question: 'Step 4: Combining both possibilities, does Davis\'s opportunity cost "necessarily" remain unchanged?',
        questionZh: '第四步：綜合兩種情況，Davis 的機會成本是否「必然」保持不變？',
        explanation: 'Give a direct answer addressing "necessarily".',
        options: [
          { id: 's4-a', text: 'No. Because there is a possibility that the opportunity cost increases, it does NOT necessarily remain unchanged.', isCorrect: true, feedback: 'Spot on! That directly answers the "Explain whether ... necessarily" prompt.' },
          { id: 's4-b', text: 'Yes, it necessarily remains unchanged.', isCorrect: false, feedback: 'If the value of playing video games exceeds tutoring, the cost increases!' }
        ]
      }
    ],
    answerBuilder: {
      stepA: {
        prompt: '1. State direct conclusion and the effect on the 3rd option:',
        sentenceTemplate: '[directAnswer]. The game event increases the value of the third option ([option3]).',
        slots: [
          {
            id: 'directAnswer',
            label: 'direct answer',
            options: ['No', 'Yes'],
            correctAnswer: 'No'
          },
          {
            id: 'option3',
            label: 'third option',
            options: ['staying home and playing video games', 'tutoring the primary student', 'watching the movie'],
            correctAnswer: 'staying home and playing video games'
          }
        ]
      },
      stepB: {
        prompt: '2. State Branch 1 (if value remains lower) vs Branch 2 (if value exceeds):',
        sentenceTemplate: 'If its value remains lower than tutoring the primary student (the current forgone option), opportunity cost [branch1]. However, if its value becomes higher than tutoring, it becomes the [newStatus] and opportunity cost [branch2].',
        slots: [
          {
            id: 'branch1',
            label: 'branch 1 cost',
            options: ['remains unchanged', 'increases', 'decreases'],
            correctAnswer: 'remains unchanged'
          },
          {
            id: 'newStatus',
            label: 'new status',
            options: ['new highest-valued option forgone', 'chosen option'],
            correctAnswer: 'new highest-valued option forgone'
          },
          {
            id: 'branch2',
            label: 'branch 2 cost',
            options: ['increases', 'remains unchanged', 'decreases'],
            correctAnswer: 'increases'
          }
        ]
      },
      stepC: {
        prompt: '3. State the final conclusion addressing "necessarily remains unchanged":',
        sentenceTemplate: 'Therefore, the opportunity cost of watching the movie [finalPhrase].',
        slots: [
          {
            id: 'finalPhrase',
            label: 'final conclusion',
            options: [
              'does not necessarily remain unchanged',
              'necessarily remains unchanged',
              'must decrease'
            ],
            correctAnswer: 'does not necessarily remain unchanged'
          }
        ]
      }
    },
    modelAnswer: 'No. If the value of staying home and playing video games (the third option) remains lower than the value of tutoring the primary student, tutoring remains the highest-valued option forgone and the opportunity cost remains unchanged. However, if the value of playing video games becomes higher than that of tutoring, it becomes the new highest-valued option forgone and the opportunity cost increases. Therefore, the opportunity cost does not necessarily remain unchanged.',
    modelAnswerZh: '不是。如果留在家中打機（第三選項）的價值仍低於為小學生補習，補習仍是最高價值放棄選項，機會成本保持不變。然而，如果打機的價值超越為小學生補習，它將成為新的最高價值放棄選項，機會成本增加。因此，看電影的機會成本不必然保持不變。',
    markingRubric: {
      points: [
        {
          pointNumber: 1,
          title: 'Direct conclusion stated',
          criterion: 'States "No" / it does not necessarily remain unchanged.',
          examplePhrase: 'No / does not necessarily remain unchanged'
        },
        {
          pointNumber: 2,
          title: 'Explains unchanged branch',
          criterion: 'Explains that if the 3rd option (playing video games) remains lower in value than tutoring, cost remains unchanged.',
          examplePhrase: 'if value remains lower than tutoring ... remains unchanged'
        },
        {
          pointNumber: 3,
          title: 'Explains increased branch',
          criterion: 'Explains that if the value of playing video games exceeds tutoring, it becomes the new highest-valued option forgone and cost increases.',
          examplePhrase: 'if value becomes higher ... becomes new highest-valued option forgone ... increases'
        },
        {
          pointNumber: 4,
          title: 'Addresses "necessarily"',
          criterion: 'Synthesizes both branches to conclude that the cost does not necessarily remain unchanged.',
          examplePhrase: 'therefore does not necessarily remain unchanged'
        }
      ]
    },
    reasoningSummary: {
      chosenOptionName: 'Watch a movie',
      initialForgoneOptionName: 'Tutor a primary school student',
      affectedOptionName: 'Stay home and play video games',
      affectsChosen: false,
      affectsForgone: false,
      affectsThird: true,
      finalForgoneOptionName: 'Playing video games (if > Tutoring) or Tutoring (if not)',
      finalCostChange: 'not_necessarily_unchanged',
      explanationSummary: 'Possibility 1 (cost unchanged) + Possibility 2 (cost increases) → Does NOT necessarily remain unchanged.'
    }
  }
];
