import { Routes, Route } from "react-router-dom";
import WelcomePage from "./pages/WelcomePage";
// import ElectreForm from "./ElectreForm";
import ElectreWizard from "./pages/ElectreWizard";
function App() {
  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/electre" element={<ElectreWizard />} />
    </Routes>
  );
}

export default App;
