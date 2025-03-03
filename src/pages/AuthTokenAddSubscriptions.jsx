import React, { useState } from "react";

export default function AuthTokenAddSubscriptions({ channelId, onUpdate }) {
const [subscribed, setSubscribed] = useState(false);

const handleSubscribe = () => {
  const token = localStorage.getItem("token");
  if (!token) return;

  fetch(`http://127.0.0.1:3000/api/v1/auth/subscriptions/${channelId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      if (res.ok) {
        setSubscribed(true);
        onUpdate();
      }
    })
    .catch((err) => console.error("Error al suscribirse:", err));
};

return (
  <button onClick={handleSubscribe} disabled={subscribed}>
    {subscribed ? "Suscrito" : "Suscribirse"}
  </button>
);
}