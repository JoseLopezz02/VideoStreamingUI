import React, {useState} from "react";
import { useNavigate } from "react-router-dom";

export default function FloatingButton() {
  const navigate = useNavigate();
  const [fabOpen, setFabOpen] = useState(false);


  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="fab-container">
      {fabOpen && (
        <div className="fab-options">
          <button className="fab-button" onClick={scrollToTop}>
            <i className="fa-solid fa-arrow-up"></i>
          </button>
          <button className="fab-button home-button" onClick={() => navigate("/")}>
            <i className="fa-solid fa-house"></i>
          </button>
        </div>
      )}

      <button className="fab-main" onClick={() => setFabOpen(!fabOpen)}>
        <i className="fa-solid fa-bars"></i>
      </button>
    </div>
  );
}
