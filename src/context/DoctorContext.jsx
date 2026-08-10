// src/context/DoctorContext.jsx
import { createContext, useContext, useState, useCallback } from "react";
import api from "../api/api";

const DoctorContext = createContext(null);

export function DoctorProvider({ children }) {
  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchDoctors = useCallback(async ({ specialty, city, name } = {}) => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (specialty) params.specialty = specialty;
      if (city) params.city = city;
      if (name) params.name = name;

      const res = await api.get("/get-all-doctor-data", { params });
      setDoctors(res.data.data);
    } catch (err) {
      if (err.response?.status === 404) {
        setDoctors([]);
      } else {
        setError(err.response?.data?.message || "Failed to load doctors");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const resetDoctors = useCallback(() => {
    setDoctors([]);
    setError(null);
  }, []);

  const fetchFilterOptions = useCallback(async () => {
    try {
      const res = await api.get("/get-all-doctor-data");
      const allDoctors = res.data.data || [];

      const specialtySet = new Set();
      const citySet = new Set();

      allDoctors.forEach((doc) => {
        if (doc.specialty) specialtySet.add(doc.specialty);
        if (doc.userId?.location) citySet.add(doc.userId.location);
      });

      setSpecialties([...specialtySet].sort());
      setCities([...citySet].sort());
    } catch (err) {
      console.error("Failed to load filter options", err);
    }
  }, []);

  return (
    <DoctorContext.Provider
      value={{
        doctors,
        specialties,
        cities,
        loading,
        error,
        searchDoctors,
        resetDoctors,
        fetchFilterOptions,
      }}
    >
      {children}
    </DoctorContext.Provider>
  );
}

export function useDoctors() {
  const context = useContext(DoctorContext);
  if (!context) {
    throw new Error("useDoctors must be used within a DoctorProvider");
  }
  return context;
}
