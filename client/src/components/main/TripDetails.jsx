import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { Header } from "../Header";
import { Footer } from "../Footer";
import "../../App.css";

// Custom hook to handle send_trip state and Polizei popup logic
const useSendTrip = () => {
  const [sendTrip, setSendTrip] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem("gamePath", location.pathname + location.search);
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (localStorage.getItem("role") === "Polizei") {
      setShowPopup(true);
    }
  }, []);

  const handleDecision = (decision) => {
    setSendTrip(decision === "ja");
    setShowPopup(false);
  };

  return { sendTrip, showPopup, handleDecision };
};

export const TripDetails = () => {
  const [routeName, setRouteName] = useState("");
  const [headsign, setHeadsign] = useState("");
  const [loading, setLoading] = useState(true);
  const [stopTimes, setStopTimes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(false);
  const [selectedBahnhof, setSelectedBahnhof] = useState(true);
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const tripId = searchParams.get("tripId");

  const { sendTrip, showPopup, handleDecision } = useSendTrip();

  const RouteSpeichern = async (stop) => {
    const historyId = parseInt(localStorage.getItem("history_id"));
    const tripId = localStorage.getItem("selectedTripId");
    const departureTime = localStorage.getItem("dep_time");
    setSelectedBahnhof(false);
    setSelectedRoute(true);

    const payload = {
      trip_id: tripId,
      departure_time: departureTime,
      history_id: historyId,
      send_trip: sendTrip,
    };

    console.log("Sending route selection payload:", payload);

    try {
      const response = await fetch(
        "http://localhost:8000/api/history/rout_select",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (data.status === "success") {
        console.log("✅ Route successfully saved.");
      } else {
        console.error("❌ Error response:", data);
      }
    } catch (err) {
      console.error("❌ Failed to save route:", err);
    }
  };

  const BahnhofAbmelden = async () => {
    const historyId = parseInt(localStorage.getItem("history_id"));
    const now = new Date();
    const timeOnly = now.toTimeString().split(" ")[0]; // "HH:MM:SS"
    const sendStop = true; // or false, depending on your logic

    const payload = {
      history_id: historyId,
      logout_time: timeOnly,
      send_stop: sendStop,
    };

    console.log("📤 Sending logout payload:", payload);

    try {
      const response = await fetch(
        "http://localhost:8000/api/history/abmelden",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (data.status === "success") {
        console.log("✅ Successfully abgemeldet.");
        navigate("/nextStation");
      } else {
        console.error("❌ Abmelden failed:", data);
      }
    } catch (err) {
      console.error("❌ Error during abmelden:", err);
    }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    if (!tripId) return;

    localStorage.setItem("selectedTripId", tripId);

    const fetchTripDetails = async () => {
      try {
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
            }}
          >
            {routeName
              ? `${routeName} Richtung ${headsign}`
              : "Fahrplan dieser Verbindung"}
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
          <button onClick={RouteSpeichern} disabled={selectedRoute}>
            Route Speichern
          </button>
          <button onClick={BahnhofAbmelden} disabled={selectedBahnhof}>
            von Bahnhof abmelden
          </button>

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
                <p style={{ marginBottom: "12px" }}>Trip teilen?</p>
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
      </div>
      <Footer />
    </div>
  );
};
