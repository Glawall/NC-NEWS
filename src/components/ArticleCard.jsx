import {Link} from "react-router-dom"

function ArticleCard({ article }) {
  return (
    <>
    <h2>{article.title}</h2>
      <span className="article-info">
        <p> Written by: {article.author}</p>
        <p>Topic: {article.topic}</p>
        <Link to={`/articles/${article.article_id}`}>See More Info Here</Link>
      </span>
      <span className="article-image">
        {article.article_img_url ? (
          <img src={article.article_img_url} />
        ) : (
          <img src="https://www.ncenet.com/wp-content/uploads/2020/04/No-image-found.jpg" />
        )}
      </span>
    </>
  );
}

export default ArticleCard;
