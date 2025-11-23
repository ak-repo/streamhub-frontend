import { useState } from "react";
import { AuthContext } from "./context";
import {
  generateLinkService,
  loginService,
  registerService,
  verifyLinkService,
} from "../api/services/authService";

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const isAuthenticated = !!user;

  const login = async (email, password) => {
    try {
      const res = await loginService(email, password);
      console.log("login  ", res);
      if (res?.user) {
        setUser(res.user);
        return true; // return true on successful login
      } else {
        return false; // return false if login fails
      }
    } catch (error) {
      console.error("Login error:", error);
      return false; // return false on error
    }
  };

  const register = async (form) => {
    try {
      const res = await registerService(form);
      return res?.data?.link_send;
    } catch (error) {
      console.error("Register error:", error);
      return null;
    }
  };

  const verifyLink = async (email, token) => {
    try {
      const res = await verifyLinkService(email, token);
      if (res.ok) {
        console.log("user data: ", res.user);
        setUser(res.user);
      }
      return true;
    } catch (err) {
      console.error("Email verification error:", err);
    }
  };

  const generateLink = async (email) => {
    try {
      const res = await generateLinkService(email);
      if (res.ok) {
        console.log("user data: ", res.user);
        setUser(res.user);
      }
      return true;
    } catch (err) {
      console.error("Email verification error:", err);
    }
  };

  const logout = () => {
    // logoutService();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        verifyLink,
        login,
        logout,
        generateLink,
        isAuthenticated,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
