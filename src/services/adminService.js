import api from "../api/api";

export const getAllDoctors = () => api.get("/all-doctors");
export const approveDoctor = (id) => api.patch(`/approve-doctor/${id}`);
export const revokeDoctor = (id) => api.patch(`/revoke-doctor/${id}`);

export const getAllUsers = () => api.get("/allUsers");
export const deleteUser = (id) => api.delete(`/delete-user/${id}`);

export const getProfile = () => api.get("/profile");
export const updateProfile = (formData) =>
  api.put("/update-profile", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
