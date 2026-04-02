import React, { createContext, useContext, useState, useCallback } from "react";
import { User } from "./mock-data";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("auth_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("auth_token"));

  const login = useCallback(async (username: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) return false;
      const data = await res.json();
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem("auth_user", JSON.stringify(data.user));
      localStorage.setItem("auth_token", data.token);
      return true;
    } catch (err) {
      console.error("Erreur de connexion:", err);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("auth_user");
    localStorage.removeItem("auth_token");
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, setUser, token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
