import { app } from "../../config/index.js";
import * as graph from "../../api/index.js";
import { extractUserDetails } from "../functions/index.js";

//registers new users
app.event("team_join", async ({ event, client, logger }) => {
  try {
    const { user } = event;
    console.log("user joined");

    if (user.is_email_confirmed) {
      const userData = extractUserDetails(user);

      await graph.register(userData);
    }
  } catch (err) {
    logger.error(err);
  }
});

//updates user details
app.event("user_change", async ({ event, client, logger }) => {
  try {
    const { user } = event;
    console.log("user changed");
    const { id, real_name, tz, tz_label, tz_offset } = user;

    const args = {
      id,
      name: real_name,
      tz,
      tz_label,
      tz_offset: Number(tz_offset),
    };

    await graph.updateUser(args);
  } catch (err) {
    console.error(err);
  }
});
