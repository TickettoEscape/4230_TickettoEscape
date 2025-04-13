// App.jsx
import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";

import { StartScreen } from "./components/start/StartScreen";
import { JoinGame } from "./components/start/JoinGame";
import { CreateGame } from "./components/start/CreateGame";
import { ChooseRole } from "./components/start/ChooseRole";
import { Rules } from "./components/start/Rules";
import { WaitingRoom } from "./components/start/WaitingRoom";
import { StartStation } from "./components/main/StartStation";
import { Infos } from "./components/main/Infos";
import { NextConnections } from "./components/main/NextConnections";

function App() {
  const [selectedStop, setSelectedStop] = useState(null); // Zentraler Zustand für den Bahnhof

  return (
    <Routes>
      <Route path="/start" element={<StartScreen />} />
      <Route path="/join" element={<JoinGame />} />
      <Route path="/new" element={<CreateGame />} />
      <Route path="/role" element={<ChooseRole />} />
      <Route path="/rules" element={<Rules />} />
      <Route path="/waiting" element={<WaitingRoom />} />
      <Route path="/infos" element={<Infos />} />
      <Route path="/startstation" element={<StartStation setSelectedStop={setSelectedStop} />} />
      <Route path="/connections" element={<NextConnections selectedStop={selectedStop} />} />
    </Routes>
  );
}

export default App;
