import React, { useEffect, useState } from "react";
import { Footer } from "../Footer";
import { Header } from "../Header";
import { useNavigate, useLocation } from "react-router-dom";

export const NextStation = ({ setSelectedStop, host }) => {
  const [stations, setStations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [stopTimes, setStopTimes] = useState([]);
  const [routeName, setRouteName] = useState("");
  const [headsign, setHeadsign] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [pendingStation, setPendingStation] = useState(null);
  const tripId = localStorage.getItem("selectedTripId");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem("gamePath", location.pathname);
  }, [location.pathname]);

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

  useEffect(() => {
    if (!tripId) return;

    const fetchTripDetails = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `http://${host}:8000/api/departures_details?trip_id=${tripId}`
        );
        const data = await res.json();

        if (data.length > 0) {
          setRouteName(data[0].route_short_name || "");
          setHeadsign(data[0].trip_headsign || "");
        }

        setStopTimes(data);
        setLoading(false);
      } catch (err) {
        console.error("❌ Error fetching trip details:", err);
        setLoading(false);
      }
    };

    fetchTripDetails();
  }, [tripId]);

  const getCurrentTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const filteredStopTimes = stopTimes.filter((stop) => {
    const currentTime = getCurrentTime();
    return stop.departure_time > currentTime;
  });

  const filtered = stations
    .filter((val) =>
      val.stop_name.toLowerCase().startsWith(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.stop_name.localeCompare(b.stop_name));

  const proceedWithSelection = async (station, sendStop) => {
    try {
      setSelectedStop(station);

      const groupId = parseInt(localStorage.getItem("group_id"));
      const gameId = parseInt(localStorage.getItem("gameId"));
      const now = new Date();
      const timeOnly = now.toTimeString().split(" ")[0];

      const payload = {
        group_id: groupId,
        game_id: gameId,
        from_stop: station.stop_name,
        login_time: timeOnly,
        arrival_time: timeOnly,
        send_stop: sendStop,
      };

      console.log("Payload for station selection:", payload);

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
        navigate("/connections");
      } else {
        console.error("No historyId returned", data);
      }
    } catch (error) {
      console.error("Error during station selection:", error);
    }
  };

  const handleSelect = (station) => {
    const isPolizei = localStorage.getItem("role") === "Polizei";
    if (isPolizei) {
      setPendingStation(station);
      setShowPopup(true);
    } else {
      proceedWithSelection(station, true);
    }
  };

  const handleDecision = (decision) => {
    setShowPopup(false);
    const sendStop = decision === "ja";
    if (pendingStation) {
      proceedWithSelection(pendingStation, sendStop);
      setPendingStation(null);
    }
  };

  return (
    <div className="page top-align">
      <Header />
      <div className="card">
        <div
          className="form-box table-box"
          style={{
            maxWidth: "360px",
            padding: "16px",
            boxSizing: "border-box",
            height: "auto",
            maxHeight: "calc(100vh - 160px)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div
            style={{
              color: "#b20000",
              textAlign: "center",
              fontSize: "18px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              paddingBottom: "8px",
              background: "white",
              position: "sticky",
              top: "0",
              zIndex: 10,
              height: "90px",
            }}
          >
            {routeName ? (
              <>
                Aktuelle Verbindung
                <br />
                {routeName} Richtung {headsign}
              </>
            ) : (
              "Nächster Bahnhof wählen"
            )}
          </div>

          {loading ? (
            <p style={{ textAlign: "center" }}>Lade Daten...</p>
          ) : (
            <div
              className="timeline"
              style={{
                flexGrow: 1,
                overflowY: "auto",
                padding: "10px 16px 10px 10px",
                boxSizing: "border-box",
              }}
            >
              {filteredStopTimes.map((stop, index) => {
                const time = stop.departure_time.slice(0, 5);
                const isFirst = index === 0;
                const isLast = index === filteredStopTimes.length - 1;

                return (
                  <div
                    key={index}
                    className={`timeline-entry ${isFirst ? "first" : ""} ${
                      isLast ? "last" : ""
                    }`}
                  >
                    <div
                      className="time"
                      style={{
                        textAlign: "left",
                        minWidth: "40px",
                        paddingRight: "6px",
                      }}
                    >
                      {time}
                    </div>
                    <div className="line-col"></div>
                    <div className="station">{stop.stop_name}</div>
                    <div className="platform">Gleis {stop.platform}</div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="form-box">
            <label htmlFor="search">Nächster Bahnhof eingeben</label>
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
                    onClick={() => handleSelect(val)}
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
      <Footer />

      {/* Polizei popup */}
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
            <p style={{ marginBottom: "12px" }}>Bahnhof im Chat speichern?</p>
            <div
              style={{ display: "flex", gap: "10px", justifyContent: "center" }}
            >
              <button onClick={() => handleDecision("ja")}>Ja</button>
              <button onClick={() => handleDecision("nein")}>Nein</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
