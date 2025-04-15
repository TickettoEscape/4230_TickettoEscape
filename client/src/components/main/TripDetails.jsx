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

  useEffect(() => {
    Promise.all([
      fetch("/stop_times.json").then((res) => res.text()),
      fetch("/stops.json").then((res) => res.text()),
    ])
      .then(([stopTimesText, stopsText]) => {
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

        const stops = Object.fromEntries(
          stopsData.map((s) => [s.stop_id, s])
        );

        setStopTimes(stopTimesData);
        setStopsMap(stops);
        setLoading(false);
      })
      .catch((err) => console.error("Fehler beim Laden der Daten:", err));
  }, [tripId]);

  return (
    <div className="page top-align">
      <Header />
      <div className="card">
        <div className="form-box table-box" style={{ maxWidth: "360px" }}>
          <h3 style={{ color: "#b20000", textAlign: "center", fontSize: "18px" }}>
            Fahrplan dieser Verbindung
          </h3>
          {loading ? (
            <p>Lade Daten...</p>
          ) : (
            <div className="timeline">
              {stopTimes.map((stop, index) => {
                const stopData = stopsMap[stop.stop_id];
                const name = stopData?.stop_name || stop.stop_id;
                const platform = stop.stop_id.split(":").pop();
                const time = stop.departure_time.slice(0, 5);
                const isSelected = stopData?.parent_station === selectedStopId;

                const isFirst = index === 0;
                const isLast = index === stopTimes.length - 1;

                return (
                  <div
                    key={index}
                    className={`timeline-entry ${isSelected ? "selected" : ""} ${isFirst ? "first" : ""} ${isLast ? "last" : ""}`}
                  >
                    <div className="time">{time}</div>
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
