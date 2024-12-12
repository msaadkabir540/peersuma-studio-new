import { axiosApiRequest } from "@/utils/api";

import createNotification from "@/common/create-notification";

import { AddThemesInterface } from "@/interface/themes-interface";
import { AddInventoriesInterface } from "@/interface/inventories-interface";

export const createInventory = async ({ data }: { data: AddInventoriesInterface }) => {
  try {
    const res = await axiosApiRequest({
      method: "post",
      url: `/inventory`,
      data,
    });
    if (res.status === 200) {
      createNotification("success", "Theme created successfully");
      return res;
    } else {
      return [];
    }
  } catch (e: unknown) {
    console.error(e);
  }
};

export const getAllInventoryData = async ({
  sortBy,
  sortOrder,
  search,
}: {
  sortOrder?: string;
  search?: string;
  sortBy?: string;
}) => {
  try {
    const res = await axiosApiRequest({
      method: "get",
      url: `/inventory`,
      params: {
        sortBy,
        sortOrder,
        search,
      },
    });

    if (res.status === 200) {
      return res?.data?.allInventory;
    } else {
      return [];
    }
  } catch (e) {
    console.error(e);
  }
};

export const deleteInventoryById = async ({ id }: { id: string }) => {
  try {
    const res = await axiosApiRequest({
      method: "delete",
      url: `/inventory/${id}`,
    });
    if (res.status === 200) {
      createNotification("success", "Inventory deleted successfully.");
      return res?.data;
    } else {
      return [];
    }
  } catch (e) {
    console.error(e);
  }
};

export const getInventoryById = async ({ id }: { id: string }) => {
  try {
    const res = await axiosApiRequest({
      method: "get",
      url: `/inventory/${id}`,
    });
    if (res.status === 200) {
      return res?.data;
    } else {
      return [];
    }
  } catch (e) {
    console.error(e);
  }
};

export const updateInventoryById = async ({
  id,
  data,
}: {
  id: string;
  data: AddThemesInterface;
}) => {
  try {
    const res = await axiosApiRequest({
      method: "put",
      url: `/inventory/${id}`,
      data,
    });
    if (res.status === 200) {
      createNotification("success", "Inventory update successfully.");
      return res;
    } else {
      return [];
    }
  } catch (e) {
    console.error(e);
  }
};
