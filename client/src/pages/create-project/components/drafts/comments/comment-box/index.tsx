import styles from "../index.module.scss";

const CommentBox = ({
  name,
  time,
  comment,
  color,
}: {
  name: string;
  time: string;
  comment: string;
  color: string;
}) => {
  const subName = name?.charAt(0);
  return (
    <div className={styles.commentBox}>
      <div className={styles.commentBody}>
        <div className={styles.commentTitle}>
          <div className={`${styles.colorPink} ${color}`}>{subName}</div>
          <div className={styles.commentsText}>{name}</div>
          <div className={styles.commentTime}>{time}</div>
        </div>
        <div className={styles.commentsMessage}>{comment}</div>
      </div>
    </div>
  );
};

export default CommentBox;
