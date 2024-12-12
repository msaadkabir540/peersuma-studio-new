import createNotification from "@/common/create-notification";
import { AddThemesInterface, GetAllThemesInterface } from "@/interface/themes-interface";
import { axiosApiRequest } from "@/utils/api";

export const createThemes = async ({ data }: { data: AddThemesInterface }) => {
  try {
    const res = await axiosApiRequest({
      method: "post",
      url: `/themes`,
      data,
    });
    if (res.status === 200) {
      createNotification("success", "Theme created successfully");
      return res;
    } else {
      return [];
    }
  } catch (e: any) {
    console.error(e);
    throw new Error(e);
  }
};

export const getAllThemesData = async (params?: GetAllThemesInterface) => {
  try {
    const res = await axiosApiRequest({
      method: "get",
      url: "/themes/",
      params,
    });

    if (res.status === 200) {
      return res?.data?.allThemes;
    } else {
      return [];
    }
  } catch (e) {
    console.error(e);
  }
};

export const deleteThemeById = async ({ id }: { id: string }) => {
  try {
    const res = await axiosApiRequest({
      method: "delete",
      url: `/themes/${id}`,
    });
    if (res.status === 200) {
      createNotification("success", "Theme deleted successfully.");
      return res?.data;
    } else {
      return [];
    }
  } catch (e: any) {
    console.error(e);
    throw new Error(e);
  }
};

export const getThemeById = async ({ id }: { id: string }) => {
  try {
    const res = await axiosApiRequest({
      method: "get",
      url: `/themes/${id}`,
    });
    if (res.status === 200) {
      return res?.data;
    } else {
      return [];
    }
  } catch (e: any) {
    console.error(e);
    throw new Error(e);
  }
};

export const updateThemeById = async ({ id, data }: { id: string; data: AddThemesInterface }) => {
  try {
    const res = await axiosApiRequest({
      method: "put",
      url: `/themes/${id}`,
      data,
    });
    if (res.status === 200) {
      createNotification("success", "Theme update successfully.");
      return res;
    } else {
      return [];
    }
  } catch (e: any) {
    console.error(e);
    throw new Error(e);
  }
};
