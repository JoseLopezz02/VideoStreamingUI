import React, { useState, useEffect } from "react";

export default function AuthLogin() {
    const [authToken, setAuthToken] = useState(localStorage.getItem("authToken"));
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleLogin = () => {
        setLoading(true);
        fetch("http://127.0.0.1:3000/api/v1/authorize_token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                scopes: "POST:playlists*",
                callback_url: "http://127.0.0.1:3000",
                expire: "3600"
            })
        })
        .then(async (res) => {
            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`Server Error (${res.status}): ${errorText}`);
            }
            return res.text().then((text) => (text ? JSON.parse(text) : {}));
        })
        .then((data) => {
            if (data.token) {
                localStorage.setItem("authToken", data.token);
                setAuthToken(data.token);
            } else {
                throw new Error("Failed to get token: No token received");
            }
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    };

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        setAuthToken(null);
        setPlaylists([]);
    };

    useEffect(() => {
        if (!authToken) return;

        setLoading(true);
        fetch("http://127.0.0.1:3000/api/v1/playlists", {
            method: "GET",
            headers: { Authorization: `Bearer ${authToken}` }
        })
        .then((res) => res.json())
        .then((data) => setPlaylists(data || []))
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }, [authToken]);

    return (
        <div>
            <h2>Login to Invidious</h2>

            {authToken ? (
                <div>
                    <p>✅ Logged in!</p>
                    <button onClick={handleLogout}>Logout</button>

                    <h3>Your Playlists:</h3>
                    {loading ? (
                        <p>Loading playlists...</p>
                    ) : playlists.length > 0 ? (
                        <ul>
                            {playlists.map((playlist) => (
                                <li key={playlist.playlistId}>{playlist.title}</li>
                            ))}
                        </ul>
                    ) : (
                        <p>No playlists found.</p>
                    )}
                </div>
            ) : (
                <div>
                    <button onClick={handleLogin} disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </button>
                    {error && <p style={{ color: "red" }}>⚠️ {error}</p>}
                </div>
            )}
        </div>
    );
}