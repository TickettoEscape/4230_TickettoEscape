import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../App.css";
import logo from "../../data/Logo.png";

export const WaitingRoom = () => {
  const navigate = useNavigate();
  const gameId = localStorage.getItem("gameId");
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:8000/api/games/${gameId}/players`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setPlayers(data);
        } else {
          console.error("Invalid players data:", data);
          setPlayers([]); // Reset or handle
        }
      })
      .catch((err) => console.error("Error fetching players:", err));
  }, [gameId]);

  const handleStartGame = () => {
    navigate("/startstation");
  };

  return (
    <div className="page">
      <div className="card">
        <div className="logo-container">
          <img src={logo} alt="Ticket to Escape" />
        </div>
        <div className="form-box">
          <h3>Warte auf die anderen Gruppen.</h3>
          <table className="waiting-table">
            <thead>
              <tr>
                <th>Gruppe</th>
                <th>Rolle</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(players) &&
                players.map((player, index) => (
                  <tr key={index}>
                    <td>{player.group_name}</td>
                    <td>{player.role}</td>
                    <td>Bereit</td>
                  </tr>
                ))}
            </tbody>
          </table>

          <button onClick={handleStartGame}>Spiel starten</button>
        </div>
      </div>
    </div>
  );
};
