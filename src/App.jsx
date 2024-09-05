import { Route, Routes } from "react-router-dom";
import { SideNavbar, Wrapper } from "./layouts";
import { Builder, Dashboard } from "./pages";

function App() {
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
