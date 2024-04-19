import { api } from "../config/index.js";

export const makeQuestion = async ({ workflowId, text, step_id }) => {
  const mutation = `
      mutation {
        makeQuestion (input: {workflowId: "${workflowId}", text: "${text}", step_id: "${step_id}"}) {
          id
          text
        }
      }
    `;

  const response = await api.post("/", { query: mutation });

  return response.data.data.makeQuestion;
};

export const listQuestionsByWorkflow = async (workflowId) => {
  const query = `
      query {
        listQuestionsByWorkflow (input: {workflowId: "${workflowId}"}) {
          id
          text
        }
      }
    `;

  const response = await api.post("/", { query });

  return response.data.data.listQuestionsByWorkflow;
};

export const listQuestionById = async (id) => {
  const query = `
      query {
        listQuestionById (input: {id: "${id}"}) {
          id
          text
          step_id
        }
      }
    `;

  const response = await api.post("/", { query });

  return response.data.data.listQuestionById;
};

export const queueQuestion = async ({ workflowId, questionId }) => {
  const mutation = `
      mutation {
        queueQuestion(input: {workflowId: "${workflowId}", questionId: "${questionId}"}) {
          id
          workflow_id
          questions {
            text
          }
        }
      }
    `;

  const response = await api.post("/", { query: mutation });

  return response.data.data.queueQuestion;
};
