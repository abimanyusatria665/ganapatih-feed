"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

type JwtPayload = {
  sub: number;
  username: string;
  exp: number;
};

type AuthContextType = {
  isLoggedIn: boolean;
  username: string | null;
  login: (token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  username: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded: JwtPayload = jwtDecode(token);
        setIsLoggedIn(true);
        setUsername(decoded.username);
      } catch {
        setIsLoggedIn(false);
        setUsername(null);
      }
    }
  }, []);

  const login = (token: string) => {
    localStorage.setItem("token", token);
    const decoded: JwtPayload = jwtDecode(token);
    setIsLoggedIn(true);
    setUsername(decoded.username);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUsername(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
