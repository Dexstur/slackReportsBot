import { app } from "../../config/index.js";
import * as bolt from "@slack/bolt";
import * as graph from "../../api/index.js";
import { saveQuestionStep } from "../functions/index.js";

const questioning = new bolt.default.WorkflowStep("ask_question", {
  edit: async ({ ack, step, configure }) => {
    await ack();

    console.log("editing question");

    const { question } = step.inputs;

    const blocks = [
      {
        type: "input",
        block_id: "question_input",
        element: {
          type: "plain_text_input",
          action_id: "question",
          placeholder: {
            type: "plain_text",
            text: question ? question.value : "Enter a qestion",
          },
        },
        label: {
          type: "plain_text",
          text: "Question",
        },
      },
    ];

    await configure({ blocks });
  },
  save: async ({ ack, step, view, update }) => {
    await ack();

    console.log("saving question");

    const { values } = view.state;

    const question = values.question_input.question;

    const inputs = {
      question: { value: question.value },
    };

    const workId = step.workflow_id;

    const stepId = step.step_id;

    const args = {
      workId,
      stepId,
      question: question.value,
    };

    try {
      await update({ inputs });

      await saveQuestionStep(args);
      console.log("question saved");
    } catch (err) {
      console.error(err);
      console.error("error saving question");
    }
  },
  execute: async ({ step, complete, fail }) => {
    const workflowId = step.workflow_id;

    const questionId = step.step_id;

    const args = {
      workflowId,
      questionId,
    };

    const queueQuestion = await graph.queueQuestion(args);

    if (!queueQuestion) {
      await fail({ error: "Question not queued" });
    }

    await complete();
  },
});

app.step(questioning);
