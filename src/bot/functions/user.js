import { app } from "../../config/index.js";
import * as graph from "../../api/index.js";

export const listUsers = async () => {
  const result = await app.client.users.list();
  const realUsers = result.members.filter(
    (user) => user.is_email_confirmed === true
  );

  return realUsers;
};

export function extractUserDetails(user) {
  const { id, team_id, real_name, tz, tz_label, tz_offset, profile } = user;

  return {
    slackId: id,
    teamId: team_id,
    email: profile.email,
    name: real_name,
    tz,
    tz_label,
    tz_offset: Number(tz_offset),
  };
}

export async function registerUsers() {
  const users = await listUsers();

  const calls = users.map(async (user) => {
    const userData = extractUserDetails(user);

    return graph.register(userData);
  });

  await Promise.all(calls);

  console.log("Users registered");
}
