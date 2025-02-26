import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Card from "../../components/Card";
import CardContent from "../../components/CardContent";
import "../../styles/videoListChannel.css";

export default function ChannelVideos() {
    const { channelId } = useParams();
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`http://127.0.0.1:3000/api/v1/channels/${channelId}/videos`)
            .then((response) => response.json())
            .then((data) => {
                console.log("API Response:", data);
                setVideos(Array.isArray(data) ? data : data.videos || []);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error loading videos:", error);
                setLoading(false);
            });
    }, [channelId]);

    if (loading) return <p>Loading videos...</p>;
    if (!videos.length) return <p>No videos found.</p>;

    return (
        <Card className="video-list-container">
            <h1>Videos of the Channel</h1>
            <CardContent>
                <ul className="video-list">
                    {videos.map((video) => (
                        <li key={video.videoId} className="video-item">
                            <Link 
                                to={`/video/${video.videoId}`} 
                                className="video-link"
                            >
                                🎬 {video.title}
                            </Link>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
}
