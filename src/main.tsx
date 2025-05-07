import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
// import ElectreResultViewer from "./ElectreResultViewer.tsx";
// import ElectreForm from "./ElectreForm.tsx";
import { HashRouter } from "react-router-dom";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>
);
