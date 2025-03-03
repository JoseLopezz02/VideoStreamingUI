import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Button from "../../components/Button";
import "../../styles/channelResult.css";
import { useNavigate } from "react-router-dom";
import FloatingButton from "../../components/FloatingButton";
import AuthTokenManageSubscriptions from "../AuthTokenManageSubscriptions"; 

export default function ChannelContent() {
  const { channelId } = useParams();
  const [channelData, setChannelData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://127.0.0.1:3000/api/v1/channels/${channelId}`)
      .then((response) => response.json())
      .then((data) => {
        setChannelData(data || {});
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error carregant el canal:", error);
        setLoading(false);
      });
  }, [channelId]);

  if (loading) return <p>Loading channel...</p>;
  if (!channelData || Object.keys(channelData).length === 0) return <p>No channel found.</p>;

  return (
    <div className="channel-container">
      <div className="channel-header">
        <img
          src={channelData.authorThumbnails?.[0]?.url || "default-avatar.png"}
          alt={channelData.author}
          className="channel-avatar"
        />
        <div>
          <h1>{channelData.author || "Unknown Author"}</h1>
          <p>{channelData.description || "No description available"}</p>
          <p><strong>Subscribers:</strong> {channelData.subCount?.toLocaleString() || "N/A"}</p>
        </div>
      </div>

      <div className="channel-actions">
        <Button onClick={() => navigate(`/channel/${channelId}/videos`)}>📺 Videos del canal</Button>
        <Button onClick={() => navigate(`/channel/${channelId}/podcasts`)}>🎙️ Podcast del canal</Button>
        <Button onClick={() => navigate(`/channel/${channelId}/playlists`)}>📂 Playlist del canal</Button>

        <AuthTokenManageSubscriptions channelId={channelId} />
      </div>

      {channelData.relatedChannels?.length > 0 && (
        <div className="related-channels">
          <h2>Related Channels</h2>
          <ul>
            {channelData.relatedChannels.map((related) => (
              <li key={related.authorId}>
                <a href={`https://www.youtube.com/channel/${related.authorId}`} target="_blank" rel="noopener noreferrer">
                  {related.author}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      <FloatingButton />
    </div>
  );
}
