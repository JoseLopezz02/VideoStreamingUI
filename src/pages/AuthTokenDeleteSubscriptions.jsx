import React from "react";

export default function AuthTokenDeleteSubscriptions({ channelId, onUpdate }) {
  const handleUnsubscribe = () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`http://127.0.0.1:3000/api/v1/auth/subscriptions/${channelId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.ok) {
          onUpdate(); // Llama a la función de actualización
        }
      })
      .catch((err) => console.error("Error al desuscribirse:", err));
  };

  return <button onClick={handleUnsubscribe}>Desuscribirse</button>;
}