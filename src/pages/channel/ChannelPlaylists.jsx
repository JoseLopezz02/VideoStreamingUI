import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "../../styles/channelPlaylists.css";

export default function ChannelPlaylists() {
  const { channelId } = useParams();
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://127.0.0.1:3000/api/v1/channels/${channelId}/playlists`)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const text = await response.text();
        if (!text) {
          throw new Error("Empty response body");
        }
        return JSON.parse(text);
      })
      .then((data) => {
        console.log("API Response:", data);
        setPlaylists(data && Array.isArray(data.playlists) ? data.playlists : []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error cargando las playlists:", error);
        setPlaylists([]);
        setLoading(false);
      });
  }, [channelId]);

  if (loading) return <p>Cargando playlists...</p>;
  if (!playlists.length) return <p>No se encontraron playlists.</p>;

  return (
    <div className="playlist-list-container">
      <h1>Playlists del Canal</h1>
      <ul className="playlist-list">
        {playlists.map((playlist) => (
          <li key={playlist.id || playlist.playlistId} className="playlist-item">
            <Link to={`/playlist/${playlist.playlistId}`} className="playlist-link">
              <img
                src={
                  playlist.videos.length > 0 && playlist.videos[0].videoThumbnails
                    ? playlist.videos[0].videoThumbnails[0].url
                    : playlist.playlistThumbnail || "fallback-image.png"
                }
                alt={playlist.title || "Imagen no disponible"}
                className="playlist-thumbnail"
                onError={(e) => (e.target.src = "fallback-image.png")}
              />
              <span className="playlist-title">📂 {playlist.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
