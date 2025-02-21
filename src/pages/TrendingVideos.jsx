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
  const [streamingVideo, setStreamingVideo] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 20;

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
        setCurrentPage(1);
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

  const lastCommentIndex = currentPage * commentsPerPage;
  const firstCommentIndex = lastCommentIndex - commentsPerPage;
  const currentComments = comments.slice(firstCommentIndex, lastCommentIndex);

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

      {streamingVideo && (
        <div className="modal">
          <div className="modal-content">
            <h2>🔴 En Directe</h2>
            <ReactPlayer
              url={`https://www.youtube.com/watch?v=${streamingVideo}`}
              playing
              controls
              width="100%"
              height="500px"
            />
            <Button onClick={closeStream}>Tancar</Button>
          </div>
        </div>
      )}
      
      {showComments && (
        <div className="modal">
          <div className="modal-content">
            <h2>Comentaris ({comments.length})</h2>
            
            {/* Contenedor con scroll para los comentarios */}
            <div className="comments-container">
              {currentComments.length > 0 ? (
                currentComments.map((comment, index) => (
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

            <div className="pagination">
              <Button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Anterior
              </Button>
              <span>
                Pàgina {currentPage} de {Math.max(1, Math.ceil(comments.length / commentsPerPage))}
              </span>
              <Button
                onClick={() =>
                  setCurrentPage((prev) => (lastCommentIndex < comments.length ? prev + 1 : prev))
                }
                disabled={lastCommentIndex >= comments.length}>
                Següent
              </Button>
            </div>


            <Button onClick={closeModal}>Tancar</Button>
            </div>
          </div>
        )}
    </div>
  );
}