import React, { useState, useEffect } from "react";

export default function AuthTokenManageSubscriptions({ channelId }) {
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setLoading(false);
      return;
    }

    fetch("http://127.0.0.1:3000/api/v1/auth/subscriptions", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const isSubscribed = data.some((sub) => sub.channelId === channelId);
        setSubscribed(isSubscribed);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al obtener suscripciones:", err);
        setLoading(false);
      });
  }, [channelId]);

  const handleSubscription = () => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    fetch(`http://127.0.0.1:3000/api/v1/auth/subscriptions/${channelId}`, {
      method: subscribed ? "DELETE" : "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.ok) {
          setSubscribed(!subscribed); // Toggle subscription state
        }
      })
      .catch((err) => console.error("Error en la suscripción:", err));
  };

  if (loading) return <p>Verificando suscripción...</p>;

  return (
    <button onClick={handleSubscription}>
      {subscribed ? "Desuscribirse" : "Suscribirse"}
    </button>
  );
}
