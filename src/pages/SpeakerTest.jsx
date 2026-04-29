import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SpeakerTest.css";
import {
  FaVolumeUp,
  FaArrowLeft,
  FaPlay,
  FaStop,
  FaExclamationTriangle
} from "react-icons/fa";

const SpeakerTest = () => {
  const navigate = useNavigate();
  const audioRef = useRef(null);

  const [status, setStatus] = useState("idle");

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Save activity function
  const saveActivity = (text) => {
    const oldActivities = JSON.parse(localStorage.getItem("activities") || "[]");
    const newActivities = [...oldActivities, text];
    localStorage.setItem("activities", JSON.stringify(newActivities));
  };

  const playSound = () => {
    try {
      const audio = new Audio("/test-sound.mp3");

      audio.loop = true;

      audio.play()
        .then(() => {
          audioRef.current = audio;
          setStatus("playing");
          localStorage.setItem("speaker", "Passed");

          saveActivity("🔊 Speaker test completed");
        })
        .catch((err) => {
          console.log("Audio error:", err);
          setStatus("error");
          localStorage.setItem("speaker", "Fail");

          saveActivity("❌ Speaker test failed");
        });

    } catch (err) {
      console.log(err);
      setStatus("error");
      localStorage.setItem("speaker", "Fail");

      saveActivity("❌ Speaker test failed");
    }
  };

  const stopSound = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setStatus("stopped");
  };

  return (
    <div className="speaker-page">
      {/* HEADER */}
      <div className="top-bar">
        <button className="back-btn" onClick={() => navigate("/dashboard")}>
          <FaArrowLeft /> Back
        </button>

        <h1>
          <FaVolumeUp /> Speaker Test
        </h1>
      </div>

      {/* CARD */}
      <div className="speaker-card">
        <h2>Speaker Diagnostic Test</h2>

        <p className={`status ${status}`}>
          Status:{" "}
          {status === "idle" && "Ready"}
          {status === "playing" && "Playing Sound 🔊"}
          {status === "stopped" && "Stopped"}
          {status === "error" && "Error ❌"}
        </p>

        {/* ERROR MESSAGE */}
        {status === "error" && (
          <div className="error-box">
            <FaExclamationTriangle />
            <p>
              Audio failed to load. Please add <b>test-sound.mp3</b> in public folder.
            </p>
          </div>
        )}

        {/* BUTTONS */}
        <div className="btns">
          <button className="play-btn" onClick={playSound}>
            <FaPlay /> Play Sound
          </button>

          <button className="stop-btn" onClick={stopSound}>
            <FaStop /> Stop
          </button>
        </div>

        <p className="note">
          ✔ If you hear sound clearly → Speaker is working
        </p>
      </div>
    </div>
  );
};

export default SpeakerTest;