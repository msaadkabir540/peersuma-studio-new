import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import React, { useContext, useEffect } from "react";

import Comments from "./comments";
import MultiSelectBox from "@/components/multi-select-box";
import createNotification from "@/common/create-notification";
import DraftCarouselSection from "./draft-grid-card/draft-carousel-section";

import { updateVideoProjectsStatus } from "@/api-services/video-project";

import { CreateProjectContext } from "@/context/create-project";

import { VideoDraftComponentInterface } from "@/interface/video-draft-interface";
import { LoggedInUserInterface, LogginInterface } from "@/interface/user-selector-interface";

import nodata from "@/assets/nodata.png";

import styles from "./index.module.scss";

const DraftComponent = () => {
  const { users } = useSelector((state: LogginInterface) => state.users);

  const {
    currentUser,
    videoDrafts,
    videoProjects,
    selectedClient,
    currentAllUser,
    handleAddComments,
  } = useContext<VideoDraftComponentInterface>(CreateProjectContext as any);

  const createdUser = users?.find(
    (data: LoggedInUserInterface) => data?._id === (videoProjects?.createdByUser as string),
  );

  const { control, setValue, watch } = useForm<{ status: string }>({
    defaultValues: {
      status: "",
    },
  });

  const isVideoDrafts = videoDrafts === undefined || null || videoDrafts?.length === 0;

  useEffect(() => {
    if (videoProjects?.status) {
      setValue("status", videoProjects?.status);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoProjects]);

  const handleStatusChange = async ({ value }: { value: string }) => {
    try {
      if (watch("status")) {
        const updateData = {
          name: videoProjects?.name,
          status: value || watch("status"),
          oldStatus: videoProjects?.status,
          videoProjectOwnerId: createdUser?._id,
          statusChangeFrom: "peersumaStudio",
        };

        const res = await updateVideoProjectsStatus({
          videoProjectId: videoProjects?._id,
          status: updateData,
        });

        if (res.status === 200) {
          createNotification("success", "Status change successfully ");
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className={styles.selectionStatusClass}>
        <MultiSelectBox
          label={`Video Project :  ${videoProjects?.name}`}
          name="status"
          control={control}
          isClearable={false}
          isSearchable={false}
          options={statusOption || []}
          handleChange={() => handleStatusChange({ value: watch("status") })}
        />
      </div>
      {isVideoDrafts ? (
        <div className={styles.noDataClass}>
          <img style={{ cursor: "pointer" }} src={nodata} alt="icon" />
        </div>
      ) : (
        <div className={`${styles.backgroundColor}`}>
          <div className={styles.flexLeft} id="draft-video-container">
            <DraftCarouselSection
              assets={videoDrafts?.[0]?.draftVideo}
              videoDraftsId={videoDrafts?.[0]?._id}
            />
          </div>

          <div
            className={styles.flexRight}
            style={{
              overflow: "auto",
            }}
          >
            <Comments
              draftId={videoDrafts?.[0]?._id}
              currentUser={currentUser}
              clientId={selectedClient}
              commentsData={videoDrafts?.[0]?.comments}
              handleAddComments={handleAddComments}
              videoProjectId={videoDrafts?.[0]?.videoProjectId}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default DraftComponent;

const statusOption = [
  { value: "in-production", label: "In Production" },
  { value: "in-post-production", label: "In Post Production" },
  {
    value: "in-review",
    label: "Draft Review",
  },
  {
    value: "cancelled",
    label: "Cancelled",
  },
  {
    value: "closed",
    label: "Closed",
  },
];
