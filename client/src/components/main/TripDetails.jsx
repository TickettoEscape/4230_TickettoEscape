import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { Header } from "../Header";
import { Footer } from "../Footer";
import "../../App.css";

// ✅ Custom hook with RouteSpeichern inside
const useSendTrip = ({ host }) => {
  const [sendTrip, setSendTrip] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem("gamePath", location.pathname + location.search);
  }, [location.pathname, location.search]);

  const handleDecision = async (decision) => {
    const finalSendTrip = decision === "ja";
    setSendTrip(finalSendTrip);
    setShowPopup(false);

    const historyId = parseInt(localStorage.getItem("history_id"));
    const tripId = localStorage.getItem("selectedTripId");
    const departureTime = localStorage.getItem("dep_time");

    const payload = {
      trip_id: tripId,
      departure_time: departureTime,
      history_id: historyId,
      send_trip: finalSendTrip,
    };

    console.log("📤 Sending route selection payload:", payload);

    try {
      const response = await fetch(
        `http://${host}:8000/api/history/rout_select`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
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

  return { sendTrip, showPopup, handleDecision, setShowPopup };
};

export const TripDetails = ({ host }) => {
  const [routeName, setRouteName] = useState("");
  const [headsign, setHeadsign] = useState("");
  const [loading, setLoading] = useState(true);
  const [stopTimes, setStopTimes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(false);
  const [selectedBahnhof, setSelectedBahnhof] = useState(true);
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const tripId = searchParams.get("tripId");

  const { showPopup, handleDecision, setShowPopup } = useSendTrip();

  useEffect(() => {
    if (localStorage.getItem("role") === "Polizei" && selectedRoute === true) {
      setShowPopup(true);
    }
  }, [selectedRoute, setShowPopup]);

  const handleRouteSave = async () => {
    const historyId = parseInt(localStorage.getItem("history_id"));
    const tripId = localStorage.getItem("selectedTripId");
    const departureTime = localStorage.getItem("dep_time");
    setSelectedBahnhof(false);
    setSelectedRoute(true);

    const payload = {
      trip_id: tripId,
      departure_time: departureTime,
      history_id: historyId,
      send_trip: false,
    };

    console.log("📤 Sending default route selection payload:", payload);

    try {
      const response = await fetch(
        `http://${host}:8000/api/history/rout_select`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
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
    const timeOnly = now.toTimeString().split(" ")[0];
    const sendStop = localStorage.getItem("role") === "Räuber" ? true : null;

    const payload = {
      history_id: historyId,
      logout_time: timeOnly,
      send_stop: sendStop,
    };

    console.log("📤 Sending logout payload:", payload);

    try {
      const response = await fetch(`http://${host}:8000/api/history/abmelden`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

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

          <button onClick={handleRouteSave} disabled={selectedRoute}>
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
                <p style={{ marginBottom: "12px" }}>Trip im Chat Speichern?</p>
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
