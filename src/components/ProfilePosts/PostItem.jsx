import classes from "./PostItem.module.css";
import { Link } from "react-router-dom";
import Likes from "../Likes/Likes";
import Avatar from "@mui/material/Avatar";

const PostItem = (props) => {
  return (
    <li className={classes.post}>
      <div className={classes.profile}>
        <Avatar
          alt={props.fullName}
          src={props.profilePicture}
        />
        <Link className={classes.name} to={`/profile/${props.postedBy}`}>
          {props.fullName}
        </Link>
      </div>
      <div className={classes.text}>
        <p>{props.text}</p>
      </div>
      <div className={classes.options}>
        {props.date}
        <Link
          className={classes.detail}
          to={`/post/${props.postedBy}?postId=${props.postId}`}
        >
          <button>Post Detail</button>
        </Link>
      </div>
      <Likes postId={props.postId} postedBy={props.postedBy} />
    </li>
  );
};

export default PostItem;
