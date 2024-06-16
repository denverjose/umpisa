import { useEffect, useContext, useCallback } from "react";
import PostForm from "../components/ProfilePosts/PostForm";
import AuthContext from "../store/auth-context";
import PostsList from "../components/ProfilePosts/PostsList";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import useHttp from "../hooks/use-http";
import { getAllPosts } from "../lib/api";

const Feed = () => {
  const { token: profileId } = useContext(AuthContext);

  const { sendRequest, status, data: loadedPosts, error } = useHttp(getAllPosts, true);

  useEffect(() => {
    sendRequest();
  }, [sendRequest]);

  const addedPostHandler = useCallback(() => {
    sendRequest();
  }, [sendRequest]);

  let posts;

  if (status === "pending") {
    posts = (
      <div className="centered">
        <LoadingSpinner />
      </div>
    );
  } else if (status === "completed") {
    if (error) {
      posts = <p className="centered">{error}</p>;
    } else if (loadedPosts && loadedPosts.length > 0) {
      posts = <PostsList posts={loadedPosts} />;
    } else {
      posts = <h1 className="centered">NO POSTS</h1>;
    }
  }

  return (
    <>
      <PostForm profileId={profileId} onAddedPost={addedPostHandler} />
      {posts}
    </>
  );
};

export default Feed;
