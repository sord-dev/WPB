import { Route, Routes } from "react-router-dom";
import { SideNavbar, Wrapper } from "./layouts";
import { Builder, Dashboard } from "./pages";

import { invoke } from "@tauri-apps/api";
import { useEffect } from "react";

function App() {

  useEffect(() => {
    invoke("scan_for_projects").then((data) => {
      console.log(data);
    });
  }, []);


  return (
    <Routes>
      <Route path="/" element={<SideNavbar />}>
        <Route element={<Wrapper />}>
          <Route index element={<Dashboard />} />
          <Route path="/builder" element={<Builder />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
