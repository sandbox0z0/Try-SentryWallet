import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./components/HomePage";
import LoginPage from "./components/LoginPage";
import DashboardLayout from "./components/DashboardLayout";
import WalletPage from "./components/WalletPage";
import NomineeSettingsPage from "./components/NomineeSettingsPage";
import ProfilePage from "./components/ProfilePage";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Navigate to="/dashboard/wallet" replace />} />
            <Route path="wallet" element={<WalletPage />} />
            <Route path="nominee" element={<NomineeSettingsPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
          {/* Redirect old dashboard route to new structure */}
          <Route path="/dashboard/*" element={<Navigate to="/dashboard/wallet" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;