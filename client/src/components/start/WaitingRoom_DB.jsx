import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../App.css";
import logo from "../../data/Logo.png";

export const WaitingRoom = () => {
  const navigate = useNavigate();
  const gameId = localStorage.getItem("gameId"); // Get gameId from localStorage
  const [players, setPlayers] = useState([]);

  // Function to fetch the players list from the backend
  const fetchPlayers = () => {
    fetch(`http://localhost:8000/api/waiting?game_id=${gameId}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setPlayers(data); // Set the players data if it's valid
        } else {
          console.error("Invalid players data:", data);
          setPlayers([]); // Reset or handle invalid data
        }
      })
      .catch((err) => {
        console.error("Error fetching players:", err);
        setPlayers([]); // Handle the error gracefully
      });
  };

  useEffect(() => {
    // Initial fetch when the component mounts
    fetchPlayers();

    // Set an interval to fetch players data every 5 seconds
    const intervalId = setInterval(fetchPlayers, 5000); // 5000ms = 5 seconds

    // Cleanup the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, [gameId]); // Dependency on gameId to refetch when gameId changes

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
          <h4 style={{ textAlign: "center" }}>Deine Spiel ID ist {gameId}</h4>
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
                    <td>{player.group_name}</td> {/* Display group_name */}
                    <td>{player.role}</td> {/* Display role */}
                    <td>Bereit</td> {/* Hardcoded status */}
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
