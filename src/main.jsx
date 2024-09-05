import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./styles/globals.css";
import { HashRouter } from "react-router-dom";
import { PageContextProvider, TabProvider } from "./contexts";
import { ProjectProvider } from "./contexts/ProjectContext/ProjectContext.jsx";

createRoot(document.getElementById("root")).render(
  <HashRouter>
    <PageContextProvider>
      <ProjectProvider>
        <TabProvider>
          <StrictMode>
            <App />
          </StrictMode>
        </TabProvider>
      </ProjectProvider>
    </PageContextProvider>
  </HashRouter>
);
