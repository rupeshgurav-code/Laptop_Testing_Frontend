import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Dashboard.css";
import {
  FaKeyboard,
  FaCamera,
  FaMicrophone,
  FaBatteryHalf,
  FaVolumeUp,
  FaWifi,
  FaDesktop,
  FaHistory,
  FaUserCircle,
  FaSignOutAlt
} from "react-icons/fa";

const Dashboard = () => {
  const [user, setUser] = useState({ name: "" });

  const [battery, setBattery] = useState(0);
  const [wifi, setWifi] = useState("checking");
  const [systemHealth, setSystemHealth] = useState("Good");
  const [activities, setActivities] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("userName") || "User";

    setUser({ name });

    if (!token) navigate("/");

    // APPLY SAVED THEME
    const savedTheme = localStorage.getItem("theme") || "dark";
    document.body.setAttribute("data-theme", savedTheme);

    // 🔋 BATTERY
    const loadBattery = async () => {
      if (navigator.getBattery) {
        const bat = await navigator.getBattery();

        const update = () => {
          setBattery(Math.round(bat.level * 100));
        };

        update();
        bat.addEventListener("levelchange", update);
      }
    };

    loadBattery();

    // 🌐 INTERNET STATUS
    const updateWifi = () => {
      setWifi(navigator.onLine ? "Connected" : "Disconnected");
    };

    updateWifi();
    window.addEventListener("online", updateWifi);
    window.addEventListener("offline", updateWifi);

    // 📜 LOAD ACTIVITY
    const loadActivities = () => {
      const saved = JSON.parse(localStorage.getItem("activities") || "[]");
      setActivities([...saved].reverse());
    };

    loadActivities();

    window.addEventListener("storage", loadActivities);

    return () => {
      window.removeEventListener("online", updateWifi);
      window.removeEventListener("offline", updateWifi);
      window.removeEventListener("storage", loadActivities);
    };
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const currentPath = location.pathname;

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2>
          <img src="/logo.png" alt="LaptopTester Logo" className="login-logo" />
        </h2>
        <ul>
          <li
            className={currentPath === "/dashboard" ? "active" : ""}
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </li>

          <li
            className={currentPath === "/report" ? "active" : ""}
            onClick={() => navigate("/report")}
          >
            Reports
          </li>

          <li
            className={currentPath === "/settings" ? "active" : ""}
            onClick={() => navigate("/settings")}
          >
            Settings
          </li>
        </ul>
      </div>

      {/* Main */}
      <div className="main-content">
        {/* Navbar */}
        <div className="navbar">
          <h1>System Test Dashboard</h1>

          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div className="profile-box">
              <FaUserCircle />
              <span>{user.name}</span>
            </div>

            <button className="logout-btn" onClick={handleLogout}>
              <FaSignOutAlt />
            </button>
          </div>
        </div>

        {/* TEST CARDS */}
        <div className="cards-grid">
          <div className="card" onClick={() => navigate("/keyboard-test")}>
            <FaKeyboard />
            <span>Keyboard Test</span>
          </div>

          <div className="card" onClick={() => navigate("/webcam-test")}>
            <FaCamera />
            <span>Webcam Test</span>
          </div>

          <div className="card" onClick={() => navigate("/mic-test")}>
            <FaMicrophone />
            <span>Mic Test</span>
          </div>

          <div className="card" onClick={() => navigate("/battery-test")}>
            <FaBatteryHalf />
            <span>Battery Test</span>
          </div>

          <div className="card" onClick={() => navigate("/speaker-test")}>
            <FaVolumeUp />
            <span>Speaker Test</span>
          </div>

          <div className="card" onClick={() => navigate("/wifi-test")}>
            <FaWifi />
            <span>Internet Test</span>
          </div>
        </div>

        {/* STATUS */}
        <div className="status-section">
          <div className="status-card">
            <FaDesktop />
            <h3>System Health</h3>
            <p>{systemHealth}</p>
          </div>

          <div className="status-card">
            <FaBatteryHalf />
            <h3>Battery</h3>
            <p>{battery}%</p>
          </div>

          <div className="status-card">
            <FaWifi />
            <h3>Internet</h3>
            <p>{wifi}</p>
          </div>
        </div>

        {/* RECENT ACTIVITY */}
        <div className="activity-section">
          <h2>
            <FaHistory /> Recent Activity
          </h2>

          <ul>
            {activities.length === 0 ? (
              <li>No activity yet</li>
            ) : (
              activities.map((a, i) => <li key={i}>{a}</li>)
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;