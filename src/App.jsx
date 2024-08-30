import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { Navbar, Wrapper } from "./layouts";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navbar />}>
        <Route element={<Wrapper />}>
        <Route index element={<h1>Home</h1>} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
