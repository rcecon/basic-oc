import { DSEQuestion, EvaluationResult, RubricCheckResult } from '../types/economics';

export function evaluateStudentAnswer(
  answer: string,
  question: DSEQuestion
): EvaluationResult {
  const normalized = answer.toLowerCase().trim();
  const checks: RubricCheckResult[] = [];
  const strengths: string[] = [];
  const areasToImprove: string[] = [];

  const points = question.markingRubric.points;
  let score = 0;

  // Question context keywords
  const chosenOpt = question.options.find(o => o.id === question.chosenOptionId)?.name.toLowerCase() || '';
  const affectedOpt = question.options.find(o => o.id === question.affectedOptionId)?.name.toLowerCase() || '';
  const hasForgoneMention = normalized.includes('forgone') || normalized.includes('highest-valued') || normalized.includes('highest valued');
  
  // Point 1: Identified relevant value change
  const p1 = points[0];
  if (p1) {
    let p1Awarded = false;
    let feedback = '';

    if (question.type === 'TYPE_A' || question.type === 'TYPE_B') {
      // Should mention value/wage/return and increase/decrease
      const hasChange = question.valueChange === 'decrease' 
        ? (normalized.includes('decreas') || normalized.includes('cut') || normalized.includes('reduc') || normalized.includes('lower') || normalized.includes('fall') || normalized.includes('drops'))
        : (normalized.includes('increas') || normalized.includes('rais') || normalized.includes('higher') || normalized.includes('more'));
      
      const mentionsValue = normalized.includes('value') || normalized.includes('wage') || normalized.includes('pay') || normalized.includes('return') || normalized.includes('earning');

      if (hasChange && mentionsValue) {
        p1Awarded = true;
        feedback = `✓ Correctly identified that the event ${question.valueChange === 'decrease' ? 'decreases' : 'increases'} the value of the forgone option.`;
        strengths.push('Clear identification of the relevant change in option value.');
      } else {
        feedback = `✗ Missing or unclear identification of value change. State clearly whether the value of ${affectedOpt} increases or decreases.`;
        areasToImprove.push('Explicitly state what happens to the value of the affected option (e.g. "increases the value of..." or "decreases the value of...").');
      }
    } else if (question.type === 'TYPE_C') {
      // Event changes chosen option value
      const hasChosenMention = normalized.includes('chosen') || (chosenOpt && normalized.includes(chosenOpt.split(' ')[0]));
      const hasValueChange = normalized.includes('value') || normalized.includes('enjoyment') || normalized.includes('benefit');
      
      if (hasChosenMention && hasValueChange) {
        p1Awarded = true;
        feedback = '✓ Correctly recognized that the event affects the value of the chosen option.';
        strengths.push('Accurately pointed out that the event changes the value of the chosen option.');
      } else {
        feedback = '✗ Did not clearly note that the event only affects the chosen option.';
        areasToImprove.push('State that the event affects the chosen option, not the forgone alternative.');
      }
    } else if (question.type === 'TYPE_E' || question.type === 'TYPE_G') {
      // 3rd option affected or "necessarily"
      const mentions3rd = normalized.includes('third') || normalized.includes('3rd') || normalized.includes(affectedOpt.split(' ')[0]);
      const mentionsIncrease = normalized.includes('increase') || normalized.includes('higher') || normalized.includes('more');
      
      if (mentions3rd && (mentionsIncrease || normalized.includes('value'))) {
        p1Awarded = true;
        feedback = '✓ Identified that the event increases the value of the third option.';
        strengths.push('Recognized the change in value of the third option.');
      } else {
        feedback = '✗ Need to explicitly state that the event increases the value of the third option.';
        areasToImprove.push('Specify that the event increases the value of the third option.');
      }
    } else {
      // Generic Level 5
      const hasValue = normalized.includes('value') || normalized.includes('benefit') || normalized.includes('ticket') || normalized.includes('price');
      p1Awarded = hasValue;
      feedback = hasValue 
        ? '✓ Identified the relevant economic change.' 
        : '✗ Please clearly state how the option value or cost changes.';
    }

    if (p1Awarded) score += 1;
    checks.push({
      pointNumber: 1,
      title: p1.title,
      awarded: p1Awarded,
      matchedFeedback: feedback,
      suggestion: p1Awarded ? undefined : p1.criterion
    });
  }

  // Point 2: Highest-valued option forgone identified / considered
  const p2 = points[1];
  if (p2) {
    let p2Awarded = false;
    let feedback = '';

    if (question.type === 'TYPE_C') {
      // Must state that highest-valued option forgone is unchanged
      const mentionsUnchanged = normalized.includes('unchanged') || normalized.includes('remains unchanged') || normalized.includes('same') || normalized.includes('not change');
      if (hasForgoneMention && mentionsUnchanged) {
        p2Awarded = true;
        feedback = '✓ Accurately stated that the highest-valued option forgone (and its value) remains unchanged.';
        strengths.push('Emphasized that the highest-valued option forgone is unchanged.');
      } else {
        feedback = '✗ Missing key point: You must explicitly state that the highest-valued option forgone remains unchanged.';
        areasToImprove.push('State explicitly that the highest-valued option forgone and its value remain unchanged.');
      }
    } else if (question.type === 'TYPE_E') {
      // Must mention condition: if value becomes higher than current forgone option
      const hasCondition = normalized.includes('if') || normalized.includes('exceed') || normalized.includes('higher than') || normalized.includes('surpass') || normalized.includes('becomes');
      const mentionsNewForgone = normalized.includes('new') || normalized.includes('forgone');
      
      if (hasCondition && mentionsNewForgone) {
        p2Awarded = true;
        feedback = '✓ Correctly formulated the condition under which the third option becomes the new highest-valued option forgone.';
        strengths.push('Stated the conditional replacement: if the 3rd option exceeds the current forgone option.');
      } else {
        feedback = '✗ Missing condition: State that IF the third option\'s value exceeds the current forgone option, it becomes the new highest-valued option forgone.';
        areasToImprove.push('Write the conditional clause: "If the value of [third option] becomes higher than [second option], it becomes the new highest-valued option forgone."');
      }
    } else if (question.type === 'TYPE_G') {
      // Must address both branches or state forgone option
      const hasBranch1 = normalized.includes('remains lower') || normalized.includes('lower') || normalized.includes('unchanged');
      const hasBranch2 = normalized.includes('higher') || normalized.includes('new') || normalized.includes('becomes');
      
      if ((hasBranch1 && hasBranch2) || hasForgoneMention) {
        p2Awarded = true;
        feedback = '✓ Clearly analyzed the role of the highest-valued option forgone and conditional outcomes.';
        strengths.push('Rigorous consideration of the highest-valued option forgone.');
      } else {
        feedback = '✗ Need to identify the highest-valued option forgone and test both possibilities.';
        areasToImprove.push('Mention the highest-valued option forgone and consider both cases (if value remains lower vs if it exceeds).');
      }
    } else {
      // General case: Must mention highest-valued option forgone
      if (hasForgoneMention) {
        p2Awarded = true;
        feedback = '✓ Correctly identified the option as the highest-valued option forgone.';
        strengths.push('Explicitly referenced the highest-valued option forgone.');
      } else {
        feedback = '✗ You must use the official terminology: "highest-valued option forgone".';
        areasToImprove.push('Include the exact DSE term: "which is the highest-valued option forgone".');
      }
    }

    if (p2Awarded) score += 1;
    checks.push({
      pointNumber: 2,
      title: p2.title,
      awarded: p2Awarded,
      matchedFeedback: feedback,
      suggestion: p2Awarded ? undefined : p2.criterion
    });
  }

  // Point 3: Link to Opportunity Cost Conclusion
  const p3 = points[2];
  if (p3) {
    let p3Awarded = false;
    let feedback = '';

    const mentionsOppCost = normalized.includes('opportunity cost') || normalized.includes('cost');

    if (question.type === 'TYPE_A') {
      const mentionsDecrease = normalized.includes('decrease') || normalized.includes('decreases') || normalized.includes('lower') || normalized.includes('falls');
      if (mentionsOppCost && mentionsDecrease) {
        p3Awarded = true;
        feedback = '✓ Correct conclusion: Opportunity cost decreases.';
      } else {
        feedback = '✗ Ensure you conclude: "Therefore, the opportunity cost decreases."';
        areasToImprove.push('Clearly state the final impact on opportunity cost (decreases).');
      }
    } else if (question.type === 'TYPE_B') {
      const mentionsIncrease = normalized.includes('increase') || normalized.includes('increases') || normalized.includes('higher') || normalized.includes('rises');
      if (mentionsOppCost && mentionsIncrease) {
        p3Awarded = true;
        feedback = '✓ Correct conclusion: Opportunity cost increases.';
      } else {
        feedback = '✗ Ensure you conclude: "Therefore, the opportunity cost increases."';
        areasToImprove.push('Clearly state the final impact on opportunity cost (increases).');
      }
    } else if (question.type === 'TYPE_C') {
      const mentionsUnchanged = normalized.includes('unchanged') || normalized.includes('remains unchanged') || normalized.includes('does not change');
      if (mentionsOppCost && mentionsUnchanged) {
        p3Awarded = true;
        feedback = '✓ Correct conclusion: Opportunity cost remains unchanged.';
      } else {
        feedback = '✗ Conclude clearly that opportunity cost remains unchanged.';
        areasToImprove.push('Conclude that opportunity cost remains unchanged because the forgone option is unchanged.');
      }
    } else if (question.type === 'TYPE_E') {
      const mentionsMayIncrease = normalized.includes('may increase') || normalized.includes('might increase') || (normalized.includes('may') && normalized.includes('cost'));
      if (mentionsMayIncrease) {
        p3Awarded = true;
        feedback = '✓ Concluded accurately with "may increase".';
      } else {
        feedback = '✗ Remember to conclude that opportunity cost "may increase" (not definitely increases).';
        areasToImprove.push('Use the precise modal verb: "Therefore, the opportunity cost may increase."');
      }
    } else if (question.type === 'TYPE_G' || question.type === 'TYPE_F') {
      const rejectsNecessarily = normalized.includes('no') || normalized.includes('not necessarily') || normalized.includes('does not necessarily') || normalized.includes('not remain unchanged');
      if (rejectsNecessarily) {
        p3Awarded = true;
        feedback = '✓ Correctly concluded that the opportunity cost does not necessarily remain unchanged.';
      } else {
        feedback = '✗ Must address the prompt directly: "No / does not necessarily remain unchanged."';
        areasToImprove.push('Directly answer the question: state that it does not necessarily remain unchanged.');
      }
    } else {
      if (mentionsOppCost) {
        p3Awarded = true;
        feedback = '✓ Correctly linked the economic reasoning to opportunity cost.';
      } else {
        feedback = '✗ Make sure to conclude on the opportunity cost.';
        areasToImprove.push('State the conclusion on opportunity cost clearly.');
      }
    }

    if (p3Awarded) score += 1;
    checks.push({
      pointNumber: 3,
      title: p3.title,
      awarded: p3Awarded,
      matchedFeedback: feedback,
      suggestion: p3Awarded ? undefined : p3.criterion
    });
  }

  // Point 4: If question has 4 rubric points (e.g. Level 4 questions)
  if (points.length >= 4) {
    const p4 = points[3];
    let p4Awarded = false;
    let feedback = '';

    const addressedBothOrNecessarily = 
      (normalized.includes('necessarily') && (normalized.includes('not') || normalized.includes('no'))) ||
      (normalized.includes('if') && normalized.includes('however'));

    if (addressedBothOrNecessarily) {
      p4Awarded = true;
      feedback = '✓ Handled the word "necessarily" with thorough economic reasoning.';
      strengths.push('Demonstrated mastery of "necessarily" logic by evaluating conditions.');
    } else {
      feedback = '✗ Remember to explicitly address the word "necessarily" in your conclusion.';
      areasToImprove.push('Explicitly conclude: "Therefore, the opportunity cost does not necessarily remain unchanged."');
    }

    if (p4Awarded) score += 1;
    checks.push({
      pointNumber: 4,
      title: p4.title,
      awarded: p4Awarded,
      matchedFeedback: feedback,
      suggestion: p4Awarded ? undefined : p4.criterion
    });
  }

  let overallFeedback = '';
  if (score === points.length) {
    overallFeedback = 'Full marks! Your response closely matches the official HKDSE marking scheme structure and terminology.';
  } else if (score >= points.length / 2) {
    overallFeedback = 'Good attempt! You have grasped the main economics idea, but check the missing marking points to achieve DSE Level 5 precision.';
  } else {
    overallFeedback = 'Keep going! Review the step-by-step reasoning chain and make sure to explicitly connect the highest-valued option forgone to opportunity cost.';
  }

  return {
    score,
    maxScore: points.length,
    checks,
    overallFeedback,
    strengths,
    areasToImprove
  };
}
