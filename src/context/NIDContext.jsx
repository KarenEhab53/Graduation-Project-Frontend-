import { createContext, useState } from "react";
import api from "../api/api";

export const NIDContext = createContext();

export const NIDProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

 const addNID = async (formData) => {
   try {
     setLoading(true);
     setError(null);

     const { data } = await api.post("/addIdSearch", formData, {
       headers: {
         "Content-Type": "multipart/form-data",
       },
     });

     return data;
   } catch (err) {
     console.log("addNID error:", err?.response?.data);
     const message = err?.response?.data?.message || "Failed to add NID";
     setError(message);
     throw err;
   } finally {
     setLoading(false);
   }
 };

  const getMyNID = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data } = await api.get("/mynidsearch");

      return data;
    } catch (err) {
      if (err?.response?.status !== 404) {
        const message = err?.response?.data?.message || "Failed to fetch NID";
        setError(message);
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

const updateNID = async (formData) => {
  try {
    setLoading(true);
    setError(null);

    const { data } = await api.put("/updateIdSearch", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return data;
  } catch (err) {
    console.log("updateNID error:", err?.response?.data);
    const message = err?.response?.data?.message || "Failed to update NID";
    setError(message);
    throw err;
  } finally {
    setLoading(false);
  }
};

  const deleteNID = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data } = await api.delete("/deleteIdSearch");

      return data;
    } catch (err) {
      const message = err?.response?.data?.message || "Failed to delete NID";
      setError(message);
      throw err;
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
