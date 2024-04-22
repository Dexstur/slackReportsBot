import { app } from "../../config/index.js";
import * as graph from "../../api/index.js";

export async function saveQuestionStep(
  { workId, stepId, question },
  times = 0
) {
  const args = {
    workflowId: workId,
    step_id: stepId,
    text: question,
  };
  if (times > 5) {
    return null;
  }

  const saved = await graph.createQuestion(args);

  if (!saved) {
    return setTimeout(async () => {
      await saveQuestionStep({ workId, stepId, question }, times + 1);
    }, times * 1000);
  }

  return saved;
}
