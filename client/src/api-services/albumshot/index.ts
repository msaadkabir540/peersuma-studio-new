import createNotification from "@/common/create-notification";

import { axiosApiRequest } from "@/utils/api";

import {
  AddAlbumShotRequestInterface,
  InvitationUserEmailInterface,
  UpdateAlbumShotRequestInterface,
  UpdateShotVisibilityRequestInterface,
  RemoveAlbumShotMediaRequestInterface,
} from "@/interface/album-shot-interface";
import { MediaUploadFileType } from "@/pages/media-library/media-library-interface";

export const addAlbumshot = async (data: AddAlbumShotRequestInterface) => {
  const res = await axiosApiRequest({
    method: "post",
    url: "/albumshot",
    data,
  });
  if (res.status === 200) {
    createNotification("success", res.data.msg);
    return res?.data;
  } else {
    createNotification("error", res.data.error);
  }
};

export const updateAlbumshot = async (id: string, data: UpdateAlbumShotRequestInterface) => {
  const res = await axiosApiRequest({
    method: "put",
    url: `/albumshot/${id}`,
    data,
  });

  if (res.status === 200) {
    createNotification("success", res.data.msg);
    return res?.data;
  }
};

export const getAlbumshotByIdORShotUrl = async (params: { shotUrl: string }) => {
  return await axiosApiRequest({
    method: "get",
    url: `/albumshot/single_shot`,
    params,
  });
};

export const uploadShotMedia = async ({
  id,
  media,
  data,
}: {
  id: string;
  media?: MediaUploadFileType;
  data?: MediaUploadFileType;
}) => {
  const res = await axiosApiRequest({
    method: "put",
    url: `/albumshot/upload/${id}`,
    data: media || data,
  });
  if (res.status === 200) {
    return true;
  } else {
    return false;
  }
};

export const updateAlbumShotUrl = async ({ id, shotUrl }: { id: string; shotUrl: string }) => {
  const res = await axiosApiRequest({
    method: "put",
    url: `/albumshot/shotUrl/${id}`,
    data: { shotUrl },
  });
  if (res.status === 200) {
    createNotification("success", res?.data?.msg);
    return res;
  } else {
    createNotification("error", res?.data?.error);
    return false;
  }
};

export const updateAlbumShotVisibility = async ({
  id,
  params,
}: UpdateShotVisibilityRequestInterface) => {
  const res = await axiosApiRequest({
    method: "put",
    url: `/albumshot/updateAlbumShotVisibility/${id}`,
    params,
  });
  if (res.status === 200) {
    createNotification("success", res?.data?.msg);
    return res;
  } else {
    createNotification("error", res?.data?.error);
    return false;
  }
};

export const deleteAlbumshot = async (id: string) => {
  const res = await axiosApiRequest({
    method: "delete",
    url: `/albumshot/${id}`,
  });
  if (res.status === 200) {
    createNotification("success", res?.data?.msg);
  } else {
    createNotification("error", res?.data?.error);
  }
};

export const removeAlbumShotMedia = async (params: RemoveAlbumShotMediaRequestInterface) => {
  const res = await axiosApiRequest({
    method: "delete",
    url: `/albumshot/delete-media`,
    params,
  });
  if (res.status === 200) {
    createNotification("success", res.data.msg);
    return true;
  } else {
    createNotification("error", res.data.error);
    return false;
  }
};

// api for send email invitation to user
export const invitationUserEmail = async (data: InvitationUserEmailInterface) => {
  try {
    const res = await axiosApiRequest({
      method: "post",
      url: `/albumshot/invitation`,
      data,
    });
    if (res.status === 200) {
      createNotification("success", res?.data?.msg);
      return true;
    } else {
      createNotification("error", res?.data?.error || "Something Wrong");
      return false;
    }
  } catch (e) {
    console.error(e as string);
  }
};
