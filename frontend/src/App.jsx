import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ParallaxProvider } from "react-scroll-parallax";
import { useState } from "react";
import Home from "./pages/Home.jsx";
import Room from "./pages/Room.jsx";
import "./App.css";
import React from "react";

function App() {
  // Authentication State
  const [room, setRoom] = useState("");

  return (
    <ParallaxProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home room={room} setRoom={setRoom} />} />
          <Route path="/rooms/:id/:name" element={<Room room={room} />} />
        </Routes>
      </Router>
    </ParallaxProvider>
  );
}

export default App;
