import { useState, useContext } from "react";
import { useHttpClient } from "../hooks/http-hook";
import { AuthContext } from "../context/auth-context";
import Confirm from "./Confirm";
import "../styling/Voting.css";

function Voting({ votes, id, type, authorName }) {
  const { isLoading, sendRequest } = useHttpClient();
  const { user, addVotedArticles } = useContext(AuthContext);
  const [voteCount, setVoteCount] = useState(votes);
  const [userVote, setUserVote] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingVote, setPendingVote] = useState(null);

  if (user.username === authorName) {
    return null;
  }

  const initiateVote = (increment) => {
    setPendingVote(increment);
    setShowConfirm(true);
  };

  const handleVote = async () => {
    const increment = pendingVote;
    const previousVote = userVote;
    setUserVote(increment === userVote ? 0 : increment);
    const newVoteCount =
      voteCount + (increment === userVote ? -increment : increment - userVote);
    setVoteCount(newVoteCount);

    try {
      await sendRequest(
        `https://glawall-nc-backend-project.onrender.com/api/${type}s/${id}`,
        "PATCH",
        {
          inc_votes: increment === userVote ? -increment : increment - userVote,
        }
      );
      if (type === "article") {
        addVotedArticles(id);
      }
      setShowConfirm(false);
    } catch (error) {
      console.log(error);
      setVoteCount(voteCount);
      setUserVote(previousVote);
    }
  };

  return (
    <div className="voting-container">
      {showConfirm && (
        <Confirm
          message={`Are you sure you want to ${
            pendingVote === 1 ? "upvote" : "downvote"
          } this ${type}?`}
          onConfirm={handleVote}
          onCancel={() => setShowConfirm(false)}
        />
      )}
      <button
        className={`vote-button ${userVote === 1 ? "active" : ""}`}
        onClick={() => initiateVote(1)}
      >
        👍
      </button>
      <span className="vote-count">{voteCount}</span>
      <button
        className={`vote-button ${userVote === -1 ? "active" : ""}`}
        onClick={() => initiateVote(-1)}
      >
        👎
      </button>
    </div>
  );
}

export default Voting;
