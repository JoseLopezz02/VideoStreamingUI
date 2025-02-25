import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/home.css";
import SearchBar from "./SearchBar";
import Card from "../components/Card";
import CardContent from "../components/CardContent";
import Button from "../components/Button";
import FloatingButton from "../components/FloatingButton";
import ComentsVideo from "./ComentsVideo";

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 20;

  useEffect(() => {
    fetch("http://127.0.0.1:3000/api/v1/trending")
      .then((response) => response.json())
      .then((data) => setVideos(data || []))
      .catch((error) => console.error("Error cargando los videos:", error));
  }, []);

  const fetchComments = (videoId) => {
    fetch(`http://127.0.0.1:3000/api/v1/comments/${videoId}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Comentarios recibidos:", data);
        setComments(data.comments || []);
        setSelectedVideo(videoId);
        setShowComments(true);
        setCurrentPage(1);
      })
      .catch((error) => console.error("Error cargando comentarios:", error));
  };

  const closeModal = () => {
    setShowComments(false);
    setSelectedVideo(null);
    setComments([]);
    setCurrentPage(1);
  };

  const handleVideoClick = (videoId) => {
    navigate(`/video/${videoId}`);
  };

  return (
    <div className="home-container">
      <SearchBar searchType="video" />

      {/* Sección de Trending Videos directamente en Home */}
      <h2 className="trending-title">Trending Videos</h2>
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
                <Button className="card-button" onClick={() => handleVideoClick(video.videoId)}>
                  Ver Video
                </Button>
                <Button className="card-button" onClick={() => fetchComments(video.videoId)}>
                  Ver Comentarios
                </Button>
                {video.isLive && (
                  <Button className="card-button live-button" onClick={() => setSelectedVideo(video.videoId)}>
                    🔴 Ver en Directo
                  </Button>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-center col-span-3 text-gray-500">No se han encontrado videos...</p>
        )}
      </div>

      <FloatingButton />
      <ComentsVideo
        showComments={showComments}
        comments={comments}
        currentPage={currentPage}
        commentsPerPage={commentsPerPage}
        setCurrentPage={setCurrentPage}
        closeModal={closeModal}
      />
    </div>
  );
}
