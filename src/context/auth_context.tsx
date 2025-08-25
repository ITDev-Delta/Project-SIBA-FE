import React, { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { loginService } from "../api/Auth/authService";
import { toast } from "react-toastify";

interface AuthContextType {
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const storedLoginStatus = localStorage.getItem("isLoggedIn");
    const token = localStorage.getItem("access_token");

    return storedLoginStatus === "true" && !!token;
  });

  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("access_token")
  );

  useEffect(() => {
    localStorage.setItem("isLoggedIn", JSON.stringify(isLoggedIn));
    if (token) {
      localStorage.setItem("access_token", token);
    } else {
      localStorage.removeItem("access_token");
    }
  }, [isLoggedIn, token]);

  const login = (username: string, password: string): void => {
    setIsLoading(true);

    const payload = {
      username: username,
      password: password,
    };

    console.log(payload);

    loginService(payload)
      .then((res) => {
        setIsLoading(false);
        if (res.status === 200 || res.status === 201) {
          setIsLoading(false);
          // toast.success(res.data.message);
          console.log(res.data);
          setToken(res.data.access_token);
          setIsLoggedIn(true);
          navigate("/");
        } else {
          setIsLoading(false);
          toast.error(
            res.data.message || "Gagal melakukan login, silakan coba lagi."
          );
        }
      })
      .catch((error) => {
        setIsLoading(false);
        toast.error(error?.response?.data?.message || "Internal Server Error");
      });
  };

  const logout = (): void => {
    setIsLoggedIn(false);
    setToken(null);
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ isLoading, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
