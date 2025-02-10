import { useState, useContext, useEffect } from "react";
import { useHttpClient } from "../hooks/http-hook";
import { AuthContext } from "../context/auth-context";
import "../styling/Article.css";
import { useNavigate } from "react-router-dom";
import "../styling/PostNewArticle.css";
import Confirm from "./Confirm";

function PostNewArticleForm() {
  const { isLoading, sendRequest, setError } = useHttpClient();
  const { user } = useContext(AuthContext);
  const [topicsList, setTopicsList] = useState([]);
  const [articleInputs, setArticleInputs] = useState({
    author: user.username,
    title: "",
    body: "",
    topic: "",
    article_img_url: "",
  });
  const [topicInput, setTopicInput] = useState({
    slug: "",
    description: "",
  });
  const [addingNewTopic, setAddingNewTopic] = useState(false);
  const [removeTopic, setRemoveTopic] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmittingTopic, setIsSubmittingTopic] = useState(false);
  const navigate = useNavigate();

  const fetchTopics = async () => {
    try {
      const { topics } = await sendRequest(
        `https://glawall-nc-backend-project.onrender.com/api/topics`
      );
      if (!isLoading) {
        setTopicsList(topics);
      }
    } catch (err) {
      console.log("error fetching topics", err);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  const postNewArticle = async () => {
    try {
      const newArticle = await sendRequest(
        `https://glawall-nc-backend-project.onrender.com/api/articles`,
        "POST",
        {
          author: user.username,
          title: articleInputs.title,
          body: articleInputs.body,
          topic: articleInputs.topic,
          article_img_url: articleInputs.article_image_url,
        }
      );
      if (!isLoading) {
        setTopicsList((existingTopics) => {
          return [newArticle.topic, ...existingTopics];
        });
        setArticleInputs({
          author: user.username,
          title: "",
          body: "",
          topic: "",
          article_img_url: "",
        });
        setSuccessMessage("Article posted successfully!");
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          navigate("/my-articles");
        }, 2000);
      }
    } catch (error) {
      console.log("error posting article", error);
    }
  };

  const postNewTopic = async (slug, description) => {
    try {
      setIsSubmittingTopic(true);
      const response = await sendRequest(
        `https://glawall-nc-backend-project.onrender.com/api/topics`,
        "POST",
        { slug, description }
      );
      if (!isLoading) {
        fetchTopics();
        setArticleInputs({ ...articleInputs, topic: slug });
        setAddingNewTopic(false);
        setSuccessMessage("Topic added successfully!");
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } catch (error) {
      console.log("error posting topic", error);
    } finally {
      setIsSubmittingTopic(false);
    }
  };

  const deleteTopic = async (slug) => {
    try {
      await sendRequest(
        `https://glawall-nc-backend-project.onrender.com/api/topics/${slug}`,
        "DELETE"
      );
      fetchTopics();
      setRemoveTopic(false);
      setSuccessMessage("Topic removed successfully!");
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.log("Error deleting topic", error);
    }
  };

  function handleArticleinputs(e) {
    const { name, value } = e.target;
    setArticleInputs({ ...articleInputs, [name]: value });
  }

  function handleTopicInput(e) {
    const { value } = e.target;
    if (value === "add-new-topic") {
      setAddingNewTopic(true);
      setArticleInputs({ ...articleInputs, topic: value });
    } else if (value === "remove-topic") {
      setRemoveTopic(true);
      setArticleInputs({ ...articleInputs, topic: value });
    } else {
      setAddingNewTopic(false);
      setRemoveTopic(false);
      setArticleInputs({ ...articleInputs, topic: value });
    }
  }

  function handleNewTopic(e) {
    const { name, value } = e.target;
    setTopicInput({ ...topicInput, [name]: value });
  }

  function handleSubmitClick(e) {
    e.preventDefault();
    if (addingNewTopic) {
      const { slug, description } = topicInput;
      if (slug && description) {
        postNewTopic(slug, description);
        return;
      } else {
        setError(new Error("Please fill in all the fields"));
      }
    } else if (
      articleInputs.title.length > 0 &&
      articleInputs.body.length > 0 &&
      articleInputs.topic.length > 0
    ) {
      setShowConfirm(true);
    } else {
      setError(new Error("Please fill in all the fields"));
    }
  }

  useEffect(() => {
    if (!addingNewTopic) {
      setArticleInputs({
        author: user.username,
        title: articleInputs.title,
        body: articleInputs.body,
        topic: articleInputs.topic,
        article_img_url: articleInputs.article_img_url,
      });
    }
  }, [articleInputs.topic]);

  return (
    user.username && (
      <div className="post-article-container">
        {showSuccess && <div className="success-message">{successMessage}</div>}
        {showConfirm && (
          <Confirm
            message="Post this article?"
            onConfirm={() => {
              postNewArticle();
              setShowConfirm(false);
            }}
            onCancel={() => setShowConfirm(false)}
          />
        )}
        <h2>Create New Article</h2>
        <form onSubmit={handleSubmitClick} className="post-article-form">
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={articleInputs.title}
              onChange={handleArticleinputs}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="body">Body</label>
            <input
              type="text"
              id="body"
              name="body"
              value={articleInputs.body}
              onChange={handleArticleinputs}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="topic">Topic</label>
            <select
              id="topic"
              name="topic"
              value={articleInputs.topic}
              onChange={handleTopicInput}
              required
            >
              <option value="" disabled>
                {topicsList.length === 0
                  ? "Loading Topics"
                  : "Please select a topic"}
              </option>
              {topicsList.map((topic) => {
                return (
                  <option key={topic.slug} value={topic.slug}>
                    {topic.slug.charAt(0).toUpperCase() + topic.slug.slice(1)}
                  </option>
                );
              })}
              <option value="add-new-topic">Add a new topic</option>
              <option value="remove-topic">Remove a topic</option>
            </select>
          </div>
          {addingNewTopic && (
            <div className="new-topic-input">
              <input
                type="text"
                name="slug"
                placeholder="Enter new topic"
                value={topicInput.slug}
                onChange={handleNewTopic}
                required
              />
              <input
                type="text"
                name="description"
                placeholder="Enter topic description"
                value={topicInput.description}
                onChange={handleNewTopic}
                required
              />
              <button
                className="post-new-topic"
                type="button"
                onClick={() =>
                  postNewTopic(topicInput.slug, topicInput.description)
                }
                disabled={
                  isSubmittingTopic ||
                  !topicInput.slug ||
                  !topicInput.description
                }
              >
                {isSubmittingTopic ? "Adding..." : "Add New Topic"}
              </button>
            </div>
          )}
          {removeTopic && (
            <div className="new-topic-input">
              <select
                name="topic"
                onChange={(e) => deleteTopic(e.target.value)}
              >
                <option value="" disabled selected>
                  Select a topic to remove
                </option>
                {topicsList.map((topic) => (
                  <option key={topic.slug} value={topic.slug}>
                    {topic.slug.charAt(0).toUpperCase() + topic.slug.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="form-group">
            <label htmlFor="article_image_url">Image URL</label>
            <input
              type="text"
              id="article_image_url"
              name="article_image_url"
              value={articleInputs.article_image_url}
              onChange={handleArticleinputs}
              required
              placeholder="Add your image URL here"
            />
          </div>
          <button
            className="post-article"
            type="submit"
            disabled={
              articleInputs.title.length === 0 &&
              articleInputs.body.length === 0 &&
              articleInputs.topic.length === 0
            }
          >
            Post New Article
          </button>
        </form>
      </div>
    )
  );
}

export default PostNewArticleForm;
