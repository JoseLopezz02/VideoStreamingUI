import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Card from "../components/Card";
import CardContent from "../components/CardContent";

export default function SearchResults() {
  const [videos, setVideos] = useState([]);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("q");

  useEffect(() => {
    if (searchQuery) {
      fetch(
        `http://127.0.0.1:3000/api/v1/search?q=${encodeURIComponent(searchQuery)}`
      )
        .then((response) => response.json())
        .then((data) => setVideos(data || []))
        .catch((error) => console.error("Error fetching videos:", error));
    }
  }, [searchQuery]);

  return (
    <div>
      <h2>Search Results for: "{searchQuery}"</h2>
      {videos.length > 0 ? (
        <ul>
          {videos.map((video) => (
            <Card key={video.id}>
              <CardContent>
                <h3>{video.title}</h3>
                <p>{video.description}</p>
                <video width="320" height="240" controls>
                  <source src={video.url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </CardContent>
            </Card>
          ))}
        </ul>
      ) : (
        <p>No results found.</p>
      )}
    </div>
  );
}
