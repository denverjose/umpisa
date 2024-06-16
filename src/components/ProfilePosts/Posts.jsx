import { useEffect, useCallback } from "react";
import { getProfilePost } from "../../lib/api";
import classes from "./Posts.module.css";
import useHttp from "../../hooks/use-http";
import LoadingSpinner from "../UI/LoadingSpinner";
import PostsList from "./PostsList";

const Posts = (props) => {
  const { profileId } = props;

  const { sendRequest, status, data: loadedPosts } = useHttp(getProfilePost);

  useEffect(() => {
    sendRequest(profileId);
  }, [profileId, sendRequest]);

  const addedPostHandler = useCallback(() => {
    sendRequest(profileId);
  }, [sendRequest, profileId]);

  let posts;

  if (status === "pending") {
    posts = (
      <div className="centered">
        <LoadingSpinner />
      </div>
    );
  }

  if (status === "completed" && loadedPosts && loadedPosts.length > 0) {
    posts = <PostsList onAddedLike={addedPostHandler} posts={loadedPosts} />;
  }

  if (status === "completed" && (!loadedPosts || loadedPosts.length === 0)) {
    posts = <p className="centered">No posts were added yet!</p>;
  }

  return (
    <section className={classes.posts}>
      {posts}
    </section>
  );
};

export default Posts;
