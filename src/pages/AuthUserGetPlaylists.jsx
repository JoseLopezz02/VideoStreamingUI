import React, { useState, useEffect } from "react";
import AuthUserEditPlaylists from "./AuthUserEditPlaylists";

export default function AuthUserGetPlaylists() {
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingPlaylist, setEditingPlaylist] = useState(null);

    useEffect(() => {
        const fetchPlaylists = async () => {
            let token = localStorage.getItem("authToken");
            if (!token) {
                setError("Authentication token not found.");
                setLoading(false);
                return;
            }
            
            token = decodeURIComponent(token);

            try {
                const response = await fetch("http://127.0.0.1:3000/api/v1/auth/playlists", { 
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                console.log("Raw response:", response);

                if (!response.ok) {
                    throw new Error(`HTTP Error! Status: ${response.status}`);
                }

                const text = await response.text();
                console.log("Raw JSON response:", text);

                if (!text) {
                    throw new Error("Empty response from server.");
                }

                const data = JSON.parse(text);
                setPlaylists(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPlaylists();
    }, []);

    return (
        <div className="container">
            <h3>Your Playlists:</h3>

            {loading ? (
                <p>Loading playlists...</p>
            ) : error ? (
                <p className="error">⚠️ {error}</p>
            ) : playlists.length > 0 ? (
                <ul className="playlist-list">
                    {playlists.map((playlist) => (
                        <li key={playlist.playlistId} className="playlist-item">
                            <div>
                                <strong>{playlist.title}</strong> ({playlist.privacy})
                                <button onClick={() => setEditingPlaylist(playlist)}>
                                    ✏️ Edit
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No playlists found...</p>
            )}

            {editingPlaylist && (
                <div className="edit-modal">
                    <h3>Edit Playlist</h3>
                    <AuthUserEditPlaylists
                        playlist={editingPlaylist}
                        onClose={() => setEditingPlaylist(null)}
                    />
                </div>
            )}
        </div>
    );
}
