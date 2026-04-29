import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export const generateReport = async (reportData) => {
  const doc = new jsPDF();

  const {
    userName,
    keyboard,
    mic,
    webcam,
    battery,
    speaker,
    wifi,
    overallScore
  } = reportData;

  doc.setFontSize(18);
  doc.text("Laptop Diagnostic Report", 20, 20);

  doc.setFontSize(12);
  doc.text(`User: ${userName}`, 20, 35);
  doc.text(`Date: ${new Date().toLocaleString()}`, 20, 45);

  doc.setFontSize(14);
  doc.text("Test Results:", 20, 65);

  let y = 80;

  const addLine = (label, value) => {
    doc.text(`${label}: ${value}`, 20, y);
    y += 10;
  };

  addLine("Keyboard", keyboard);
  addLine("Mic", mic);
  addLine("Webcam", webcam);
  addLine("Battery", battery);
  addLine("Speaker", speaker);
  addLine("WiFi", wifi);

  doc.setFontSize(16);
  doc.text(`Overall Score: ${overallScore}/100`, 20, y + 10);

  let status = "Poor";
  if (overallScore > 80) status = "Excellent";
  else if (overallScore > 60) status = "Good";
  else if (overallScore > 40) status = "Fair";

  doc.text(`Status: ${status}`, 20, y + 25);

  doc.save("laptop-test-report.pdf");
};