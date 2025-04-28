import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../App.css";
import logo from "../../data/Logo.png";

export const CreateGame = () => {
  const navigate = useNavigate();
  const [duration, setDuration] = useState();
  const [policeCount, setPoliceCount] = useState();

  const handleCreateGame = () => {
    if (
      duration >= 1 &&
      duration <= 10 &&
      policeCount >= 1 &&
      policeCount <= 10
    ) {
      fetch(
        `http://localhost:8000/api/create_game?duration=${duration}&police_count=${policeCount}`,
        {
          method: "POST",
        }
      )
        .then((res) => res.json())
        .then((data) => {
          console.log("Spielzeit:", duration);
          console.log("Anzahl Polizisten:", policeCount);
          console.log("Game ID:", data.gameId);
          localStorage.setItem("gameId", data.gameId);
          navigate("/role");
        })
        .catch((err) => console.error("Error creating game:", err));
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
            onChange={(e) => setDuration(e.target.value)}
          />
          <label htmlFor="policeCount">Anzahl Polizisten</label>
          <input
            id="policeCount"
            type="number"
            placeholder="z.B. 2"
            min={1}
            max={10}
            value={policeCount}
            onChange={(e) => setPoliceCount(e.target.value)}
          />
          <button onClick={handleCreateGame}>Spiel erstellen</button>
        </div>
      </div>
    </div>
  );
};
