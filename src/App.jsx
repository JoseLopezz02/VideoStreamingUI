import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import SearchResults from "./pages/SearchResults";
import VideoDetails from "./pages/VideoDetails";
import ChannelContent from "./pages/channel/ChannelContent";
import ChannelVideos from "./pages/channel/ChannelVideos";
import ChannelPlaylists from "./pages/channel/ChannelPlaylists";
import ChannelPodcasts from "./pages/channel/ChannelPodcasts";
import PodcastPage from "./pages/PodcastPage";
import PlaylistPage from "./pages/PlaylistPage";

export default function App() {
  return (
    <Router>
      <div className="p-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/video/:videoId" element={<VideoDetails />} />
          <Route path="/channels/:channelId" element={<ChannelContent />} />
          <Route path="/channel/:channelId/videos" element={<ChannelVideos />} />
          <Route path="/channel/:channelId/podcasts" element={<ChannelPodcasts />} />
          <Route path="/channel/:channelId/playlists" element={<ChannelPlaylists />} />
          <Route path="/podcast/:playlistId" element={<PodcastPage />} />
          <Route path="/playlist/:playlistId" element={<PlaylistPage />} /> 
        </Routes>
      </div>
    </Router>
  );
}
