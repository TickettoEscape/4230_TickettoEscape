import React, { useEffect, useState } from "react";

export const StartStation = () => {
  const [stations, setStations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStation, setSelectedStation] = useState(null); // ausgewählter Bahnhof

  // Bahnhofsdaten laden
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

  // Nur Bahnhöfe anzeigen, die mit dem Suchbegriff beginnen
  const filtered = stations.filter((val) =>
    val.stop_name.toLowerCase().startsWith(searchTerm.toLowerCase())
  );

  //Auswahl speichern
  const handleSelect = (station) => {
    setSelectedStation(station);
    setSearchTerm(station.stop_name); // den Namen ins Eingabefeld übernehmen
    console.log("✅ Ausgewählt:", station);
  };

  return (
    <div className="page">
      <div className="card">
        <div className="form-box">
          <label htmlFor="search">Bahnhof suchen</label>
          <input
            id="search"
            type="text"
            placeholder="z. B. Zürich"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setSelectedStation(null); // Auswahl zurücksetzen bei neuer Eingabe
            }}
          />

          {/* Nur zeigen, wenn etwas eingegeben wurde UND Treffer vorhanden sind */}
          {searchTerm.length > 0 && filtered.length > 0 && (
            <div style={{ marginTop: "10px" }}>
              {filtered.slice(0, 5).map((val) => (
                <div
                  key={val.stop_id}
                  onClick={() => handleSelect(val)} // Auswahl per Klick
                  style={{
                    padding: "6px 10px",
                    cursor: "pointer",
                  }}
                >
                  {val.stop_name}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Optional: aktuelle Auswahl anzeigen */}
        {selectedStation && (
          <div style={{ marginTop: "30px", color: "#b20000" }}>
            Gewählt: {selectedStation.stop_name}
          </div>
        )}
      </div>
    </div>
  );
};
