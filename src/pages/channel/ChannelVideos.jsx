import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "../../styles/channelPlaylists.css";

export default function ChannelVideos() {
    const { channelId } = useParams();
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`http://127.0.0.1:3000/api/v1/channels/${channelId}/videos`)
            .then(async (response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                console.log("API Response:", data);
                setVideos(Array.isArray(data) ? data : data.videos || []);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error cargando los videos:", error);
                setVideos([]);
                setLoading(false);
            });
    }, [channelId]);

    if (loading) return <p>Loading videos...</p>;
    if (!videos.length) return <p>No videos found.</p>;

    return (
        <div className="playlist-list-container">
            <h1>Channel Videos</h1>
            <ul className="playlist-list">
                {videos.map((video) => (
                    <li key={video.videoId} className="playlist-item">
                        <Link to={`/video/${video.videoId}`} className="playlist-link">
                            <img
                                src={
                                    video.videoThumbnails?.[0]?.url?.startsWith("/")
                                        ? `http://127.0.0.1:3000${video.videoThumbnails[0].url}`
                                        : video.videoThumbnails?.[0]?.url || "fallback-image.png"
                                }
                                alt={video.title || "Imagen no disponible"}
                                className="playlist-thumbnail"
                                onError={(e) => (e.target.src = "fallback-image.png")}
                            />
                            <span className="playlist-title">🎬 {video.title}</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
