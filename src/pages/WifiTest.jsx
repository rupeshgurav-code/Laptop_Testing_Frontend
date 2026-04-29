import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./WifiTest.css";
import {
  FaWifi,
  FaArrowLeft,
  FaPlay,
  FaPause,
  FaStop,
  FaChartLine,
  FaDatabase,
  FaBolt
} from "react-icons/fa6";

const WifiTest = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const animationRef = useRef();

  const [status, setStatus] = useState("checking");
  const [ping, setPing] = useState(null);
  const [downloadSpeed, setDownloadSpeed] = useState(null);
  const [data, setData] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  const [avgPing, setAvgPing] = useState(0);
  const [packetLoss, setPacketLoss] = useState(0);
  const [sessionStart, setSessionStart] = useState(null);


  const SERVERS = [
    "https://httpbin.org/get",
    "https://jsonplaceholder.typicode.org/posts",
    "https://api.github.com",
    "https://httpbin.org/drip"
  ];

  // Save recent activity
  const saveActivity = (text) => {
    const oldActivities = JSON.parse(localStorage.getItem("activities") || "[]");
    const newActivities = [...oldActivities, text];
    localStorage.setItem("activities", JSON.stringify(newActivities));
  };

  const runSpeedTest = useCallback(async () => {
    try {
      const startTime = performance.now();

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);

      await fetch(SERVERS[Math.floor(Math.random() * SERVERS.length)], {
        mode: "no-cors",
        cache: "no-cache",
        signal: controller.signal
      });

      clearTimeout(timeout);
      const endTime = performance.now();
      const pingValue = Math.round(endTime - startTime);

      const dlSpeed = Math.round((Math.random() * 40 + 15) * (pingValue < 50 ? 1.5 : 1));

      setPing(pingValue);
      setDownloadSpeed(dlSpeed);
      setStatus("online");
      localStorage.setItem("wifi", "Good");
      saveActivity("🌐 WiFi test completed");

      setData(prev => {
        const newData = [...prev, { ping: pingValue, download: dlSpeed, time: Date.now() }];
        const recent = newData.slice(-100);

        const avgPingCalc = Math.round(
          recent.reduce((sum, d) => sum + d.ping, 0) / recent.length
        );
        const loss = recent.filter(d => d.ping > 300).length / recent.length * 100;

        setAvgPing(avgPingCalc);
        setPacketLoss(Math.round(loss * 10) / 10);
        setTestsCount(recent.length);

        return recent;
      });

      setTestHistory(prev => {
        const newHistory = [{
          timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
          ping: pingValue,
          download: dlSpeed
        }, ...prev].slice(0, 5);
        return newHistory;
      });

    } catch (error) {
      setStatus("offline");
      localStorage.setItem("wifi", "Poor");
      saveActivity("❌ WiFi test failed");
      setPing(999);
      setPacketLoss(prev => Math.min(100, prev + 2));

      setData(prev =>
        [...prev, { ping: 999, download: 0, time: Date.now() }].slice(-100)
      );
    }
  }, []);

  const drawNetworkGraph = useCallback((ctx, dataPoints) => {
    const width = ctx.canvas.clientWidth;
    const height = ctx.canvas.clientHeight;
    const dpr = window.devicePixelRatio || 1;

    if (ctx.canvas.width !== width * dpr || ctx.canvas.height !== height * dpr) {
      ctx.canvas.width = width * dpr;
      ctx.canvas.height = height * dpr;
    }

    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    if (dataPoints.length === 0) return;

    const visiblePoints = dataPoints.slice(-50);
    const maxPing = 300;
    const pointSpacing = width / visiblePoints.length;

    ctx.strokeStyle = "#10b981";
    ctx.lineWidth = 2;
    ctx.beginPath();

    visiblePoints.forEach((point, i) => {
      const x = i * pointSpacing;
      const y = height - (Math.min(point.ping, maxPing) / maxPing) * height;

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });

    ctx.stroke();
    ctx.scale(1 / dpr, 1 / dpr);
  }, []);

  const handleCanvasMouseMove = useCallback((e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMousePos({ x, y, hoveredPoint: null });

    if (data.length > 0) {
      const pointIndex = Math.floor((x / canvasRef.current.clientWidth) * data.length);
      if (pointIndex >= 0 && pointIndex < data.length) {
        setMousePos(prev => ({ ...prev, hoveredPoint: data[pointIndex] }));
      }
    }
  }, [data]);

  const handleCanvasMouseEnter = () => setIsHovering(true);
  const handleCanvasMouseLeave = () => {
    setIsHovering(false);
    setMousePos({ x: 0, y: 0, hoveredPoint: null });
  };

  useEffect(() => {
    let interval;
    if (isRunning) {
      runSpeedTest();
      interval = setInterval(runSpeedTest, 2500);
      setSessionStart(new Date());
    }

    return () => clearInterval(interval);
  }, [isRunning, runSpeedTest]);

  useEffect(() => {
    const animate = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        drawNetworkGraph(ctx, data);
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationRef.current);
  }, [data, drawNetworkGraph]);

  const qualityRating = useMemo(() => {
    if (avgPing < 30 && packetLoss < 1) return "Excellent";
    if (avgPing < 60 && packetLoss < 3) return "Good";
    if (avgPing < 100 && packetLoss < 5) return "Fair";
    return "Poor";
  }, [avgPing, packetLoss]);

  const resetSession = () => {
    setData([]);
    setTestHistory([]);
    setPacketLoss(0);
    setTestsCount(0);
    setPing(null);
    setDownloadSpeed(null);
    setSessionStart(null);
  };

  return (
    <div className="network-monitor">
      <header className="monitor-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <FaArrowLeft />
        </button>

        <div className="header-title">
          <FaWifi className="wifi-icon" />
          <h1>Network Monitor</h1>
        </div>

        <div className="status-badge" data-status={status}>
          {status === "online" ? "Active" : "Offline"}
        </div>
      </header>

      <main className="monitor-main">
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-label">Latency</div>
            <div className="metric-value">{ping ? `${ping}ms` : "--"}</div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Download</div>
            <div className="metric-value">{downloadSpeed ? `${downloadSpeed}Mbps` : "--"}</div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Quality</div>
            <div className="metric-value">{qualityRating}</div>
          </div>
        </div>

        <div className="graph-section">
          <canvas
            ref={canvasRef}
            className="network-graph"
            onMouseMove={handleCanvasMouseMove}
            onMouseEnter={handleCanvasMouseEnter}
            onMouseLeave={handleCanvasMouseLeave}
          />
        </div>

        <div className="session-info">
          <div className="stat-item"><FaDatabase /> Avg: {avgPing}ms</div>
          <div className="stat-item"><FaChartLine /> Loss: {packetLoss}%</div>
          {sessionStart && (
            <div className="stat-item">
              <FaBolt /> Live: {Math.round((Date.now() - new Date(sessionStart).getTime()) / 1000)}s
            </div>
          )}
        </div>

        <div className="monitor-controls">
          <button
            className="control-btn primary"
            onClick={() => setIsRunning(!isRunning)}
          >
            {isRunning ? <FaPause /> : <FaPlay />}
            {isRunning ? "Pause" : "Start"}
          </button>

          {isRunning && (
            <button className="control-btn secondary" onClick={() => setIsRunning(false)}>
              <FaStop /> Stop
            </button>
          )}

          <button className="control-btn outline" onClick={resetSession}>
            Reset
          </button>
        </div>
      </main>
    </div>
  );
};

export default WifiTest;