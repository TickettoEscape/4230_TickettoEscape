import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Header } from "../Header";
import { Footer } from "../Footer";
import "../../App.css";

export const TripDetails = () => {
  const [tripDetails, setTripDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [routeName, setRouteName] = useState("");
  const [headsign, setHeadsign] = useState("");
  const [stopTimes, setStopTimes] = useState([]);

  // Getting tripId from the URL query parameters
  const [searchParams] = useSearchParams();
  const tripId = searchParams.get("tripId");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    if (!tripId) return;

    // Fetch trip details
    const fetchTripDetails = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/api/departures_details?trip_id=${tripId}`
        );
        const data = await res.json();
        setStopTimes(data);
        setLoading(false);
      } catch (err) {
        console.error("❌ Error fetching trip details:", err);
        setLoading(false);
      }
    };

    fetchTripDetails();
  }, [tripId]);

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
    position: "relative", // wichtig
  }}
>
  {/* Fixer Titel */}
  <div
    style={{
      color: "#b20000",
      textAlign: "center",
      fontSize: "18px",
      // marginBottom: "10px",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      paddingBottom: "8px",
      background: "white",
      position: "sticky",
      top: "0",
      zIndex: 10,
    }}
  >
    Fahrplan{" "}
    {routeName
      ? `${routeName} Richtung ${headsign}`
      : "dieser Verbindung"}
  </div>

  {/* Scrollbarer Bereich */}
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
      {stopTimes.map((stop, index) => {
        const time = stop.departure_time.slice(0, 5);
        const isSelected = stop.stop_name.includes(tripId);
        const isFirst = index === 0;
        const isLast = index === stopTimes.length - 1;

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
</div>

      </div>
      <Footer />
    </div>
  );
};
