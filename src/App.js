import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login setAuth={setIsAuthenticated} />} />
      <Route path="/signup" element={<Signup setAuth={setIsAuthenticated} />} />
      <Route
        path="/dashboard"
        element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
      />
    </Routes>
  );
};

export default App;
