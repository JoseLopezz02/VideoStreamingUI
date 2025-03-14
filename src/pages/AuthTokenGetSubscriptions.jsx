import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthTokenGetSubscriptions() {
  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState([]);

  useEffect(() => {
    let token = localStorage.getItem("authToken");

    if (!token) {
      navigate("/");
      return;
    }

    fetch("http://127.0.0.1:3000/api/v1/auth/subscriptions", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status === 401) {
          localStorage.removeItem("token");
          navigate("/");
          return;
        }
        return res.json();
      })
      .then((data) => setSubscriptions(data))
      .catch(() => navigate("/"));
  }, [navigate]);

  return (
    <div className="playlist-list-container">
      <h2>Mis suscripciones</h2>
      <ul className="playlist-list">
        {subscriptions.length > 0 ? (
          subscriptions.map((sub) => (
            <li key={sub.channelId} className="playlist-item">
              {sub.channelName}
            </li>
          ))
        ) : (
          <p>No tienes suscripciones.</p>
        )}
      </ul>
    </div>
  );
}
