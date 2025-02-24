import React from "react";
import LiveStream from "../components/LiveStream";

export default function StreamingVideo({streamingVideo}) {
  if (!streamingVideo) return null; // Don't render if no streaming video

  return (
    <LiveStream />
  );
}
