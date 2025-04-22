import React, { useEffect, useState } from "react";
import { Footer } from "../Footer";
import { Header } from "../Header";
import { useNavigate } from "react-router-dom";
import "../../App.css";

export const NextConnections = ({ selectedStop }) => {
  const [departures, setDepartures] = useState([]);
  const [offset, setOffset] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (!selectedStop) return;

    const fetchDepartures = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/api/departures?stop_name=${encodeURIComponent(
            selectedStop.stop_name
          )}`
        );
        const data = await res.json();

        console.log("📦 Received departures JSON:", data); // ← Log here

        setDepartures(data);
        setOffset(0);
      } catch (err) {
        console.error("Fehler beim Laden:", err);
      }
    };

    fetchDepartures();
  }, [selectedStop]);

  const parseJsonLines = (text) =>
    text
      .split("\n")
      .filter(Boolean)
      .map((line) => JSON.parse(line));

  const toMinutes = (timeStr) => {
    const [h, m] = timeStr.split(":").map(Number);
    return h * 60 + m;
  };

  const getRouteIdFromTripId = (tripId) => {
    const parts = tripId.split(".");
    return parts.find((p) => p.includes("-")) || "";
  };

  const displayed = departures.slice(offset, offset + 5);

  return (
    <div className="page top-align">
      <Header />
      <div className="card">
        <div className="form-box table-box">
          <h3
            style={{
              color: "#b20000",
              fontSize: "18px",
              fontWeight: "bold",
              textAlign: "center",
              margin: "0 0 10px 0",
            }}
          >
            Nächste Verbindungen ab: {selectedStop?.stop_name}
          </h3>

          <table className="connection-table">
            <thead>
              <tr>
                <th style={{ width: "20%" }}>Zeit</th>
                <th style={{ width: "20%" }}>Linie</th>
                <th style={{ width: "40%" }}>Richtung</th>
                <th style={{ width: "20%" }}>Gleis</th>
              </tr>
            </thead>
            <tbody>
              {displayed.length > 0 ? (
                displayed.map((dep, i) => (
                  <tr
                    key={i}
                    onClick={() => navigate(`/trip/${dep.tripId}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <td>{dep.time}</td>
                    <td>{dep.line}</td>
                    <td
                      style={{
                        fontSize: "clamp(10px, 1.8vw, 14px)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {dep.destination}
                    </td>
                    <td style={{ textAlign: "right" }}>{dep.platform}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">Keine Verbindungen gefunden.</td>
                </tr>
              )}
            </tbody>
          </table>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              marginTop: "10px",
            }}
          >
            <button
              onClick={() => setOffset(Math.max(0, offset - 5))}
              disabled={offset === 0}
            >
              Frühere Verbindungen
            </button>
            <button
              onClick={() => setOffset(offset + 5)}
              disabled={offset + 5 >= departures.length}
            >
              Spätere Verbindungen
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
