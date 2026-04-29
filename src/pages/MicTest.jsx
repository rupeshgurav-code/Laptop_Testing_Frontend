import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MicTest.css";
import {
  FaMicrophone,
  FaArrowLeft,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle
} from "react-icons/fa";

const MicTest = () => {
  const navigate = useNavigate();
  const audioRef = useRef(null);
  const streamRef = useRef(null);
  const analyserRef = useRef(null);
  const animationRef = useRef(null);

  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("Click start to test microphone");
  const [levels, setLevels] = useState(new Array(20).fill(2));

  // Add activity
  const addActivity = (msg) => {
    const old = JSON.parse(localStorage.getItem("activities") || "[]");
    old.push(msg);
    localStorage.setItem("activities", JSON.stringify(old));

    window.dispatchEvent(new Event("storage"));
  };

  const startMic = async () => {
    try {
      setStatus("loading");
      setMessage("Requesting microphone access...");

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      streamRef.current = stream;

      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();

      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();

      analyser.fftSize = 32;
      analyserRef.current = analyser;

      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const update = () => {
        analyser.getByteFrequencyData(dataArray);

        setLevels([...dataArray]);

        animationRef.current = requestAnimationFrame(update);
      };

      update();

      setStatus("success");
      setMessage("Microphone is working properly ✔");
      localStorage.setItem("mic", "Passed");

      if (!localStorage.getItem("micActivity")) {
        addActivity("🎤 Mic test completed ✔");
        localStorage.setItem("micActivity", "done");
      }

    } catch (err) {
      console.log(err);

      if (err.name === "NotAllowedError") {
        setStatus("error");
        setMessage("Microphone permission blocked ❌");
        localStorage.setItem("mic", "Fail");
      } else if (err.name === "NotFoundError") {
        setStatus("error");
        setMessage("No microphone device found ❌");
        localStorage.setItem("mic", "Fail");
      } else {
        setStatus("error");
        setMessage("Microphone error ❌");
        localStorage.setItem("mic", "Fail");
      }
    }
  };

  const stopMic = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    setLevels(new Array(20).fill(2));
    setStatus("idle");
    setMessage("Mic test stopped");
  };

  useEffect(() => {
    return () => stopMic();
  }, []);

  const getIcon = () => {
    if (status === "success") return <FaCheckCircle />;
    if (status === "error") return <FaTimesCircle />;
    if (status === "loading") return <FaExclamationTriangle />;
    return <FaMicrophone />;
  };

  return (
    <div className="mic-page">

      {/* HEADER */}
      <div className="top-bar">
        <button className="back-btn" onClick={() => navigate("/dashboard")}>
          <FaArrowLeft /> Back
        </button>

        <h1>{getIcon()} Microphone Test</h1>
      </div>

      <p className="sub-text">
        Speak into microphone and check real-time audio levels
      </p>

      {/* STATUS BOX */}
      <div className={`mic-box ${status}`}>
        <div className="status-text">{message}</div>

        {/* AUDIO VISUALIZER */}
        <div className="bars">
          {levels.slice(0, 20).map((val, i) => (
            <div
              key={i}
              className="bar"
              style={{
                height: `${Math.max(val / 2, 5)}px`,
              }}
            />
          ))}
        </div>
      </div>

      {/* BUTTONS */}
      <div className="btn-group">
        {status !== "success" ? (
          <button className="start-btn" onClick={startMic}>
            Start Mic Test
          </button>
        ) : (
          <button className="stop-btn" onClick={stopMic}>
            Stop Test
          </button>
        )}
      </div>
    </div>
  );
};

export default MicTest;