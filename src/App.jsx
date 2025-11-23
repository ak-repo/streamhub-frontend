import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./MainLayout";
import AuthProvider from "./context/AuthProvider";
const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <MainLayout />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
