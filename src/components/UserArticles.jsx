import { useState, useEffect, useContext } from "react";
import { useHttpClient } from "../hooks/http-hook";
import { AuthContext } from "../context/auth-context";
import { useSearchParams } from "react-router-dom";
import Pagination from "./Pagination";
import ArticleCard from "./ArticleCard";
import "../styling/UserArticles.css";

function UserArticles() {
  const [userArticles, setUserArticles] = useState([]);
  const { isLoggedIn, user, login, logout } = useContext(AuthContext);
  const { isLoading, sendRequest, error } = useHttpClient();
  const [topicsList, setTopicsList] = useState([]);
  const [sortByOptions, setSortByOptions] = useState({
    p: 1,
    limit: 1000,
    sort_by: "created_at",
  });
  const [searchParams, setSearchParams] = useSearchParams();
  const [totalCount, setTotalCount] = useState(0);

  const handleSortByChange = (event) => {
    setSortByOptions((existing) => ({
      ...existing,
      sort_by: event.target.value,
    }));
  };

  const fetchUserArticles = async () => {
    const profileArticles = [];

    try {
      const { articles } = await sendRequest(
        `https://glawall-nc-backend-project.onrender.com/api/articles?limit=${sortByOptions.limit}&p=${sortByOptions.p}&sort_by=${sortByOptions.sort_by}`
      );
      if (!isLoading) {
        articles.forEach((article) => {
          if (article.author === user.username) {
            profileArticles.push(article);
          }
        });
        setTotalCount(profileArticles.length);
        setUserArticles(profileArticles);
      }
    } catch (err) {
      console.log("failed to fetch articles", err);
    }
  };

  const fetchTopics = async () => {
    try {
      const response = await sendRequest(
        `https://glawall-nc-backend-project.onrender.com/api/topics`
      );
      if (!isLoading) {
        setTopicsList(response.topics);
      }
    } catch (err) {
      console.log("error fetching topics", err);
    }
  };
  useEffect(() => {
    setSearchParams(sortByOptions);
    fetchTopics();
    setUserArticles([]);
    fetchUserArticles();
  }, [sortByOptions]);

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

  return (
    <div className="articles-container">
      <div className="sort-group">
        <div className="sort-controls">
          <select
            value={sortByOptions.sort_by}
            onChange={handleSortByChange}
            className="sort-select"
          >
            <option value="created_at">Most Recent</option>
            <option value="created_at,asc">Oldest First</option>
          </select>
        </div>
        <div className="items-per-page">
          <label htmlFor="limit-select">Items per page:</label>
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
      <div className="user-articles-grid">
        {userArticles.length > 0 ? (
          userArticles.map((article) => (
            <ArticleCard key={article.article_id} article={article} />
          ))
        ) : (
          <p className="no-articles">No articles yet</p>
        )}
      </div>
      <div className="pagination-wrapper">
        <div className="pagination-info"></div>
        <Pagination
          totalCount={totalCount}
          limit={sortByOptions.limit}
          pageNumber={sortByOptions.p}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
export default UserArticles;
