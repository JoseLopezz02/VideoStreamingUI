import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FloatingButton from "../components/FloatingButton"; 
import "../styles/playlistPage.css"; 

export default function PodcastPage() {
  const { playlistId } = useParams(); 
  const [podcast, setPodcast] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const [selectedVideo, setSelectedVideo] = useState(null); 

  useEffect(() => {
    fetch(`http://127.0.0.1:3000/api/v1/playlists/${playlistId}`)
      .then((response) => response.json())
      .then((data) => {
        setPodcast(data); 
        if (data.videos && data.videos.length > 0) {
          setSelectedVideo(data.videos[0]); 
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error cargando el podcast:", error);
        setLoading(false); 
      });
  }, [playlistId]); 

  const handleVideoSelect = (video) => {
    setSelectedVideo(video); 
  };

  if (loading) return <p>Loading podcast...</p>;
  if (!podcast || !podcast.videos || podcast.videos.length === 0) return <p>No hay videos en este podcast.</p>;

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

      {/* Lista de Videos del Podcast */}
      <div className="playlist-sidebar">
        <h3>Lista de Videos</h3>
        <ul>
          {podcast.videos.map((video) => (
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

      {/* Componente Flotante */}
      <FloatingButton />
    </div>
  );
}
