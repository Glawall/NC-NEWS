import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import '../Article.css'


function Article() {
  const [article, setArticle] = useState({});
  const { article_id } = useParams();
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [voteCount, setVoteCount] = useState(0);

  useEffect((voteCount) => {
    setIsLoading(true);
    axios
      .get(
        `https://glawall-nc-backend-project.onrender.com/api/articles/${article_id}`
      )
      .then((response) => {
        return response.data;
      })
      .then((data) => {
        setIsLoading(false);
        setArticle(data.article);
      })
      .catch((err) => {
        setIsError(true);
      });
  }, [article_id]);

  function handleIncreaseVotes(article_id, vote) {
    axios
      .patch(
        `https://glawall-nc-backend-project.onrender.com/api/articles/${article_id}`,
        { inc_votes: 1 }
      )
      .catch((err) => {
      });
      setVoteCount((currVoteChange) => currVoteChange + vote);
  }

useEffect(() => {
setVoteCount(voteCount)
}, [voteCount])

  function handleDecreaseVotes(article_id, vote) {
    setVoteCount((currVoteChange) => currVoteChange + vote);
    axios
      .patch(
        `https://glawall-nc-backend-project.onrender.com/api/articles/${article_id}`,
        { inc_votes: -1 }
      )
      .catch((err) => {
      });
  }
  
 
  return isLoading ? (
    <h1>Loading...</h1>
  ) : (
    <span className="article">
      <span className="list">
        <h3 className="title">{article.title}</h3>
        <h4 className="author">Author: {article.author}</h4>
        <p className="body">{article.body}</p>
        <p className="date">{(article.created_at).substring(0,10)}</p>

      </span>
      <span className="article-image">
        {article.article_img_url ? (
          <img src={article.article_img_url} />
        ) : (
          <img src="https://www.ncenet.com/wp-content/uploads/2020/04/No-image-found.jpg" />
        )}
      </span>
      <span className="votes">
        <p>Votes: {article.votes +voteCount}</p>
      </span>
      <span className ="increase">
        <button
          disabled={voteCount === 1}
          onClick={() => handleIncreaseVotes(article_id, 1)}
        >
          {" "}
          + Increase Vote
        </button>{" "}
      </span>
      <span className = "decrease">
        {" "}
        <button
          disabled={voteCount === -1}
          onClick={() => handleDecreaseVotes(article_id, -1)}
        >
          {" "}
          - Decrease Vote
        </button>{" "}
      </span>
    </span>
  );
}

export default Article;
