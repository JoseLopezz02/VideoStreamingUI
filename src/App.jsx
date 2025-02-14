import React, { useEffect, useState } from "react";
import './index.css';

// Component Card
function Card({ children }) {
  return <div className="p-4 border rounded-lg shadow">{children}</div>;
}

function CardContent({ children }) {
  return <div className="mt-2">{children}</div>;
}

// Component Button
function Button({ children, ...props }) {
  return (
    <button className="px-4 py-2 bg-blue-500 text-white rounded" {...props}>
      {children}
    </button>
  );
}

export default function App() {
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
