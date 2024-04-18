import axios from "axios";
import { slackBotToken, baseURL } from "../env.js";

export const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    Authorization: `Bearer ${slackBotToken}`,
    "Access-Control-Allow-Credentials": true,
  },
});
