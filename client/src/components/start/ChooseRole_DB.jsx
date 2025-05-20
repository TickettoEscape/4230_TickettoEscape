import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../App.css";
import logo from "../../data/Logo.png";

export const ChooseRole = ({ host }) => {
  const navigate = useNavigate();
  const [popupVisible, setPopupVisible] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [isRauberDisabled, setIsRauberDisabled] = useState(false); // Default is false

  useEffect(() => {
    const gameId = localStorage.getItem("gameId"); // Get game ID from local storage

    const checkRauberStatus = async () => {
      try {
        const res = await fetch(
          `http://${host}:8000/api/checkRauberRole?game_id=${gameId}`
        );
        const data = await res.json();
        console.log("Räuber check result:", data);
        setIsRauberDisabled(data); // Disable if taken
        // Store in local storage
      } catch (err) {
        console.error("Error checking 'Räuber' role:", err);
      }
    };

    checkRauberStatus();
  }, []);

  const handleChoose = (role) => {
    if (role === "Räuber" && isRauberDisabled) {
      alert("Die Rolle 'Räuber' wurde bereits gewählt.");
      return;
    }

    localStorage.setItem("role", role);
    setPopupVisible(true);
  };

  const handleConfirmGroup = () => {
    if (groupName.trim() === "") {
      alert("Bitte gib einen Gruppennamen ein.");
      return;
    }

    const gameId = localStorage.getItem("gameId");
    const role = localStorage.getItem("role");

    const requestData = {
      game_id: gameId,
      group_name: groupName,
      role: role,
    };

    console.log("Sending group data to backend:", requestData);

    fetch(`http://${host}:8000/api/newGroup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Backend response:", data);
        localStorage.setItem("groupName", data.groupName || groupName);
        localStorage.setItem("group_id", data.groupId || "");
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
          <button
            onClick={() => handleChoose("Räuber")}
            disabled={isRauberDisabled}
          >
            Räuber
          </button>
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
