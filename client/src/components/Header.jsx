import React, { useEffect, useState } from "react";
import "./Header.css";

export const Header = () => {
  const [groupName, setGroupName] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    setGroupName(localStorage.getItem("groupName") || "Gruppe");
    setRole(localStorage.getItem("role") || "Rolle");
  }, []);

  const roleIcon =
    role === "Polizei"
      ? "/Logo_Polizei.png"
      : role === "Räuber"
      ? "/Logo_Raeuber.png"
      : null;

  // 🔁 App-Logo oder Sonderlogo für RUNFAST
  const rightLogo =
    groupName === "RUNFAST"
      ? "/logo_zugeschnitten2.jpg"
      : "/logo_zugeschnitten.png";

  return (
    <div className="header">
      {/* ⬅️ Rolle (links) */}
      {roleIcon && (
        <img
          src={roleIcon}
          alt={role}
          className="header-icon"
          title={role}
        />
      )}

      {/* ⬆️ Gruppenname (zentriert) */}
      <div className="header-title">{groupName}</div>

      {/* ➡️ App-Logo oder Gruppenbild (rechts) */}
      <img src={rightLogo} alt="Logo" className="header-icon" />
    </div>
  );
};
