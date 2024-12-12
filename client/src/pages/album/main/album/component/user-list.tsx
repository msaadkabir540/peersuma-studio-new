import { useRef, useState } from "react";

import Input from "@/components/input";
import Switch from "@/components/switch";

import { useOutsideClickHook } from "@/utils/helper";

import { UserHistoryInterface } from "../../album-interface";
import { SendEmailUserInterface, UserListInterface } from "../albumInterface";

import drag from "@/assets/drag-icon.svg";

import styles from "../index.module.scss";

const UserList: React.FC<UserListInterface> = ({
  users,
  watch,
  invites,
  control,
  register,
  getLetter,
  handleDragEnd,
  handleDragStart,
}) => {
  const userListRef = useRef(null);
  const [userHistory, setUserHistory] = useState<UserHistoryInterface>({
    list: [],
    openAt: -1,
    open: false,
  });
  const userResult = users?.filter(
    (data: SendEmailUserInterface) =>
      data?.firstName?.toLowerCase()?.includes(watch?.("search")?.toLowerCase()) ||
      data?.username?.toLowerCase()?.includes(watch?.("search")?.toLowerCase()),
  );

  const getInvitedTime = (_id: string) => {
    const userInvites = invites?.filter((invite) => invite?.id === _id);
    const latestInvite = userInvites?.reduce(
      (latest, current) =>
        new Date(current.lastInvited) > new Date(latest.lastInvited) ? current : latest,
      userInvites[0] || {},
    );
    const date = latestInvite ? new Date(latestInvite?.lastInvited).toLocaleString() : undefined;
    const count = userInvites?.length || 0;
    return { date, count, userInvites };
  };

  useOutsideClickHook(userListRef, () => {
    setUserHistory({
      open: false,
    });
  });

  return (
    <div ref={userListRef} className={styles.userListContainer}>
      <div>
        <div className={styles.field}>
          <Input
            name="search"
            label={"Search"}
            register={register}
            placeholder={"Search Here"}
            iconClass={styles.iconClass}
            inputClass={styles.inputClass}
          />
        </div>
        <div className={styles.switchContainer}>
          <Switch
            control={control}
            defaultValue={false}
            name={"inviteUser"}
            mainClass={styles.switch}
          />
          <div className={styles.invitedUserText}>{`${
            watch("inviteUser") ? "Invited User " : "Not Invited User"
          } `}</div>
        </div>
        <div className={styles.field}>
          {userResult?.map(({ fullName, username, _id }, index, allUsers) => {
            const name = username || fullName;
            const { count, date, userInvites } = getInvitedTime(_id);
            return watch("inviteUser") && count > 0 ? (
              <div
                className={styles.userList}
                style={{ cursor: "grab" }}
                draggable
                onDragEnd={handleDragEnd}
                onDragStart={(e) =>
                  handleDragStart(e as React.DragEvent<HTMLInputElement>, { ...allUsers[index] })
                }
                key={index}
              >
                <div className={styles.userIcons}>{getLetter(name)}</div>
                <div className={styles.email}>
                  <div className={styles.nameDiv}>{name}</div>
                  <div className={styles.emailDiv}>{`Invitations Sent ${count}`}</div>
                </div>
                <div className={styles.userNotInvited}></div>
                <img className={styles.DragIcon} src={drag} alt="drag" />
              </div>
            ) : !watch("inviteUser") && count <= 0 ? (
              <div
                className={styles.userList}
                style={{ cursor: "grab" }}
                draggable
                onDragEnd={handleDragEnd}
                onDragStart={(e) =>
                  handleDragStart(e as React.DragEvent<HTMLInputElement>, { ...allUsers[index] })
                }
                key={index}
              >
                <div className={styles.userIcons}>{getLetter(name)}</div>
                <div className={styles.email}>
                  <div className={styles.nameDiv}>{name}</div>
                  <div className={styles.emailDiv}></div>
                </div>
                <div className={styles.userNotInvited}></div>
                <img className={styles.DragIcon} src={drag} alt="drag" />
              </div>
            ) : null;
          })}
        </div>
      </div>
    </div>
  );
};

export default UserList;
