import React from "react";
import { useNavigate } from "react-router-dom";
import "../../App.css";
import logo from "../../data/Logo.png";

export const JoinGame = ({ gameId, setGameId }) => {
  const navigate = useNavigate();


  const handleJoin = () => {
    localStorage.setItem("gameId",gameId)
    console.log(gameId)
    navigate("/role");
  };


  return (
    <div className="page">
      <div className="card">
        <div className="logo-container">
          <img src={logo} alt="Ticket to Escape" />
        </div>

        <div className="form-box">
          <label htmlFor="gameId">Spiel ID</label>
          <input
            id="gameId"
            type="text"
            placeholder="1234"
            value={gameId}
            onChange={(e) => setGameId(e.target.value)}
          />
          <button onClick={handleJoin}>Spiel beitreten</button>
        </div>
      </div>
    </div>
  );
};
