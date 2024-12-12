import { axiosApiRequest } from "@/utils/api";

import createNotification from "@/common/create-notification";

import { FieldSchema } from "@/pages/album/main/album-interface";
import { GetAllAlbumsdParamsInterface } from "@/interface/album-interface";

export const getAllAlbums = async ({
  params,
}: {
  params: {
    data?: GetAllAlbumsdParamsInterface[];
    clientId?: string;
  };
}) => {
  const res = await axiosApiRequest({
    method: "get",
    url: "/albums",
    params,
  });
  if (res.status === 200) {
    return res;
  }
};

export const getAllAlbums1 = async ({ params }: { params: any }) => {
  const { status, data } = await axiosApiRequest({
    method: "get",
    url: "/albums/get-all-album",
    params,
  });
  if (status === 200) {
    return {
      albumsData: data?.data || [],
    };
  }
};

export const addAlbum = async ({ data }: { data: FieldSchema }) => {
  const res = await axiosApiRequest({
    method: "post",
    url: "/albums",
    data,
  });
  if (res.status === 200) {
    createNotification("success", res.data.msg);
    return res;
  }
};

export const updateAlbum = async ({ id, data }: { id: string; data: FieldSchema }) => {
  const res = await axiosApiRequest({
    method: "put",
    url: `/albums/${id}`,
    data,
  });
  if (res.status === 200) {
    createNotification("success", res.data.msg);
    return res?.data;
  }
};

export const getAlbumsById = async ({ params }: { params: { id: string } }) => {
  const res = await axiosApiRequest({
    method: "get",
    url: `/albums/single_album`,
    params,
  });
  if (res.status === 200) {
    return res;
  } else {
    return res;
  }
};
