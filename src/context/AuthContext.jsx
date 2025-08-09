import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("authUser");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  function signUp(email, password, extraData = {}) {
    let users = JSON.parse(localStorage.getItem("users")) || [];

    if (users.find((u) => u.email === email)) {
      throw new Error("Email already registered");
    }

    const newUser = {
      id: Date.now(),
      email,
      password, // In real apps, hash this
      ...extraData,
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("authUser", JSON.stringify(newUser));
    setCurrentUser(newUser);
    return newUser;
  }

  function signIn(email, password) {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const foundUser = users.find(
      (u) => u.email === email && u.password === password
    );

    if (foundUser) {
      localStorage.setItem("authUser", JSON.stringify(foundUser));
      setCurrentUser(foundUser);
      return foundUser;
    }
    throw new Error("Invalid email or password");
  }

  function logOut() {
    localStorage.removeItem("authUser");
    setCurrentUser(null);
  }

  const value = {
    currentUser,
    signUp,
    signIn,
    logOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
