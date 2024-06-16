import { useState, useEffect, useContext } from "react";
import useHttp from "../../hooks/use-http";
import { addPost } from "../../lib/api";
import classes from "./PostForm.module.css";
import ProfileContext from "../../store/profile-context";
import LoadingSpinner from "../UI/LoadingSpinner";
import Avatar from "@mui/material/Avatar";

const PostForm = (props) => {
  const [postText, setPostText] = useState("");
  const profileCtx = useContext(ProfileContext);
  const fullName = profileCtx.fullName;
  const profilePicture = profileCtx.profilePicture;
  const { profileId } = props;
  const { sendRequest, status, error } = useHttp(addPost);
  const { onAddedPost } = props;

  useEffect(() => {
    if (status === "completed" && !error) {
      onAddedPost();
    }
  }, [status, error, onAddedPost]);

  const submitFormHandler = (event) => {
    event.preventDefault();
    sendRequest({
      postData: {
        text: postText,
        postedBy: profileId,
      },
      profileId: profileId,
    });
    setPostText("");
  };

  return (
    <form className={classes.form} onSubmit={submitFormHandler}>
      <div className={classes.control}>
        <Avatar variant="rounded" alt={fullName} src={profilePicture} />
        <input
          placeholder="What's on your mind?"
          id="post"
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
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

export default PostForm;
