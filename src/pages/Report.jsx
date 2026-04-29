import React, { useMemo, useState } from "react";
import { generateReport } from "../utils/generateReport.js";
import { useNavigate } from "react-router-dom";
import { FaBatteryHalf, FaArrowLeft, FaBolt, FaPlug } from "react-icons/fa";
import './Report.css'

import {
  FaFileDownload,
  FaRedo,
  FaTrashAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaLaptopCode
} from "react-icons/fa";
import "./Report.css";

const getReportData = () => {

  const get = (k) => localStorage.getItem(k) || "Not Tested";

  const data = {
    userName: localStorage.getItem("userName") || "User",
    keyboard: get("keyboard"),
    mic: get("mic"),
    webcam: get("webcam"),
    battery: get("battery"),
    speaker: get("speaker"),
    wifi: get("wifi"),
  };

  return {
    ...data,
    overallScore: calculateScore(data),
  };
};

const calculateScore = (d) => {
  const tests = [
    d.keyboard,
    d.mic,
    d.webcam,
    d.battery,
    d.speaker,
    d.wifi
  ];

  let totalScore = 0;
  let testedCount = 0;

  tests.forEach((test) => {
    if (test !== "Not Tested") {
      testedCount++;

      if (test === "Passed" || test === "Good") {
        totalScore += 100;
      } 
      else if (typeof test === "string" && test.includes("%")) {
        totalScore += parseInt(test);
      } 
      else if (test === "Poor" || test === "Fail") {
        totalScore += 40;
      } 
      else {
        totalScore += 70;
      }
    }
  });

  if (testedCount === 0) return 0;

  return Math.round(totalScore / testedCount);
};

const getStatusIcon = (value) => {
  if (value === "Passed" || value === "Good")
    return <FaCheckCircle color="#22c55e" />;
  if (value === "Fail" || value === "Poor")
    return <FaTimesCircle color="#ef4444" />;
  return <span style={{ color: "#94a3b8" }}>●</span>;
};

const Report = () => {
  const [refresh, setRefresh] = useState(0);
    const navigate = useNavigate();

  const data = useMemo(() => getReportData(), [refresh]);

  const tests = [
    { name: "Keyboard", value: data.keyboard },
    { name: "Mic", value: data.mic },
    { name: "Webcam", value: data.webcam },
    { name: "Battery", value: data.battery },
    { name: "Speaker", value: data.speaker },
    { name: "WiFi", value: data.wifi },
  ];

  return (
    <div className="report-container">
      {/* HEADER */}
      <div className="report-header">
        <div>
          <h1>System Diagnostics Report</h1>
          <p>Real-time hardware test summary</p>
        </div>

        <div className="report-actions">
          <button onClick={() => setRefresh((r) => r + 1)}>
            <FaRedo /> Refresh
          </button>
 <button className="back-btn" onClick={() => navigate("/dashboard")}>
          <FaArrowLeft /> Back
        </button>
          <button
            onClick={() => {
              ["keyboard", "mic", "webcam", "battery", "speaker", "wifi"].forEach((key) =>
                localStorage.removeItem(key)
              );
              setRefresh((r) => r + 1);
            }}
            className="danger"
          >
            <FaTrashAlt /> Reset
          </button>

        </div>
      </div>

      {/* MAIN GRID */}
      <div className="report-grid">
        {/* LEFT PANEL */}
        <div className="report-card glass">
          <div className="user-box">
            <FaLaptopCode size={28} />
            <div>
              <h2>{data.userName}</h2>
              <p>User System Check</p>
            </div>
          </div>

          <div className="test-list">
            {tests.map((t, i) => (
              <div key={i} className="test-row">
                <span>{t.name}</span>

                <div className="status">
                  {getStatusIcon(t.value)}
                  <b>{t.value}</b>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="report-card score-card">
          <h2>Overall Score</h2>

          <div className="score-circle">
            {data.overallScore}
            <span>/100</span>
          </div>

          <div className="progress-bar">
            <div
              style={{ width: `${data.overallScore}%` }}
              className="fill"
            />
          </div>

          <p className="score-text">
            {data.overallScore === 0
              ? "No Tests Performed"
              : data.overallScore > 80
              ? "Excellent System Health"
              : data.overallScore > 60
              ? "Good System Performance"
              : "System Needs Attention"}
          </p>

          <button
            className="download-btn"
            onClick={() => generateReport(data)}
          >
            <FaFileDownload /> Download PDF Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default Report;