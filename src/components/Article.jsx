import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "../Article.css";
import CommentCard from "./CommentCard";
import StylingBox from "./StylingBox";

function Article() {
  const [article, setArticle] = useState({});
  const { article_id } = useParams();
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [voteCount, setVoteCount] = useState(0);
  const [commentsArr, setCommentsArr] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [numberOfItemsPerPage, setNumberOfItemsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState();
  const [isVisible, setIsVisible] = useState(true);
  const [viewCommentButton, setViewCommentButton] = useState("View Comments");

  const fetchArticle = useEffect(
    (voteCount) => {
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
    },
    [article_id]
  );

  const fetchComments = useEffect(() => {
    setIsLoading(true);
    axios
      .get(
        `https://glawall-nc-backend-project.onrender.com/api/articles/${article_id}/comments?p=${pageNumber}&&limit=${numberOfItemsPerPage}`
      )
      .then((response) => {
        return response.data;
      })
      .then((data) => {
        setIsLoading(false);
        setCommentsArr(data);
        setTotalCount(data.length);
      })
      .catch((err) => {
        setIsError(true);
      });
  }, [article_id]);

  if (isError) {
    return <h2>An error has occured</h2>;
  }

  const voteCounts = useEffect(() => {
    setVoteCount(voteCount);
  }, [voteCount]);

  const commentsButton = useEffect(() => {
    setViewCommentButton(viewCommentButton);
  }, [viewCommentButton]);

  const isItVisible = useEffect(() => {
    setIsVisible(isVisible);
  }, [isVisible]);

  Promise.all([
    fetchArticle,
    fetchComments,
    voteCounts,
    isItVisible,
    commentsButton,
  ]);

  function handleIncreaseVotes(article_id, vote) {
    axios
      .patch(
        `https://glawall-nc-backend-project.onrender.com/api/articles/${article_id}`,
        { inc_votes: 1 }
      )
      .catch((err) => {
        setVoteCount(currentVote);
        return <p>Vote did not go through</p>;
      });
    setVoteCount((currVoteChange) => currVoteChange + vote);
  }

  function handleDecreaseVotes(article_id, vote) {
    setVoteCount((currVoteChange) => currVoteChange + vote);
    axios
      .patch(
        `https://glawall-nc-backend-project.onrender.com/api/articles/${article_id}`,
        { inc_votes: -1 }
      )
      .catch((err) => {
        setVoteCount(currentVote);
        return <p>Vote did not go through</p>;
      });
  }

  function onClickReveal(setIsVisible, setViewCommentButton) {
    if (viewCommentButton === "View Comments") {
      setViewCommentButton("Hide Comments");
      setIsVisible(false);
    }
    else {
    setIsVisible(true);
    setViewCommentButton("View Comments");

    }

  }

  return isLoading ? (
    <h1>Loading...</h1>
  ) : (
    <span className="article">
      <span className="list">
        <h3 className="title">{article.title}</h3>
        <h4 className="author">Author: {article.author}</h4>
        <p className="body">{article.body}</p>
        <p className="date">{article.created_at.substring(0, 10)}</p>
      </span>
      <span className="article-image">
        {article.article_img_url ? (
          <img src={article.article_img_url} />
        ) : (
          <img src="https://www.ncenet.com/wp-content/uploads/2020/04/No-image-found.jpg" />
        )}
      </span>
      <span className="votes">
        <p>Votes: {article.votes + voteCount}</p>
      </span>
      <span className="increase">
        <button
          disabled={voteCount === 1}
          onClick={() => handleIncreaseVotes(article_id, 1)}
        >
          {" "}
          + Increase Vote
        </button>{" "}
      </span>
      <span className="decrease">
        {" "}
        <button
          disabled={voteCount === -1}
          onClick={() => handleDecreaseVotes(article_id, -1)}
        >
          {" "}
          - Decrease Vote
        </button>{" "}
      </span>
      <span className="comments">
        <button
          value={viewCommentButton}
          onClick={() => onClickReveal(setIsVisible, setViewCommentButton)}
        >
          {viewCommentButton}
        </button>
        <button
          className={isVisible ? "comment-hidden" : "comment"}
        >
          Post New Comment
        </button>
        <ul className={isVisible ? "comment-hidden" : "comment"}>
          {commentsArr.map((comment) => {
            return (
              <StylingBox key={comment.comment_id}>
                <CommentCard comment={comment} />
              </StylingBox>
            );
          })}
        </ul>
        <button
          className={isVisible ? "comment-hidden" : "comment"}
          onClick={() => {
            setPageNumber(1) && setNumberOfItemsPerPage(totalCount);
          }}
          disabled={numberOfItemsPerPage * pageNumber >= totalCount}
        >
          View More Comments
        </button>
        <p className={isVisible ? "comment-hidden" : "comment"}>Total Comments = {totalCount}</p>
      </span>
    </span>
  );
}

export default Article;
