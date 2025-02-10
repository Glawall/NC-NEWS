import { useContext, useState } from "react";
import { useHttpClient } from "../hooks/http-hook";
import { AuthContext } from "../context/auth-context";
import Confirm from "./Confirm";

function PostCommentForm({ article_id, setCommentsArr }) {
  const { isLoading, sendRequest } = useHttpClient();
  const [commentBody, setCommentBody] = useState("");
  const { user } = useContext(AuthContext);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  const confirmPost = async () => {
    try {
      const response = await sendRequest(
        `https://glawall-nc-backend-project.onrender.com/api/articles/${article_id}/comments`,
        "POST",
        {
          username: user.username,
          body: commentBody,
        }
      );
      if (!isLoading) {
        setCommentsArr((prev) => [response.comment, ...prev]);
        setCommentBody("");
        setShowConfirm(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="post-comment-form">
      {showConfirm && (
        <Confirm
          message="Are you sure you want to post this comment?"
          onConfirm={confirmPost}
          onCancel={() => setShowConfirm(false)}
        />
      )}
      <textarea
        value={commentBody}
        onChange={(e) => setCommentBody(e.target.value)}
        placeholder="Write a comment..."
      />
      <button type="submit">Post Comment</button>
    </form>
  );
}

export default PostCommentForm;
