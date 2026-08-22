import axios from "axios";
import api from "../api/api"; 

const BASE_URL = "http://localhost:3000/api";

export const requestOtp = (email) => {
  return api.post("/forget-password", { email });
};

export const verifyOtp = (email, otp) => {
  return api.post("/verify-otp", { email, otp });
};


export const resetPassword = (resetToken, password, confirmPassword) => {
  return axios.post(
    `${BASE_URL}/reset-password`,
    { password, confirmPassword },
    { headers: { Authorization: `Bearer ${resetToken}` } },
  );
};
