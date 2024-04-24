import { api } from "../config/index.js";

export const viewWorkflow = async (workflowId) => {
  const query = `
      query {
        viewWorkflow(input: {id: "${workflowId}"}) {
          id
          teamId
          broadcast
          questions {
            step_id
            text
          }
        }
      }
    `;

  const response = await api.post("/", { query });

  return response.data.data.viewWorkflow;
};

export const createWorkflow = async ({
  workflow_id,
  name,
  teamId,
  announce,
  channelId,
}) => {
  const mutation = `
      mutation {
        createWorkflow(input: {workflow_id: "${workflow_id}", name: "${name}", teamId: "${teamId}", announce: "${announce}", channelId: "${channelId}"}) {
          id
          name
        }
      }
    `;

  try {
    const response = await api.post("/", { query: mutation });

    console.log(response.data.data);

    return response.data.data.createWorkflow;
  } catch (err) {
    console.log(err.response.data.errors);
    return null;
  }
};

export const addBroadcast = async ({ workflowId, channelId }) => {
  const mutation = `
      mutation {
        addBroadcast(input: {workflowId: "${workflowId}", channelId: "${channelId}"}) {
          id
        }
      }
    `;

  const response = await api.post("/", { query: mutation });
  console.log(response.data);

  return response.data.data.addBroadcast;
};

export const launchWorkflow = async (id) => {
  const mutation = `
    mutation {
      launchWorkflow(input: {id: "${id}"}) {
        workflow_id
        channelId
        name
        announce
        questions {
          text
        }
      }
    }
  `;

  const response = await api.post("/", { query: mutation });

  return response.data.data.launchWorkflow;
};
