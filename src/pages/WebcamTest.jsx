import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./WebcamTest.css";
import {
  FaVideo,
  FaArrowLeft,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle
} from "react-icons/fa";

const WebcamTest = () => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("Click start to test camera");
  const [streaming, setStreaming] = useState(false);

  const navigate = useNavigate();

  const startCamera = async () => {
    try {
      setStatus("loading");
      setMessage("Checking camera access...");

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setStreaming(true);
      setStatus("success");
      setMessage("Camera is working properly ✔");
      localStorage.setItem("webcam", "Passed");
    } catch (err) {
      console.log(err);

      setStreaming(false);

      // 🔥 SMART ERROR DETECTION
      if (err.name === "NotAllowedError") {
        setStatus("error");
        setMessage("Camera permission blocked ❌ Please allow access");
      } else if (err.name === "NotFoundError") {
        setStatus("error");
        setMessage("No camera device found ❌");
        localStorage.setItem("webcam", "Fail");
      } else if (err.name === "NotReadableError") {
        setStatus("warning");
        setMessage("Camera is already in use ⚠️");
        localStorage.setItem("webcam", "Fail");
      } else {
        setStatus("error");
        setMessage("Unknown camera error ❌");
        localStorage.setItem("webcam", "Fail");
      }
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setStreaming(false);
    setStatus("idle");
    setMessage("Camera stopped");
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  const getStatusIcon = () => {
    if (status === "success") return <FaCheckCircle />;
    if (status === "error") return <FaTimesCircle />;
    if (status === "warning") return <FaExclamationTriangle />;
    return <FaVideo />;
  };

  return (
    <div className="webcam-page">

      {/* HEADER */}
      <div className="top-bar">
        <button className="back-btn" onClick={() => navigate("/dashboard")}>
          <FaArrowLeft /> Back
        </button>

        <h1>{getStatusIcon()} Webcam Test</h1>
      </div>

      <p className="sub-text">
        Detect camera issues in real time
      </p>

      {/* CAMERA BOX */}
      <div className={`camera-box ${status}`}>
        <video ref={videoRef} autoPlay playsInline />

        <div className="status-bar">
          <span className={`status-dot ${status}`}></span>
          <p>{message}</p>
        </div>
      </div>

      {/* BUTTONS */}
      <div className="btn-group">
        {!streaming ? (
          <button className="start-btn" onClick={startCamera}>
            Start Camera Test
          </button>
        ) : (
          <button className="stop-btn" onClick={stopCamera}>
            Stop Test
          </button>
        )}
      </div>
    </div>
  );
};

export default WebcamTest;