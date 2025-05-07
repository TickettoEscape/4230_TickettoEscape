import React, { useEffect, useState } from "react";
import { Footer } from "../Footer";
import { Header } from "../Header";
import { useNavigate, useLocation } from "react-router-dom";
import "../../App.css";

// Custom hook for popup & send_stop handling
const useSendStop = () => {
  const [sendStop, setSendStop] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [pendingTrip, setPendingTrip] = useState(null);
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem("gamePath", location.pathname);
  }, [location.pathname]);

  const handleDecision = (decision) => {
    const finalSendStop = decision === "ja";
    setSendStop(finalSendStop);
    setShowPopup(false);

    if (pendingTrip) {
      const { tripId, departure_time, navigate } = pendingTrip;
      localStorage.setItem("dep_time", departure_time);
      localStorage.setItem("send_stop", finalSendStop);
      navigate(`/trip?tripId=${encodeURIComponent(tripId)}`);
      setPendingTrip(null);
    }
  };

  return { sendStop, showPopup, handleDecision, setShowPopup, setPendingTrip };
};

export const NextConnections = ({ selectedStop }) => {
  const [departures, setDepartures] = useState([]);
  const [offset, setOffset] = useState(0);
  const navigate = useNavigate();

  const { sendStop, showPopup, handleDecision, setShowPopup, setPendingTrip } =
    useSendStop();

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
        setDepartures(data);
        setOffset(0);
      } catch (err) {
        console.error("Fehler beim Laden:", err);
      }
    };

    fetchDepartures();
  }, [selectedStop]);

  const displayed = departures.slice(offset, offset + 5);

  const handleRowClick = (tripId, departure_time) => {
    if (!tripId) {
      console.warn("❌ No tripId found!");
      return;
    }

    const isPolizei = localStorage.getItem("role") === "Polizei";

    if (isPolizei) {
      setPendingTrip({ tripId, departure_time, navigate });
      setShowPopup(true);
    } else {
      localStorage.setItem("dep_time", departure_time);
      localStorage.setItem("send_stop", true); // default if no popup
      navigate(`/trip?tripId=${encodeURIComponent(tripId)}`);
    }
  };

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
                    onClick={() => handleRowClick(dep.tripId, dep.time)}
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

        {showPopup && (
          <div className="popup-overlay">
            <div className="popup-content">
              <div className="popup-header">
                <span
                  onClick={() => handleDecision("nein")}
                  className="close-button"
                >
                  ✕
                </span>
              </div>
              <p style={{ marginBottom: "12px" }}>Bahnhof im Chat Speichern?</p>
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  justifyContent: "center",
                }}
              >
                <button onClick={() => handleDecision("ja")}>Ja</button>
                <button onClick={() => handleDecision("nein")}>Nein</button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};
