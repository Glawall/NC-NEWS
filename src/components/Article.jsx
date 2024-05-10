import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "../Article.css";
import CommentCard from "./CommentCard";
import StylingBox from "./StylingBox";
import PostCommentForm from "./PostCommentForm";

function Article({ usernameG, isError, setIsError}) {
  const [article, setArticle] = useState({});
  const { article_id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [voteCount, setVoteCount] = useState(0);
  const [commentsArr, setCommentsArr] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [numberOfItemsPerPage, setNumberOfItemsPerPage] = useState(10);
  const [isVisible, setIsVisible] = useState(true);
  const [newComment, setNewComment] = useState({});
  const [commentCount, setCommentCount] = useState(0)
  const [articleDate, setArticleDate] = useState("")


useEffect(() => {
    setIsLoading(true);
    axios
      .get(
        `https://glawall-nc-backend-project.onrender.com/api/articles/${article_id}`
      )
      .then((response) => {
        setIsLoading(false);
        setArticle(response.data.article);
        setCommentCount(response.data.article.comment_count)
        setArticleDate(response.data.article.created_at.substring(0, 10))
      })
      .catch((err) => {
        setIsError(true);
      });
  }, [article_id]);

useEffect(() => {
    setIsLoading(true);
    axios
      .get(
        `https://glawall-nc-backend-project.onrender.com/api/articles/${article_id}/comments?p=${pageNumber}&&limit=${numberOfItemsPerPage}`
      )
      .then((response) => {
        setIsLoading(false);
        setCommentsArr(response.data);
      })
      .catch((err) => {
        setIsError(true);
      });
  }, [article_id, newComment]);

  if (isError) {
    return <h2>An error has occured</h2>;
  }


  function handleVotesChange(article_id, vote) {
    axios
      .patch(
        `https://glawall-nc-backend-project.onrender.com/api/articles/${article_id}`,
        { inc_votes: vote }
      )
      .catch((err) => {
        setVoteCount((currentVoteChange) => currentVoteChange - vote);
        return <p>Vote did not go through</p>;
      });
    setVoteCount((currVoteChange) => currVoteChange + vote);
  }

  function onClickReveal(e) {
    if (e.target.innerHTML === "View Comments") {
      setIsVisible(false);
      e.target.innerHTML = "Hide Comments";
    } else {
      setIsVisible(true);
      e.target.innerHTML = "View Comments";
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
        <p className="date">{articleDate}</p>
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
          onClick={() => handleVotesChange(article_id, 1)}
        >
          {" "}
          + Increase Vote
        </button>{" "}
      </span>
      <span className="decrease">
        {" "}
        <button
          disabled={voteCount === -1}
          onClick={() => handleVotesChange(article_id, -1)}
        >
          {" "}
          - Decrease Vote
        </button>{" "}
      </span>
      <span className="comments">
        <button onClick={(event) => onClickReveal(event)}>View Comments</button>
        <PostCommentForm
          setCommentsArr={setCommentsArr}
          setNewComment={setNewComment}
          newComment={newComment}
          usernameG={usernameG}
        />
        <ul className={isVisible ? "comment-hidden" : "comment"}>
          {commentsArr.map((comment) => {
            return (
              <StylingBox key={comment.comment_id}>
                <CommentCard comment={comment} />
              </StylingBox>
            );
          })}
        </ul>
        <span className={isVisible ? "comment-hidden" : "comment"}>
        <button
          className="previous-page"
          onClick={() => {
            setPageNumber((currentPage) => currentPage - 1);
          }}
          disabled={pageNumber === 0}
        >
          Previous page
        </button>
        <p>Page: {pageNumber} </p>
        <button
          className="next-page"
          onClick={() => {
            setPageNumber((currentPage) => currentPage + 1);
          }}
          disabled={numberOfItemsPerPage * pageNumber >= commentCount}
        >
          Next page
        </button>
        <p>
          Total Comments = {commentCount}
        </p>
        </span>
      </span>
    </span>
  );
}

export default Article;
