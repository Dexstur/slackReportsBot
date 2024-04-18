import { appPort } from "./env.js";
import { app } from "./config/bot.config.js";
import "./bot/index.js";

console.log("App");

app.start(appPort).then(() => {
  console.log("App is running " + appPort);
  console.log("⚡️ Bolt app is running!");
});
