import { api } from "../config/index.js";

export const listUsers = async () => {
  const query = `
          query {
              listUsers {
                  id
                  slackId
                  name
                  teamId
                  email
              }
          }
      `;

  const response = await api.post("/", { query });

  return response.data.data.listUsers;
};

export const register = async ({
  slackId,
  tz,
  email,
  name,
  teamId,
  tz_label,
  tz_offset,
}) => {
  const mutation = `
      mutation {
        register (input: {slackId: "${slackId}", tz: "${tz}", email: "${email}", name: "${name}", teamId: "${teamId}", tz_label: "${tz_label}", tz_offset: ${tz_offset}}) {
          id
          slackId
        }
      }
    `;

  const response = await api.post("/", { query: mutation });

  return response.data.data.register;
};

export const updateUser = async ({ id, name, tz, tz_label, tz_offset }) => {
  const mutation = `
      mutation {
        updateUser (input: {id: "${id}", name: "${name}", tz: "${tz}", tz_label: "${tz_label}", tz_offset: ${tz_offset}}) {
          id
          name
        }
      }
    `;

  const response = await api.post("/", { query: mutation });

  return response.data.data.updateUser;
};

export const listUsersByTeam = async (teamId) => {
  const query = `
      query {
        listUsersByTeam (input: {teamId: "${teamId}"}) {
          id
          slackId
          name
          email
        }
      }
    `;

  const response = await api.post("/", { query });

  return response.data.data.listUsersByTeam;
};
