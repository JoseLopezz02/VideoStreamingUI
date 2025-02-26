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
          setPodcasts([]);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error carregant els podcasts:", error);
        setPodcasts([]);
        setLoading(false);
      });
  }, [channelId]);

  if (loading) return <p>Loading podcasts...</p>;
  if (!Array.isArray(podcasts) || podcasts.length === 0) return <p>No podcasts found.</p>;

  return (
    <div>
      <h1>Podcasts of the Channel</h1>
      <ul>
        {podcasts.map((podcast, index) => (
          <li key={podcast.playlistId || index}>{podcast.title || "Untitled Podcast"}</li>
        ))}
      </ul>
    </div>
  );
}
