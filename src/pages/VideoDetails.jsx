import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Button from "../components/Button";

export default function VideoDetails() {
  const { videoId } = useParams(); 
  const [video, setVideo] = useState(null); // Estado para guardar los detalles del video
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
        console.log("Datos del video:", data); // Verificar la respuesta en la consola
        setVideo(data); // Guardar los detalles del video en el estado
      })
      .catch((error) => {
        console.error("Error cargando los detalles del video:", error);
        setError("Hubo un problema al cargar el video.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [videoId]);

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  // Verificar si video es null antes de intentar acceder a sus propiedades
  if (!video) {
    return <p>No se encontraron detalles del video.</p>;
  }

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
      
      {/* Detalles del video */}
      <h2>{video.title}</h2>
      <p><strong>Autor:</strong> {video.author}</p>
      <p><strong>Descripción:</strong> {video.description}</p>
      <p><strong>Fecha de publicación:</strong> {video.publishedText}</p>
      <p><strong>Duración:</strong> {video.lengthSeconds} segundos</p>
      <p><strong>Visualizaciones:</strong> {video.viewCount.toLocaleString()} vistas</p>
      <p><strong>Likes:</strong> {video.likeCount.toLocaleString()}</p>

      {/* Subtítulos (si están disponibles) */}
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
