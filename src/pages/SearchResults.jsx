import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import Card from "../components/Card";
import CardContent from "../components/CardContent";
import "../styles/searchResults.css"; // Add CSS for styling
import FloatingButton from "../components/FloatingButton";

export default function SearchResults() {
  const [videos, setVideos] = useState([]);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("q");

  useEffect(() => {
    if (searchQuery) {
      fetch(`http://127.0.0.1:3000/api/v1/search?q=${encodeURIComponent(searchQuery)}`)
        .then((response) => response.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setVideos(data);
          } else if (data && data.videos && Array.isArray(data.videos)) {
            setVideos(data.videos);
          } else {
            setVideos([]);
          }
        })
        .catch((error) => console.error("Error fetching videos:", error));
    }
  }, [searchQuery]);

  return (
    <div className="search-results-container">
      <h2>Search Results for: "{searchQuery}"</h2>
      {videos.length > 0 ? (
        <ul className="video-list">
          {videos.map((video) => (
            <li key={video.videoId} className="video-item">
              <Link to={`/video/${video.videoId}`} className="video-link">
                <Card>
                  <CardContent className="video-card">
                    <img
                      src={video.videoThumbnails?.[0]?.url || "default-thumbnail.jpg"}
                      alt={video.title}
                      className="video-thumbnail"
                    />
                    <div className="video-info">
                      <h3 className="video-title">{video.title}</h3>
                      <p className="video-author">{video.author}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No results found.</p>
      )}

      <FloatingButton />
    </div>
  );
}
