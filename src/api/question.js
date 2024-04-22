import { api } from "../config/index.js";

export const createQuestion = async ({ workflowId, text, step_id }) => {
  const mutation = `
      mutation {
        createQuestion (input: {workflowId: "${workflowId}", text: "${text}", step_id: "${step_id}"}) {
          id
          text
        }
      }
    `;

  try {
    const response = await api.post("/", { query: mutation });

    return response.data.data.createQuestion;
  } catch (err) {
    console.log(err.response.data.errors);
    return null;
  }
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

  try {
    const response = await api.post("/", { query });

    return response.data.data.listQuestionsByWorkflow;
  } catch (err) {
    console.log(err.response.data.errors);
    return null;
  }
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

  try {
    const response = await api.post("/", { query });

    return response.data.data.listQuestionById;
  } catch (err) {
    console.log(err.response.data.errors);
    return null;
  }
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
