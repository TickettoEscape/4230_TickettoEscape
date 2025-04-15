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

    const parentId = selectedStop.stop_id.startsWith("Parent")
      ? selectedStop.stop_id.replace("Parent", "")
      : selectedStop.stop_id;

    Promise.all([
      fetch("/stop_times.json").then((res) => res.text()),
      fetch("/trips.json").then((res) => res.text()),
      fetch("/routes.json").then((res) => res.text())
    ])
      .then(([stopTimesText, tripsText, routesText]) => {
        const stopTimes = parseJsonLines(stopTimesText);
        const trips = parseJsonLines(tripsText);
        const routes = parseJsonLines(routesText);

        const now = new Date();
        const nowMinutes = now.getHours() * 60 + now.getMinutes();

        const tripMap = Object.fromEntries(trips.map(t => [t.trip_id, t]));
        const routeMap = Object.fromEntries(routes.map(r => [r.route_id, r.route_short_name]));

        const relevantStops = stopTimes.filter(st =>
          st.stop_id.startsWith(`${parentId}:`)
        );

        const connections = relevantStops
          .filter(st => toMinutes(st.departure_time) >= nowMinutes)
          .map(st => {
            const trip = tripMap[st.trip_id];
            const routeId = getRouteIdFromTripId(st.trip_id);
            const line = routeMap[routeId] || "?";
            const destination = trip?.trip_headsign || "-";
            const platform = st.stop_id.split(":").pop();
            const time = st.departure_time.slice(0, 5);

            if (
              destination.toLowerCase().includes(
                selectedStop.stop_name.toLowerCase()
              )
            ) {
              return null;
            }

            return { time, line, destination, platform, tripId: st.trip_id };
          })
          .filter(Boolean);

        const sorted = connections.sort(
          (a, b) => toMinutes(a.time) - toMinutes(b.time)
        );

        const seen = new Set();
        const unique = [];
        for (const entry of sorted) {
          const key = `${entry.time}|${entry.line}|${entry.destination}|${entry.platform}`;
          if (!seen.has(key)) {
            seen.add(key);
            unique.push(entry);
          }
        }

        setDepartures(unique);
        setOffset(0);
      })
      .catch(err => console.error("Fehler beim Laden:", err));
  }, [selectedStop]);

  const parseJsonLines = (text) =>
    text.split("\n").filter(Boolean).map(line => JSON.parse(line));

  const toMinutes = (timeStr) => {
    const [h, m] = timeStr.split(":").map(Number);
    return h * 60 + m;
  };

  const getRouteIdFromTripId = (tripId) => {
    const parts = tripId.split(".");
    return parts.find(p => p.includes("-")) || "";
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
              margin: "0 0 10px 0"
            }}
          >
            Nächste Verbindungen ab: {selectedStop?.stop_name}
          </h3>

          <table className="connection-table">
          <thead>
  <tr>
    <th style={{ width: "20%" }}>Zeit</th>
    <th style={{ width: "20%" }}>Linie</th> {/* vorher 15% */}
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
                    <td style={{
                      fontSize: "clamp(10px, 1.8vw, 14px)",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis"
                    }}>{dep.destination}</td>
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
              marginTop: "10px"
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
