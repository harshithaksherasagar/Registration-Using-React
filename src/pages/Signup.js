import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = ({ setAuth }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/signup", { // ✅ Fixed API URL
        username,
        email,
        password,
      });

      console.log("Signup Success:", res.data);
      setMessage(res.data.message);
      navigate("/login"); // Redirect to login after signup
    } catch (error) {
      console.error("Signup Error:", error);

      if (error.response) {
        setMessage(error.response.data?.message || "Signup failed");
      } else if (error.request) {
        setMessage("No response from server. Check backend.");
      } else {
        setMessage("Unexpected error occurred");
      }
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign Up</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Signup;
