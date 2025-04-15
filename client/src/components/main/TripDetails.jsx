import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Header } from "../Header";
import { Footer } from "../Footer";
import "../../App.css";

export const TripDetails = () => {
  const { tripId } = useParams();
  const [searchParams] = useSearchParams();
  const selectedStopId = searchParams.get("stopId");

  const [stopTimes, setStopTimes] = useState([]);
  const [stopsMap, setStopsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [routeName, setRouteName] = useState("");
  const [headsign, setHeadsign] = useState("");

  // Hilfsfunktion: Parent aus stop_id extrahieren
  const getParentId = (fullStopId) => fullStopId.split(":")[0];

  // Bereinige "Parent..." aus stopId
  const cleanedStopId = selectedStopId?.startsWith("Parent")
    ? selectedStopId.replace("Parent", "")
    : selectedStopId;

  // Body-Scroll verhindern
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // Daten laden
  useEffect(() => {
    Promise.all([
      fetch("/stop_times.json").then((res) => res.text()),
      fetch("/stops.json").then((res) => res.text()),
      fetch("/trips.json").then((res) => res.text()),
      fetch("/routes.json").then((res) => res.text())
    ])
      .then(([stopTimesText, stopsText, tripsText, routesText]) => {
        const stopTimesData = stopTimesText
          .split("\n")
          .filter(Boolean)
          .map((line) => JSON.parse(line))
          .filter((entry) => entry.trip_id === tripId)
          .sort((a, b) => a.stop_sequence - b.stop_sequence);

        const stopsData = stopsText
          .split("\n")
          .filter(Boolean)
          .map((line) => JSON.parse(line));

        const tripsData = tripsText
          .split("\n")
          .filter(Boolean)
          .map((line) => JSON.parse(line));

        const routesData = routesText
          .split("\n")
          .filter(Boolean)
          .map((line) => JSON.parse(line));

        const trip = tripsData.find((t) => t.trip_id === tripId);
        const route = routesData.find((r) => r.route_id === trip?.route_id);

        setRouteName(route?.route_short_name || "?");
        setHeadsign(trip?.trip_headsign || "-");

        const stops = Object.fromEntries(stopsData.map((s) => [s.stop_id, s]));
        setStopsMap(stops);
        setStopTimes(stopTimesData);

        setLoading(false);
      })
      .catch((err) => console.error("Fehler beim Laden der Daten:", err));
  }, [tripId, cleanedStopId]);

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
            overflow: "hidden"
          }}
        >
          <h3
            style={{
              color: "#b20000",
              textAlign: "center",
              fontSize: "18px",
              marginBottom: "10px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis"
            }}
          >
            Fahrplan {routeName ? `${routeName} Richtung ${headsign}` : "dieser Verbindung"}
          </h3>

          {loading ? (
            <p style={{ textAlign: "center" }}>Lade Daten...</p>
          ) : (
            <div
              className="timeline"
              style={{
                flexGrow: 1,
                overflowY: "auto",
                padding: "10px 16px 10px 10px",
                boxSizing: "border-box"
              }}
            >
              {stopTimes.map((stop, index) => {
                const stopData = stopsMap[stop.stop_id];
                const name = stopData?.stop_name || stop.stop_id;
                const platform = stop.stop_id.split(":").pop();
                const time = stop.departure_time.slice(0, 5);

                const stopParent = getParentId(stop.stop_id);
                const isSelected = stopParent === cleanedStopId;
                const isFirst = index === 0;
                const isLast = index === stopTimes.length - 1;

                return (
                  <div
                    key={index}
                    className={`timeline-entry ${isSelected ? "selected" : ""} ${
                      isFirst ? "first" : ""
                    } ${isLast ? "last" : ""}`}
                  >
                    <div
                      className="time"
                      style={{
                        textAlign: "left",
                        minWidth: "40px",
                        paddingRight: "6px"
                      }}
                    >
                      {time}
                    </div>
                    <div className="line-col">
                      <div className="dot" />
                    </div>
                    <div className="station">{name}</div>
                    <div className="platform">Gleis {platform}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};
