import React, { useState } from "react";

export default function AuthUserEditPlaylists({ playlist, onClose }) {
    const [title, setTitle] = useState(playlist.title);
    const [privacy, setPrivacy] = useState(playlist.privacy);
    const [description, setDescription] = useState(playlist.description || "") //I set as default description an empty String
    const [message, setMessage] = useState("");
    const [error, setError] = useState(null);

    const handleUpdate = async () => {
        setMessage("");
        setError(null);

        let token = localStorage.getItem("authToken");
        if (!token) {
            setError("Authentication token not found.");
            return;
        }

        try {
            const response = await fetch(`http://127.0.0.1:3000/api/v1/auth/playlists/${playlist.playlistId}`, {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ title, privacy, description }),
            });

            if (!response.ok) {
                throw new Error(`HTTP Error! Status: ${response.status}`);
            }

            setMessage("✅ Playlist updated successfully!");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="container">
            <h3>Edit Playlist</h3>
            <div>
                <label>Title:</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>
            <div>
                <label>Privacy:</label>
                <select value={privacy} onChange={(e) => setPrivacy(e.target.value)}>
                    <option value="public">Public</option>
                    <option value="unlisted">Unlisted</option>
                    <option value="private">Private</option>
                </select>
            </div>
            <div>
                <label>Description:</label> 
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>
            <button onClick={handleUpdate}>Update Playlist</button>
            {message && <p className="success">{message}</p>}
            {error && <p className="error">⚠️ {error}</p>}
            <button onClick={onClose}>Close</button>
        </div>
    );
}
