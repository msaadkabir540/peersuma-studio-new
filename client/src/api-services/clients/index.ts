import createNotification from "@/common/create-notification";
import { CreateUpdateInterface, GetAllClientsInterfacae } from "@/pages/clients/clients-interface";

import { axiosApiRequest } from "@/utils/api";

export const getAllClients = async ({ params }: { params: GetAllClientsInterfacae }) => {
  try {
    const res = await axiosApiRequest({
      method: "get",
      url: `/client/`,
      params,
      headers: {
        "X-access-Token": localStorage.getItem("token"),
      },
    });
    return res;
  } catch (e) {
    console.error("[getAllClients]-error", e);
  }
};

export const getClientById = async ({ clientId }: { clientId: string }) => {
  try {
    const res = await axiosApiRequest({
      method: "get",
      url: `/client/${clientId}/`,
      headers: {
        "X-access-Token": localStorage.getItem("token"),
      },
    });
    return res;
  } catch (e) {
    console.error(e);
  }
};

export const deleteClient = async ({ id }: { id: string }) => {
  try {
    const res = await axiosApiRequest({
      method: "delete",
      url: `/client/${id}/`,
      headers: {
        "X-access-Token": localStorage.getItem("token"),
      },
    });
    return res;
  } catch (e) {
    console.error(e);
  }
};

export const updateClientStatus = async ({
  id,
  data,
}: {
  id: string;
  data: { status: boolean | undefined };
}) => {
  const res = await axiosApiRequest({
    method: "put",
    url: `/client/status/${id}`,
    data,
    headers: {
      "X-access-Token": localStorage.getItem("token"),
    },
  });
  if (res.status === 200) {
    createNotification("success", "Successfully Updated!");
    return res;
  }
};

export const updateClient = async ({ id, data }: { id: string; data: CreateUpdateInterface }) => {
  try {
    const res = await axiosApiRequest({
      method: "put",
      data: data,
      url: `/client/${id}/`,
      headers: {
        "X-access-Token": localStorage.getItem("token"),
      },
    });
    return res;
  } catch (e) {
    console.error(e);
  }
};

export const createClient = async ({ data }: { data: CreateUpdateInterface }) => {
  try {
    const res = await axiosApiRequest({
      method: "post",
      data: data,
      url: `/client/`,
      headers: {
        "X-access-Token": localStorage.getItem("token"),
      },
    });
    return res;
  } catch (e) {
    console.error(e);
  }
};

export const demoSchoolLogout = async () => {
  try {
    const res = await axiosApiRequest({
      method: "post",
      url: `/auth/demo-school-logout`,
    });
    return res;
  } catch (e) {
    console.error(e);
  }
};
