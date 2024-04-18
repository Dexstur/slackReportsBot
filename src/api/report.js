import { api } from "../config/index.js";

export const fetchDayReport = async (userId) => {
  const query = `
          query{
              fetchDayReport(input: {userId: "${userId}"}){
                  id
              }
          }
      `;

  const response = await api.post("/", { query });

  return response.data.data.fetchDayReport;
};

export const fullReport = async (userId) => {
  const query = `
      query {
        fullReport (input: {userId: "${userId}"}) {
          id
          workflowId
          user {
            name
            slackId
          }
          responses {
            question
            answer
          }
        }
      }
    `;

  const response = await api.post("/", { query });

  return response.data.data.fullReport;
};

export const reportWithNextQuestion = async (userId) => {
  const mutation = `
      mutation {
          reportWithNextQuestion(input: {userId: "${userId}"}){
              report {
                  id
                  userId
                  user{
                      name
                  }
  
                  responses {
                    id
                  }
                  
              }
  
              nextQuestion {
                  step_id
                  text
              }
          }
      }
    `;

  const response = await api.post("/", { query: mutation });

  return response.data.data.reportWithNextQuestion;
};

export const trashReport = async (userId) => {
  const mutation = `
      mutation {
        trashReport(input: {userId: "${userId}"}) 
      }
    `;

  const response = await api.post("/", { query: mutation });

  return response.data.data.trashReport;
};
