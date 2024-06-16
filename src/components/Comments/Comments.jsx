import { useEffect, useCallback } from "react";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";
import useHttp from "../../hooks/use-http";
import LoadingSpinner from "../UI/LoadingSpinner";
import { getPostComment } from "../../lib/api";

const Comments = (props) => {
  const { sendRequest, status, data: loadedComments } = useHttp(getPostComment);

  useEffect(() => {
    sendRequest(props.postId);
  }, [props.postId, sendRequest]);

  const addedCommentHandler = useCallback(() => {
    sendRequest(props.postId);
  }, [sendRequest, props.postId]);

  let comments;

  if (status === "pending") {
    comments = (
      <div className="centered">
        <LoadingSpinner />
      </div>
    );
  }

  if (status === "completed" && loadedComments && loadedComments.length > 0) {
    comments = <CommentList comments={loadedComments} />;
  }

  return (
    <>
      <CommentForm postId={props.postId} onAddedComment={addedCommentHandler} />
      {comments}
    </>
  );
};

export default Comments;
