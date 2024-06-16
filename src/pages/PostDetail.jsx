import { useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import useHttp from "../hooks/use-http";
import { getSinglePost } from "../lib/api";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import Avatar from "@mui/material/Avatar";
import Card from "../components/UI/Card";
import Likes from "../components/Likes/Likes";
import classes from "./PostDetail.module.css";

const PostDetail = () => {
  const { userId } = useParams();
  const location = useLocation();
  const postId = new URLSearchParams(location.search).get("postId");

  const { sendRequest, status, data: loadedPost, error } = useHttp(getSinglePost, true);

  useEffect(() => {
    sendRequest({ postId, userId });
  }, [sendRequest, postId, userId]);

  if (status === "pending") {
    return (
      <div className="centered">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return <p className="centered">{error}</p>;
  }

  return (
    <Card className={classes.post}>
      <div className={classes.profile}>
        <Avatar
          alt={loadedPost.fullName}
          src={loadedPost.profilePicture}
          sx={{ width: 70, height: 70 }}
        />
        <Link className={classes.name} to={`/profile/${loadedPost.postedBy}`}>
          {loadedPost.fullName}
        </Link>
      </div>
      <p>{loadedPost.text}</p>
      <Likes postId={loadedPost.id} />
    </Card>
  );
};

export default PostDetail;
