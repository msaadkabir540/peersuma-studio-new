import { VideoProjectByIdInterface } from "@/interface/video-draft-interface";
import { axiosApiRequest } from "@/utils/api";

export const getVideoProjectById = async ({ videoProjectId }: { videoProjectId: string }) => {
  try {
    const res = await axiosApiRequest({
      method: "get",
      url: `/video-project/get-video-project/${videoProjectId}`,
      headers: {
        "X-Access-Token": localStorage.getItem("token"),
      },
    });

    if (res.status === 200) {
      return res;
    } else {
      return res;
    }
  } catch (error) {
    console.error(error);
  }
};

export const updateVideoProjectsStatus = async ({
  videoProjectId,
  status,
}: VideoProjectByIdInterface) => {
  try {
    const res = await axiosApiRequest({
      method: "put",
      url: `/video-project/update-video-project-status/${videoProjectId}`,
      headers: {
        "X-Access-Token": localStorage.getItem("token"),
      },
      data: status,
    });

    if (res.status === 200) {
      return res;
    } else {
      return res;
    }
  } catch (error) {
    return error;
  }
};
