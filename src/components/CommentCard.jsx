import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

function CommentCard({ comment }) {
  const [commentCount, setCommentCount] = useState(0);

  useEffect(() => {
    setCommentCount(commentCount);
  }, [commentCount]);

  let comment_id = comment.comment_id;

  function handleIncreaseComment(comment_id, vote) {
    setCommentCount((currCommentChange) => currCommentChange + vote);

    axios
      .patch(
        `https://glawall-nc-backend-project.onrender.com/api/comments/${comment_id}`,
        { inc_votes: 1 }
      )
      .catch((err) => {
        setCommentCount(commentCount);
        return <p>Vote did not go through</p>;
      });
  }
  function handleDecreaseComment(comment_id, vote) {
    setCommentCount((currCommentChange) => currCommentChange + vote);
    axios
      .patch(
        `https://glawall-nc-backend-project.onrender.com/api/comments/${comment_id}`,
        { inc_votes: -1 }
      )
      .catch((err) => {
        setCommentCount(commentCount);
        return <p>Vote did not go through</p>;
      });
  }

  return (
    <>
      <div key={comment.comment_id}>
        <h2>{comment.author}</h2>
        <p>{comment.body}</p>
        <p>Votes: {comment.votes + commentCount}</p>
      </div>
      <span className="increase">
        <button
          disabled={commentCount === 1}
          onClick={() => handleIncreaseComment(comment_id, 1)}
        >
          {" "}
          + Increase Vote
        </button>{" "}
      </span>
      <span className="decrease">
        {" "}
        <button
          disabled={commentCount === -1}
          onClick={() => handleDecreaseComment(comment_id, -1)}
        >
          {" "}
          - Decrease Vote
        </button>{" "}
      </span>
    </>
  );
}

export default CommentCard;
