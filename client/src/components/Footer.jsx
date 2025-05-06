import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Footer.css";

export const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="footer">
      <div
        className={`footer-icon-wrapper ${
          location.pathname + location.search === localStorage.getItem("gamePath") ? "active" : ""
        }`}
        onClick={() => navigate(localStorage.getItem("gamePath"))}
      >
        <img src="/Logo_Zug.png" alt="Verbindungen" className="footer-icon" />
      </div>

      
      <div
        className={`footer-icon-wrapper ${
          location.pathname === "/chat" ? "active" : ""
        }`}
        onClick={() => navigate("/chat")}
      >
        <img src="/Logo_Chat.png" alt="Chat" className="footer-icon" />
      </div>

      <div
        className={`footer-icon-wrapper ${
          location.pathname === "/map" ? "active" : ""
        }`}
        onClick={() => navigate("/map")}
      >
        <img src="/Logo_Karte.png" alt="Karte" className="footer-icon" />
      </div>

      <div
        className={`footer-icon-wrapper ${
          location.pathname === "/infos" ? "active" : ""
        }`}
        onClick={() => navigate("/infos")}
      >
        <img src="/Logo_Info.png" alt="Info" className="footer-icon" />
      </div>

    </div>
  );
};
