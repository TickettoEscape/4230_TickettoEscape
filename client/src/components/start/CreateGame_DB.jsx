import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../App.css";
import logo from "../../data/Logo.png";

export const CreateGame = () => {
  const navigate = useNavigate();
  const [duration, setDuration] = useState(); // State for game duration
  const [policeCount, setPoliceCount] = useState(); // State for police count

  const handleCreateGame = () => {
    if (
      duration >= 1 &&
      duration <= 10 &&
      policeCount >= 1 &&
      policeCount <= 10
    ) {
      const payload = {
        duration: duration,
        police_count: policeCount,
      };

      console.log("Sending JSON to backend:", payload);

      fetch("http://localhost:8000/api/create_game", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            alert("Fehler beim Erstellen des Spiels: " + data.error);
            return;
          }

          console.log("Game ID:", data.gameId);
          localStorage.setItem("gameId", data.gameId);
          localStorage.setItem("policeCount", policeCount); // Store duration in localStorage
          navigate("/role");
        })
        .catch((err) => {
          console.error("Fehler beim Erstellen des Spiels:", err);
        });
    } else {
      alert("Bitte gültige Werte zwischen 1 und 10 eingeben!");
    }
  };

  return (
    <div className="page">
      <div className="card">
        <div className="logo-container">
          <img src={logo} alt="Ticket to Escape" />
        </div>

        <div className="form-box">
          <label htmlFor="duration">Maximale Spieldauer (Stunden)</label>
          <input
            id="duration"
            type="number"
            placeholder="z.B. 2"
            min={1}
            max={10}
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))} // Update duration
          />

          <label htmlFor="policeCount">Anzahl Polizisten</label>
          <input
            id="policeCount"
            type="number"
            placeholder="z.B. 2"
            min={1}
            max={10}
            value={policeCount}
            onChange={(e) => setPoliceCount(Number(e.target.value))} // Update policeCount
          />

          <button onClick={handleCreateGame}>Spiel erstellen</button>
        </div>
      </div>
    </div>
  );
};
