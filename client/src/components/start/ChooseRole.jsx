import React from "react";
import "../../App.css";
import logo from "../../data/Logo.png";

export const ChooseRole = () => {
  const handleChoose = (role) => {
    alert(`Gewählte Rolle: ${role}`);
    // Optional: hier könnte man später navigieren oder Zustand setzen
  };

  return (
    <div className="page">
      <div className="card">
        <div className="logo-container">
          <img src={logo} alt="Ticket to Escape" />
        </div>

        <div className="form-box">
          <label>Wähle deine Rolle</label>
          <button onClick={() => handleChoose("Polizei")}>Polizei</button>
          <button onClick={() => handleChoose("Räuber")}>Räuber</button>
        </div>
      </div>
    </div>
  );
};
