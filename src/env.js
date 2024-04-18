import { config } from "dotenv";

config();

export const slackBotToken = process.env.SLACK_BOT_TOKEN;
export const signingSecret = process.env.SLACK_SIGNING_SECRET;
export const appToken = process.env.SLACK_APP_TOKEN;
export const baseURL = process.env.GRAPH_URL;
export const appPort = Number(process.env.PORT) || 3100;
