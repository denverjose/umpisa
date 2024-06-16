import PostItem from "./PostItem";
import classes from "./PostsList.module.css";

const PostsList = (props) => {
  return (
    <ul className={classes.posts}>
      {props.posts.map((post) => (
        <PostItem
          key={post.id}
          postId={post.id}
          userId={post.userId}
          text={post.text}
          fullName={post.fullName}
          profilePicture={post.profilePicture}
          postedBy={post.postedBy}
          date={post.datePosted}
        />
      ))}
    </ul>
  );
};

export default PostsList;
