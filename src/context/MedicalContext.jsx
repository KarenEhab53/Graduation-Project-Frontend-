import React, { createContext, useContext, useState, useCallback } from "react";
import api from "../api/api";

const MedicalContext = createContext(null);

export const MedicalProvider = ({ children }) => {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getFolders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/get-folders");
      setFolders(Array.isArray(res.data.folder) ? res.data.folder : []);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createFolder = useCallback(async (disease) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post("/create-folder", { disease });
      const newFolder = res.data.folder;
      setFolders((prev) => [
        ...prev,
        Array.isArray(newFolder) ? newFolder[0] : newFolder,
      ]);
      return newFolder;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

 const updateFolder = useCallback(async (id, disease) => {
   setLoading(true);
   setError(null);
   try {
     const res = await api.put(`/update-folder/${id}`, { disease });
     console.log("update-folder response:", res.data); // TEMP: check devtools console for the real shape
     const returned = Array.isArray(res.data.folder)
       ? res.data.folder[0]
       : res.data.folder;
     setFolders((prev) =>
       prev.map((folder) =>
         folder._id === id ? { ...folder, ...returned, disease } : folder,
       ),
     );
     return returned;
   } catch (err) {
     setError(err.response?.data?.message || err.message);
     throw err;
   } finally {
     setLoading(false);
   }
 }, []);

  const deleteFolder = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/delete-folder/${id}`);
      setFolders((prev) => prev.filter((folder) => folder._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    folders,
    loading,
    error,
    getFolders,
    createFolder,
    updateFolder,
    deleteFolder,
  };

  return (
    <MedicalContext.Provider value={value}>{children}</MedicalContext.Provider>
  );
};

export const useMedical = () => {
  const context = useContext(MedicalContext);
  if (!context) {
    throw new Error("useMedical must be used within a MedicalProvider");
  }
  return context;
};
