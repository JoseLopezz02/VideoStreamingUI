import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "../../styles/channelPlaylists.css"; // Usa los mismos estilos de playlists

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
  if (!podcasts.length) return <p>No se encontraron podcasts.</p>;

  return (
    <div className="playlist-list-container">
      <h1>Podcasts del Canal</h1>
      <ul className="playlist-list">
        {podcasts.map((podcast) => (
          <li key={podcast.id || podcast.playlistId} className="playlist-item">
            <Link to={`/podcast/${podcast.playlistId}`} className="playlist-link">
              <img
                src={
                  podcast.videos.length > 0 && podcast.videos[0].videoThumbnails
                    ? podcast.videos[0].videoThumbnails[0].url
                    : podcast.playlistThumbnail || "fallback-image.png"
                }
                alt={podcast.title || "Imagen no disponible"}
                className="playlist-thumbnail"
                onError={(e) => (e.target.src = "fallback-image.png")}
              />
              <span className="playlist-title">🎙️ {podcast.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
