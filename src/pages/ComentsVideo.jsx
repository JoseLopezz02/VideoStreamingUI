import React from "react";
import Button from "../components/Button";

export default function CommentsModal({
  showComments,
  comments,
  currentPage,
  commentsPerPage,
  setCurrentPage,
  closeModal,
}) {
  if (!showComments) return null; // Don't render if comments are not shown

  const lastCommentIndex = currentPage * commentsPerPage;
  const firstCommentIndex = lastCommentIndex - commentsPerPage;
  const currentComments = comments.slice(firstCommentIndex, lastCommentIndex);

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Comentaris ({comments.length})</h2>

        {/* Contenedor con scroll para los comentarios */}
        <div className="comments-container">
          {currentComments.length > 0 ? (
            currentComments.map((comment, index) => (
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

        {/* Pagination Controls */}
        <div className="pagination">
          <Button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>
          <span>
            Pàgina {currentPage} de {Math.max(1, Math.ceil(comments.length / commentsPerPage))}
          </span>
          <Button
            onClick={() =>
              setCurrentPage((prev) => (lastCommentIndex < comments.length ? prev + 1 : prev))
            }
            disabled={lastCommentIndex >= comments.length}
          >
            Següent
          </Button>
        </div>

        <Button onClick={closeModal}>Tancar</Button>
      </div>
    </div>
  );
}
