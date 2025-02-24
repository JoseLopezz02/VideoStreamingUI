import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchBar({ searchType }) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (event) => {
    if (event.key === "Enter" && query.trim() !== "") {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <input
      type="text"
      placeholder={"Search videos..."}
      className="search-input"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      onKeyDown={handleSearch}
      aria-label={"Search videos"}
    />
  );
}
