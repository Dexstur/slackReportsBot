import { app } from "../../config/index.js";
import * as bolt from "@slack/bolt";
import * as graph from "../../api/index.js";
import { saveBroadcast } from "../functions/index.js";
import { locateChannel } from "../functions/index.js";
import { slackBotToken } from "../../env.js";

const broadcast = new bolt.default.WorkflowStep("televise", {
  edit: async ({ ack, step, configure }) => {
    await ack();

    console.log("editing broadcast step");

    const { televise } = step.inputs;

    const blocks = [
      {
        type: "input",
        block_id: "televise_input",
        element: {
          type: "plain_text_input",
          action_id: "televise",
          placeholder: {
            type: "plain_text",
            text: televise ? televise.value : "Channel name to publish reports",
          },
        },
        label: {
          type: "plain_text",
          text: "Publish channel",
        },
      },
    ];

    await configure({ blocks });
  },
  save: async ({ ack, step, view, update }) => {
    await ack();

    console.log("saving broadcast step");

    const { values } = view.state;

    const televise = values.televise_input.televise;

    const inputs = {
      televise: { value: televise.value },
    };

    const workId = step.workflow_id;
    console.log(workId);

    const workflow = await graph.viewWorkflow(workId);

    const questions = workflow.questions;
    const channelId = await locateChannel(televise.value, workflow.teamId);

    if (questions.length && channelId) {
      await update({ inputs });
      await saveBroadcast({ workflowId: workId, channelId });
    }
  },
  execute: async ({ step, complete, fail, client }) => {
    console.log("executing workflow");

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

app.step(broadcast);
