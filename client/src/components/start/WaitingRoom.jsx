import React from "react";
import { useNavigate } from "react-router-dom";
import "../../App.css";
import logo from "../../data/Logo.png";

export const WaitingRoom = () => {
  const navigate = useNavigate();
  const groupName = localStorage.getItem("groupName") || "Unbenannt";
  const role = localStorage.getItem("role") || "Unbekannt";

  const handleStartGame = () => {
    navigate("/game"); // ändere den Pfad, wenn dein Spielflow anders läuft
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
              <tr>
                <td>{groupName}</td>
                <td>{role}</td>
                <td>Bereit</td>
              </tr>
              <tr>
                <td colSpan={3}></td>
              </tr>
              <tr>
                <td colSpan={3}></td>
              </tr>
            </tbody>
          </table>

          {/* Spiel starten Button */}
<button onClick={() => navigate("/startstation")}>Spiel starten</button>
        </div>
      </div>
    </div>
  );
};
