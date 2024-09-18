import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./styles/globals.css";
import { HashRouter } from "react-router-dom";
import { PageContextProvider, TabProvider } from "./contexts";
import { ProjectProvider } from "./contexts/ProjectContext/ProjectContext.jsx";
import { ExportContextProvider } from "./contexts/ExportContext";

createRoot(document.getElementById("root")).render(
  <HashRouter>
    <ExportContextProvider>
      <PageContextProvider>
        <TabProvider>
          <ProjectProvider>
            <StrictMode>
              <App />
            </StrictMode>
          </ProjectProvider>
        </TabProvider>
      </PageContextProvider>
    </ExportContextProvider>
  </HashRouter>
);
