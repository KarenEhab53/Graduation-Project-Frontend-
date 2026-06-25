// src/context/ProfileContext.jsx
import { createContext, useContext, useState, useCallback } from "react";
import api from "../api/api";
import { useAuth } from "./AuthContext.jsx";

const ProfileContext = createContext(null);

export function ProfileProvider({ children }) {
  const { user: authUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/profile");
      setProfile(res.data.user);
      return res.data.user;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load profile");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (updates) => {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        name: updates.name,
        phone: updates.phone,
        location: updates.location,
      };
      const res = await api.put("/update-profile", payload);
      setProfile(res.data.user);
      return res.data.user;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfileImage = useCallback(async (file) => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("profileImage", file);

      const res = await api.put("/update-profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setProfile(res.data.user);
      return res.data.user;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update photo");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchLocations = useCallback(async () => {
    try {
      const res = await api.get("/locations");
      setLocations(res.data.locations);
    } catch (err) {
      console.error("Failed to load locations", err);
    }
  }, []);

  return (
    <ProfileContext.Provider
      value={{
        profile,
        loading,
        error,
        fetchProfile,
        updateProfile,
        updateProfileImage,
        locations,
        fetchLocations,
        authUser,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
}
