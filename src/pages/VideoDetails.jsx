import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Button from "../components/Button";

export default function VideoDetails() {
  const { videoId } = useParams(); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 

  useEffect(() => {
    setLoading(true);
    setError(null); 

    // Aquí solo hacemos una verificación básica, ya que no vamos a mostrar detalles
    fetch(`http://127.0.0.1:3000/api/v1/videos/${videoId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("No se pudo obtener los detalles del video");
        }
        return response.json();
      })
      .then(() => {
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

  return (
    <div className="video-details-container">
      <div className="video-container">
        {/* Aquí mostramos solo el video en un iframe */}
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          title={`Video ${videoId}`}
          frameBorder="0"
          allowFullScreen
        ></iframe>
      </div>
      <h2 className=""></h2>

      <Button onClick={() => window.history.back()}>Volver</Button>
    </div>
  );
}