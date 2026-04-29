import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./KeyboardTest.css";
import { FaKeyboard, FaArrowLeft } from "react-icons/fa";

const keysLayout = [
  ["Escape", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12"],
  ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "Backspace"],
  ["Tab", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]", "\\"],
  ["CapsLock", "A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "'", "Enter"],
  ["Shift", "Z", "X", "C", "V", "B", "N", "M", ",", ".", "/", "Shift"],
  ["Control", "Meta", "Alt", "Space", "Alt", "Fn", "ContextMenu", "Control"]
];

// normalize browser key → UI key
const normalizeKey = (key) => {
  if (key === " ") return "Space";
  if (key === "Escape") return "Escape";
  if (key === "Control") return "Control";
  if (key === "Alt") return "Alt";
  if (key === "Shift") return "Shift";
  if (key === "Meta") return "Meta";
  if (key === "CapsLock") return "CapsLock";
  if (key === "Enter") return "Enter";
  if (key === "Backspace") return "Backspace";
  if (key === "Tab") return "Tab";

  // letters → uppercase
  if (key.length === 1) return key.toUpperCase();

  return key;
};

const KeyboardTest = () => {
  const [pressedKeys, setPressedKeys] = useState([]);
  const navigate = useNavigate();

  // Add activity
  const addActivity = (msg) => {
    const old = JSON.parse(localStorage.getItem("activities") || "[]");
    old.push(msg);
    localStorage.setItem("activities", JSON.stringify(old));

    window.dispatchEvent(new Event("storage"));
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = normalizeKey(e.key);

      setPressedKeys((prev) =>
        prev.includes(key) ? prev : [...prev, key]
      );

      // Save keyboard result
      localStorage.setItem("keyboard", "Passed");

      // Save activity only once
      if (!localStorage.getItem("keyboardActivity")) {
        addActivity("⌨️ Keyboard test completed ✔");
        localStorage.setItem("keyboardActivity", "done");
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="keyboard-page">

      <div className="top-bar">
        <button className="back-btn" onClick={() => navigate("/dashboard")}>
          <FaArrowLeft /> Back
        </button>

        <h1><FaKeyboard /> Keyboard Tester</h1>
      </div>

      <p className="sub-text">
        Press each key to verify it is working properly
      </p>

      <div className="keyboard-container">
        {keysLayout.map((row, i) => (
          <div className="keyboard-row" key={i}>
            {row.map((key, j) => {
              const isActive = pressedKeys.includes(key);

              return (
                <div key={j} className={`key ${isActive ? "active" : ""}`}>
                  {key === "Space" ? "Space" : key}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="status-box">
        <h3>Keys Tested: {pressedKeys.length}</h3>
        <p>Press all keys to verify keyboard health</p>
      </div>
    </div>
  );
};

export default KeyboardTest;