import { v4 as uuidV4 } from "uuid";
import React, { ReactNode, useEffect, useMemo, useReducer, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import { templateDefaultValues } from "@/pages/create-project/services/helper";
import createNotification from "@/common/create-notification";
import useFieldRenderers from "@/components/project-field-render-hook";
import { apiRequest } from "@/utils/helper";
import { getAllThemesData } from "@/api-services/themes";
import {
  getProject,
  getAllTemplates,
} from "@/pages/create-project/services/get-projects-and-templates";

import { addComments, getVideoDraftByClientId } from "@/api-services/video-draft";

import {
  TemplateInterface,
  TemplateOptionsInterface,
  SelectTemplateHandlerArgs,
  CreateProjectFormInterface,
  ClickOnSelectedTemplateArgsInterface,
  DeleteSelectedTemplateArgsInterface,
} from "@/pages/create-project/interface";
import { ContextValueObjectInterface, VideoProjectsInterface } from "./context-interface";
import { LoadingStateInterface } from "@/pages/create-project/components/interface";
import { RenameClipInterface } from "@/pages/create-project/components/staging/staging-interface";

import { getVideoProjectById } from "@/api-services/video-project";

import {
  defaultFormValues,
  loadingDefaultValues,
  projectDEfaultValue,
} from "@/pages/create-project/services/helper";
import { projectReducer } from "./reducer";
import { UpdateProjectEnum } from "./types";

import { VideoDraftInterface } from "@/interface/video-draft-interface";
import { LogginInterface } from "@/interface/user-selector-interface";

import styles from "../../pages/create-project/index.module.scss";

interface ContextAPIProps {
  children: ReactNode;
}
export const CreateProjectContext = React.createContext<ContextValueObjectInterface | undefined>(
  undefined,
);

export const ContextAPI: React.FC<ContextAPIProps> = ({ children }: ContextAPIProps) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const clients = useSelector((state: any) => state.clients);
  const selectedClient: string = clients?.selectedClient || "";
  const { loggedInUser } = useSelector((state: LogginInterface) => state?.users);
  const currentUser = {
    name: loggedInUser?.fullName || loggedInUser?.username,
    userId: loggedInUser?._id,
  };
  const fieldRenderers = useFieldRenderers({ styles });

  const allUsers = useSelector((state: LogginInterface) => state?.users);
  // eslint-disable-next-line no-unsafe-optional-chaining
  const currentAllUser = allUsers?.users;

  const [addIncrement, setAddIncrement] = useState<number>(0);
  const [isUpdateModal, setIsUpdateModal] = useState<boolean>(false);
  const [videoDrafts, setVideoDrafts] = useState<VideoDraftInterface>();
  const [videoProjects, setVideoProjects] = useState<VideoProjectsInterface>();
  const [showSelectTemplate, setShowSelectTemplate] = useState<boolean>(false);
  const [templates, setTemplates] = useState<TemplateInterface[]>([{ ...templateDefaultValues }]);
  const [loading, setLoading] = useState<LoadingStateInterface>({ ...loadingDefaultValues });

  const [project, dispatchProject] = useReducer(projectReducer, {
    ...projectDEfaultValue,
  });

  const [renameVideoClip, setRenameVideoClip] = useState<RenameClipInterface>({
    isRenameModal: false,
    renameText: "",
    clipId: "",
  });

  const {
    mediaList = [],
    finalVideos,
    finalVideosToMerge,
    stagingFields,
    albumId,
    videoProjectId,
  } = project;

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

  useEffect(() => {
    (async () => {
      if (id && selectedClient) await getProjectDataById({ projectId: id });
      else {
        if (selectedClient) await getAlbumsDataByClientId();
      }
      setLoading((prev) => ({ ...prev, isLoading: false }));
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedClient, id]);

  // wrong condition
  const submitDisabled = useMemo(() => {
    return watch("projectName") && watch("yourName") ? false : true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch("projectName"), watch("yourName")]);

  const onSubmit = async (data: CreateProjectFormInterface) => {
    setLoading((prev) => ({ ...prev, addUpdate: true }));
    if (id) await updateProjectData({ data });
    else await createProject({ data });
    setLoading((prev) => ({ ...prev, addUpdate: false }));
  };

  const getProjectDataById = async ({ projectId }: { projectId: string }) => {
    const [projectResponse, themeResponse] = await Promise.all([
      await getProject({
        id: projectId,
        fieldRenderers,
      }),
      await getAllThemesData({ params: { sortBy: "themeName", sortOrder: "asc" } }),
    ]);
    const { projectData, singleSelectedProjectData } = projectResponse || {};
    const themesData = themeResponse || {};

    let projectCopy = { ...project };

    projectCopy = {
      ...projectCopy,
      ...projectData,
      ...singleSelectedProjectData,
      templateOptions: projectData?.templateOptions || [],
      themesData: themesData, // adding new themes option data
    };

    dispatchProject({
      type: UpdateProjectEnum.SET_PROJECT,
      payload: projectCopy,
    });
    reset({ ...singleSelectedProjectData });
  };

  const getAlbumsDataByClientId = async () => {
    const [templateOptionsData] = await Promise.all([await getAllTemplates({ selectBox: true })]);

    let copyProject = { ...project };
    copyProject = {
      ...copyProject,
      templateOptions: (templateOptionsData?.templateOptions ||
        []) as Array<TemplateOptionsInterface>,
    };
    dispatchProject({ type: UpdateProjectEnum.SET_PROJECT, payload: copyProject });
  };

  const updateProjectData = async ({ data }: { data: CreateProjectFormInterface }) => {
    const res = await apiRequest({
      type: "put",
      body: {
        mediaList,
        ...data,
        templates: project.templates,
        finalVideos,
        stagingFields,
        selectedTemplates: project.selectedTemplates,
        finalVideosToMerge,
        templateIds: data?.templateIds || [],
      },
      path: "/project/" + id,
    });
    if (res?.status === 500)
      createNotification("error", res?.data?.msg || "Failed to update project!", 15000);

    if (res.status === 200) {
      reset({ ...res?.data?.newProject });
      dispatchProject({
        type: UpdateProjectEnum.SET_PROJECT,
        payload: {
          ...project,
          mediaList: res?.data?.newProject?.mediaList,
          stagingFields: res?.data?.newProject?.stagingFields,
        },
      });
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
      dispatchProject({
        type: UpdateProjectEnum.UPDATE_MEDIA_LIST,
        payload: res?.data?.newProject?.mediaList,
      });
      navigate(`/project/${res?.data?.newProject?._id}`);
    }
  };

  const closeAllSelectedTemplate = () => {
    dispatchProject({
      type: UpdateProjectEnum.CLOSE_TEMPLATE,
    });
  };

  const selectTemplateHandler = ({ value, label, description }: SelectTemplateHandlerArgs) => {
    const uuid = uuidV4();
    const newSelected = [...templates, { value, label, description, uuid }];
    dispatchProject({
      type: UpdateProjectEnum.SELECT_TEMPLATE_HANDLER,
      payload: [...newSelected],
    });
    setTemplates(newSelected);
  };

  const { templateStyleIds, activeTemplateId, templateThemeIds, selectedTemplates } = project;

  const updateAndSaveEvents = () => {
    onSubmit({
      ...watch(),
      albumId: albumId,
      templateStyleIds: templateStyleIds && [...templateStyleIds],
      templateThemeIds: templateThemeIds && templateThemeIds,
    });
  };

  const clickOnSelectedTemplate = ({
    uuid,
    index,
    value,
    ssJson,
    clickMediaColor,
  }: ClickOnSelectedTemplateArgsInterface) => {
    dispatchProject({
      type: UpdateProjectEnum.CLICK_ON_SELECTED_TEMPLATE,
      ssJson,
      clickMediaColor,
      activeTemplateId: value,
      activeTemplateUuid: uuid,
      activeTemplateIndex: index,
    });
  };

  const deleteSelectedTemplate = ({
    templates,
    selectedTemplates,
    value,
    uuid,
  }: DeleteSelectedTemplateArgsInterface) => {
    const selectedTemplatesFilterData = selectedTemplates?.filter((x) => x.uuid !== uuid);
    setValue(
      "templateIds",
      selectedTemplatesFilterData?.map((x) => ({ templateId: x?.value, uuid: x?.uuid })),
    );

    dispatchProject({
      type: UpdateProjectEnum.DELETE_SELECTED_TEMPLATE,
      ssJson: false,
      templates: templates?.filter((x) => x.id !== value),
      activeTemplateId: value !== activeTemplateId ? activeTemplateId : "",
      activeTemplateUuid: "",
      selectedTemplates: selectedTemplatesFilterData,
      templatesData: project?.templatesData?.filter((x: any) => x._id !== value),
      templateStyleIds: project?.templateStyleIds?.filter((x: any) => x.uuid !== uuid),
    });
  };

  const assemblyHandleEvent = () =>
    dispatchProject({
      type: UpdateProjectEnum.ASSEMBLY_HANDLE_EVENT,
      payload: {
        activeTab: "assembly",
        ssJson: false,
        clickMediaColor: null,
      },
    });

  const draftHandleEvent = () =>
    dispatchProject({
      type: UpdateProjectEnum.ASSEMBLY_HANDLE_EVENT,
      payload: {
        activeTab: "drafts",
        ssJson: false,
        clickMediaColor: null,
      },
    });

  const stagingHandleEvent = () =>
    dispatchProject({
      type: UpdateProjectEnum.STAGEING_HANDLE_EVENT,
      payload: {
        activeTab: "stagingTab",
        ssJson: false,
        clickMediaColor: null,
        activeTemplateUuid: "",
      },
    });

  const templateHandleEvent = () =>
    dispatchProject({
      type: UpdateProjectEnum.TEMPLATE_HANDLE_EVENT,
      payload: {
        activeTab: "templateTab",
        ssJson: false,
        clickMediaColor: null,
      },
    });

  const cancelActiveTemplateId = () =>
    dispatchProject({
      type: UpdateProjectEnum.CANCEL_ACTIVE_TEMPLATEID,
      payload: {
        ssJson: false,
        activeTemplateId: "",
        activeTemplateUuid: "",
      },
    });

  const handleUpdateModalOpen = () => {
    setIsUpdateModal(true);
  };

  const handleUpdateModalClose = () => {
    setIsUpdateModal(false);
  };

  const handleTemplateToogle = () => {
    setShowSelectTemplate((prev: boolean) => !prev);
  };

  const handleSelectTemplateModalClose = () => {
    setShowSelectTemplate(false);
    setValue("searchTemplate", "");
  };

  const handleSelectionClear = () => {
    dispatchProject({
      type: UpdateProjectEnum.HANDLE_SELECTION_CLEAR,
      payload: {
        selectionClear: undefined,
      },
    });
  };

  const handleSelectedVideoClip = () => {
    dispatchProject({
      type: UpdateProjectEnum.HANDLE_SELECTION_CLEAR,
      payload: {
        selectedVideoClip: undefined,
      },
    });
  };

  const handleEmptyVideoPlayerClickEvent = () => {
    dispatchProject({
      type: UpdateProjectEnum.HANDLE_EMPTY_VIDEOPLAYER_CLICKEVENT,
    });
  };
  const handleSelectTemplateOpen = () => {
    setShowSelectTemplate(true);
  };

  useEffect(() => {
    dispatchProject({
      type: UpdateProjectEnum.IS_JSONLOAD_LOADING,
      payload: true,
    });
    if (project.ssJson) {
      dispatchProject({
        type: UpdateProjectEnum.SS_JSON,
        payload: project.ssJson,
      });
    }

    dispatchProject({
      type: UpdateProjectEnum.IS_JSONLOAD_LOADING,
      payload: false,
    });
  }, [project.ssJson]);

  useEffect(() => {
    setTemplates(selectedTemplates?.length > 0 ? selectedTemplates : []);
    setValue(
      "templateIds",
      selectedTemplates?.length > 0
        ? selectedTemplates?.map((x: any) => ({ templateId: x?.value, uuid: x?.uuid }))
        : [],
    );
  }, [selectedTemplates, loading?.isLoading]);
  //

  // draft api

  const handleAddComments = async ({
    comment,
    videoProjectId,
    clientId,
    videoDraftId,
    currentUser,
  }: {
    comment: string;
    videoDraftId: string;
    videoProjectId: string;
    clientId: string;
    currentUser: { name: string; userId: string };
  }) => {
    try {
      const response = await addComments({
        videoDraftId,
        clientId,
        videoProjectId,
        userData: currentUser,
        comments: comment,
      });

      if (response) {
        const updatedDraftVideo = response?.data?.draftVideo;

        const draftVideoIndex = videoDrafts?.findIndex(
          ({ _id }: { _id: string }) => _id === updatedDraftVideo?._id,
        );

        if (draftVideoIndex !== -1) {
          const updatedVideoDrafts = [...(videoDrafts as any)];
          updatedVideoDrafts[draftVideoIndex] = updatedDraftVideo;

          setVideoDrafts(updatedVideoDrafts as any);
        }
      }

      return response;
    } catch (error) {
      console.error(error);
    }
  };

  const handleGetAllVideoDraft = async ({
    selectedClient,
    videoProjectId,
  }: {
    selectedClient: string;
    videoProjectId: string;
  }) => {
    try {
      const response = await getVideoDraftByClientId({
        clientId: selectedClient,
        videoProjectId,
      });

      if (response.status === 200) {
        setVideoDrafts(response?.data?.getDraftVideo);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    selectedClient && videoProjectId && handleGetAllVideoDraft({ selectedClient, videoProjectId });
  }, [selectedClient, videoProjectId, addIncrement]);

  // video project Api

  const handleGetVideoProjectById = async ({ videoProjectId }: { videoProjectId: string }) => {
    try {
      const response = await getVideoProjectById({ videoProjectId });
      if (response.status === 200) {
        setVideoProjects(response?.data?.videoProjectById);
      }
    } catch (error) {
      throw new Error(error as any);
    }
  };

  useEffect(() => {
    videoProjectId && handleGetVideoProjectById({ videoProjectId });
  }, [videoProjectId]);

  // values of context
  const contextValuesObject = {
    id,
    watch,
    reset,
    errors,
    project,
    loading,
    control,
    setValue,
    register,
    onSubmit,
    templates,
    currentUser,
    videoDrafts,
    videoProjects,
    setTemplates,
    isUpdateModal,
    currentAllUser,
    selectedClient,
    setAddIncrement,
    submitDisabled,
    dispatchProject,
    renameVideoClip,
    draftHandleEvent,
    setIsUpdateModal,
    handleAddComments,
    setRenameVideoClip,
    stagingHandleEvent,
    showSelectTemplate,
    templateHandleEvent,
    updateAndSaveEvents,
    assemblyHandleEvent,
    handleTemplateToogle,
    handleSelectionClear,
    selectTemplateHandler,
    setShowSelectTemplate,
    handleUpdateModalOpen,
    cancelActiveTemplateId,
    handleUpdateModalClose,
    deleteSelectedTemplate,
    handleSelectedVideoClip,
    clickOnSelectedTemplate,
    closeAllSelectedTemplate,
    handleSelectTemplateOpen,
    handleSelectTemplateModalClose,
    handleEmptyVideoPlayerClickEvent,
    isLoading: loading.addUpdate ? true : false,
  } as ContextValueObjectInterface;

  return (
    <CreateProjectContext.Provider value={contextValuesObject}>
      {children}
    </CreateProjectContext.Provider>
  );
};
