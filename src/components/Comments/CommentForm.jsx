import { useState, useEffect, useContext } from "react";
import classes from "./CommentForm.module.css";
import { addComment } from "../../lib/api";
import LoadingSpinner from "../UI/LoadingSpinner";
import useHttp from "../../hooks/use-http";
import AuthContext from "../../store/auth-context";
import ProfileContext from "../../store/profile-context";
import Avatar from "@mui/material/Avatar";

const CommentForm = (props) => {
  const [commentText, setCommentText] = useState("");
  const authCtx = useContext(AuthContext);
  const profileCtx = useContext(ProfileContext);
  const profileId = authCtx.token;
  const profilePicture = profileCtx.profilePicture;
  const fullName = profileCtx.fullName;

  const { sendRequest, status, error } = useHttp(addComment);

  const { onAddedComment } = props;

  useEffect(() => {
    if (status === "completed" && !error) {
      onAddedComment();
    }
  }, [status, error, onAddedComment]);

  const submitFormHandler = (event) => {
    event.preventDefault();
    if (commentText) {
      sendRequest({
        commentData: {
          userId: profileId,
          text: commentText,
        },
        postId: props.postId,
      });
    }
    setCommentText("");
  };

  return (
    <form className={classes.form} onSubmit={submitFormHandler}>
      <div className={classes.control}>
        <Avatar variant="rounded" alt={fullName} src={profilePicture} />
        <input
          placeholder="Write a comment..."
          id="comment"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
      </div>
      {status === "pending" && (
        <div className={classes.center}>
          <LoadingSpinner />
        </div>
      )}
    </form>
  );
};

export default CommentForm;
