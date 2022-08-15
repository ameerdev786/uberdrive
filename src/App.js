import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Map from "./components/Map";
import MainMap from "./components/MainMap";
import Rides from "./components/Rides";
import FindRideForm from "./components/FindRideForm";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainMap />} />
        <Route path="/map" element={<Map />} />
        <Route path="/sidenav" element={<FindRideForm />} />
      </Routes>
    </Router>
  );
}

export default App;
