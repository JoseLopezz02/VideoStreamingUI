import React,{ useState, useEffect } from "react";
import "../styles/requestToken.css"; 

const FRONTEND_URL = "http://localhost:5173";
const INVIDIOUS_API_URL = "http://127.0.0.1:3000";

export default function RequestToken() {
    const [authToken, setAuthToken] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get("token");

        if (token) {
            const decodedToken = decodeURIComponent(token);
            setAuthToken(decodedToken);
            localStorage.setItem("authToken", decodedToken);
            window.history.replaceState({}, document.title, FRONTEND_URL);
        } else {
            const storedToken = localStorage.getItem("authToken");
            if (storedToken) {
                setAuthToken(storedToken);
            }
        }
    }, []);

    const handleLogin = () => {
        window.location.href = `${INVIDIOUS_API_URL}/login`;
    };

    const handleAuthorize = () => {
        const expire = 86400;
        window.location.href = `${INVIDIOUS_API_URL}/authorize_token?scopes=:*&callback_url=${encodeURIComponent(FRONTEND_URL)}&expire=${expire}`;
    };

    const handleLogout = () => {
        setAuthToken(null);
        localStorage.removeItem("authToken");
    };

    return (
        <div className="container">
            <div className="auth-box">
                <h1>🔑 Invidious Authentication</h1>
                
                {authToken ? (
                    <>
                        <button onClick={handleLogout} className="button logout">Logout</button>
                        <div className="success-message">✅ Token stored for authentication.</div>
                    </>
                ) : (
                    <>
                        <button onClick={handleLogin} className="button login">Login</button>
                        <button onClick={handleAuthorize} className="button authorize">Authorize Token</button>
                    </>
                )}

                {error && <p className="error-message">⚠️ {error}</p>}
            </div>
        </div>
    );
}
