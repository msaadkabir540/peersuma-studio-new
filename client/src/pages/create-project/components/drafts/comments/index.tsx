import moment from "moment";
import React, { useMemo, useState } from "react";

import CommentBox from "./comment-box";

import Input from "@/components/input";

import sendIcon from "@/assets/arrow-simple.svg";

import { CommentBoxInterface, CommentInterface } from "./comment-box.interface";

import styles from "./index.module.scss";

const Comments = ({
  commentsData,
  draftId,
  currentUser,
  videoProjectId,
  clientId,
  handleAddComments,
}: CommentBoxInterface) => {
  const [comment, setComment] = useState<string>("");

  const handleAddComment = async ({ comment, id }: { comment: string; id: string }) => {
    await handleAddComments({
      comment,
      videoProjectId,
      clientId,
      currentUser,
      videoDraftId: id,
    });
    setComment("");
  };

  const commentsResult = useMemo(() => {
    return (
      commentsData?.map((comment: CommentInterface) => {
        let name = "";
        let color;
        if (comment?.userId?._id === currentUser?.userId) {
          color = styles.colorPink;
          name = comment?.userId?.fullName || comment?.userId?.username || "Unknown";
        } else {
          name = comment?.userId?.fullName || comment?.userId?.username || "Unknown";
          color = styles.colorSkyblue;
        }
        const date = moment(comment?.createdAt).format("YYYY-MM-DD | hh:mm A");
        const description = comment?.comment ?? "";

        return { id: comment?._id, name, date, description, color };
      }) || []
    );
  }, [commentsData, currentUser?.userId]);

  return (
    <div className={styles.commentContainer}>
      <div className={styles.commentsBody}>
        <div className={styles.commentsBox}>
          {commentsResult?.map(({ name, date, description, id, color }) => {
            return (
              <>
                <div className={styles.comments} key={id}>
                  <CommentBox time={date} name={name} comment={description} color={color} />
                </div>
              </>
            );
          })}
        </div>
        <div className={styles.sendMessageBox}>
          <Input
            name="comment"
            value={comment}
            placeholder="Type Something"
            inputClass={styles.inputField}
            onChange={(e) => {
              setComment(e.target.value);
            }}
          />

          <div className={styles.sendBtn}>
            <img
              src={sendIcon}
              alt="send comment icon"
              onClick={() => handleAddComment({ comment, id: draftId })}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comments;
