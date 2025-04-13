import React, { useEffect, useState } from "react";
import { Footer } from "../Footer";
import { Header } from "../Header";
import { useNavigate } from "react-router-dom";

export const StartStation = ({ setSelectedStop }) => {
  const [stations, setStations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

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
  const handleSelect = (station) => {
    setSelectedStop(station); // an App übergeben
    navigate("/connections"); // Weiterleitung auf neue Seite
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
