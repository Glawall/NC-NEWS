import { useState, useContext, useEffect } from "react";
import { useHttpClient } from "../hooks/http-hook";
import { AuthContext } from "../context/auth-context";

function PostCommentForm({ setCommentsArr, article_id }) {
  const [commentBodyInput, setCommentBodyInput] = useState("");
  const { isLoading, sendRequest, error, setError } = useHttpClient();
  const { user } = useContext(AuthContext);

  const postNewComment = async () => {
    try {
      const newComment = await sendRequest(
        `https://glawall-nc-backend-project.onrender.com/api/articles/${article_id}/comments`,
        "POST",
        { username: user.username, body: commentBodyInput }
      );
      if (!isLoading) {
        console.log(newComment);
        setCommentsArr((existing) => {
          return [{ ...newComment }, ...existing];
        });
        setCommentBodyInput("");
        alert("nice post");
      }
    } catch (error) {
      console.log(error);
    }
  };

  function handleBodyInput(e) {
    setCommentBodyInput(e.target.value);
  }

  function handleSubmitClick() {
    if (commentBodyInput !== "" && user.username) {
      postNewComment();
    } else {
      setError(new Error("No comment provided"));
    }
  }
  // function PostNewComment(article_id) {
  //   axios
  //     .post(
  //       `https://glawall-nc-backend-project.onrender.com/api/articles/${article_id}/comments`,
  //       { username: user.username,
  //     )
  //     .then((response) => {
  //       setNewComment(response.data);
  //       setCommentsArr((currentComments => [...currentComments, newComment]))
  //       alert("Succesfully Posted")
  //     })
  //     .catch((err) => {
  //       alert("Error with your post")
  //     });
  // }

  return (
    user.username && (
      <>
        <div className="new-comment">
          <label className="body-label"></label>
          <input
            id="body"
            type="text"
            onChange={handleBodyInput}
            value={commentBodyInput}
            required
            placeholder=" Add your comment here"
          ></input>
        </div>
        <br></br>
        <button
          className="post-comment"
          onClick={handleSubmitClick}
          disabled={commentBodyInput.length === 0}
        >
          Post New Comment
        </button>
      </>
    )
  );
}

export default PostCommentForm;
