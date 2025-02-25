import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/playlistPage.css";

export default function PlaylistPage() {
  const { playlistId } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://127.0.0.1:3000/api/v1/playlists/${playlistId}`)
      .then((response) => response.json())
      .then((data) => {
        setPlaylist(data);
        if (data.videos && data.videos.length > 0) {
          setSelectedVideo(data.videos[0]);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error cargando la playlist:", error);
        setLoading(false);
      });
  }, [playlistId]);

  const handleVideoSelect = (video) => {
    setSelectedVideo(video);
  };

  if (loading) return <p>Cargando playlist...</p>;
  if (!playlist || !playlist.videos || playlist.videos.length === 0) return <p>No hay videos en esta playlist.</p>;

  return (
    <div className="playlist-page">
      {/* Video Principal */}
      <div className="video-player">
        <h2>{selectedVideo.title}</h2>
        <iframe
          src={`https://www.youtube.com/embed/${selectedVideo.videoId}`}
          title={selectedVideo.title}
          allowFullScreen
        ></iframe>
        <p className="video-author">Autor: {selectedVideo.author}</p>
      </div>

      {/* Lista de Reproducción */}
      <div className="playlist-sidebar">
        <h3>Lista de reproducción</h3>
        <ul>
          {playlist.videos.map((video) => (
            <li
              key={video.videoId}
              className={`playlist-video-item ${video.videoId === selectedVideo.videoId ? "active" : ""}`}
              onClick={() => handleVideoSelect(video)}
            >
              <img
                src={
                  video.videoThumbnails?.[0]?.url.startsWith("/")
                    ? `http://127.0.0.1:3000${video.videoThumbnails[0].url}`
                    : video.videoThumbnails?.[0]?.url || "fallback-image.png"
                }
                alt={video.title}
              />
              <div className="playlist-video-info">
                <p>{video.title}</p>
                <span>{video.author}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
