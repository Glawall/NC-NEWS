import { useState } from "react";
import axios from "axios";

function CommentCard({ comment, usernameG, setCommentCount, commentCount }) {
  const [commentVotesCount, setCommentVotesCount] = useState(0);

  let comment_id = comment.comment_id;

  function handleCommentVotes(comment_id, vote) {
    setCommentVotesCount((currCommentChange) => currCommentChange + vote);
    axios
      .patch(
        `https://glawall-nc-backend-project.onrender.com/api/comments/${comment_id}`,
        { inc_votes: vote }
      )
      .catch((err) => {
        setCommentVotesCount(commentCount - vote);
        return <p>Vote did not go through</p>;
      });
  }

  function handleDeleteComment(comment_id, usernameG){
    console.log(commentCount, "in delete first")
    console.log(usernameG)
    if(comment.author === usernameG)
    axios.delete(`https://glawall-nc-backend-project.onrender.com/api/comments/${comment_id}`)
    .then(response => {
        setCommentCount(commentCount -1)
    alert("Comment Deleted") })
  }

  return (
    <>
    <span className = "box">
      <div key={comment.comment_id}>
        <span className = "comment-info">
        <h2>{comment.author}</h2>
        <p>{comment.body}</p>
        <p>Votes: {comment.votes + commentVotesCount}</p>
        </span>
      </div>
      <span className="increase">
        <button
          disabled={commentVotesCount === 1}
          onClick={() => handleCommentVotes(comment_id, 1)}
        >
          {" "}
          + Increase Vote
        </button>{" "}
      </span>
      <span className="decrease">
        {" "}
        <button
          disabled={commentVotesCount === -1}
          onClick={() => handleCommentVotes(comment_id, -1)}
        >
          {" "}
          - Decrease Vote
        </button>{" "}
      </span>
      <button onClick ={() => handleDeleteComment(comment_id, usernameG)}>Delete Comment</button>
      </span>
    </>
  );
}

export default CommentCard;
