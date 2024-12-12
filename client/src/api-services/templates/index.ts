import { axiosApiRequest } from "@/utils/api";

import createNotification from "@/common/create-notification";

import {
  GetAllTemplatesInterface,
  GetTemplateByIdInterface,
  TemplatesResponseInterface,
  CreateTemlateRequestInterface,
  TemplateResponseFieldsInterface,
  CreateTemplateResponseInterface,
  UpdateTemplateRequestInterface,
} from "@/interface/template-interface";

export const getAllTemplates: ({
  params,
  setTemplates,
}: GetAllTemplatesInterface) => Promise<TemplatesResponseInterface[]> = async ({
  params,
  setTemplates,
}) => {
  try {
    const res = await axiosApiRequest({
      method: "get",
      url: "/template",
      params,
    });

    if (res.status === 200) {
      setTemplates && setTemplates(res.data.allTemplates);
      return res.data.allTemplates;
    } else {
      console.error("Failed to fetch templates!");
      setTemplates && setTemplates([]);
      return [];
    }
  } catch (e) {
    console.error(e);
  }
};

export const getTemplateById: ({
  templateId,
}: GetTemplateByIdInterface) => Promise<TemplatesResponseInterface> = async ({ templateId }) => {
  try {
    const res = await axiosApiRequest({
      method: "get",
      url: `/template/${templateId}`,
    });
    if (res.status === 200) {
      return res.data;
    } else {
      return [];
    }
  } catch (e) {
    console.error(e);
    throw new Error(e as string);
  }
};

export const getTemplateFields: ({
  templateId,
}: GetTemplateByIdInterface) => Promise<
  Record<string, TemplateResponseFieldsInterface>[]
> = async ({ templateId }) => {
  try {
    const res = await axiosApiRequest({
      method: "get",
      url: `/project/get-fields`,
      params: { templateId },
    });
    if (res.status === 200) {
      return res?.data?.fields;
    } else {
      createNotification("error", res?.data?.msg || "Failed to fetch form fields.", 15000);
      return [];
    }
  } catch (e: any) {
    console.error(e);
    throw new Error(e);
  }
};

export const createTemplates: ({
  data,
}: CreateTemlateRequestInterface) => Promise<
  Record<string, CreateTemplateResponseInterface>[]
> = async ({ data }) => {
  try {
    const res = await axiosApiRequest({
      method: "post",
      url: `/template`,
      data,
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

export const UpdateTemplateById: ({
  data,
  id,
}: UpdateTemplateRequestInterface) => Promise<
  Record<string, CreateTemplateResponseInterface>[]
> = async ({ data, id }) => {
  try {
    const res = await axiosApiRequest({
      method: "put",
      url: `/template/${id}`,
      data,
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

export const deleteTemplateById: ({
  id,
}: {
  id: string;
}) => Promise<string[] | undefined> = async ({ id }) => {
  try {
    const res = await axiosApiRequest({
      method: "delete",
      url: `/template/${id}`,
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
