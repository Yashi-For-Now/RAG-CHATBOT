import axios from "axios";

// base URL of FastAPI backend
const Base_URL = "http://localhost:8000/api";

const api = axios.create({ baseURL: Base_URL });

//Upload a pdf file for a session

export const uploadPDF = async (file, sessionId) => {
  const formData = new FormData();
  formData.append("file", file);
  // formData.append("session_id", sessionId);

  const response = await api.post(`/upload?session_id=${sessionId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

//sending question and getting an answer

export const sendMessage = async (question, sessionId) => {
  const response = await api.post("/chat", { question, session_id: sessionId });

  return response.data;
};

//get chat history for a session

export const getHistory = async (sessionId) => {
  const response = await api.get(`/history/${sessionId}`);

  return response.data;
};

// session status

export const getSessionStatus = async (sessionId) => {
  const response = await api.get(`/session/${sessionId}`);

  return response.data;
};

//delete session

export const deleteSession = async (sessionId) => {
  const response = await api.delete(`/session/${sessionId}`);

  return response.data;
};
