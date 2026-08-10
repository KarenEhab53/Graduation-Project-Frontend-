
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";
import socket from "../services/socket";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });
  const loading = false;

  
  useEffect(() => {
    if (user) {
      
      socket.emit("register", user._id);
    }
  }, [user]);

  
  const login = (userData, token) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);

    setUser(userData);

    
    socket.emit("register", userData._id);
  };

 
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    socket.disconnect();

    setUser(null);
  };

  
  const updateUser = (updates) => {
    setUser((prev) => {
      if (!prev) return prev;

      const merged = { ...prev, ...updates };

      localStorage.setItem("user", JSON.stringify(merged));

      return merged;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        updateUser,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}