import { handleDownload } from "../utils";
import { axiosApiRequest } from "@/utils/api";
import createNotification from "@/common/create-notification";

export const getAllProject = async ({ selectedClient }: { selectedClient: string | undefined }) => {
  let selectedClientId;
  typeof selectedClient === "string"
    ? (selectedClientId = selectedClient)
    : (selectedClientId = selectedClient?.[0]?.clientId);

  const res = await axiosApiRequest({
    method: "get",
    url: `/project`,
    params: {
      clientId: selectedClientId,
    },
  });
  if (res.status === 200) {
    return res;
  }
};

export const updateProjectStatus = async ({
  projectStatusResult,
  id,
}: {
  projectStatusResult: string;
  id: string;
}) => {
  const res = await axiosApiRequest({
    method: "put",
    url: `/project/updateStatus/${id}`,
    data: {
      projectStatusResult,
    },
  });
  if (res.status === 200) {
    return res;
  }
};

export const deleteProjectById = async ({ id }: { id: string }) => {
  const res = await axiosApiRequest({
    method: "delete",
    url: `/project/${id}`,
  });
  if (res.status === 200) {
    createNotification("success", res?.data?.msg || "Project Removed Successfully!");
    return res;
  }
};

export const mergeFinalVideo = async (data: any) => {
  try {
    const res = await axiosApiRequest({
      method: "post",
      url: `/project/merge-final-video`,
      data,
    });
    if (res.status === 200) {
      await handleDownload({
        finalFileName: `${data.finalFileName}.mp4`,
        s3Key: res?.data?.s3Key,
      });
    } else {
      createNotification("error", res?.data?.msg || "Category Creation Failed!", 15000);
    }
  } catch (e) {
    console.error(e);
  }
};

export const createProject = async ({
  data,
}: {
  data: {
    projectName?: string;
    yourName?: string;
    albumId?: string;
    projectStatus?: string;
    clientId: string;
  };
}) => {
  const transformData = {
    projectName: data?.projectName,
    yourName: data?.yourName,
    albumId: data?.albumId && data?.albumId,
    projectStatus: "Opened",
    clientId: data?.clientId,
  };

  const res = await axiosApiRequest({
    method: "post",
    url: `/project`,
    data: { ...transformData },
  });
  if (res?.status === 500)
    createNotification("error", res?.data?.msg || "Failed to update project!", 15000);
  if (res.status === 200) {
    createNotification("success", res?.data?.msg || "Project Created successfully!");
    return res;
  }
};

export const updateProjectById = async ({
  id,
  data,
}: {
  id: string;
  data: {
    projectName?: string;
    yourName?: string;
    albumId?: string;
    projectStatus?: string;
    clientId: string;
  };
}) => {
  const res = await axiosApiRequest({
    method: "put",
    url: "/project/" + id,
    data,
  });
  if (res?.status === 500)
    createNotification("error", res?.data?.msg || "Failed to update project!", 15000);

  if (res.status === 200) {
    createNotification("success", res?.data?.msg || "Update project successfully!");
    return res;
  }
};

export const updateProjectNameById = async ({
  id,
  data,
}: {
  id: string;
  data: {
    projectName?: string;
    yourName?: string;
    albumId?: string;
    projectStatus?: string;
    clientId: string;
  };
}) => {
  const res = await axiosApiRequest({
    method: "put",
    url: "/project/update-project-name/" + id,
    data,
  });
  if (res?.status === 500)
    createNotification("error", res?.data?.msg || "Failed to update project!", 15000);

  if (res.status === 200) {
    createNotification("success", res?.data?.msg || "Update project successfully!");
    return res;
  }
};

export const deleteFinalVideoFile = async ({ s3Key, id }: { s3Key: string; id: string }) => {
  const res = await axiosApiRequest({
    method: "delete",
    url: "/project/delete-file",
    params: { Key: s3Key, keyName: "finalVideos", id },
  });
  if (res.status === 200) {
    return res;
  }
};
export const handleUpdateProcessingStatus = async ({
  id,
  status,
}: {
  id: string;
  status: boolean;
}) => {
  const res = await axiosApiRequest({
    method: "patch",
    url: "/project/update-processing-status",
    params: { id, status },
  });
  if (res.status === 200) {
    return res;
  }
};
