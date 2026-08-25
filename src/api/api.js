import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
  // من غير Content-Type ثابت هنا — axios بيحدده لوحده تلقائي:
  // "application/json" للأوبجكتات العادية، و"multipart/form-data" + الـ boundary
  // الصح تلقائيًا لما تبعت FormData (زي في AddHistory.jsx).
});

// Add token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Handle responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("Unauthorized - Token may be invalid or expired");
      console.error("Authorization header was sent, but server rejected it.");
    }

    return Promise.reject(error);
  },
);

export default api;
