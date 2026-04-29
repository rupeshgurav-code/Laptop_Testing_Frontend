import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import { FaLaptopCode, FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa";
const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Registration successful!");
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        setMessage(data.message || "Registration failed");
      }
    } catch (err) {
      setMessage("Server error");
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="logo-section">
          <FaLaptopCode className="logo-icon" />
          <h1>Create Account</h1>
          <p>Join Laptop Tester today</p>
        </div>

        <form className="register-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <FaUser className="input-icon" />
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <FaLock className="input-icon" />
            <input
              type="password"
              placeholder="Create password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <FaLock className="input-icon" />
            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="register-btn">
            Register
          </button>

          {message && (
            <p style={{ color: message.includes("successful") ? "green" : "red" }}>
              {message}
            </p>
          )}

          <p className="login-text">
            Already have an account?{" "}
            <span onClick={() => navigate("/")}>Login</span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;