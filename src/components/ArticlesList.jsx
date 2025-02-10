import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useHttpClient } from "../hooks/http-hook";
import ArticleCard from "./ArticleCard";
import Pagination from "./Pagination";
import Capitalize from "../util/Capitalize";
import "../styling/ArticlesList.css";

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
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [isSliding, setIsSliding] = useState(false);
  const [slideDirection, setSlideDirection] = useState("");

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
        `https://glawall-nc-backend-project.onrender.com/api/articles?sort_by=${sortByOptions.sort_by}&order=${sortByOptions.order}&p=${sortByOptions.p}&topic=${sortByOptions.topic}&limit=${sortByOptions.limit}`
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

  function handleSortByChange(event) {
    const [sort_by, order] = event.target.value.split(",");
    setSortByOptions((existing) => {
      return { ...existing, sort_by, order: order || "desc" };
    });
  }

  const handlePageChange = (newPage) => {
    setIsSliding(true);
    setSlideDirection("out");

    setTimeout(() => {
      setSortByOptions((existing) => ({
        ...existing,
        p: newPage,
      }));

      setSlideDirection("in");

      setTimeout(() => {
        setIsSliding(false);
        setSlideDirection("");
      }, 300);
    }, 300);
  };

  function handleLimitChange(event) {
    setSortByOptions((existing) => {
      return { ...existing, limit: event.target.value };
    });
  }

  function handleTopicClick(topic) {
    setSelectedTopic(topic);
    setSortByOptions((existing) => ({
      ...existing,
      topic: topic || "",
    }));
  }

  if (isLoading) {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <div className="articles-container">
      <div className="filters">
        <div className="topics-filter">
          <div className="topics-buttons">
            <button
              className={`topic-button ${!selectedTopic ? "active" : ""}`}
              onClick={() => handleTopicClick(null)}
            >
              All
            </button>
            {topicsList.map((topic) => (
              <button
                key={topic.slug}
                className={`topic-button ${
                  selectedTopic === topic.slug ? "active" : ""
                }`}
                onClick={() => handleTopicClick(topic.slug)}
              >
                {Capitalize(topic.slug)}
              </button>
            ))}
          </div>
          <div className="controls-group">
            <select
              value={`${sortByOptions.sort_by}${
                sortByOptions.order === "asc" ? ",asc" : ""
              }`}
              onChange={handleSortByChange}
              className="sort-select"
            >
              <option value="created_at">Most Recent</option>
              <option value="created_at,asc">Oldest First</option>
            </select>
            <div className="items-per-page">
              <label htmlFor="limit-select" className="items-label">
                Items per page:
              </label>
              <select
                id="limit-select"
                value={sortByOptions.limit}
                onChange={handleLimitChange}
                className="limit-select"
              >
                <option value="10">10</option>
                <option value="25">25</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`articles-grid ${
          isSliding ? `sliding-${slideDirection}` : ""
        } ${sortByOptions.limit === "25" ? "grid-25" : ""}`}
      >
        {isLoading ? (
          <p className="loading-message">Loading articles...</p>
        ) : (
          articlesList.map((article) => (
            <ArticleCard key={article.article_id} article={article} />
          ))
        )}
      </div>

      <div className="pagination-wrapper">
        <div className="pagination-controls">
          <Pagination
            totalCount={totalCount}
            limit={sortByOptions.limit}
            pageNumber={sortByOptions.p}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}
export default ArticlesList;
