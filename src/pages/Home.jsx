import React, { useEffect, useState } from "react";
import {useNavigate } from "react-router-dom";
import "../styles/home.css";
import SearchBar from "./SearchBar";
import Card from "../components/Card";
import CardContent from "../components/CardContent";
import Button from "../components/Button";
import FloatingButton from "../components/FloatingButton";
import RequestToken from "./RequestToken";

export default function Home() {
  const [videos, setVideos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://127.0.0.1:3000/api/v1/trending")
      .then((response) => response.json())
      .then((data) => setVideos(data || []))
      .catch((error) => console.error("Error cargando los videos:", error));
  }, []);

  const handleVideoClick = (videoId) => {
    navigate(`/video/${videoId}`);
  };

  return (
    <div className="home-container">
      <h2 className="trending-title">TRENDING VIDEOS</h2>
      <SearchBar searchType="video" />

      <RequestToken />

      <div className="card-container">
        {videos.length > 0 ? (
          videos.map((video) => (
            <Card key={video.videoId}>
              <img
                src={video.videoThumbnails?.[0]?.url.startsWith("/")
                  ? `http://127.0.0.1:3000${video.videoThumbnails[0].url}`
                  : video.videoThumbnails?.[0]?.url || "fallback-image.png"
                }
                alt={video.title}
                className="card-img"
              />
              <CardContent className="card-content">
                <h2 className="card-title">{video.title}</h2>
                <p className="card-author">{video.author}</p>
                <div className="button-container">
                  <Button className="card-button" onClick={() => handleVideoClick(video.videoId)}>
                    Ver Video
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-center col-span-3 text-gray-500">Buscando videos...</p>
        )}
      </div>

      <FloatingButton />
    </div>
  );
}
