import React, { useMemo } from "react";

import createNotification from "@/common/create-notification";

import { InvitesBoxInterface } from "../albuminterface";

import styles from "../index.module.scss";

const InviteBox = ({
  users,
  shotUrl,
  invites,
  getLetter,
  emailDialogue,
  handleDragEnd,
  setEmailDialogue,
}: InvitesBoxInterface) => {
  const onDragOver = (e: React.DragEvent<HTMLInputElement>) => {
    e.preventDefault();
  };

  const onDrop = async (e: React.DragEvent<HTMLInputElement>) => {
    e.preventDefault();
    const dragMedia = JSON.parse(e.dataTransfer.getData("user-data"));

    if (!shotUrl) {
      createNotification("error", "Please create shotURL First");
    } else if (dragMedia.length !== 0) {
      setEmailDialogue({
        ...emailDialogue,
        open: true,
        user: dragMedia,
      });
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const countMap: { [key: string]: number } = {};

  const userFiltered = useMemo(() => {
    return invites
      ?.map(
        ({ id }) =>
          users?.find(({ _id }: { _id: string }) => {
            if (id === _id) {
              const id = _id;
              return (countMap[id] = (countMap[id] || 0) + 1);
            }
          }),
      )
      ?.filter(Boolean);
  }, [invites, countMap, users]);

  const invitesUser = useMemo(() => {
    return Object?.keys(countMap)?.map((id) => ({
      object: userFiltered?.find((obj) => obj?._id === id),
      count: countMap[id],
    }));
  }, [userFiltered, countMap]);

  return (
    <div className={styles.emailDragBox}>
      <div className={styles.dragDiv}>
        <div className={styles.dragText}>Drag a user here to invite to this shot</div>
      </div>
      <div
        {...{
          onDrop,
          onDragOver,
        }}
        className={`${invites?.length !== 0 ? styles.emailDragContainer : styles.emailDrag} `}
      >
        {invites &&
          invites?.length > 0 &&
          invitesUser?.map((data, index: number) => {
            const name = data?.object?.firstName || data?.object?.username;
            return (
              <>
                <div>
                  <div
                    className={styles.userList}
                    style={{ cursor: "grab" }}
                    {...{ draggable: true, onDragEnd: handleDragEnd }}
                    key={index}
                    title={`${name} ${data?.object?.lastName} \nInvitations Sent: ${data?.count} `}
                  >
                    <div className={styles.userIcons}>{getLetter(name as string)}</div>
                    <div className={styles.email}>
                      <div className={styles.nameDiv}>{name}</div>
                    </div>
                  </div>
                </div>
              </>
            );
          })}
      </div>
    </div>
  );
};

export default InviteBox;
