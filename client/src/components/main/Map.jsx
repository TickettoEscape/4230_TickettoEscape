import React from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  Polygon,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Don't need to use `useRef` or manually initialize the map.
export const Map = () => {
  return (
    <div style={{ height: "100vh" }}>
      <MapContainer
        center={[51.505, -0.09]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        {/* Tile Layer */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
        />

        {/* Marker with Popup */}
        <Marker position={[51.505, -0.09]}>
          <Popup>
            Hello world!
            <br />
            This is a marker.
          </Popup>
        </Marker>

        {/* Circle around the marker */}
        <Circle
          center={[51.505, -0.09]}
          radius={500}
          color="red"
          fillColor="#f03"
          fillOpacity={0.5}
        />

        {/* Polygon */}
        <Polygon
          positions={[
            [51.509, -0.08],
            [51.503, -0.06],
            [51.51, -0.047],
            [51.51, -0.07],
          ]}
        >
          <Popup>I am a polygon.</Popup>
        </Polygon>
      </MapContainer>
    </div>
  );
};
