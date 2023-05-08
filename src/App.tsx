import Login from "./pages/Login";
import Chat from "./pages/Chat";

import { Routes, Route } from "react-router-dom";

function App(): JSX.Element {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/chat" element={<Chat />} />
    </Routes>
  );
}

export default App;
