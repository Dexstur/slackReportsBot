import { app } from "../../config/index.js";
import * as graph from "../../api/index.js";

export async function finishedReport(userId) {
  const completed = await graph.fullReport(userId);

  if (completed) await publishReport(completed);
}

export async function publishReport(report) {
  const user = report.user.slackId;

  const { responses } = report;

  const context = `*<@${user}>* has completed their report\n${responses
    .map((response) => `*${response.question}*\n${response.answer}`)
    .join("\n\n")}`;

  const text = `*<@${user}>* has completed their report`;

  const contents = responses.map((response) => [
    { text: `*${response.question}*`, color: "#E44325" },
    { text: `${response.answer}\n\n`, color: "#1B06F4" },
  ]);

  const flow = await graph.viewWorkflow(report.workflowId);

  if (flow.broadcast) {
    await app.client.chat.postMessage({
      channel: flow.broadcast,
      team: flow.teamId,
      text,
      attachments: contents.flat(),
    });
  }
}
