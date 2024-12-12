import { axiosApiRequest } from "@/utils/api";

import {
  ForgotPassWordFormInterface,
  LoginFromInterface,
  GetAllUsersInterface,
} from "@/interface/index";
import { CreateUserInterface } from "@/pages/users/create/interface";

export const getAllUsers = async ({
  params,
}: {
  params: {
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    role?: string;
    search?: string;
    page?: number;
    pageSize?: number;
    clientId?: string;
  };
}) => {
  try {
    const res: {
      status: number;
      data: GetAllUsersInterface;
    } = await axiosApiRequest({
      method: "get",
      url: `/users/`,
      params,
      headers: {
        "X-access-Token": localStorage.getItem("token"),
      },
    });
    return res;
  } catch (e: unknown) {
    console.error("[getAllUsers]-error", e);
  }
};

export const getUserById = async ({ userId } = { userId: "" }) => {
  try {
    const res = await axiosApiRequest({
      method: "get",
      url: `/users/${userId || "current-user"}/`,
      headers: {
        "X-access-Token": localStorage.getItem("token"),
      },
    });
    return res;
  } catch (e) {
    console.error(e);
  }
};

export const deleteUserById = async ({ userId }: { userId: string }) => {
  try {
    const res = await axiosApiRequest({
      method: "delete",
      url: `/users/${userId}/`,
      headers: {
        "X-access-Token": localStorage.getItem("token"),
      },
    });
    return res;
  } catch (e: any) {
    console.error(e);
  }
};

export const deletePermanentUserById = async ({
  userId,
  clientId,
}: {
  userId: string;
  clientId: string;
}) => {
  try {
    const res = await axiosApiRequest({
      method: "delete",
      url: `/users/permanent-delete-user/${userId}/`,
      params: { clientId: clientId },
      headers: {
        "X-access-Token": localStorage.getItem("token"),
      },
    });
    return res;
  } catch (e: any) {
    throw new Error(e);
  }
};

export const createUser = async ({ data }: { data: CreateUserInterface }) => {
  try {
    const res = await axiosApiRequest({
      method: "post",
      url: `/auth/signup/`,
      data: data,
      headers: {
        "X-access-Token": localStorage.getItem("token"),
      },
    });
    return res;
  } catch (e) {
    console.error(e);
  }
};

export const updateUserStatus = async (id: string) => {
  try {
    const res = await axiosApiRequest({
      method: "put",
      url: `/users/status/${id}`,
      headers: {
        "X-access-Token": localStorage.getItem("token"),
      },
    });
    return res;
  } catch (e: any) {
    console.error(e);
  }
};

export const updateUser = async ({ id, data }: { id: string; data: CreateUserInterface }) => {
  try {
    const res = await axiosApiRequest({
      method: "put",
      url: `/users/${id}/`,
      data: data,
      headers: {
        "X-access-Token": localStorage.getItem("token"),
      },
    });
    return res;
  } catch (e) {
    console.error(e);
  }
};

export const changePassword = async ({ id, password }: { id: string; password: string }) => {
  try {
    const res = await axiosApiRequest({
      method: "post",
      url: `/auth/reset-password/${id}`,
      data: { password },
      headers: {
        "X-access-Token": localStorage.getItem("token"),
      },
    });
    if (res.status === 200) {
      return res;
    } else {
      return false;
    }
  } catch (e) {
    console.error(e);
  }
};

export const resetPassword = async ({
  id,
  data,
  token,
}: {
  id: string;
  data: {
    password: string;
  };
  token: string;
}) => {
  try {
    const res = await axiosApiRequest({
      method: "post",
      url: `/auth/set-password/${id}/${token}`,
      data: data,
    });
    if (res.status === 200) {
      return res;
    } else {
      return false;
    }
  } catch (e) {
    console.error(e);
  }
};

export const forgotPassword = async ({ data }: { data: ForgotPassWordFormInterface }) => {
  try {
    const res = await axiosApiRequest({
      method: "post",
      url: `/auth/forgot-password`,
      data: data,
    });
    if (res.status === 200) {
      return res;
    } else {
      return false;
    }
  } catch (e) {
    console.error(e);
  }
};

export const signIn = async ({ data }: { data: LoginFromInterface }) => {
  try {
    const res = await axiosApiRequest({
      method: "post",
      url: `/auth/signIn`,
      data: data,
    });
    return res;
  } catch (e) {
    console.error(e);
  }
};

export const isAuthentication = async ({ accessToken }: { accessToken: string }) => {
  try {
    const res = await axiosApiRequest({
      method: "post",
      url: `/auth/is-user-authentication`,
      data: { accessToken },
    });
    return res;
  } catch (e) {
    console.error(e);
  }
};

export const userByEmailOrNumber = async ({ searchTerm }: { searchTerm: string }) => {
  try {
    const res = await axiosApiRequest({
      method: "post",
      url: `/auth/is-user-exist`,
      data: { searchTerm },
    });
    return res;
  } catch (e) {
    console.error(e);
  }
};

export const userLoginByEmailContact = async ({
  data,
}: {
  data: { emailContact: string; loginSide: string };
}) => {
  try {
    const res = await axiosApiRequest({
      method: "post",
      url: `/auth/user-verification`,
      data,
    });
    return res;
  } catch (e) {
    console.error(e);
  }
};
