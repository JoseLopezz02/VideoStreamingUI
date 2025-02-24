import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import CardContent from "../components/CardContent";
import Button from "../components/Button";
import "../styles/trending.css";
import FloatingButton from "../components/FloatingButton";
import ComentsVideo from "./ComentsVideo";

export default function TrendingVideos() {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [fabOpen, setFabOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const navigate = useNavigate();
  const [continued, setContinued] = useState(null);
  const [streamingVideo, setStreamingVideo] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 20;

  useEffect(() => {
    fetch("http://127.0.0.1:3000/api/v1/trending")
      .then((response) => response.json())
      .then((data) => setVideos(data || []))
      .catch((error) => console.error("Error carregant els vídeos:", error));
  }, []);

  const fetchComments = (videoId, continuedToken = "") => {
    let url = `http://127.0.0.1:3000/api/v1/comments/${videoId}`;
    if (continuedToken) {
      url += `?continued=${continuedToken}`;
    }

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log("Comentarios recibidos:", data);
        setComments((prevComments) => [...prevComments, ...(data.comments || [])]);
        setContinued(data.continuation || null);
        setSelectedVideo(videoId);
        setShowComments(true);
      })
      .catch((error) => console.error("Error carregant comentaris:", error));
  };

  const closeModal = () => {
    setShowComments(false);
    setSelectedVideo(null);
    setComments([]);
    setCurrentPage(1);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleVideoClick = (videoId) => {
    navigate(`/video/${videoId}`);
  }

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
                <Button className="card-button" onClick={() => handleVideoClick(video.videoId)}>
                  Veure Video
                </Button>
                <Button className="card-button" onClick={() => fetchComments(video.videoId)}>
                  Veure Comentaris
                </Button>
                {video.isLive && (
                  <Button className="card-button live-button" onClick={() => setStreamingVideo(video.videoId)}>
                    🔴 Veure en Directe
                  </Button>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-center col-span-3 text-gray-500">
            No s'han trobat vídeos...
          </p>
        )}
      </div>

      <FloatingButton
        fabOpen={fabOpen}
        setFabOpen={setFabOpen}
        scrollToTop={scrollToTop}
      />
      <ComentsVideo
        showComments={showComments}
        comments={comments}
        closeModal={closeModal}
        fetchComments={fetchComments}
        selectedVideo={selectedVideo}
        continued={continued}
      />
    </div>
  );
}