import React, { useState, useEffect } from "react";

export default function AuthUserGetPlaylists() {
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPlaylists = async () => {
            const token = localStorage.getItem("authToken"); 
            if (!token) {
                setError("Authentication token not found.");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch("http://127.0.0.1:3000/api/v1/playlists", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP Error! Status: ${response.status}`);
                }

                const data = await response.json();
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
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No playlists found...</p>
            )}
        </div>
    );
}