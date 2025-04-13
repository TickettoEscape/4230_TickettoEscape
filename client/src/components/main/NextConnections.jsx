import React, { useEffect, useState } from "react";
import { Footer } from "../Footer";
import { Header } from "../Header";
import "../../App.css"; // Stelle sicher, dass der Pfad korrekt ist

export const NextConnections = ({ selectedStop }) => {
  const [departures, setDepartures] = useState([]);

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

        const rawMatches = stopTimes.filter(st =>
          st.stop_id.startsWith(`${parentId}:`) &&
          toMinutes(st.departure_time) >= nowMinutes
        );

        const fullConnections = rawMatches.map(st => {
          const trip = tripMap[st.trip_id];
          const routeId = getRouteIdFromTripId(st.trip_id);
          const line = routeMap[routeId] || "?";
          const destination = trip?.trip_headsign || "-";
          const platform = st.stop_id.split(":").pop();
          const time = st.departure_time.slice(0, 5);

          return { time, line, destination, platform };
        });

        const fullSorted = fullConnections.sort(
          (a, b) => toMinutes(a.time) - toMinutes(b.time)
        );

        const unique = [];
        const seen = new Set();
        for (const entry of fullSorted) {
          const key = `${entry.time}|${entry.line}|${entry.destination}|${entry.platform}`;
          if (!seen.has(key)) {
            seen.add(key);
            unique.push(entry);
          }
        }

        setDepartures(unique.slice(0, 5));
      })
      .catch(err => console.error("❌ Fehler beim Laden:", err));
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

  return (
    <div className="page top-align">
      <Header />
      <div className="card">
        <h3 style={{
          color: "#b20000",
          fontSize: "18px",
          fontWeight: "bold",
          textAlign: "center",
          margin: "8px 0"
        }}>
          Nächste Verbindungen
        </h3>

        {/* Neue Form-Box ohne Padding für Tabelle */}
        <div className="form-box table-box">
          {selectedStop && (
            <p style={{ padding: "5px" }}>
              <strong style={{ color: "#b20000" }}>Von:</strong>{" "}
              {selectedStop.stop_name}
            </p>
          )}

          <table className="connection-table">
            <thead>
              <tr>
                <th>Zeit</th>
                <th>Linie</th>
                <th>Richtung</th>
                <th>Gleis</th>
              </tr>
            </thead>
            <tbody>
              {departures.length > 0 ? (
                departures.map((dep, i) => (
                  <tr key={i}>
                    <td>{dep.time}</td>
                    <td>{dep.line}</td>
                    <td>{dep.destination}</td>
                    <td>{dep.platform}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">Keine Verbindungen gefunden.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </div>
  );
};
