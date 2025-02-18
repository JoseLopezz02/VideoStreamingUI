import React, { useEffect, useState } from "react";
import Button from "../components/Button";
import Card from "../components/Card";
import CardContent from "../components/CardContent";

export default function PopularVideos() {
  const [popularVideos, setPopularVideos] = useState([]);
  const [selectedVideo, setPopularVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    fetch("http://127.0.0.1:3000/api/v1/popular")
      .then((response) => response.json())
      .then((data) => setPopularVideos(data || []))
      .catch((error) => console.error("Error carregant els vídeos:", error));
  }, []);

  const fetchComments = (videoId) => {
    fetch(`http://127.0.0.1:3000/api/v1/comments/${videoId}`)
      .then((response) => response.json())
      .then((data) => {
        setComments(data || []);
        setShowComments(true);
      })
      .catch((error) => console.error("Error carregant comentaris:", error));
  };

  return (
    <div>
      {popularVideos.length > 0 ? (
        popularVideos.map((video) => {
          <Card key={video.videoId}>
            <img
              src={
                video.videoThumbnails?.[0]?.url.startsWith("/")
                  ? `http://127.0.0.1:3000${video.videoThumbnails[0].url}`
                  : video.videoThumbnails?.[0]?.url || "fallback-image.png"
              }
              alt={video.title}
              className="w-full h-48 object-cover rounded-t-lg"
            />
            <CardContent>
              <h2 className="text-lg font-bold">{video.title}</h2>
              <p className="text-sm text-gray-500">{video.author}</p>
              <a
                href={`https://www.youtube.com/watch?v=${video.videoId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button>Veure Video</Button>
              </a>
            </CardContent>
          </Card>;
        })
      ) : (
        <p className="text-center col-span-3 text-gray-500">
          No s'han trobat vídeos...
        </p>
      )}

      {showComments && (
        <div className="modal">
          <div className="modal-content">
            <h2>Comentaris</h2>
            <ul>
              {comments.map((comment, index) => (
                <li key={index} className="comment">{comment.text}</li>
              ))}
            </ul>
            <Button onClick={() => setShowComments(false)}>Tancar</Button>
          </div>
        </div>
      )}

    </div>
  );
}
