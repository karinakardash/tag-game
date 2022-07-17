import React from "react";

import "./App.css";
import MainPage from "./pages/main-page/MainPage";
import ChoicePage from "./pages/choice-page/ChoicePage";

import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
        <Routes>
        <Route path="/" element={<ChoicePage />} />
          <Route
            path="/main"
            element={<MainPage />}
          />
          <Route
            path="/start"
            element={<ChoicePage />}
          />
        </Routes>
    </div>
  );
}

export default App;
