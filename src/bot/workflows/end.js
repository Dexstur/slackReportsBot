import { app } from "../../config/index.js";
import * as bolt from "@slack/bolt";
import * as graph from "../../api/index.js";
import { slackBotToken } from "../../env.js";

const end = new bolt.default.WorkflowStep("finally", {
  edit: async ({ ack, step, configure }) => {
    await ack();

    console.log("editing end step");

    const { terminate } = step.inputs;

    const blocks = [
      {
        type: "input",
        block_id: "terminate_input",
        element: {
          type: "plain_text_input",
          action_id: "terminate",
          placeholder: {
            type: "plain_text",
            text: terminate
              ? terminate.value
              : "Terminate message(Any text will do)",
          },
        },
        label: {
          type: "plain_text",
          text: "Termination",
        },
      },
    ];

    await configure({ blocks });
  },
  save: async ({ ack, step, view, update }) => {
    await ack();

    console.log("saving end step");

    const { values } = view.state;

    const terminate = values.terminate_input.terminate;

    const inputs = {
      terminate: { value: terminate.value },
    };

    const questions = await graph.listQuestionsByWorkflow(step.workflow_id);

    if (questions.length) {
      await update({ inputs });
    }
  },
  execute: async ({ step, complete, fail, client }) => {
    console.log("executing workflow");
    const workId = step.workflow_id;

    const workflow = await graph.viewWorkflow(step.workflow_id);

    if (!workflow || !workflow.questions.length) {
      await fail({ error: "Workflow not found/executable" });
    }

    const allUsers = await graph.listUsersByTeam(workflow.teamId);

    const firstQuestion = workflow.questions[0];

    const askFirstQuestion = allUsers.map(async (user) => {
      const reported = await graph.fetchDayReport(user.slackId);

      return reported
        ? null
        : client.chat.postMessage({
            token: slackBotToken,
            channel: user.slackId,
            text: firstQuestion.text,
            team: user.teamId,
          });
    });

    await Promise.all(askFirstQuestion);

    await complete();
  },
});

app.step(end);
