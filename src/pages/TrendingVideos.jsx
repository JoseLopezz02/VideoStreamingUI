import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import CardContent from "../components/CardContent";
import Button from "../components/Button";
import "../styles/trending.css";

export default function TrendingVideos() {
  const [videos, setVideos] = useState([]);
  const [fabOpen, setFabOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://127.0.0.1:3000/api/v1/trending")  
      .then((response) => response.json())
      .then((data) => setVideos(data || []))
      .catch((error) => console.error("Error carregant els vídeos:", error));
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      <div className="card-container">
        {videos.length > 0 ? (
          videos.map((video) => (
            <Card key={video.videoId}>
              <img
                src={
                  video.videoThumbnails?.[0]?.url.startsWith("/")
                    ? `http://127.0.0.1:3000${video.videoThumbnails[0].url}`
                    : video.videoThumbnails?.[0]?.url || "fallback-image.png"
                }
                alt={video.title}
                className="card-img"
              />
              <CardContent className="card-content">
                <h2 className="card-title">{video.title}</h2>
                <p className="card-author">{video.author}</p>
                <a href={`https://www.youtube.com/watch?v=${video.videoId}`} target="_blank" rel="noopener noreferrer">
                  <Button className="card-button">Veure Video</Button>
                </a>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-center col-span-3 text-gray-500">No s'han trobat vídeos...</p>
        )}
      </div>

      {/* Floating Action Button con menú desplegable */}
      <div className="fab-container">
        {fabOpen && (
          <div className="fab-options">
            <button className="fab-button" onClick={scrollToTop}><i class="fa-solid fa-arrow-up"></i></button>
            <button className="fab-button home-button" onClick={() => navigate("/")}><i class="fa-solid fa-house"></i></button>
          </div>
        )}
        
        <button className="fab-main" onClick={() => setFabOpen(!fabOpen)}>
          <i class="fa-solid fa-bars"></i>
        </button>
      </div>
    </div>
  );
}
