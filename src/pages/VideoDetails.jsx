import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import "../styles/videoDetails.css";
import FloatingButton from "../components/FloatingButton";

export default function VideoDetails() {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [recommendedVideos, setRecommendedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [continued, setContinued] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    // Cargar detalles del video y videos recomendados
    fetch(`http://127.0.0.1:3000/api/v1/videos/${videoId}`)
      .then((response) => response.json())
      .then((data) => {
        setVideo(data);
        setRecommendedVideos(data.recommendedVideos || []);
      })
      .catch(() => setError("Hubo un problema al cargar el video."))
      .finally(() => setLoading(false));

    // Cargar primeros 40 comentarios del video
    fetch(`http://127.0.0.1:3000/api/v1/comments/${videoId}?limit=40`)
      .then((response) => response.json())
      .then((data) => {
        setComments(data.comments || []);
        setContinued(data.continued || null);
      })
      .catch(() => setError("Hubo un problema al cargar los comentarios."));
  }, [videoId]);

  const loadMoreComments = () => {
    if (!continued) return;

    fetch(`http://127.0.0.1:3000/api/v1/comments/${videoId}?continued=${continued}`)
      .then((response) => response.json())
      .then((data) => {
        setComments((prevComments) => [...prevComments, ...(data.comments || [])]);
        setContinued(data.continued || null);
      })
      .catch(() => setError("Hubo un problema al cargar más comentarios."));
  };

  if (loading) return <p className="loading-message">Loading...</p>;
  if (error) return <p className="error-message">{error}</p>;
  if (!video) return <p className="error-message">No video details found.</p>;

  return (
    <div className="video-page-container">
      <div className="video-content">
        <div className="video-details-container">
          <div className="video-container">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              title={video.title}
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </div>

          <div className="author-banner" onClick={() => navigate(`/channels/${video.authorId}`)}>
            <img
              src={video.authorThumbnails?.[0]?.url || "default-avatar.png"}
              alt={video.author}
              className="author-avatar"
            />
            <div>
              <h3>{video.author}</h3>
              <p>{video.subCountText || "N/A"} subscribers</p>
            </div>
          </div>

          <h2 className="video-title">{video.title}</h2>
          <p className="video-description"><strong>Description:</strong> {video.description}</p>
          <p className="video-meta"><strong>Published:</strong> {video.publishedText}</p>
          <p className="video-meta"><strong>Duration:</strong> {video.lengthSeconds} seconds</p>
          <p className="video-meta"><strong>Views:</strong> {video.viewCount?.toLocaleString() || "0"} vistas</p>
          <p className="video-meta"><strong>Likes:</strong> {video.likeCount?.toLocaleString() || "0"}</p>

          <Button onClick={() => window.history.back()}>Volver</Button>
        </div>

        <div className="comments-section">
          <h3>Comentarios</h3>
          {comments.length > 0 ? (
            <ul className="comments-list">
              {comments.map((comment, index) => (
                <li key={index} className="comment-item" onClick={() => navigate(`/user/${comment.authorId}`)}>
                  <p><strong>{comment.author}:</strong> {comment.content}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No hay comentarios disponibles.</p>
          )}
          {continued !== null && (
            <Button onClick={loadMoreComments} className="load-more-comments">
              Cargar más comentarios
            </Button>
          )}
        </div>
      </div>

      <div className="recommended-videos-container">
        <h3 className="recommended-title">Recommended Videos</h3>
        {recommendedVideos.length > 0 ? (
          <ul className="recommended-videos-list">
            {recommendedVideos.map((vid) => (
              <li key={vid.videoId} className="recommended-video" onClick={() => navigate(`/video/${vid.videoId}`)}>
                <img
                  src={
                    vid.videoThumbnails?.[0]?.url?.startsWith("/")
                      ? `http://127.0.0.1:3000${vid.videoThumbnails[0].url}`
                      : vid.videoThumbnails?.[0]?.url || "default-thumbnail.jpg"
                  }
                  alt={vid.title}
                  className="thumbnail"
                />
                <div className="video-info">
                  <p className="title">{vid.title}</p>
                  <p className="author">{vid.author}</p>
                  <p className="views">{vid.viewCount?.toLocaleString() || "0"} views</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-recommendations">No recommended videos available.</p>
        )}
      </div>

      <FloatingButton />
    </div>
  );
}
