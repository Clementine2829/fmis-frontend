import React from "react";
import { Routes, Route, Navigate, Router, BrowserRouter } from "react-router-dom";
import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signup";
import Dashboard from "./components/Dashboard/Dashboard";
import PrivateRoute from "./utils/PrivateRoute";
import Navbar from "./components/Dashboard/Header";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute element={<Dashboard />} />
          }
        />
        <Route path="/" element={<Navigate to="/Dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
