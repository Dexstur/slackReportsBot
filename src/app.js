import { appPort } from "./env.js";
import { app } from "./config/bot.config.js";
import "./bot/index.js";
import {
  registerTeams,
  registerUsers,
  teamList,
} from "./bot/functions/index.js";

console.log("App");

function run() {
  registerTeams()
    .then(() => {})
    .catch((err) => {
      console.error(err);
    });
  registerUsers()
    .then(() => {})
    .catch((err) => {
      console.error(err.response.data);
    });
}

app.start(appPort).then(() => {
  // run();
  console.log("App is running " + appPort);
  console.log("⚡️ Bolt app is running!");
});
