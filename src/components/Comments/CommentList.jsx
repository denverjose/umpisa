import CommentItem from "./CommentItem";
import classes from "./CommentList.module.css";

const CommentList = (props) => {
  return (
    <ul className={classes.comments}>
      {props.comments.map((comment) => (
        <li key={comment.id}>
          <CommentItem
            key={comment.id}
            id={comment.id}
            commentedBy={comment.userId}
            fullName={comment.fullName}
            text={comment.text}
            profilePicture={comment.profilePicture}
          />
        </li>
      ))}
    </ul>
  );
};

export default CommentList;
