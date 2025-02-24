import React from "react";
import { Link } from "react-router-dom";
import "../styles/home.css";
import SearchBar from "./SearchBar";

export default function Home() {
  return (
    <div className="home-container">
       <SearchBar searchType="video" /> 
      <nav className="button-group">
        <Link to="/trending" className="custom-button">
          Trendy Videos
        </Link>
      </nav>
    </div>
  );
}
