// App.jsx
import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";

import { StartScreen } from "./components/start/StartScreen";
import { JoinGame } from "./components/start/JoinGame";
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

function App() {
  const [selectedStop, setSelectedStop] = useState(null); // Zentraler Zustand für den Bahnhof

  return (
    <Routes>
      <Route path="/" element={<StartScreen />} />
      <Route path="/join" element={<JoinGame />} />
      <Route path="/new" element={<CreateGame />} />
      <Route path="/role" element={<ChooseRole />} />
      <Route path="/rules" element={<Rules />} />
      <Route path="/waiting" element={<WaitingRoom />} />
      <Route path="/infos" element={<Infos />} />
      <Route path="/chat" element={<Chat />} />
      <Route
        path="/startstation"
        element={<StartStation setSelectedStop={setSelectedStop} />}
      />
      <Route
        path="/connections"
        element={<NextConnections selectedStop={selectedStop} />}
      />
      <Route path="/trip" element={<TripDetails />} />
      <Route
        path="/nextstation"
        element={<NextStation setSelectedStop={setSelectedStop} />}
      />
    </Routes>
  );
}

export default App;
