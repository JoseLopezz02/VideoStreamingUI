import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchBar({ searchType }) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (event) => {
    if (event.key === "Enter" && query.trim() !== "") {
      if (searchType === "channel") {
        navigate(`/channels/${encodeURIComponent(query)}`); // Search for a channel
      } else {
        navigate(`/search?q=${encodeURIComponent(query)}`); // Search for videos
      }
    }
  };

  return (
    <input
      type="text"
      placeholder={searchType === "channel" ? "Search channels..." : "Search videos..."}
      className="search-input"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      onKeyDown={handleSearch}
      aria-label={searchType === "channel" ? "Search channels" : "Search videos"}
    />
  );
}

