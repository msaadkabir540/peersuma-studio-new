export const defaultFormValues = {
  _id: "",
  projectName: "",
  yourName: "",
  templateIds: [{ templateId: "", uuid: "", _id: "" }],
  albumId: "",
  projectStatus: "",
  clientId: "",
  templateStyleIds: [],
  finalVideos: [],
  finalVideosToMerge: [],
  createdAt: null,
  updatedAt: null,
  searchTemplate: "",
  mySwitch: "",
  similarTemplate: null,
  templateStyleId: "",
  finalFileName: "",
  search: "",
  clipToggles: true,
};

export const loadingDefaultValues = {
  edit: false,
  addUpdate: false,
  ssJson: false,
  isLoading: true, // default loader
};

export const templateDefaultValues = {
  label: "",
  value: "",
  description: "",
  uuid: "",
};

export const projectDEfaultValue = {
  isOpen: false,
  ssJson: false,
  isJsonLoad: false,
  templateClip: false,
  allowDragDrop: false,
  activeTemplateId: "",
  activeTemplateUuid: "",
  activeTab: "stagingTab",
  mediaList: [],
  templates: [],
  finalVideos: [],
  clientUsers: [],
  mediaOptions: [],
  templatesData: [],
  templateOptions: [],
  selectedTemplates: [],
  finalVideosToMerge: [],
  stagingFields: [],
};

export const playerDefaultValues = {
  video: {
    url: "",
    startTime: 0,
    endTime: 0,
  },
  currentTime: 0,
  currentIndex: 0,
  isPlaying: false,
  videoClipPlayer: false,
};

export const mergePlayerDefaultValue = {
  mergePlayerOpen: false,
  label: "",
  name: "",
};
