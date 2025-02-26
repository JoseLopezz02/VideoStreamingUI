import React from "react";
import Button from "../components/Button";
import "../styles/trending.css";

export default function ComentsVideo({
  showComments,
  comments,
  closeModal,
  fetchComments,
  selectedVideo,
  continued
}) {
  if (!showComments) return null; 

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Comentaris ({comments.length})</h2>

        {/* Contenedor con scroll para los comentarios */}
        <div className="comments-container">
          {comments.length > 0 ? (
            comments.map((comment, index) => (
              <div key={index} className="comment">
                <img
                  src={comment.authorThumbnails?.[0]?.url || "default-avatar.png"}
                  alt={comment.author}
                  className="comment-avatar"
                />
                <div className="comment-body">
                  <a
                    href={`https://www.youtube.com${comment.authorUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="comment-author"
                  >
                    {comment.author}
                  </a>
                  <p className="comment-text">{comment.content || "Comentari sense text"}</p>
                </div>
              </div>
            ))
          ) : (
            <p>No hi ha comentaris disponibles</p>
          )}
        </div>

        {/* Botón para cargar más comentarios */}
        {continued && (
          <div className="load-more">
            <Button onClick={() => fetchComments(selectedVideo, continued)}>
              Carregar més
            </Button>
          </div>
        )}

        <Button onClick={closeModal}>Tancar</Button>
      </div>
    </div>
  );
}