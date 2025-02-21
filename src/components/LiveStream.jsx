import React from "react";
import ReactPlayer from "react-player";

export default function LiveStream({ streamUrl }) {
  return (
    <div>
      <h2>🔴 En Directe</h2>
      <ReactPlayer
        url={`https://www.youtube.com/watch?v=${streamUrl}`}
        playing
        controls
        width="100%"
        height="500px"
      />
    </div>
  );
}