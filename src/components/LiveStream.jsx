import React from "react";
import ReactPlayer from "react-player";
import CardContent from "./CardContent";

export default function LiveStream({ streamUrl }) {
  return (
    <CardContent>
      <h2>🔴 En Directe</h2>
      <ReactPlayer
        url={`https://www.youtube.com/watch?v=${streamUrl}`}
        playing
        controls
        width="100%"
        height="500px"
      />
    </CardContent>
  );
}