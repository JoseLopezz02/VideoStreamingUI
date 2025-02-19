import React from "react";
import { Link } from "react-router-dom";
import "../styles/home.css"; 

export default function Home() {
  return (
    <div className="home-container">
      <input
        type="text"
        placeholder="Search..."
        className="search-input"
        aria-label="Search videos"
      />
      <nav className="button-group">
        <Link to="/trending" className="custom-button">
          Trendy Videos
        </Link>
        <Link to="/popular" className="custom-button">
          Popular Videos
        </Link>
        <Link to="/playlists" className="custom-button">
          Playlist
        </Link>
      </nav>
    </div>
  );
}
