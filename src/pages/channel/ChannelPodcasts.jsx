import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ChannelPodcasts() {
  const { channelId } = useParams();
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://127.0.0.1:3000/api/v1/channels/${channelId}/podcasts`)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("API Response:", data);

        if (data && Array.isArray(data.playlists)) {
          setPodcasts(data.playlists); 
        } else {
          setPodcasts([]); 
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error cargando los podcasts:", error);
        setPodcasts([]);
        setLoading(false);
      });
  }, [channelId]);

  if (loading) return <p>Cargando podcasts...</p>;
  if (!Array.isArray(podcasts) || podcasts.length === 0) return <p>No se encontraron podcasts.</p>;

  return (
    <div>
      <h1>Podcasts del Canal</h1>
      <ul>
        {podcasts.map((podcast, index) => {
          // Obtener la primera miniatura del primer video del podcast
          const firstThumbnail =
            podcast.videos?.[0]?.videoThumbnails?.[0]?.url || "fallback-image.png";

          return (
            <li key={podcast.playlistId || index}>
              <img
                src={firstThumbnail.startsWith("/") ? `http://127.0.0.1:3000${firstThumbnail}` : firstThumbnail}
                alt={podcast.title || "Podcast sin título"}
                style={{ width: "150px", height: "150px", objectFit: "cover", borderRadius: "8px" }}
                onError={(e) => (e.target.src = "fallback-image.png")}
              />
              <p>{podcast.title || "Sin título"}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
