import "./App.css";
import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { StartScreen } from "./components/start/StartScreen"
import { JoinGame } from "./components/start/JoinGame"
import { CreateGame } from "./components/start/CreateGame"
import { ChooseRole } from "./components/start/ChooseRole";
import { Rules} from "./components/start/Rules";


function App() {

  const [gameId, setGameId] = useState("");
  const [duration, setDuration] = useState("");
  const [policeCount, setPoliceCount] = useState("");

  return (
  <Routes>
    <Route path="/start" element={<StartScreen />} />
    <Route
          path="/join"
          element={<JoinGame gameId={gameId} setGameId={setGameId} />}
    />
    <Route
        path="/new"
        element={
          <CreateGame
            duration={duration}
            setDuration={setDuration}
            policeCount={policeCount}
            setPoliceCount={setPoliceCount}
          />
        }
      />
      <Route path="/role" element={<ChooseRole />} />
      <Route path="/rules" element={<Rules />} />

  </Routes>
);

}

export default App;

