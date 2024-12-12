import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import createNotification from "@/common/create-notification";
import { LoadingStateInterface } from "./components/interface";
import useFieldRenderers from "@/components/project-field-render-hook";

import { apiRequest } from "@/utils/helper";
import { getAllAlbums1 } from "@/api-services/album";
import { getAllThemesData } from "@/api-services/themes";
import { getProject } from "./services/get-projects-and-templates";
import { getAllTemplates } from "./services/get-projects-and-templates";

import { defaultFormValues, loadingDefaultValues, projectDEfaultValue } from "./services/helper";

import {
  CreateProjectFormInterface,
  ProjectInterface,
  TemplateOptionsInterface,
} from "./interface";

import styles from "./index.module.scss";

export const useCreateProject = () => {
  const {
    watch,
    reset,
    control,
    setValue,
    register,
    formState: { errors },
  } = useForm<CreateProjectFormInterface>({
    defaultValues: defaultFormValues,
  });

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const clients = useSelector((state: any) => state.clients);
  const selectedClient: string = clients?.selectedClient || "";
  const prefix = `/project_${id}/input/`;
  const fieldRenderers = useFieldRenderers({ styles });

  const [loading, setLoading] = useState<LoadingStateInterface>({ ...loadingDefaultValues });
  const [fieldName, setFieldName] = useState<boolean>(false);
  const [project, setProject] = useState<ProjectInterface>({ ...projectDEfaultValue });

  const {
    mediaList = [],
    templates,
    finalVideos,
    selectedTemplates,
    finalVideosToMerge,
    stagingFields,
  } = project;

  useEffect(() => {
    (async () => {
      if (id && selectedClient)
        await getProjectDataById({ projectId: id, selectedClientId: selectedClient });
      else {
        if (selectedClient) await getAlbumsDataByClientId();
      }
      setLoading((prev) => ({ ...prev, isLoading: false }));
    })();
  }, [selectedClient, id]);

  // wrong condition
  const submitDisabled = useMemo(() => {
    return watch("projectName") && watch("yourName") ? false : true;
  }, [watch("projectName"), watch("yourName")]);

  const onSubmit = async (data: CreateProjectFormInterface) => {
    setLoading((prev) => ({ ...prev, addUpdate: true }));
    if (id) await updateProjectData({ data });
    else await createProject({ data });
    setLoading((prev) => ({ ...prev, addUpdate: false }));
  };

  const getProjectDataById = async ({
    projectId,
    selectedClientId,
  }: {
    projectId: string;
    selectedClientId: string;
  }) => {
    const [projectResponse, albumsResponse, themeResponse] = await Promise.all([
      await getProject({
        id: projectId,
        fieldRenderers,
      }),
      await getAllAlbums1({
        params: {
          clientId: selectedClientId,
        },
      }),
      await getAllThemesData({ params: { sortBy: "themeName", sortOrder: "asc" } }),
    ]);
    const { projectData, singleSelectedProjectData } = projectResponse || {};
    const { albumsData } = albumsResponse || {};
    const themesData = themeResponse || {};

    let projectCopy = { ...project };
    projectCopy = {
      ...projectCopy,
      ...projectData,
      ...singleSelectedProjectData,
      templateOptions: projectData?.templateOptions || [],
      albumData: albumsData,
      themesData: themesData, // adding new themes option data
      mediaOptions: albumsData?.map(
        ({ _id, name, description }: { _id: string; name: string; description: string }) => ({
          label: name,
          value: _id,
          description,
        }),
      ),
    };

    setProject({ ...projectCopy });
    reset({ ...singleSelectedProjectData });
  };

  const getAlbumsDataByClientId = async () => {
    const [albumsResponse, templateOptionsData] = await Promise.all([
      await getAllAlbums1({
        params: {
          clientId: selectedClient,
        },
      }),
      await getAllTemplates({ selectBox: true }),
    ]);

    const { albumsData } = albumsResponse || {};
    let copyProject = { ...project };
    copyProject = {
      ...copyProject,
      albumData: albumsData,
      mediaOptions: albumsData?.map(
        ({ _id, name, description }: { _id: string; name: string; description: string }) => ({
          label: name,
          value: _id,
          description,
        }),
      ),
      templateOptions: (templateOptionsData?.templateOptions ||
        []) as Array<TemplateOptionsInterface>,
    };
    setProject(copyProject);
  };

  const updateProjectData = async ({ data }: { data: CreateProjectFormInterface }) => {
    const res = await apiRequest({
      type: "put",
      body: {
        mediaList,
        ...data,
        templates,
        finalVideos,
        stagingFields,
        selectedTemplates,
        finalVideosToMerge,
        templateIds: data?.templateIds || [],
      },
      path: "/project/" + id,
    });
    if (res?.status === 500)
      createNotification("error", res?.data?.msg || "Failed to update project!", 15000);

    if (res.status === 200) {
      reset({ ...res?.data?.newProject });
      setProject((prev) => ({
        ...prev,
        mediaList: res?.data?.newProject?.mediaList,
        stagingFields: res?.data?.newProject?.stagingFields,
      }));
    }
  };

  const createProject = async ({ data }: { data: CreateProjectFormInterface }) => {
    const transformData = {
      projectName: data?.projectName,
      yourName: data?.yourName,
      albumId: data?.albumId,
      projectStatus: "Opened",
      clientId: selectedClient,
    };

    const res = await apiRequest({
      type: "post",
      body: { ...transformData, clientId: selectedClient, mediaList },
      path: "/project",
    });
    if (res?.status === 500)
      createNotification("error", res?.data?.msg || "Failed to update project!", 15000);

    if (res.status === 200) {
      reset({ ...res?.data?.newProject });
      setProject((prev) => ({
        ...prev,
        mediaList: res?.data?.newProject?.mediaList,
      }));
      navigate(`/project/${res?.data?.newProject?._id}`);
    }
  };

  return {
    id,
    reset,
    watch,
    errors,
    prefix,
    project,
    loading,
    control,
    setValue,
    navigate,
    register,
    onSubmit,
    fieldName,
    setProject,
    setLoading,
    setFieldName,
    submitDisabled,
  };
};
