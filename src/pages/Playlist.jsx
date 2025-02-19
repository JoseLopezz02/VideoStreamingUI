import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import CardContent from "../components/CardContent";
import Button from "../components/Button";
import "../styles/trending.css";

export default function Playlist() {
  const [playlistId, setPlaylistId] = useState("");
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchPlaylistVideos = async () => {
    if (!playlistId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://127.0.0.1:3000/api/v1/playlists/${playlistId}`);
      const data = await response.json();
      setVideos(data.videos || []);
    } catch (err) {
      setError("No se pudo obtener la playlist. Verifica el ID e inténtalo nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <input
        type="text"
        value={playlistId}
        onChange={(e) => setPlaylistId(e.target.value)}
        placeholder="Ingrese el ID de la playlist..."
        className="w-3/4 p-3 border rounded-lg shadow-md text-lg"
      />
      <button
        onClick={fetchPlaylistVideos}
        className="mt-4 p-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600"
      >
        Cargar Videos
      </button>
      {loading && <p className="mt-4">Cargando...</p>}
      {error && <p className="mt-4 text-red-500">{error}</p>}
      <div className="mt-6 w-full max-w-3xl">
        {videos.map((video) => (
          <Card key={video.videoId}>
            <img
              src={
                video.videoThumbnails?.[0]?.url.startsWith("/")
                  ? `http://127.0.0.1:3000${video.videoThumbnails[0].url}`
                  : video.videoThumbnails?.[0]?.url || "fallback-image.png"
              }
              alt={video.title}
              className="w-32 h-20 rounded-md"
            />
            <CardContent>
              <h3 className="text-lg font-bold">{video.title}</h3>
              <p className="text-sm text-gray-600">{video.author}</p>
              <a
                href={`https://www.youtube.com/watch?v=${video.videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 mt-2 inline-block"
              >
                Ver en YouTube
              </a>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}