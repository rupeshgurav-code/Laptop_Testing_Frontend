import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./BatteryTest.css";
import { FaBatteryHalf, FaArrowLeft, FaBolt, FaPlug } from "react-icons/fa";

const BatteryTest = () => {
  const navigate = useNavigate();

  const [battery, setBattery] = useState({
    level: 0,
    charging: false,
    chargeTime: null,
    backupTime: null
  });

  const [status, setStatus] = useState("checking");

  // Save activity
  const saveActivity = (text) => {
    const oldActivities = JSON.parse(localStorage.getItem("activities") || "[]");
    const newActivities = [...oldActivities, text];
    localStorage.setItem("activities", JSON.stringify(newActivities));
  };

  useEffect(() => {
    const getBattery = async () => {
      try {
        if (!navigator.getBattery) {
          setStatus("unsupported");
          saveActivity("❌ Battery API not supported");
          return;
        }

        const bat = await navigator.getBattery();

        const update = () => {
          const level = Math.round(bat.level * 100);
          const charging = bat.charging;

          let chargeTime = null;
          let backupTime = null;

          if (charging) {
            chargeTime = Math.max(0, (100 - level) * 2);
          } else {
            backupTime = Math.max(0, level * 3);
          }

          setBattery({
            level,
            charging,
            chargeTime,
            backupTime
          });

          const batteryStatus = level < 30 ? "Poor" : `${level}%`;
          localStorage.setItem("battery", batteryStatus);

          setStatus("success");
        };

        update();

        saveActivity("🔋 Battery test completed");

        bat.addEventListener("levelchange", update);
        bat.addEventListener("chargingchange", update);
      } catch (err) {
        console.log(err);
        setStatus("error");
        saveActivity("❌ Battery test failed");
      }
    };

    getBattery();
  }, []);

  const getColor = (level) => {
    if (level > 60) return "#22c55e";
    if (level > 30) return "#f59e0b";
    return "#ef4444";
  };

  return (
    <div className="battery-page">
      {/* HEADER */}
      <div className="top-bar">
        <button className="back-btn" onClick={() => navigate("/dashboard")}>
          <FaArrowLeft /> Back
        </button>

        <h1>
          <FaBatteryHalf /> Battery Test
        </h1>
      </div>

      {/* MAIN CARD */}
      <div className="battery-card">
        {status === "checking" && (
          <p>Checking battery status...</p>
        )}

        {status === "unsupported" && (
          <p>Battery API not supported in this browser ❌</p>
        )}

        {status === "error" && (
          <p>Something went wrong ❌</p>
        )}

        {status === "success" && (
          <>
            <div className="battery-icon">
              {battery.charging ? <FaBolt /> : <FaPlug />}
            </div>

            <h2>
              Battery:{" "}
              <span style={{ color: getColor(battery.level) }}>
                {battery.level}%
              </span>
            </h2>

            <p>
              Status:{" "}
              {battery.charging ? "Charging ⚡" : "On Battery 🔋"}
            </p>

            {battery.charging ? (
              <p>
                ⏱️ Time to full charge: <b>{battery.chargeTime} min</b>
              </p>
            ) : (
              <p>
                🔋 Backup time: <b>{battery.backupTime} min</b>
              </p>
            )}

            <div className="battery-bar">
              <div
                className="battery-fill"
                style={{
                  width: `${battery.level}%`,
                  background: getColor(battery.level)
                }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BatteryTest;