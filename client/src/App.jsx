// App.jsx
import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";

import { StartScreen } from "./components/start/StartScreen";
import { JoinGame } from "./components/start/JoinGame_DB";
import { CreateGame } from "./components/start/CreateGame_DB";
import { ChooseRole } from "./components/start/ChooseRole_DB";
import { Rules } from "./components/start/Rules";
import { WaitingRoom } from "./components/start/WaitingRoom_DB";
import { StartStation } from "./components/main/StartStation";
import { Infos } from "./components/main/Infos";
import { NextConnections } from "./components/main/NextConnections";
import { TripDetails } from "./components/main/TripDetails";
import { NextStation } from "./components/main/NextStation";
import { Chat } from "./components/main/Chat";
import { Map } from "./components/main/Map";

// const host = "localhost"
const host = "10.175.14.99";

function App() {
  const [selectedStop, setSelectedStop] = useState(null); // Zentraler Zustand für den Bahnhof

  return (
    <Routes>
      <Route path="/" element={<StartScreen />} />
      <Route path="/join" element={<JoinGame />} />
      <Route path="/new" element={<CreateGame host={host} />} />
      <Route path="/role" element={<ChooseRole host={host} />} />
      <Route path="/rules" element={<Rules />} />
      <Route path="/waiting" element={<WaitingRoom host={host} />} />
      <Route path="/infos" element={<Infos />} />
      <Route path="/chat" element={<Chat host={host} />} />
      <Route path="/map" element={<Map host={host} />} />
      <Route
        path="/startstation"
        element={<StartStation setSelectedStop={setSelectedStop} host={host} />}
      />
      <Route
        path="/connections"
        element={<NextConnections selectedStop={selectedStop} host={host} />}
      />
      <Route path="/trip" element={<TripDetails host={host} />} />
      <Route
        path="/nextstation"
        element={<NextStation setSelectedStop={setSelectedStop} host={host} />}
      />
    </Routes>
  );
}

export default App;
