import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { FaEnvelope, FaLock } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // 🎉 SUCCESS ANIMATION TRIGGER
        setMessage("Login successful!");
        setIsSuccess(true);
        localStorage.setItem("token", data.token);

        if (data.user) {
          localStorage.setItem("userName", data.user.name);
          localStorage.setItem("userEmail", data.user.email);
        }

        // MODERN EXIT ANIMATION - 2.5s total
        setTimeout(() => {
          navigate("/dashboard");
        }, 2500);
      } else {
        setMessage(data.message || "Login failed");
        setIsSuccess(false);
      }
    } catch (err) {
      setMessage("Server error");
      setIsSuccess(false);
    }
  };

  return (
    <div className="login-container">
      <div className={`login-card ${isSuccess ? 'success-animation' : ''}`}>
        <img src="/logo.png" alt="LaptopTester Logo" className="login-logo" />

        <div className="logo-section">
          <h1 className="app-title">Laptop Tester</h1>
          <p className="app-subtitle">Check your laptop health instantly</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit} autoComplete="off">
          <div className="input-group">
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="off"
            />
          </div>

          <div className="input-group">
            <FaLock className="input-icon" />
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>

          <button type="submit" className="login-btn">
            Login
          </button>

          {message && (
            <div
              className={`alert ${
                isSuccess ? "alert-success" : "alert-error"
              }`}
            >
              <span>{message}</span>
            </div>
          )}

          <p className="register-text">
            Don't have an account?{" "}
            <span onClick={() => navigate("/register")}>Register</span>
          </p>
        </form>

        {/* SUCCESS ANIMATION OVERLAY */}
        {isSuccess && (
          <div className="success-overlay">
            <div className="success-content">
              <div className="checkmark-circle">
                <div className="checkmark"></div>
              </div>
              <h2>Welcome Back!</h2>
              <p>Redirecting to Dashboard...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;