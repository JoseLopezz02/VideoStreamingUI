import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import "../styles/videoDetails.css"; // Asegúrate de agregar estilos para el banner

export default function VideoDetails() {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(`http://127.0.0.1:3000/api/v1/videos/${videoId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("No se pudo obtener los detalles del video");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Datos del video:", data); 
        setVideo(data);
      })
      .catch((error) => {
        console.error("Error cargando los detalles del video:", error);
        setError("Hubo un problema al cargar el video.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [videoId]);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;
  if (!video) return <p>No se encontraron detalles del video.</p>;

  return (
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

      <h2>{video.title}</h2>
      <p><strong>Descripción:</strong> {video.description}</p>
      <p><strong>Fecha de publicación:</strong> {video.publishedText}</p>
      <p><strong>Duración:</strong> {video.lengthSeconds} segundos</p>
      <p><strong>Visualizaciones:</strong> {video.viewCount.toLocaleString()} vistas</p>
      <p><strong>Likes:</strong> {video.likeCount.toLocaleString()}</p>

      {video.captions && video.captions.length > 0 ? (
        <div>
          <h3>Subtítulos disponibles:</h3>
          <ul>
            {video.captions.map((caption, index) => (
              <li key={index}>
                <a href={caption.url} target="_blank" rel="noopener noreferrer">
                  {caption.label} ({caption.language_code})
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No hay subtítulos disponibles.</p>
      )}

      <Button onClick={() => window.history.back()}>Volver</Button>
    </div>
  );
}
