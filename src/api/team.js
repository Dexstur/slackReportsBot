import { api } from "../config/index.js";

export const createTeam = async ({ team_id, name }) => {
  const mutation = `
      mutation {
        createTeam(input: {team_id: "${team_id}", name: "${name}"}) {
          id
          name
        }
      }
    `;

  const response = await api.post("/", { query: mutation });

  return response.data.data.createTeam;
};
