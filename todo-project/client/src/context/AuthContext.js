import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("jwt"));

  const login = (newToken) => {
    localStorage.setItem("jwt", newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("jwt");
    setToken(null);
  };

  const isLoggedIn = !!token;

  return (
    <AuthContext.Provider value={{ token, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
