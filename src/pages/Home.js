import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem("token"); // Check if user is logged in

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div>
      <h2>Welcome to the Home Page</h2>
      {isAuthenticated ? (
        <>
          <p>You are logged in!</p>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link> | <Link to="/signup">Sign Up</Link>
        </>
      )}
    </div>
  );
};

export default Home;
