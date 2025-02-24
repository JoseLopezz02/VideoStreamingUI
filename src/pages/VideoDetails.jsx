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

  useEffect(() => {
    setLoading(true);
    setError(null);

    // Cargar detalles del video
    fetch(`http://127.0.0.1:3000/api/v1/videos/${videoId}`)
      .then((response) => response.json())
      .then((data) => {
        setVideo(data);
      })
      .catch(() => setError("Hubo un problema al cargar el video."))
      .finally(() => setLoading(false));

    // Cargar videos recomendados
    fetch(`http://127.0.0.1:3000/api/v1/search?q=recomendados`)
      .then((response) => response.json())
      .then((data) => {
        setRecommendedVideos(data.filter(item => item.type === "video"));
      })
      .catch(() => console.error("Error cargando recomendaciones."));
  }, [videoId]);

  if (loading) return <p className="loading-message">Cargando...</p>;
  if (error) return <p className="error-message">{error}</p>;
  if (!video) return <p className="error-message">No se encontraron detalles del video.</p>;

  return (
    <div className="video-page-container">
      {/* Contenedor del video principal */}
      <div className="video-details-container">
        <div className="video-container">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            title={video.title}
            frameBorder="0"
            allowFullScreen
          ></iframe>
        </div>

        {/* Banner del Autor */}
        <div className="author-banner" onClick={() => navigate(`/channels/${video.authorId}`)}>
          <img 
            src={video.authorThumbnails?.[0]?.url || "default-avatar.png"} 
            alt={video.author} 
            className="author-avatar"
          />
          <div>
            <h3>{video.author}</h3>
            <p>{video.subCountText || "N/A"} suscriptores</p>
          </div>
        </div>

        {/* Información del video */}
        <h2 className="video-title">{video.title}</h2>
        <p className="video-description"><strong>Descripción:</strong> {video.description}</p>
        <p className="video-meta"><strong>Fecha de publicación:</strong> {video.publishedText}</p>
        <p className="video-meta"><strong>Duración:</strong> {video.lengthSeconds} segundos</p>
        <p className="video-meta"><strong>Visualizaciones:</strong> {video.viewCount.toLocaleString()} vistas</p>
        <p className="video-meta"><strong>Likes:</strong> {video.likeCount.toLocaleString()}</p>

        <Button onClick={() => window.history.back()}>
          Volver
        </Button>
      </div>

      {/* Sección de videos recomendados */}
      <div className="recommended-videos-container">
        <h3 className="recommended-title">Videos recomendados</h3>
        {recommendedVideos.length > 0 ? (
          <ul className="recommended-videos-list">
            {recommendedVideos.map((vid) => (
              <li key={vid.videoId} className="recommended-video" onClick={() => navigate(`/video/${vid.videoId}`)}>
                <img 
                  src={vid.videoThumbnails?.[0]?.url || "default-thumbnail.jpg"} 
                  alt={vid.title} 
                  className="thumbnail" 
                />
                <div className="video-info">
                  <p className="title">{vid.title}</p>
                  <p className="author">{vid.author}</p>
                  <p className="views">{vid.viewCount.toLocaleString()} vistas</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-recommendations">No hay videos recomendados disponibles.</p>
        )}
      </div>
   
      <FloatingButton />
    </div>
  );
}
