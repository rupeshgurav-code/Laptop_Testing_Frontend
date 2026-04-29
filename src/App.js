import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import KeyboardTest from "./pages/KeyboardTest";
import WebcamTest from "./pages/WebcamTest";
import MicTest from "./pages/MicTest";
import BatteryTest from "./pages/BatteryTest";
import SpeakerTest from "./pages/SpeakerTest";
import WifiTest from "./pages/WifiTest";
import Report from "./pages/Report";
import { useEffect } from "react";
import Settings from "./pages/Settings";

function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
          <Route path="/mic-test" element={<MicTest />} />
          <Route path="/report" element={<Report />} />
                  <Route path="/speaker-test" element={<SpeakerTest />} />
        <Route path="/wifi-test" element={<WifiTest />} />
            <Route path="/battery-test" element={<BatteryTest />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/webcam-test" element={<WebcamTest />} />
        <Route path="/keyboard-test" element={<KeyboardTest />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;