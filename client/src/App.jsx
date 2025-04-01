import "./App.css";
import { Routes, Route } from "react-router-dom";
import { StartScreen } from "./components/start/StartScreen"
import { JoinGame } from "./components/start/JoinGame"
import { CreateGame } from "./components/start/CreateGame"
import { ChooseRole } from "./components/start/ChooseRole";
import { Rules} from "./components/start/Rules";
import { WaitingRoom } from "./components/start/WaitingRoom";


function App() {



  return (
  <Routes>
    <Route path="/start" element={<StartScreen />} />
    <Route path="/join" element={<JoinGame/>}/>
    <Route path="/new" element={<CreateGame/>}/>
    <Route path="/role" element={<ChooseRole />} />
    <Route path="/rules" element={<Rules />} />
    <Route path="/waiting" element={<WaitingRoom />} />

  </Routes>
);

}

export default App;

