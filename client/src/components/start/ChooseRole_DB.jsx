import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../App.css";
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

    const gameId = localStorage.getItem("gameId");
    const role = localStorage.getItem("role");

    fetch(
      `http://localhost:8000/api/join_game?game_id=${gameId}&group_name=${groupName}&role=${role}`,
      {
        method: "POST",
      }
    )
      .then((res) => res.json())
      .then((data) => {
        console.log("Gruppenname gespeichert:", groupName);
        console.log(data);
        localStorage.setItem("groupName", groupName);
        navigate("/waiting");
      })
      .catch((err) => console.error("Error joining game:", err));
  };

  return (
    <div className="page">
      <div className="card">
        <div className="logo-container">
          <img src={logo} alt="Ticket to Escape" />
        </div>
        <div className="form-box">
          <h3>Wähle deine Rolle</h3>
          <button onClick={() => handleChoose("Polizei")}>Polizei</button>
          <button onClick={() => handleChoose("Räuber")}>Räuber</button>
        </div>
      </div>

      {popupVisible && (
        <div className="popup-overlay">
          <div className="popup-content">
            <div className="popup-header">
              <span
                onClick={() => setPopupVisible(false)}
                className="close-button"
              >
                ✕
              </span>
            </div>
            <label>Gruppenname</label>
            <input
              type="text"
              placeholder="Winkelbölzer"
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
