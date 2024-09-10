import { useNavigate, Link } from "react-router-dom";
import "../styling/ArticleCard.css";
import { formattedDate } from "../util/DateFormatting";
function ArticleCard({ article }) {
  const navigate = useNavigate();

  function handleClick() {
    navigate(`/articles/${article.article_id}`);
  }
  return (
    <li key={article.article_id} className="article-list">
      <div className="article-header">
        <h3 onClick={handleClick}>{article.title}</h3>
        <p> Written by: {article.author}</p>
        <p className="date">{formattedDate(article.created_at)}</p>

        <Link to={`/articles/${article.article_id}`}>
          Read the full article here
        </Link>
      </div>
      {article.article_img_url ? (
        <img
          src={article.article_img_url}
          alt="image url"
          className="article-image-card"
        />
      ) : (
        <img
          src="https://www.ncenet.com/wp-content/uploads/2020/04/No-image-found.jpg"
          alt="no image"
          className="article-image-card"
        />
      )}
    </li>
  );
}

export default ArticleCard;
