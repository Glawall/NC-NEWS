import { Link } from "react-router-dom";
import "../styling/ArticleCard.css";
import { formattedDate } from "../util/DateFormatting";
import Capitalize from "../util/Capitalize";

function ArticleCard({ article }) {
  return (
    <article className="article-card">
      <div className="article-image">
        <img src={article.article_img_url} alt={article.title} />
      </div>
      <div className="article-info">
        <span className="topic-text">{Capitalize(article.topic)}</span>
        <h2>{article.title}</h2>
        <div className="article-meta">
          <span>By {article.author}</span>
          <span>{formattedDate(article.created_at)}</span>
        </div>
        <div className="article-stats">
          <span>💬 {article.comment_count}</span>
          <span>⭐ {article.votes}</span>
        </div>
        <Link to={`/articles/${article.article_id}`} className="read-more">
          Read More →
        </Link>
      </div>
    </article>
  );
}

export default ArticleCard;
