import { app } from "../../config/index.js";
import { getTeamId } from "./team.js";

export async function channelList() {
  const result = await app.client.conversations.list();

  return result.channels;
}
export async function findChannel(name) {
  const channels = await channelList();

  const channel = channels.find((channel) => channel.name === name);

  return channel ? channel.id : null;
}

export async function findTeamChannel(channelName, teamName) {
  const channels = await channelList();

  const team = await getTeamId(teamName);

  if (!team) {
    return null;
  }

  const channel = channels.find(
    (channel) =>
      channel.name.toLowerCase() === channelName.toLowerCase() &&
      channel.context_team_id === team
  );

  return channel ? channel.id : null;
}

export async function locateChannel(channelName, teamId) {
  const channels = await channelList();

  const channel = channels.find(
    (channel) =>
      channel.name.toLowerCase() === channelName.toLowerCase() &&
      channel.context_team_id === teamId
  );

  return channel ? channel.id : null;
}
