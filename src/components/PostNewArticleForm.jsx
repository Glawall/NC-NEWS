import { useState, useContext, useEffect } from "react";
import { useHttpClient } from "../hooks/http-hook";
import { AuthContext } from "../context/auth-context";
import "../styling/Article.css";

function PostNewArticleForm({ setUserArticles, topicsList, fetchTopics }) {
  const { isLoading, sendRequest, setError } = useHttpClient();
  const { user } = useContext(AuthContext);
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
        setUserArticles((existingArticles) => {
          return [newArticle.article, ...existingArticles];
        });
        setArticleInputs({
          author: user.username,
          title: "",
          body: "",
          topic: "",
          article_img_url: "",
        });
      }
      console.log(newArticle);
      alert("nice article");
    } catch (error) {
      console.log("error posting article", error);
    }
  };

  const postNewTopic = async (slug, description) => {
    try {
      const response = await sendRequest(
        `https://glawall-nc-backend-project.onrender.com/api/topics`,
        "POST",
        { slug, description }
      );
      console.log(response, "topic");
      console.log(slug, description);
      if (!isLoading) {
        fetchTopics();
        setArticleInputs({ ...articleInputs, topic: slug });
        setAddingNewTopic(false);
      }
    } catch (error) {
      console.log("error posting topic", error);
    }
  };

  const deleteTopic = async (slug) => {
    try {
      await sendRequest(
        `https://glawall-nc-backend-project.onrender.com/api/topics/${slug}`,
        "DELETE"
      );
      console.log(`Deleted ${slug}`);
      fetchTopics();
    } catch (error) {
      "Error deleting topic", error;
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
    } else {
      setAddingNewTopic(false);
      setArticleInputs({ ...articleInputs, topic: value });
    }
    if (value === "remove-topic") {
      setRemoveTopic(true);
      setArticleInputs({ ...articleInputs, topic: value });
    } else {
      setRemoveTopic(false);
      setArticleInputs({ ...articleInputs, topic: value });
    }
  }

  function handleNewTopic(e) {
    const { name, value } = e.target;
    setTopicInput({ ...topicInput, [name]: value });
  }

  function handleRemoveTopic(slug) {
    deleteTopic(slug);
    setRemoveTopic(false);
  }

  function handleSubmitClick() {
    if (addingNewTopic) {
      const { slug, description } = topicInput;
      if (slug && description) {
        postNewTopic(slug, description);
      } else {
        setError(new Error("Please fill in all the fields"));
      }
    } else if (
      articleInputs.title.length > 0 &&
      articleInputs.body.length > 0 &&
      articleInputs.topic.length > 0
    ) {
      postNewArticle();
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
      <div class="article-form-container">
        <h2 class="form-title">Post a New Article here!</h2>

        <div className="new-article">
          <label className="title-label"></label>
          <input
            id="title"
            type="text"
            name="title"
            onChange={handleArticleinputs}
            value={articleInputs.title}
            required
            placeholder=" Add your title here"
          ></input>
          <label className="body-label"></label>
          <input
            id="body"
            type="text"
            name="body"
            onChange={handleArticleinputs}
            value={articleInputs.body}
            required
            placeholder=" Add your article here"
          ></input>
          <label className="topic-label"></label>
          <select
            value={articleInputs.topic}
            name="topic"
            onChange={handleTopicInput}
          >
            <option value="" disabled>
              {topicsList.length === 0
                ? "Loading Topics"
                : "Please select a topic"}
            </option>
            {topicsList.map((topic) => {
              return (
                <option key={topic.slug} value={topic.slug}>
                  {topic.slug.toUpperCase(0)}
                </option>
              );
            })}
            <option value="add-new-topic">Add a new topic</option>
            <option value="remove-topic">Remove a topic</option>
          </select>
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
                placeholder="Enter  topic description"
                value={topicInput.description}
                onChange={handleNewTopic}
                required
              />
              <button
                className="post-new-topic"
                onClick={handleSubmitClick}
                disabled={
                  topicInput.slug.length === 0 ||
                  topicInput.description.length === 0
                }
              >
                Add New Topic
              </button>
            </div>
          )}
          {removeTopic && (
            <div className="remove-topic">
              <select
                name="topic"
                onChange={(e) => setRemoveTopic(e.target.value)}
              >
                <option value="" disabled selected>
                  Select a topic to remove
                </option>
                {topicsList.map((topic) => {
                  return (
                    <option key={topic.slug} value={topic.slug}>
                      {topic.slug.toUpperCase(0)}
                    </option>
                  );
                })}
              </select>
              <button
                className="remove-topic-button"
                onClick={() => handleRemoveTopic(removeTopic)}
              >
                Remove Topic
              </button>
            </div>
          )}
          <label className="image-label"></label>
          <input
            id="article_image_url"
            type="text"
            name="article_image_url"
            onChange={handleArticleinputs}
            value={articleInputs.article_image_url}
            required
            placeholder=" Add your image url here"
          ></input>
        </div>
        <br></br>
        <button
          className="post-article"
          onClick={handleSubmitClick}
          disabled={
            articleInputs.title.length === 0 &&
            articleInputs.body.length === 0 &&
            articleInputs.topic.length === 0
          }
        >
          Post New Article
        </button>
      </div>
    )
  );
}

export default PostNewArticleForm;
