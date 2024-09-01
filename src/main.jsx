import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./styles/globals.css";
import { HashRouter } from "react-router-dom";
import { PageContextProvider } from "./contexts";

createRoot(document.getElementById("root")).render(
  <PageContextProvider>
    <StrictMode>
      <HashRouter>
        <App />
      </HashRouter>
    </StrictMode>
  </PageContextProvider>
);
