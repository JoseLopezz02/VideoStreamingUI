import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import TrendingVideos from "./pages/TrendingVideos";
import PopularVideos from "./pages/PopularVideos";

export default function App() {
  return (
    <Router>
      <div className="p-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/trending" element={<TrendingVideos />} />
          <Route path="/popular" element={<PopularVideos />} />
        </Routes>
      </div>
    </Router>
  );
}
