import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import LoginPage from "./components/LoginPage";
import WorkInProgress from "./components/WorkInProgress";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/work-in-progress" element={<WorkInProgress />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;