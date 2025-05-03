import React, { useEffect, useState } from "react";
import { Footer } from "../Footer";
import { Header } from "../Header";
import { useNavigate } from "react-router-dom";

export const NextStation = ({ setSelectedStop }) => {
  const [stations, setStations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [stopTimes, setStopTimes] = useState([]);
  const [routeName, setRouteName] = useState("");
  const [headsign, setHeadsign] = useState("");
  const [loading, setLoading] = useState(false);
  const tripId = localStorage.getItem("selectedTripId");
  const navigate = useNavigate();

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
          `http://localhost:8000/api/departures_details?trip_id=${tripId}`
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

  // Get the current time in the format HH:mm
  const getCurrentTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  // Filter the stopTimes array to show only the stops after the current time
  const filteredStopTimes = stopTimes.filter((stop) => {
    const currentTime = getCurrentTime();
    return stop.departure_time > currentTime;
  });

  const filtered = stations
    .filter((val) =>
      val.stop_name.toLowerCase().startsWith(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.stop_name.localeCompare(b.stop_name));

  const handleSelect = (station) => {
    setSelectedStop(station);
    navigate("/connections");
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
          {/* Title */}
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

          {/* Timeline */}
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
                const isSelected = stop.stop_name.includes(tripId);
                const isFirst = index === 0;
                const isLast = index === filteredStopTimes.length - 1;

                return (
                  <div
                    key={index}
                    className={`timeline-entry ${
                      isSelected ? "selected" : ""
                    } ${isFirst ? "first" : ""} ${isLast ? "last" : ""}`}
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

          {/* Station Search */}
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
    </div>
  );
};
