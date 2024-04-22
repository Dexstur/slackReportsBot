import { api } from "../config/index.js";

export const escapeString = (str) => {
  // Replace special characters with their escaped equivalents
  return str.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n");
};
export const createResponse = async ({
  questionId,
  reportId,
  answer,
  msgId,
}) => {
  // Escape the answer string
  const escapedAnswer = escapeString(answer);

  const mutation = `
          mutation {
            createResponse(input: {questionId: "${questionId}", reportId: "${reportId}", answer: "${escapedAnswer}", msgId: "${msgId}"}) {
              report {
                id
              }
              nextQuestion {
                text
                step_id
              }
            }
          }
      `;

  const response = await api.post("/", { query: mutation });
  console.log(response.data.data.createResponse);
  return response.data.data.createResponse;
};

export const editResponse = async ({ msgId, answer }) => {
  const escapedAnswer = escapeString(answer);
  const mutation = `
      mutation {
        editResponse (input: {msgId: "${msgId}", answer: "${escapedAnswer}"}) {
          id
          answer
        }
      }
    `;

  const response = await api.post("/", { query: mutation });

  return response.data.data.editResponse;
};
