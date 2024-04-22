import { app } from "../../config/index.js";
import * as bolt from "@slack/bolt";
import * as graph from "../../api/index.js";
import {
  saveWorkflow,
  findTeamChannel,
  getTeamId,
} from "../functions/index.js";
import { slackBotToken } from "../../env.js";

const launcher = new bolt.default.WorkflowStep("launcher", {
  edit: async ({ ack, step, configure }) => {
    await ack();
    console.log("editing launcher");

    const { title, workspace, channel, message } = step.inputs;

    const blocks = [
      {
        type: "input",
        block_id: "title_input",
        element: {
          type: "plain_text_input",
          action_id: "title",
          placeholder: {
            type: "plain_text",
            text: title ? title.value : "Title",
          },
        },
        label: {
          type: "plain_text",
          text: "Title",
        },
      },
      {
        type: "input",
        block_id: "workspace_input",
        element: {
          type: "plain_text_input",
          action_id: "workspace",
          placeholder: {
            type: "plain_text",
            text: workspace ? workspace.value : "Name of workspace",
          },
        },
        label: {
          type: "plain_text",
          text: "Workspace",
        },
      },
      {
        type: "input",
        block_id: "channel_input",
        element: {
          type: "plain_text_input",
          action_id: "channel_name",
          placeholder: {
            type: "plain_text",
            text: channel ? channel.value : "Select broadcast channel",
          },
        },
        label: {
          type: "plain_text",
          text: "Channel name",
        },
      },
      {
        type: "input",
        block_id: "message_input",
        element: {
          type: "plain_text_input",
          action_id: "message_input",
          placeholder: {
            type: "plain_text",
            text: message ? message.value : "Broadcast message",
          },
        },
        label: {
          type: "plain_text",
          text: "Broadcast message",
        },
      },
    ];

    await configure({ blocks });
  },
  save: async ({ ack, step, view, update }) => {
    await ack();

    console.log("saving launcher");

    const { workflow_id } = step;

    const { values } = view.state;
    const title = values.title_input.title;
    const workspace = values.workspace_input.workspace;
    const channel = values.channel_input.channel_name;
    const message = values.message_input.message_input;

    const inputs = {
      title: { value: title.value },
      workspace: { value: workspace.value },
      channel: { value: channel.value },
      message: { value: message.value },
    };

    const channelId = await findTeamChannel(channel.value, workspace.value);

    const teamId = await getTeamId(workspace.value);

    if (channelId) {
      const args = {
        workflow_id,
        name: title.value,
        announce: message.value,
        channelId,
        teamId,
      };

      try {
        await update({ inputs });
        await saveWorkflow(args);
      } catch (err) {
        console.error(err);
        console.error("error saving launcher");
      }
    }
  },
  execute: async ({ step, complete, fail, client }) => {
    console.log("executing launcher");

    const flow = await graph.launchWorkflow(step.workflow_id);

    const channelId = flow.channelId;

    if (!flow) {
      console.error("Resource fetch failed");
      await fail({ error: "Resource fetch failed" });
      return;
    }

    const formattedMessage = `*${flow.name}*\n${flow.announce}`;

    await client.chat.postMessage({
      token: slackBotToken,
      channel: channelId,
      text: formattedMessage,
    });

    await complete();
  },
});

app.step(launcher);
