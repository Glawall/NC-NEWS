import { useState, useEffect, useContext } from "react";
import { useHttpClient } from "../hooks/http-hook";
import { AuthContext } from "../context/auth-context";
import { useSearchParams } from "react-router-dom";
import Pagination from "./Pagination";
import ArticleCard from "./ArticleCard";
import PostNewArticleForm from "./PostNewArticleForm";

function UserArticles() {
  const [userArticles, setUserArticles] = useState([]);
  const { isLoggedIn, user, login, logout } = useContext(AuthContext);
  const { isLoading, sendRequest, error } = useHttpClient();
  const [topicsList, setTopicsList] = useState([]);
  const [sortByOptions, setSortByOptions] = useState({
    p: 1,
    limit: 1000,
  });
  const [searchParams, setSearchParams] = useSearchParams();
  const [totalCount, setTotalCount] = useState(0);
  const fetchUserArticles = async () => {
    const profileArticles = [];

    try {
      const { articles } = await sendRequest(
        `https://glawall-nc-backend-project.onrender.com/api/articles?limit=${sortByOptions.limit}&p=${sortByOptions.p}`
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
    <section>
      <PostNewArticleForm
        setUserArticles={setUserArticles}
        topicsList={topicsList}
        fetchTopics={fetchTopics}
        setTopicsList={setTopicsList}
        fetchUserArticles={fetchUserArticles}
      />
      <div className="article-card-list-wrapper">
        <ul>
          {userArticles.length > 0 ? (
            userArticles.map((article) => {
              return <ArticleCard key={article.article_id} article={article} />;
            })
          ) : (
            <p></p>
          )}
        </ul>
        <div>
          <p>Total articles = {totalCount}</p>
        </div>
        <Pagination
          totalCount={totalCount}
          pageNumber={sortByOptions.p}
          onPageChange={handlePageChange}
          limit={sortByOptions.limit}
        />
        <p>Items per page</p>
        <select value={sortByOptions.limit} onChange={handleLimitChange}>
          <option value="10">10</option>
          <option value="25">25</option>
        </select>
      </div>
    </section>
  );
}
export default UserArticles;
