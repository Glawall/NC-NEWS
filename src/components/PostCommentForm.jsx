import axios from "axios";
import { useState } from "react";
import { useParams } from "react-router-dom";

function PostCommentForm({setCommentsArr, setNewComment, newComment, usernameG}) {
  const { article_id } = useParams();
  const [usernameInput, setUsernameInput] = useState("");
  const [commentBodyInput, setCommentBodyInput] = useState("");

  function handleBodyInput(e) {
    setCommentBodyInput(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    PostNewComment(article_id);
    setNewComment({ username: usernameG, body: commentBodyInput });
    setUsernameInput("");
    setCommentBodyInput("");
    return <p>comment posted!</p>
  }
  function PostNewComment(article_id) {
    axios
      .post(
        `https://glawall-nc-backend-project.onrender.com/api/articles/${article_id}/comments`,
        { username: usernameG, body: commentBodyInput }
      )
      .then((response) => {
        setNewComment(response.data);
        setCommentsArr((currentComments => [...currentComments, newComment]))
        alert("Succesfully Posted")
      })
      .catch((err) => {
        alert("Error with your post")
      });
  }

  return (
    <>
      <form className="new-comment">
        <label className="body-label">Comment</label>
        <input
          id="body"
          type="text"
          onChange={handleBodyInput}
          value={commentBodyInput}
          required
        ></input>
        <button onClick={handleSubmit} disabled = {commentBodyInput.length === 0}>Post New Comment</button>
      </form>
    </>
  );
}

export default PostCommentForm;
