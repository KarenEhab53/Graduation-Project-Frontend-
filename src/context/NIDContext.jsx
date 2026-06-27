import { createContext, useState } from "react";
import api from "../api/api";

export const NIDContext = createContext();

export const NIDProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addNID = async (formData) => {
    try {
      setLoading(true);
      const { data } = await api.post("/addIdSearch", formData);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const getMyNID = async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/mynidsearch");

      return data;
    } finally {
      setLoading(false);
    }
  };

  const updateNID = async (formData) => {
    try {
      setLoading(true);

      const { data } = await api.put("/updateIdSearch", formData);

      return data;
    } finally {
      setLoading(false);
    }
  };

  const deleteNID = async () => {
    try {
      setLoading(true);

      const { data } = await api.delete("/deleteIdSearch");

      return data;
    } finally {
      setLoading(false);
    }
  };

  return (
    <NIDContext.Provider
      value={{
        addNID,
        getMyNID,
        updateNID,
        deleteNID,
        loading,
        error,
      }}
    >
      {children}
    </NIDContext.Provider>
  );
};
