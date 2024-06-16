import { useState, useEffect, useContext, useCallback } from "react";
import AuthContext from "../../store/auth-context";
import { like, unlike, getPostLike } from "../../lib/api";
import useHttp from "../../hooks/use-http";
import classes from "./Likes.module.css";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ModeCommentOutlinedIcon from "@mui/icons-material/ModeCommentOutlined";
import ModeCommentIcon from "@mui/icons-material/ModeComment";
import Comments from "../Comments/Comments";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const Likes = ({ postId }) => {
  const [showComment, setShowComment] = useState(false);
  const [showLike, setShowLike] = useState(false);

  const authCtx = useContext(AuthContext);
  const profileId = authCtx.token;

  const {
    sendRequest: getPostLikes,
    status: likeStatus,
    data: loadedLikes,
  } = useHttp(getPostLike, true);
  const {
    sendRequest: sendLike,
    status: likeRequestStatus,
    error: likeError,
  } = useHttp(like);
  const {
    sendRequest: sendUnlike,
    status: unlikeStatus,
    error: unlikeError,
  } = useHttp(unlike);

  useEffect(() => {
    getPostLikes(postId);
  }, [getPostLikes, postId]);

  const refreshLikesHandler = useCallback(() => {
    getPostLikes(postId);
  }, [getPostLikes, postId]);

  useEffect(() => {
    if (likeRequestStatus === "completed" && !likeError) {
      refreshLikesHandler();
    }
  }, [likeRequestStatus, likeError, refreshLikesHandler]);

  useEffect(() => {
    if (unlikeStatus === "completed" && !unlikeError) {
      refreshLikesHandler();
    }
  }, [unlikeStatus, unlikeError, refreshLikesHandler]);

  const submitLikeHandler = () => {
    sendLike({ likeData: { userId: profileId }, profileId, postId });
  };

  const submitUnlikeHandler = () => {
    const likeId = loadedLikes.find((like) => like.userId === profileId)?.id;
    if (likeId) {
      sendUnlike({ likeId, postId });
    }
  };

  const toggleLikeModal = () => setShowLike((prevState) => !prevState);
  const toggleCommentSection = () => setShowComment((prevState) => !prevState);

  const isLiked = loadedLikes?.some((user) => user.userId === profileId);
  const likeButton = isLiked ? (
    <ThumbUpAltIcon color="error" onClick={submitUnlikeHandler} />
  ) : (
    <ThumbUpOutlinedIcon color="action" onClick={submitLikeHandler} />
  );

  return (
    <>
      <div className={classes.likes}>
        {likeStatus === "completed" && loadedLikes && (
          <>
            <ThumbUpAltIcon color="error" onClick={toggleLikeModal} />
            {loadedLikes.length}
            <Modal
              open={showLike}
              onClose={toggleLikeModal}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={modalStyle}>
                {loadedLikes.map((user) => (
                  <Typography
                    key={user.id}
                    id="modal-modal-title"
                    variant="h6"
                    component="h2"
                  >
                    {user.fullName}
                  </Typography>
                ))}
              </Box>
            </Modal>
          </>
        )}
      </div>
      <div className={classes.action}>
        <div className={classes.buttons}>{likeButton}</div>
        <div className={classes.buttons}>
          {showComment ? (
            <ModeCommentIcon onClick={toggleCommentSection} />
          ) : (
            <ModeCommentOutlinedIcon
              onClick={toggleCommentSection}
              color="action"
            />
          )}
        </div>
      </div>
      {showComment && <Comments postId={postId} />}
    </>
  );
};

export default Likes;
