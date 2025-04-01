import React, { useState } from "react";
import "../../App.css";
import { useNavigate } from "react-router-dom";
import logo from "../../data/Logo.png";

export const ChooseRole = () => {
  const navigate = useNavigate();

  const [popupVisible, setPopupVisible] = useState(false);
  const [groupName, setGroupName] = useState("");

  const handleChoose = (role) => {
    localStorage.setItem("role", role);
    console.log("Gewählte Rolle:", role);
    setPopupVisible(true);
  };

  const handleConfirmGroup = () => {
    if (groupName.trim() === "") {
      alert("Bitte gib einen Gruppennamen ein.");
      return;
    }
    localStorage.setItem("groupName", groupName);
    console.log("✅ Gruppenname gespeichert:", groupName);
    navigate("/waiting");
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

      {popupVisible && (
        <div className="popup-overlay">
          <div className="popup-content">
            <div className="popup-header">
              <span onClick={() => setPopupVisible(false)} className="close-button">✕</span>
            </div>
            <h2>Gruppen Name</h2>
            <input className="button"
              type="text"
              placeholder="Gruppen Name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
            <button onClick={handleConfirmGroup}>Bestätigen</button>
          </div>
        </div>
      )}
    </div>
  );
};
