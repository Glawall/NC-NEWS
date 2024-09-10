import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useHttpClient } from "../hooks/http-hook";
import ArticleCard from "./ArticleCard";
import Pagination from "./Pagination";
import Capitalize from "../util/Capitalize";

function ArticlesList() {
  const [articlesList, setArticlesList] = useState([]);
  const { isLoading, sendRequest, error } = useHttpClient();
  const [sortByOptions, setSortByOptions] = useState({
    sort_by: "created_at",
    order: "desc",
    p: 1,
    limit: 10,
    topic: "",
  });
  const [topicsList, setTopicsList] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [totalCount, setTotalCount] = useState(0);

  const fetchTopics = async () => {
    try {
      const { topics } = await sendRequest(
        `https://glawall-nc-backend-project.onrender.com/api/topics`
      );
      if (!isLoading) {
        setTopicsList(topics);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchArticles = async () => {
    try {
      const { articles } = await sendRequest(
        `https://glawall-nc-backend-project.onrender.com/api/articles?sort_by=${sortByOptions.sort_by}&order=${sortByOptions.order}&p=${sortByOptions.p}&topic=${sortByOptions.topic}`
      );
      if (!isLoading) {
        setArticlesList(articles);
        setTotalCount(articles[0].total_count);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setSearchParams(sortByOptions);
    fetchArticles();
    fetchTopics();
  }, [sortByOptions, setArticlesList]);

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

  function handleTopicChange(event) {
    setSortByOptions((existing) => {
      return { ...existing, topic: event.target.value };
    });
  }

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
          <option value="desc">Newest</option>
          <option value="asc">Oldest</option>
        </select>
        <select value={sortByOptions.sort_by} onChange={handleSortByChange}>
          <option value="created_at">Date</option>
          <option value="title">Title</option>
          <option value="author">Author</option>
        </select>
        <select value={sortByOptions.topic} onChange={handleTopicChange}>
          <option value="">Choose Topic</option>
          {topicsList.map((topic) => {
            return (
              <option key={topic.slug} value={topic.slug}>
                {Capitalize(topic.slug)}
              </option>
            );
          })}
        </select>
      </div>{" "}
      <div className="article--card-list-wrapper">
        <ul>
          {articlesList.map((article) => {
            return <ArticleCard key={article.article_id} article={article} />;
          })}
        </ul>
      </div>
      <div></div>
      <Pagination
        totalCount={totalCount}
        limit={sortByOptions.limit}
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
