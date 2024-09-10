import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { useHttpClient } from "../hooks/http-hook";
import "../styling/Article.css";
import CommentCard from "./CommentCard";
import PostCommentForm from "./PostCommentForm";
import Voting from "./Voting";
import { formattedDate } from "../util/DateFormatting";
import Pagination from "./Pagination";
import { AuthContext } from "../context/auth-context";

function Article() {
  const [article, setArticle] = useState({});
  const { article_id } = useParams();
  const [commentsArr, setCommentsArr] = useState([]);
  const [pageNumberOptions, setPageNumberOptions] = useState({
    limit: 10,
    p: 1,
  });
  const [isVisible, setIsVisible] = useState(true);
  const { isLoading, sendRequest, error } = useHttpClient();
  const [commentCount, setCommentCount] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchArticleById = async () => {
    try {
      const { article } = await sendRequest(
        `https://glawall-nc-backend-project.onrender.com/api/articles/${article_id}`
      );
      if (!isLoading) {
        setArticle(article);
        setCommentCount(article.comment_count);
        setIsVisible(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCommentsByArticleId = async () => {
    try {
      const comments = await sendRequest(
        `https://glawall-nc-backend-project.onrender.com/api/articles/${article_id}/comments?limit=${pageNumberOptions.limit}&p=${pageNumberOptions.p}`
      );
      if (!isLoading) {
        setCommentsArr(comments);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteArticle = async () => {
    try {
      await sendRequest(
        `https://glawall-nc-backend-project.onrender.com/api/articles/${article_id}`,
        "DELETE"
      );
      if (!isLoading) {
        alert("Comment Deleted");
      }
      navigate("/userArticles");
    } catch (error) {
      console.log(error);
    }
  };

  function handleDeleteArticle() {
    deleteArticle();
  }
  useEffect(() => {
    setSearchParams(pageNumberOptions);
    fetchArticleById();
    fetchCommentsByArticleId();
  }, [article_id, pageNumberOptions, article.votes]);

  function handlePageChange(pageNumber) {
    setPageNumberOptions((existing) => {
      return { ...existing, p: pageNumber };
    });
  }

  function handleLimitChange(event) {
    setPageNumberOptions((existing) => {
      return { ...existing, limit: event.target.value };
    });
  }

  if (isLoading) {
    return <p>Loading</p>;
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

  return (
    <section className="article">
      <div className="article-info">
        <h3 className="title">{article.title}</h3>
        <p className="body">{article.body}</p>
        <p className="date">{formattedDate(article.created_at)}</p>
        <p className="date">Written By: {article.author}</p>
      </div>
      <div className="article-image">
        {article.article_img_url ? (
          <img src={article.article_img_url} alt="image url" />
        ) : (
          <img
            src="https://www.ncenet.com/wp-content/uploads/2020/04/No-image-found.jpg"
            alt="no image found"
          />
        )}
      </div>
      <div className="delete-article">
        {user.username === article.author ? (
          <button onClick={handleDeleteArticle}>Delete Article</button>
        ) : null}
      </div>
      <Voting votes={article.votes} article_id={article_id}></Voting>
      <ul className="comments">
        <button onClick={(event) => onClickReveal(event)}>View Comments</button>
        <PostCommentForm
          article_id={article_id}
          setCommentsArr={setCommentsArr}
        />
        <ul className={isVisible ? "comment-hidden" : "comment-container"}>
          {commentsArr.length > 0 ? (
            commentsArr.map((comment) => {
              return (
                <CommentCard
                  key={comment.comment_id}
                  comment={comment}
                  setCommentsArr={setCommentsArr}
                />
              );
            })
          ) : (
            <p>Be the first to add your comment here!</p>
          )}
        </ul>
        <div className={isVisible ? "pagination-hidden" : "pagination"}>
          {commentCount > pageNumberOptions.limit && (
            <Pagination
              totalCount={commentCount}
              pageNumber={pageNumberOptions.p}
              onPageChange={handlePageChange}
            />
          )}
          <p>Total Comments: {commentCount}</p>
          {commentCount > pageNumberOptions.limit && (
            <select
              value={pageNumberOptions.limit}
              onChange={handleLimitChange}
            >
              <option value="10">10</option>
              <option value="25">25</option>
            </select>
          )}
        </div>
      </ul>
    </section>
  );
}

{
  /* <button
className="previous-page"
onClick={() => {
  setPageNumber((currentPage) => currentPage - 1);
}}
disabled={pageNumber === 1}
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
<p className={isVisible ? "comment-hidden" : "comment"}>
Total Comments = {commentCount}
</p> */
}
export default Article;
