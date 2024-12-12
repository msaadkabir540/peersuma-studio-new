import { FieldRenderers } from "@/components/project-field-render-hook/interface";

import { apiRequest } from "@/utils/helper";

import {
  TemplatesInterface,
  TemplateOptionsInterface,
  TemplateIdsInterface,
  SelectedTemplateInterface,
} from "../interface";

export const getProject = async ({
  id,
  fieldRenderers,
}: {
  id: string;
  fieldRenderers: FieldRenderers;
}) => {
  try {
    const { status, data } = await apiRequest({
      type: "get",
      path: `/project/${id}`,
    });

    if (status === 200) {
      const clientUsers = await apiRequest({
        type: "get",
        path: `/client/clientId/${data?.clientId}`,
      });

      const projectTemplates: Array<TemplatesInterface> = data?.templates || [];
      const templates = (projectTemplates?.map((x) => {
        const fields = x?.fields
          ?.filter((x) => Object.keys(fieldRenderers)?.includes(x.type))
          ?.map((x) => {
            return {
              ...x,
              render: fieldRenderers[x?.type as keyof FieldRenderers],
            };
          });
        return { ...x, fields };
      }) || []) as Array<TemplatesInterface>;

      const templateOptionsData: { templateOptions: Array<TemplateOptionsInterface> } =
        await getAllTemplates({ selectBox: true });
      const { templateOptions } = templateOptionsData;

      const templateIds: Array<TemplateIdsInterface> = data?.templateIds || [];

      const selectedTemplates = (templateIds?.map((data) => ({
        ...templateOptions?.find(({ value }) => value === data?.templateId),
        uuid: data?.uuid,
      })) || []) as Array<SelectedTemplateInterface>;

      const finalVideosToMerge = data?.finalVideosToMerge?.map((x: any, index: number) => ({
        ...x,
        id: x._id + index,
        clipDuration: x?.duration || 0,
      }));

      const projectData = {
        templates,
        selectedTemplates,
        albumId: data?.albumId || null,
        finalVideos: data?.finalVideos || null,
        finalVideosToMerge,
        videoProjectId: data?.videoProjectId,
        clientUsers: clientUsers?.data || [],
        templateStyleIds: data?.templateStyleIds || [],
        templateThemeIds: data?.templateThemeIds || "",
        templateOptions: (templateOptions || []) as Array<TemplateOptionsInterface>,
        stagingFields: data?.stagingFields || [],
      };

      const singleProjectResultData = {
        _id: data._id,
        yourName: data.yourName,
        clientId: data.clientId,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        projectName: data.projectName,
        albumId: data?.albumId || null,
        projectStatus: data.projectStatus,
      };

      return {
        projectData,
        singleSelectedProjectData: singleProjectResultData,
      };
    } else {
      throw new Error("Error for getting data");
    }
  } catch (error) {
    console.error({ error });
  }
};

export const getAllTemplates = async ({ selectBox }: { selectBox: boolean }) => {
  try {
    const { data } = await apiRequest({
      type: "get",
      path: "/template",
      params: {
        selectBox,
      },
    });
    return {
      templateOptions: (data?.allTemplates || []) as Array<TemplateOptionsInterface>,
    };
  } catch (error) {
    console.error({ error });
    return {
      templateOptions: [] as Array<TemplateOptionsInterface>,
    };
  }
};
