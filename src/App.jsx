import { Route, Routes } from "react-router-dom";
import { SideNavbar, Wrapper } from "./layouts";
import { Builder, ComponentBuilder, Dashboard, ExportTestingGround, Handlers } from "./pages";

function App() {

  return (
    <Routes>
      <Route path="/" element={<SideNavbar />}>
        <Route element={<Wrapper />}>
          <Route index element={<Dashboard />} />
          <Route path="/builder" element={<Builder />} />
          <Route path="/component-builder" element={<ComponentBuilder />} />
          <Route path="/handlers" element={<Handlers />} />
          <Route path="/testing" element={<ExportTestingGround />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
