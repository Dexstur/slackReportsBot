import * as bolt from "@slack/bolt";
import { slackBotToken, signingSecret, appToken } from "../env.js";

export const app = new bolt.default.App({
  token: slackBotToken,
  signingSecret,
  appToken,
  socketMode: true,
});
