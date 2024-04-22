import { app } from "../../config/index.js";
import { channelList } from "./channel.js";
import * as graph from "../../api/index.js";

export async function teamList() {
  const channels = await channelList();
  const teamIds = [
    ...new Set(channels.map((channel) => channel.context_team_id)),
  ];

  const teams = teamIds.map(async (teamId) => {
    const team = await app.client.team.info({ team: teamId });

    return team.team;
  });

  const result = await Promise.all(teams);
  return result;
}

export async function findTeam(name) {
  const teams = await teamList();

  const team = teams.find(
    (team) => team.name.toLowerCase() === name.toLowerCase()
  );

  return team ? team : null;
}

export async function getTeamId(teamName) {
  const team = await findTeam(teamName);

  return team ? team.id : null;
}

export async function registerTeams() {
  const teams = await teamList();

  const register = teams.map(async (team) => {
    const args = {
      team_id: team.id,
      name: team.name,
    };
    return graph.createTeam(args);
  });

  await Promise.all(register);

  console.log("Teams registered");
}
