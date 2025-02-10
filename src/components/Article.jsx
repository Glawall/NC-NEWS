import { useParams, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { useHttpClient } from "../hooks/http-hook";
import "../styling/Article.css";
import CommentCard from "./CommentCard";
import PostCommentForm from "./PostCommentForm";
import { formattedDate } from "../util/DateFormatting";
import { AuthContext } from "../context/auth-context";
import Voting from "./Voting";
import Confirm from "./Confirm";

function Article() {
  const { id } = useParams();
  const { isLoading, sendRequest } = useHttpClient();
  const [article, setArticle] = useState(null);
  const [commentsArr, setCommentsArr] = useState([]);
  const [error, setError] = useState(null);
  const [commentCount, setCommentCount] = useState(0);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showComments, setShowComments] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const data = await sendRequest(
          `https://glawall-nc-backend-project.onrender.com/api/articles/${id}`
        );
        setArticle(data.article);
        setCommentCount(data.article.comment_count);

        const commentsData = await sendRequest(
          `https://glawall-nc-backend-project.onrender.com/api/articles/${id}/comments?limit=1000`
        );
        console.log(commentsData);
        if (commentsData) {
          setCommentsArr(commentsData);
        }
      } catch (err) {
        setError(err.message);
      }
    };
    fetchArticle();
  }, [id, sendRequest]);

  const handleDelete = async () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await sendRequest(
        `https://glawall-nc-backend-project.onrender.com/api/articles/${id}`,
        "DELETE"
      );
      navigate("/articles");
    } catch (err) {
      console.log(err);
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <section className="article-container">
      {showDeleteConfirm && (
        <Confirm
          message="Are you sure you want to delete this article?"
          onConfirm={confirmDelete}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
      <article className="article-content">
        <header className="article-header">
          <h1 className="title">{article?.title}</h1>
          <div className="article-meta">
            <span className="author">by {article?.author}</span>
            <span className="date">{formattedDate(article?.created_at)}</span>
          </div>
        </header>

        <div className="article-body">
          <div className="article-text">
            <p>{article?.body}</p>
            <Voting
              votes={article?.votes}
              id={id}
              type="article"
              authorName={article?.author}
            />
          </div>

          <div className="article-image-container">
            <img
              src={
                article?.article_img_url ||
                "https://www.ncenet.com/wp-content/uploads/2020/04/No-image-found.jpg"
              }
              alt={article?.article_img_url ? "article" : "no image found"}
            />
          </div>
        </div>

        <div className="article-actions">
          <button
            className="toggle-comments"
            onClick={() => setShowComments(!showComments)}
          >
            {showComments ? "Hide" : "Show"} Comments
          </button>
          {user.username === article?.author && (
            <button className="delete-article" onClick={handleDelete}>
              Delete Article
            </button>
          )}
        </div>
      </article>

      <section className="comments-section">
        {showComments && (
          <div className="comments-container">
            <PostCommentForm article_id={id} setCommentsArr={setCommentsArr} />
            {commentsArr.map((comment) => (
              <CommentCard
                key={comment.comment_id}
                comment={comment}
                setCommentsArr={setCommentsArr}
              />
            ))}
          </div>
        )}
      </section>
    </section>
  );
}

export default Article;
