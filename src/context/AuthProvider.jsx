import { useState, useEffect } from "react";
import { AuthContext } from "./context";
import {
  generateLinkService,
  loginService,
  registerService,
  verifyLinkService,
} from "../api/services/authService";

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // // Load user safely on mount
  // useEffect(() => {
  //   try {
  //     const savedUser = localStorage.getItem("user");
  //     console.log("user: ", saveUser);
  //     if (savedUser) {
  //       setUser(JSON.parse(savedUser));
  //     }
  //   } catch (err) {
  //     console.error("Invalid user in localStorage. Clearing...", err);
  //     localStorage.removeItem("user"); // remove corrupted data
  //   }
  // }, []);

  const saveUser = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const login = async (email, password) => {
    try {
      const res = await loginService(email, password);
      if (res?.user) {
        saveUser(res.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const register = async (form) => {
    try {
      const res = await registerService(form);
      return res?.success || false;
    } catch (error) {
      console.error("Register error:", error);
      return false;
    }
  };

  const verifyLink = async (email, token) => {
    try {
      const res = await verifyLinkService(email, token);
      if (res.ok && res.user) {
        saveUser(res.user);
      }
      return true;
    } catch (err) {
      console.error("Email verification error:", err);
      return false;
    }
  };

  const generateLink = async (email) => {
    try {
      const res = await generateLinkService(email);
      if (res.ok && res.user) {
        saveUser(res.user);
      }
      return true;
    } catch (err) {
      console.error("Email verification error:", err);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        register,
        logout,
        verifyLink,
        generateLink,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
