import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import CardContent from "../components/CardContent";
import Button from "../components/Button";

export default function TrendingVideos() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    fetch("https://vid.puffyan.us/api/v1/trending")
      .then((response) => response.json())
      .then((data) => setVideos(data || []))
      .catch((error) => console.error("Error carregant els vídeos:", error));
  }, []);

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {videos.length > 0 ? (
        videos.map((video) => (
          <Card key={video.videoId}>
            <img
              src={video.videoThumbnails[3].url}
              alt={video.title}
              className="w-full h-48 object-cover rounded-t-lg"
            />
            <CardContent>
              <h2 className="text-lg font-bold">{video.title}</h2>
              <p className="text-sm text-gray-500">{video.author}</p>
              <a href={`https://www.youtube.com/watch?v=${video.videoId}`} target="_blank" rel="noopener noreferrer">
                <Button>Veure Video</Button>
              </a>
            </CardContent>
          </Card>
        ))
      ) : (
        <p className="text-center col-span-3 text-gray-500">No s'han trobat vídeos...</p>
      )}
    </div>
  );
}
