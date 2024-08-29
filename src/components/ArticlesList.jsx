import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useHttpClient } from "../hooks/http-hook";
import ArticleCard from "./ArticleCard";
import Pagination from "./Pagination";

function ArticlesList() {
  const [articlesList, setArticlesList] = useState([]);
  const { isLoading, sendRequest, error } = useHttpClient();
  const [sortByOptions, setSortByOptions] = useState({
    sort_by: "created_at",
    order: "desc",
    p: 1,
    limit: 10,
  });
  const [searchParams, setSearchParams] = useSearchParams();
  const [totalCount, setTotalCount] = useState(0);

  const fetchArticles = async () => {
    try {
      const { articles } = await sendRequest(
        `https://glawall-nc-backend-project.onrender.com/api/articles?sort_by=${sortByOptions.sort_by}&order=${sortByOptions.order}&p=${sortByOptions.p}`
      );
      if (!isLoading) {
        setArticlesList(articles);
        setTotalCount(articles[0].total_count);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    setSearchParams(sortByOptions);
    fetchArticles();
  }, [sortByOptions.setArticlesList]);

  function handleOrderChange(event) {
    setSortByOptions((existing) => {
      return { ...existing, order: event.target.value };
    });
  }

  function handleSortByChange(event) {
    setSortByOptions((existing) => {
      return { ...existing, sort_by: event.target.value };
    });
  }

  function handlePageChange(pageNumber) {
    setSortByOptions((existing) => {
      return { ...existing, p: pageNumber };
    });
  }

  function handleLimitChange(event) {
    setSortByOptions((existing) => {
      return { ...existing, limit: event.target.value };
    });
  }

  // function FetchTopics() {
  //   axios.get(`https://glawall-nc-backend-project.onrender.com/api/topics`)
  //   .then((response) => {
  //       setTopicArr(response.data.topics.map((topic) => (topic.slug).charAt(0).toUpperCase() + (topic.slug).slice(1)))
  //       })
  //   .catch(err => console.log(err))

  //   }

  // function handleTopicChange(event) {
  //   setTopic(event.target.value)
  //   console.log(topic)
  //   setTopicSelector(`topic=${topic}`)
  // }

  if (isLoading) {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <section>
      <div className="sorting-options">
        <select value={sortByOptions.order} onChange={handleOrderChange}>
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
        <select value={sortByOptions.sort_by} onChange={handleSortByChange}>
          <option value="created_at">Date</option>
          <option value="title">Title</option>
          <option value="author">Author</option>
        </select>
      </div>
      <div className="article--card-list-wrapper">
        <ul>
          {articlesList.map((article) => {
            return <ArticleCard key={article.article_id} article={article} />;
          })}
        </ul>
      </div>
      <div>
        <p>Total articles = {totalCount}</p>
      </div>
      <Pagination
        totalCount={totalCount}
        pageNumber={sortByOptions.p}
        onPageChange={handlePageChange}
      />
      <p>Items per page</p>
      <select value={sortByOptions.limit} onChange={handleLimitChange}>
        <option value="10">10</option>
        <option value="25">25</option>
      </select>
    </section>
  );
}
export default ArticlesList;
