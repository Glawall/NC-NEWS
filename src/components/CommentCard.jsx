import { useContext, useState } from "react";
import { AuthContext } from "../context/auth-context";
import { useHttpClient } from "../hooks/http-hook";
import { formattedDate } from "../util/DateFormatting";
import Voting from "./Voting";
import Confirm from "./Confirm";
import "../styling/Article.css";

function CommentCard({ comment, setCommentsArr }) {
  const { user } = useContext(AuthContext);
  const { sendRequest, isLoading } = useHttpClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editedBody, setEditedBody] = useState(comment.body);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = async () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await sendRequest(
        `https://glawall-nc-backend-project.onrender.com/api/comments/${comment.comment_id}`,
        "DELETE"
      );
      if (!isLoading) {
        setCommentsArr((prev) =>
          prev.filter((c) => c.comment_id !== comment.comment_id)
        );
      }
      setShowDeleteConfirm(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleEditComment = async () => {
    try {
      const response = await sendRequest(
        `https://glawall-nc-backend-project.onrender.com/api/comments/${comment.comment_id}`,
        "PATCH",
        { body: editedBody }
      );
      setCommentsArr((prevComments) =>
        prevComments.map((c) =>
          c.comment_id === comment.comment_id ? { ...c, body: editedBody } : c
        )
      );
      setIsEditing(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="comment">
      {showDeleteConfirm && (
        <Confirm
          message="Are you sure you want to delete this comment?"
          onConfirm={confirmDelete}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
      <div className="comment-header">
        <div className="comment-author">
          <img
            className="avatar"
            src={`https://api.dicebear.com/6.x/avataaars/svg?seed=${comment.author}`}
            alt="avatar"
          />
          <div className="author-info">
            <h4>{comment.author}</h4>
            <span className="comment-date">
              {formattedDate(comment.created_at)}
            </span>
          </div>
        </div>
        <Voting
          votes={comment.votes}
          id={comment.comment_id}
          type="comment"
          authorName={comment.author}
        />
      </div>
      <div className="comment-content">
        {isEditing ? (
          <div className="edit-comment-form">
            <textarea
              value={editedBody}
              onChange={(e) => setEditedBody(e.target.value)}
              rows="3"
            />
            <div className="edit-actions">
              <button onClick={handleEditComment}>Save</button>
              <button onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
          </div>
        ) : (
          <>
            <p>{comment.body}</p>
            {user.username === comment.author && (
              <div className="comment-actions">
                <button
                  className="edit-button"
                  onClick={() => setIsEditing(true)}
                  aria-label="Edit comment"
                >
                  ✏️ Edit
                </button>
                <button
                  className="delete-button"
                  onClick={handleDelete}
                  aria-label="Delete comment"
                >
                  🗑️
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default CommentCard;
