import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Card from "../../components/Card";
import CardContent from "../../components/CardContent";

export default function ChannelVideos() {
    const { channelId } = useParams();
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`http://127.0.0.1:3000/api/v1/channels/${channelId}/videos`)
            .then((response) => response.json())
            .then((data) => {
                console.log("API Response:", data); // Debugging: Check what is returned
                if (Array.isArray(data)) {
                    setVideos(data);
                } else if (data && data.videos && Array.isArray(data.videos)) {
                    setVideos(data.videos);
                } else {
                    setVideos([]); // Ensure we set an empty array if data is not in expected format
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error carregant els vídeos:", error);
                setLoading(false);
            });
    }, [channelId]);

    if (loading) return <p>Loading videos...</p>;
    if (!Array.isArray(videos) || videos.length === 0) return <p>No videos found.</p>;

    return (
        <Card>
            <h1>Videos of the Channel</h1>
            <CardContent>
                <ul>
                    {videos.map((video) => (
                        <li key={video.videoId}>{video.title}</li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
}
