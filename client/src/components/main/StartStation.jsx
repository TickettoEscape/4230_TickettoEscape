import React, { useEffect, useState } from "react";
import { Footer } from "../Footer";
import { Header } from "../Header";
import { useNavigate, useLocation } from "react-router-dom";

export const StartStation = ({ setSelectedStop, host }) => {
  const [stations, setStations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem("gamePath", location.pathname);
  }, [location.pathname]);

  // Bahnhöfe laden
  useEffect(() => {
    fetch("/stops_parent.json")
      .then((res) => res.text())
      .then((text) => {
        const lines = text.split("\n").filter((line) => line.trim() !== "");
        const parsed = lines.map((line) => JSON.parse(line));
        setStations(parsed);
      })
      .catch((err) => console.error("Fehler beim Laden der Datei:", err));
  }, []);

  // Filter für Suche
  const filtered = stations
    .filter((val) =>
      val.stop_name.toLowerCase().startsWith(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.stop_name.localeCompare(b.stop_name));

  // Auswahlhandler
  const handleSelect = async (station) => {
    try {
      setSelectedStop(station);

      // Retrieve required values
      const groupId = parseInt(localStorage.getItem("group_id"));
      const gameId = parseInt(localStorage.getItem("gameId"));
      const now = new Date();
      const timeOnly = now.toTimeString().split(" ")[0]; // "HH:MM:SS"

      const payload = {
        group_id: groupId,
        game_id: gameId,
        from_stop: station.stop_name,
        login_time: timeOnly,
        arrival_time: timeOnly,
        send_stop: true,
        send_trip: true,
      };

      console.log("Payload for station selection:", payload);

      // Send POST request
      const response = await fetch(`http://${host}:8000/api/history/anmelden`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.historyId) {
        localStorage.setItem("history_id", data.historyId);
        // localStorage.setItem("gramePath", "/connections");
        navigate("/connections");
      } else {
        console.error("No historyId returned", data);
      }
    } catch (error) {
      console.error("Error during station selection:", error);
    }
  };

  return (
    <div className="page top-align">
      <Footer />
      <Header />
      <div className="card">
        <div className="form-box">
          <label htmlFor="search">Start Bahnhof</label>
          <input
            id="search"
            type="text"
            placeholder="z.B. Muttenz"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm.length > 0 && filtered.length > 0 && (
            <div style={{ marginTop: "10px" }}>
              {filtered.slice(0, 5).map((val) => (
                <div
                  key={val.stop_id}
                  onClick={() => handleSelect(val)} // 🠒 Auswahl & Navigation
                  style={{
                    padding: "6px 10px",
                    cursor: "pointer",
                    backgroundColor: "#f0f0f0",
                    borderRadius: "5px",
                    marginBottom: "5px",
                  }}
                >
                  {val.stop_name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
