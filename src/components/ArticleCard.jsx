function ArticleCard({ article }) {
  return (
    <>
      <h2 className="article-title">{article.title}</h2>
      <span className="article-info">
        <p> Written by: {article.author}</p>
        <p>Topic: {article.topic}</p>
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
