import { app } from "../../config/index.js";
import * as graph from "../../api/index.js";
import { finishedReport } from "../functions/index.js";

app.message(async ({ message, say }) => {
  console.log("message received");

  const reply = await app.client.conversations.history({
    channel: message.channel,
    team: message.team,
    limit: 2,
  });
  //   console.log(reply.messages);

  try {
    const { user, client_msg_id, bot_id } = reply.messages[0];

    if (message.subtype) {
      if (message.subtype === "message_changed") {
        const msgId = message.message.client_msg_id;
        const edit = message.message.text;

        await graph.editResponse({ msgId, answer: edit });
      }
      return;
    }

    if (bot_id) {
      return;
    }

    const question = reply.messages[1]?.text;

    const answer = reply.messages[0].text;

    const filedReport = await graph.reportWithNextQuestion(user);

    if (!filedReport) {
      say(
        `Hi, I'm a bot. I'm here to help you with your report.\n Reports have not been setup yet.`
      );
      return;
    }

    if (!filedReport.nextQuestion && !filedReport.report.responses.length) {
      say("Edit in progress. Please check in later");

      await graph.trashReport(user);
      return;
    }

    if (filedReport.nextQuestion) {
      if (filedReport.nextQuestion.text !== question) {
        say(filedReport.nextQuestion.text);
        return;
      }
      const questionId = filedReport.nextQuestion.step_id;
      const reportId = filedReport.report.id;

      console.log("sending response");
      const respond = await graph.createResponse({
        questionId,
        reportId,
        answer,
        msgId: client_msg_id.toString(),
      });

      if (respond.nextQuestion) {
        say(respond.nextQuestion.text);
        return;
      } else {
        say("Thank you. Have a nice day");
        console.log("report finished");
        await finishedReport(user);
        return;
      }
    } else {
      say(`Hi, I'm a bot. I'm here to help you with your report`);
      return;
    }
  } catch (err) {
    console.log(err);
    say("Something went wrong");
  }
});
