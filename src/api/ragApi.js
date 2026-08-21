import axios from "axios";

const ragApi = axios.create({
  baseURL: import.meta.env.VITE_RAG_SERVICE_URL || "http://localhost:5050/api",
});

ragApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const uploadDocument = (file, category) => {
  const formData = new FormData();
  formData.append("file", file);
  if (category) formData.append("category", category);
  return ragApi.post("/documents/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const listDocuments = () => ragApi.get("/documents");

export const deleteDocument = (id) => ragApi.delete(`/documents/${id}`);

export const askQuestion = (question) => ragApi.post("/chat/ask", { question });

export default ragApi;
