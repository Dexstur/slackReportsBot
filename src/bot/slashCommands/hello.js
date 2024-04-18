import { app } from "../../config/index.js";

app.command("/hello", async ({ command, ack, say }) => {
  await ack();
  await say(`Hello there, <@${command.user_id}>`);
});
