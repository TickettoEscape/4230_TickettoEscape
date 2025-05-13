import { Footer } from "../Footer";
import { Header } from "../Header";
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Custom marker icon
const customMarker = new L.DivIcon({
  className: "custom-circle-icon",
  html: `<div style="background-color: #b20000; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white;"></div>`,
  iconSize: [20, 20], // Size of the circle
  iconAnchor: [10, 10], // Positioning the circle properly on the marker point
  popupAnchor: [0, -20], // Position of the popup relative to the marker
});

export const Map = () => {
  const [locations, setLocations] = useState([]);

  const group_id = parseInt(localStorage.getItem("group_id"));
  const game_id = parseInt(localStorage.getItem("gameId"));

  useEffect(() => {
    console.log("Fetching with group_id:", group_id, "game_id:", game_id);

    fetch(
      "http://localhost:8000/api/karte?group_id=" +
        group_id +
        "&game_id=" +
        game_id
    )
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched data:", data);
        if (Array.isArray(data)) {
          setLocations(data);
        } else {
          console.error("Unexpected response format:", data);
          setLocations([]); // Fallback to empty array
        }
      })
      .catch((err) => console.error("Failed to fetch locations:", err));
  }, [group_id, game_id]);

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <div>
        <Header />
      </div>
      <div style={{ flexGrow: 1 }}>
        <MapContainer
          center={[46.8084, 8.2275]} // center of Switzerland
          zoom={7}
          style={{ height: "90%", width: "100%", marginTOP: "10%" }}
        >
          {/* Stadia Alidade Smooth Tile Layer */}
          <TileLayer
            url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.{ext}"
            minZoom={0}
            maxZoom={20}
            attribution='&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
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
      <Footer />
    </div>
  );
};
