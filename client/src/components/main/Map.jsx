import { Footer } from "../Footer";
import { Header } from "../Header";
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../../App.css"; // use your existing global styles

const customMarker = new L.DivIcon({
  className: "custom-circle-icon",
  html: `<div style="background-color: #b20000; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white;"></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
  popupAnchor: [0, -20],
});

export const Map = () => {
  const [locations, setLocations] = useState([]);

  const group_id = parseInt(localStorage.getItem("group_id"));
  const game_id = parseInt(localStorage.getItem("gameId"));

  useEffect(() => {
    fetch(`http://localhost:8000/api/karte?group_id=${group_id}&game_id=${game_id}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setLocations(data);
        } else {
          setLocations([]);
        }
      })
      .catch((err) => console.error("Failed to fetch locations:", err));
  }, [group_id, game_id]);

  return (
    <div className="page top-align" >
      <Header />

      <div
        style={{
          width: "100%",
          height:"100%",
          maxWidth: "1000px",
          marginTop: "20px",
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          className="card"
          style={{ width: "100%",height:"100%", padding: "0",}}
        >
          <div style={{ width: "100%", height: "900px" }}>
            <MapContainer
              center={[46.8084, 8.2275]}
              zoom={7}
              style={{ width: "100%", height: "100%" }}
            >
              <TileLayer
                url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.{ext}"
                minZoom={7}
                maxZoom={20}
                attribution='&copy; <a href="https://www.stadiamaps.com/">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                ext="png"
              />
              {locations.map((location, index) => (
                <Marker
                  key={index}
                  position={[location.lat, location.lon]}
                  icon={customMarker}
                >
                  <Popup>{location.name}</Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};
