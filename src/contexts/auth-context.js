import React, { useState, createContext } from "react";
import AuthService from "../services/auth-service";

export const AuthContext = createContext();

export const AuthContextProvider = (props) => {
  const [appUser, setAppUser] = useState();
  const service = new AuthService();

  const makeLogin = async (username, password) => {
    return await service
      .login(username, password)
      .then((response) => {
        if (response.username) {
          setAppUser(response);
        }
        return response;
      })
      .catch((error) => console.log(error));
  };

  const checkLogin = async () => {
    await service.isAuthenticated().then((response) => {
      if (response.username) {
        setAppUser(response);
      }
    });
  };

  const logout = async () => {
    await service
      .logout()
      .then((response) => {
        if (response.message === "User logged out succesfully") {
          setAppUser(null);
        }
      })
      .catch((e) => console.log(e));
  };

  return (
    <AuthContext.Provider value={{ appUser, makeLogin, checkLogin, logout }}>{props.children}</AuthContext.Provider>
  );
};
