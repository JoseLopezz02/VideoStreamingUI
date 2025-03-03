import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthTokenGetSubscriptions() {
  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

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
    <div>
      <h2>Mis suscripciones</h2>
      <ul>
        {subscriptions.length > 0 ? (
          subscriptions.map((sub) => (
            <li key={sub.channelId}>{sub.channelName}</li>
          ))
        ) : (
          <p>No tienes suscripciones.</p>
        )}
      </ul>
    </div>
  );
}
