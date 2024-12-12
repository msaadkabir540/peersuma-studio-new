import { axiosApiRequest } from "@/utils/api";

import { VideoData } from "@/interface/video-draft-interface";

import createNotification from "@/common/create-notification";

export const addVideoToDraft = async ({ data }: { data: VideoData }) => {
  const res = await axiosApiRequest({
    method: "post",
    url: "/video-draft/",
    headers: {
      "X-access-Token": localStorage.getItem("token"),
    },
    data,
  });
  if (res.status === 200) {
    createNotification("success", res.data.msg);
    return res;
  }
};

export const getVideoDraftByClientId = async ({
  clientId,
  videoProjectId,
}: {
  clientId: string;
  videoProjectId: string;
}) => {
  const res = await axiosApiRequest({
    method: "get",
    url: `/video-draft/get-video-draft-clientId/`,
    headers: {
      "X-Access-Token": localStorage.getItem("token"),
    },
    params: { clientId, videoProjectId },
  });

  if (res.status === 200) {
    return res;
  } else {
    return res;
  }
};

export const addComments = async ({
  clientId,
  videoProjectId,
  userData,
  comments,
  videoDraftId,
}: {
  clientId: string;
  videoDraftId: string;
  videoProjectId: string;
  userData: { name: string; userId: string };
  comments: string;
}) => {
  const res = await axiosApiRequest({
    method: "put",
    url: `/video-draft/add-comments/${videoDraftId}`,
    params: { clientId, videoProjectId, userData, comments },
  });

  if (res.status === 200) {
    return res;
  } else createNotification("success", res.msg);
};
