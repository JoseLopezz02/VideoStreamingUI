import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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
        console.log("API Response:", data); // Debugging: Check API response
        if (data && Array.isArray(data.playlists)) {
          setPlaylists(data.playlists);
        } else {
          setPlaylists([]);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error carregant les playlists:", error);
        setPlaylists([]);
        setLoading(false);
      });
  }, [channelId]);

  if (loading) return <p>Loading playlists...</p>;
  if (!Array.isArray(playlists) || playlists.length === 0) return <p>No playlists found.</p>;

  return (
    <div>
      <h1>Playlists of the Channel</h1>
      <ul>
        {playlists.map((playlist) => (
          <li key={playlist.id || playlist.playlistId}>{playlist.title}</li>
        ))}
      </ul>
    </div>
  );
}
