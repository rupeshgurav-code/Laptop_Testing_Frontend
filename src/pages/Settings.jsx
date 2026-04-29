import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCog,
  FaMoon,
  FaSun,
  FaTrash,
  FaSignOutAlt,
  FaArrowLeft,
  FaUserCircle
} from "react-icons/fa";
import "./Settings.css";

const Settings = () => {
  const navigate = useNavigate();

  const userName = localStorage.getItem("userName") || "User";

  // 🔥 FIXED: Initialize from localStorage AND sync with document
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme || "dark";
  });

  // 🔥 FIXED: Apply theme immediately on mount AND on changes
  useEffect(() => {
    // Apply saved theme immediately
    const savedTheme = localStorage.getItem("theme") || "dark";
    document.documentElement.setAttribute("data-theme", savedTheme);
    setTheme(savedTheme);
  }, []); // Empty dependency = run once on mount

  // 🔥 FIXED: Update theme AND save to localStorage
  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const clearData = () => {
    // Clear test data but KEEP theme and userName
    const keysToRemove = [
      "activities", "keyboard", "mic", "webcam", 
      "battery", "speaker", "wifi", "internet"
    ];
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    // Show better UX
    const notification = document.createElement("div");
    notification.innerHTML = "✅ All test history cleared!";
    notification.style.cssText = `
      position: fixed; top: 20px; right: 20px; 
      background: #28a745; color: white; 
      padding: 12px 20px; border-radius: 8px; 
      z-index: 9999; font-weight: bold;
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  };

  const logout = () => {
    if (window.confirm("Logout and clear all data?")) {
      localStorage.clear();
      navigate("/");
    }
  };

  return (
    <div className="settings-page">
      {/* HEADER */}
      <div className="settings-header">
        <button className="back-btn" onClick={() => navigate("/dashboard")}>
          <FaArrowLeft />
        </button>
        <h1>
          <FaCog /> Settings
        </h1>
      </div>

      {/* PROFILE */}
      <div className="settings-card profile-card">
        <FaUserCircle className="profile-icon" />
        <h2>{userName}</h2>
        <p>Manage your profile and preferences</p>
      </div>

      {/* THEME */}
      <div className="settings-card">
        <h3>
          <span>🌙 Theme </span>
          <span className={`theme-badge${theme}`}>{theme.toUpperCase()}</span>
        </h3>
        <button className="theme-btn" onClick={toggleTheme}>
          {theme === "dark" ? <FaSun /> : <FaMoon />}
          Switch to {theme === "dark" ? "Light" : "Dark"} Mode
        </button>
      </div>

      {/* STORAGE */}
      <div className="settings-card">
        <h3>Storage</h3>
        <div className="storage-info">
          <p>{Object.keys(localStorage).length - 2} items stored</p>
          <small>Includes test results and preferences</small>
        </div>
        <button className="danger-btn" onClick={clearData}>
          <FaTrash /> Clear Test History
        </button>
      </div>

      {/* ACCOUNT */}
      <div className="settings-card">
        <h3>Account</h3>
        <button className="logout-btn-settings" onClick={logout}>
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </div>
  );
};

export default Settings;