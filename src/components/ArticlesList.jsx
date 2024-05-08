import { useState, useEffect } from "react";
import ArticleCard from "./ArticleCard";
import axios from "axios";
import StylingBox from "./StylingBox";

function ArticlesList() {
  const [articlesList, setArticlesList] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [numberOfItemsPerPage, setNumberOfItemsPerPage] = useState(10);
  const [order, setOrder] = useState("desc");
  const [sortBy, setSortBy] = useState("created_at");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0)


  useEffect(() => {
    setIsLoading(true);

    axios
      .get(
        `https://glawall-nc-backend-project.onrender.com/api/articles?p=${pageNumber}&limit=${numberOfItemsPerPage}&order=${order}&sort_by=${sortBy}`
      )
      .then((response) => {
        return response.data;
      })
      .then((data) => {
        setArticlesList(data.articles);
        setIsLoading(false);
        setTotalCount(data.articles[0].total_count)
      })
      .catch((err) => {
        setIsError(true);
      });
  }, [order, numberOfItemsPerPage, sortBy, pageNumber]);

  function handleOrderChange(event) {
    setOrder(event.target.value);
  }
  function handleLimitChange(event) {
    setNumberOfItemsPerPage(event.target.value);
  }

  function handleSortByChange(event) {
    setSortBy(event.target.value);
  }
  if (isError) {
    return <h2>An error has occured</h2>;
  }

  return isLoading ? (
    <h1>Loading...</h1>
  ) : (
    <span className = "article-list">
      <span className = "selectors">
      <select className = "order-change" value = {order} onChange={handleOrderChange}>
        <option value="desc">Descending</option>
        <option value="asc">Ascending</option>
      </select>
      <select className = "limit-change" value ={numberOfItemsPerPage} onChange={handleLimitChange}>
        <option defaultValue="10">10</option>
        <option value="20">20</option>
        <option value={articlesList[0].total_count}>all</option>
      </select>
      <select className = "sort-by-change" value ={sortBy} onChange={handleSortByChange}>
        <option defaultValue="created_at">Latest</option>
        <option value="title">Title</option>
        <option value="author">Author</option>
        <option value="topic">Topic</option>
      </select>
      </span>
      <span className="article--card-list-wrapper">
      <ul>
        {articlesList.map((article) => {
          return (
            <StylingBox key={article.article_id}>
              <ArticleCard article={article} />
            </StylingBox>
          );
        })}
      </ul>
      </span>
      <span className="button-wrapper">
      <p>Total articles = {articlesList[0].total_count}</p>
      <button className = "previous-page" onClick = {()=> { setPageNumber((currentPage)=> currentPage-1)}} disabled ={pageNumber ===0}>Previous page</button>
      <button className = "next-page" onClick = {()=> { setPageNumber((currentPage)=> currentPage+1)}} disabled ={numberOfItemsPerPage * pageNumber >= totalCount}>Next page</button>
      </span>
    </span>
  );
}
export default ArticlesList;
