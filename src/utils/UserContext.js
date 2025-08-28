import React, { createContext, useContext, useState } from "react";

export const UserContext = createContext();

export const useUser = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(sessionStorage.getItem("user")) || null
  );

  const login = (userData) => {
    setUser(userData);
    sessionStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("user");
  };

  const updateAccessToken = (token) => {
    setUser((prevUser) => ({
      ...prevUser,
      accessToken: token,
    }));
    sessionStorage.setItem("user", JSON.stringify({ ...user, accessToken: token }));
  };

  return (
    <UserContext.Provider value={{ user, setUser, login, logout, updateAccessToken }}>
      {children}
    </UserContext.Provider>
  );
};
