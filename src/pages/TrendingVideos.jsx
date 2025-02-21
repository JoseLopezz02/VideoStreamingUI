import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import CardContent from "../components/CardContent";
import Button from "../components/Button";
import "../styles/trending.css";

export default function TrendingVideos() {
  const [videos, setVideos] = useState([]);
  const [fabOpen, setFabOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://127.0.0.1:3000/api/v1/trending")
      .then((response) => response.json())
      .then((data) => setVideos(data || []))
      .catch((error) => console.error("Error carregant els vídeos:", error));
  }, []);

  const fetchComments = (videoId) => {
    fetch(`http://127.0.0.1:3000/api/v1/comments/${videoId}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Comentarios recibidos:", data);
        setComments(data.comments || []);
        setSelectedVideo(videoId);
        setShowComments(true);
      })
      .catch((error) => console.error("Error carregant comentaris:", error));
  };

  const closeModal = () => {
    setShowComments(false);
    setSelectedVideo(null);
    setComments([]);
  };

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
                <a
                  href={`https://www.youtube.com/watch?v=${video.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="card-button">Veure Video</Button>
                </a>
                <Button className="card-button" onClick={() => fetchComments(video.videoId)}>
                  Veure Comentaris
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-center col-span-3 text-gray-500">
            No s'han trobat vídeos...
          </p>
        )}
      </div>

      {/* Floating Action Button con menú desplegable */}
      <div className="fab-container">
        {fabOpen && (
          <div className="fab-options">
            <button className="fab-button" onClick={scrollToTop}>
              <i class="fa-solid fa-arrow-up"></i>
            </button>
            <button
              className="fab-button home-button"
              onClick={() => navigate("/")}
            >
              <i class="fa-solid fa-house"></i>
            </button>
          </div>
        )}

        <button className="fab-main" onClick={() => setFabOpen(!fabOpen)}>
          <i class="fa-solid fa-bars"></i>
        </button>
      </div>
      
      {showComments && (
        <div className="modal">
          <div className="modal-content">
            <h2>Comentaris ({comments.length})</h2>
            
            {/* Contenedor con scroll para los comentarios */}
            <div className="comments-container">
              {comments.length > 0 ? (
                comments.map((comment, index) => (
                  <div key={index} className="comment">
                    <img
                      src={comment.authorThumbnails?.[0]?.url || "default-avatar.png"}
                      alt={comment.author}
                      className="comment-avatar"
                    />
                    <div className="comment-body">
                      <a 
                        href={`https://www.youtube.com${comment.authorUrl}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="comment-author"
                      >
                        {comment.author}
                      </a>
                      <p className="comment-text">{comment.content || "Comentari sense text"}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p>No hi ha comentaris disponibles</p>
              )}
            </div>

            <Button onClick={closeModal}>Tancar</Button>
            </div>
          </div>
        )}
    </div>
  );
}