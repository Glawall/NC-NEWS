import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/auth-context";
import { useHttpClient } from "../hooks/http-hook";
import Voting from "./Voting";

function CommentCard({ comment, setCommentsArr }) {
  const { isLoading, sendRequest, error } = useHttpClient();
  const { user } = useContext(AuthContext);
  const [commentVotesCount, setCommentVotesCount] = useState(0);

  let comment_id = comment.comment_id;

  const patchCommentVotes = async (comment_id, vote) => {
    try {
      const { comment } = await sendRequest(
        `https://glawall-nc-backend-project.onrender.com/api/comments/${comment_id}`,
        "PATCH",
        { inc_votes: vote }
      );
      setCommentVotesCount((existingVotes) => {
        return existingVotes + vote;
      });
    } catch (err) {
      setCommentVotesCount((existingVotes) => {
        return existingVotes - vote;
      });
      console.log(err);
    }
  };

  const deleteComment = async () => {
    try {
      await sendRequest(
        `https://glawall-nc-backend-project.onrender.com/api/comments/${comment_id}`,
        "DELETE"
      );
      if (!isLoading) {
        setCommentsArr((existingComments) => {
          const newCommentsArr = existingComments.filter((comment) => {
            return comment.comment_id !== comment_id;
          });
          return newCommentsArr;
        });
        alert("Comment Deleted");
      }
    } catch (error) {
      console.log(error);
    }
  };

  function handleDeleteComment() {
    deleteComment();
  }
  return (
    <section className="comments-container">
      <div className="comment">
        <div className="comment-info" key={comment.comment_id}>
          <h2>{comment.author}</h2>
          <img
            src={comment.author_avatar_url}
            alt="avatar-url"
            className="avatar-url"
          />
        </div>
        <p>{comment.body}</p>
        <br></br>
        <p className="votes">Votes: {comment.votes + commentVotesCount}</p>
        <div className="voting-buttons">
          <button
            className="increase"
            disabled={commentVotesCount === 1}
            onClick={() => patchCommentVotes(comment_id, 1)}
          >
            {" "}
            Agree{" "}
          </button>
          <button
            className="decrease"
            disabled={commentVotesCount === -1}
            onClick={() => patchCommentVotes(comment_id, -1)}
          >
            {" "}
            Disagree{" "}
          </button>{" "}
        </div>
        <div className="delete-comment">
          {user.username === comment.author ? (
            <button onClick={handleDeleteComment}>Delete Comment</button>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export default CommentCard;
