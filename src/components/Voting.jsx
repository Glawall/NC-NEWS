import { useHttpClient } from "../hooks/http-hook";
import { AuthContext } from "../context/auth-context";
import { useState, useContext } from "react";
import "../styling/Voting.css";

const Voting = ({ votes, article_id }) => {
  const [voteCountArticle, setVoteCountArticle] = useState(votes);

  const { isLoading, sendRequest } = useHttpClient();
  const { user, addVotedArticles } = useContext(AuthContext);
  let currentArticleVotes;

  if (user.votedArticle) {
    currentArticleVotes = user.votedArticle[article_id];
  }

  const patchArticleVotes = async (vote) => {
    try {
      setVoteCountArticle((existingVotes) => {
        return existingVotes + vote;
      });
      const { article } = await sendRequest(
        `https://glawall-nc-backend-project.onrender.com/api/articles/${article_id}`,
        "PATCH",
        { inc_votes: vote }
      );
    } catch (err) {
      setVoteCountArticle((existingVotes) => {
        return existingVotes - vote;
      });
      console.log(error);
    }
  };

  const handleVoteIncrease = () => {
    addVotedArticles(article_id, 1);
    patchArticleVotes(1);
  };

  const handleVoteDecrease = () => {
    addVotedArticles(article_id, -1);
    patchArticleVotes(-1);
  };

  return (
    <div className="vote-container">
      <p className="votes">Votes : {voteCountArticle}</p>
      <br></br>
      <div className="article-voting-buttons">
        <button
          className="increase-button"
          disabled={voteCountArticle === votes + 1}
          onClick={handleVoteIncrease}
        >
          + Increase Vote
        </button>{" "}
        <button
          className="decrease-button"
          disabled={voteCountArticle === votes - 1}
          onClick={handleVoteDecrease}
        >
          - Decrease Vote
        </button>{" "}
      </div>
    </div>
  );
};

export default Voting;
