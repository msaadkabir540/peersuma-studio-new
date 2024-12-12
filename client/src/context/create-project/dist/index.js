"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.ContextAPI = exports.CreateProjectContext = void 0;
var uuid_1 = require("uuid");
var react_1 = require("react");
var react_hook_form_1 = require("react-hook-form");
var react_router_dom_1 = require("react-router-dom");
var react_redux_1 = require("react-redux");
var helper_1 = require("@/pages/create-project/services/helper");
var create_notification_1 = require("@/common/create-notification");
var project_field_render_hook_1 = require("@/components/project-field-render-hook");
var helper_2 = require("@/utils/helper");
var themes_1 = require("@/api-services/themes");
var get_projects_and_templates_1 = require("@/pages/create-project/services/get-projects-and-templates");
var video_draft_1 = require("@/api-services/video-draft");
var video_project_1 = require("@/api-services/video-project");
var helper_3 = require("@/pages/create-project/services/helper");
var reducer_1 = require("./reducer");
var types_1 = require("./types");
var index_module_scss_1 = require("../../pages/create-project/index.module.scss");
exports.CreateProjectContext = react_1["default"].createContext(undefined);
exports.ContextAPI = function (_a) {
    var children = _a.children;
    var id = react_router_dom_1.useParams().id;
    var navigate = react_router_dom_1.useNavigate();
    var clients = react_redux_1.useSelector(function (state) { return state.clients; });
    var selectedClient = (clients === null || clients === void 0 ? void 0 : clients.selectedClient) || "";
    var loggedInUser = react_redux_1.useSelector(function (state) { return state === null || state === void 0 ? void 0 : state.users; }).loggedInUser;
    var currentUser = {
        name: (loggedInUser === null || loggedInUser === void 0 ? void 0 : loggedInUser.fullName) || (loggedInUser === null || loggedInUser === void 0 ? void 0 : loggedInUser.username),
        userId: loggedInUser === null || loggedInUser === void 0 ? void 0 : loggedInUser._id
    };
    var fieldRenderers = project_field_render_hook_1["default"]({ styles: index_module_scss_1["default"] });
    var allUsers = react_redux_1.useSelector(function (state) { return state === null || state === void 0 ? void 0 : state.users; });
    // eslint-disable-next-line no-unsafe-optional-chaining
    var currentAllUser = allUsers === null || allUsers === void 0 ? void 0 : allUsers.users;
    var _b = react_1.useState(0), addIncrement = _b[0], setAddIncrement = _b[1];
    var _c = react_1.useState(false), isUpdateModal = _c[0], setIsUpdateModal = _c[1];
    var _d = react_1.useState(), videoDrafts = _d[0], setVideoDrafts = _d[1];
    var _e = react_1.useState(), videoProjects = _e[0], setVideoProjects = _e[1];
    var _f = react_1.useState(false), showSelectTemplate = _f[0], setShowSelectTemplate = _f[1];
    var _g = react_1.useState([__assign({}, helper_1.templateDefaultValues)]), templates = _g[0], setTemplates = _g[1];
    var _h = react_1.useState(__assign({}, helper_3.loadingDefaultValues)), loading = _h[0], setLoading = _h[1];
    var _j = react_1.useReducer(reducer_1.projectReducer, __assign({}, helper_3.projectDEfaultValue)), project = _j[0], dispatchProject = _j[1];
    var _k = react_1.useState({
        isRenameModal: false,
        renameText: "",
        clipId: ""
    }), renameVideoClip = _k[0], setRenameVideoClip = _k[1];
    var _l = project.mediaList, mediaList = _l === void 0 ? [] : _l, finalVideos = project.finalVideos, finalVideosToMerge = project.finalVideosToMerge, stagingFields = project.stagingFields, albumId = project.albumId, videoProjectId = project.videoProjectId;
    var _m = react_hook_form_1.useForm({
        defaultValues: helper_3.defaultFormValues
    }), watch = _m.watch, reset = _m.reset, control = _m.control, setValue = _m.setValue, register = _m.register, errors = _m.formState.errors;
    react_1.useEffect(function () {
        (function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(id && selectedClient)) return [3 /*break*/, 2];
                        return [4 /*yield*/, getProjectDataById({ projectId: id })];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 2:
                        if (!selectedClient) return [3 /*break*/, 4];
                        return [4 /*yield*/, getAlbumsDataByClientId()];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        setLoading(function (prev) { return (__assign(__assign({}, prev), { isLoading: false })); });
                        return [2 /*return*/];
                }
            });
        }); })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedClient, id]);
    // wrong condition
    var submitDisabled = react_1.useMemo(function () {
        return watch("projectName") && watch("yourName") ? false : true;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [watch("projectName"), watch("yourName")]);
    var onSubmit = function (data) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoading(function (prev) { return (__assign(__assign({}, prev), { addUpdate: true })); });
                    if (!id) return [3 /*break*/, 2];
                    return [4 /*yield*/, updateProjectData({ data: data })];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, createProject({ data: data })];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    setLoading(function (prev) { return (__assign(__assign({}, prev), { addUpdate: false })); });
                    return [2 /*return*/];
            }
        });
    }); };
    var getProjectDataById = function (_a) {
        var projectId = _a.projectId;
        return __awaiter(void 0, void 0, void 0, function () {
            var _b, projectResponse, themeResponse, _c, _d, _e, _f, projectData, singleSelectedProjectData, themesData, projectCopy;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        _d = (_c = Promise).all;
                        return [4 /*yield*/, get_projects_and_templates_1.getProject({
                                id: projectId,
                                fieldRenderers: fieldRenderers
                            })];
                    case 1:
                        _e = [
                            _g.sent()
                        ];
                        return [4 /*yield*/, themes_1.getAllThemesData({ params: { sortBy: "themeName", sortOrder: "asc" } })];
                    case 2: return [4 /*yield*/, _d.apply(_c, [_e.concat([
                                _g.sent()
                            ])])];
                    case 3:
                        _b = _g.sent(), projectResponse = _b[0], themeResponse = _b[1];
                        _f = projectResponse || {}, projectData = _f.projectData, singleSelectedProjectData = _f.singleSelectedProjectData;
                        themesData = themeResponse || {};
                        projectCopy = __assign({}, project);
                        projectCopy = __assign(__assign(__assign(__assign({}, projectCopy), projectData), singleSelectedProjectData), { templateOptions: (projectData === null || projectData === void 0 ? void 0 : projectData.templateOptions) || [], themesData: themesData });
                        dispatchProject({
                            type: types_1.UpdateProjectEnum.SET_PROJECT,
                            payload: projectCopy
                        });
                        reset(__assign({}, singleSelectedProjectData));
                        return [2 /*return*/];
                }
            });
        });
    };
    var getAlbumsDataByClientId = function () { return __awaiter(void 0, void 0, void 0, function () {
        var templateOptionsData, _a, _b, copyProject;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _b = (_a = Promise).all;
                    return [4 /*yield*/, get_projects_and_templates_1.getAllTemplates({ selectBox: true })];
                case 1: return [4 /*yield*/, _b.apply(_a, [[_c.sent()]])];
                case 2:
                    templateOptionsData = (_c.sent())[0];
                    copyProject = __assign({}, project);
                    copyProject = __assign(__assign({}, copyProject), { templateOptions: ((templateOptionsData === null || templateOptionsData === void 0 ? void 0 : templateOptionsData.templateOptions) ||
                            []) });
                    dispatchProject({ type: types_1.UpdateProjectEnum.SET_PROJECT, payload: copyProject });
                    return [2 /*return*/];
            }
        });
    }); };
    var updateProjectData = function (_a) {
        var data = _a.data;
        return __awaiter(void 0, void 0, void 0, function () {
            var res;
            var _b, _c, _d, _e, _f, _g;
            return __generator(this, function (_h) {
                switch (_h.label) {
                    case 0: return [4 /*yield*/, helper_2.apiRequest({
                            type: "put",
                            body: __assign(__assign({ mediaList: mediaList }, data), { templates: project.templates, finalVideos: finalVideos,
                                stagingFields: stagingFields, selectedTemplates: project.selectedTemplates, finalVideosToMerge: finalVideosToMerge, templateIds: (data === null || data === void 0 ? void 0 : data.templateIds) || [] }),
                            path: "/project/" + id
                        })];
                    case 1:
                        res = _h.sent();
                        if ((res === null || res === void 0 ? void 0 : res.status) === 500)
                            create_notification_1["default"]("error", ((_b = res === null || res === void 0 ? void 0 : res.data) === null || _b === void 0 ? void 0 : _b.msg) || "Failed to update project!", 15000);
                        if (res.status === 200) {
                            reset(__assign({}, (_c = res === null || res === void 0 ? void 0 : res.data) === null || _c === void 0 ? void 0 : _c.newProject));
                            dispatchProject({
                                type: types_1.UpdateProjectEnum.SET_PROJECT,
                                payload: __assign(__assign({}, project), { mediaList: (_e = (_d = res === null || res === void 0 ? void 0 : res.data) === null || _d === void 0 ? void 0 : _d.newProject) === null || _e === void 0 ? void 0 : _e.mediaList, stagingFields: (_g = (_f = res === null || res === void 0 ? void 0 : res.data) === null || _f === void 0 ? void 0 : _f.newProject) === null || _g === void 0 ? void 0 : _g.stagingFields })
                            });
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    var createProject = function (_a) {
        var data = _a.data;
        return __awaiter(void 0, void 0, void 0, function () {
            var transformData, res;
            var _b, _c, _d, _e, _f, _g;
            return __generator(this, function (_h) {
                switch (_h.label) {
                    case 0:
                        transformData = {
                            projectName: data === null || data === void 0 ? void 0 : data.projectName,
                            yourName: data === null || data === void 0 ? void 0 : data.yourName,
                            albumId: data === null || data === void 0 ? void 0 : data.albumId,
                            projectStatus: "Opened",
                            clientId: selectedClient
                        };
                        return [4 /*yield*/, helper_2.apiRequest({
                                type: "post",
                                body: __assign(__assign({}, transformData), { clientId: selectedClient, mediaList: mediaList }),
                                path: "/project"
                            })];
                    case 1:
                        res = _h.sent();
                        if ((res === null || res === void 0 ? void 0 : res.status) === 500)
                            create_notification_1["default"]("error", ((_b = res === null || res === void 0 ? void 0 : res.data) === null || _b === void 0 ? void 0 : _b.msg) || "Failed to update project!", 15000);
                        if (res.status === 200) {
                            reset(__assign({}, (_c = res === null || res === void 0 ? void 0 : res.data) === null || _c === void 0 ? void 0 : _c.newProject));
                            dispatchProject({
                                type: types_1.UpdateProjectEnum.UPDATE_MEDIA_LIST,
                                payload: (_e = (_d = res === null || res === void 0 ? void 0 : res.data) === null || _d === void 0 ? void 0 : _d.newProject) === null || _e === void 0 ? void 0 : _e.mediaList
                            });
                            navigate("/project/" + ((_g = (_f = res === null || res === void 0 ? void 0 : res.data) === null || _f === void 0 ? void 0 : _f.newProject) === null || _g === void 0 ? void 0 : _g._id));
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    var closeAllSelectedTemplate = function () {
        dispatchProject({
            type: types_1.UpdateProjectEnum.CLOSE_TEMPLATE
        });
    };
    var selectTemplateHandler = function (_a) {
        var value = _a.value, label = _a.label, description = _a.description;
        var uuid = uuid_1.v4();
        var newSelected = __spreadArrays(templates, [{ value: value, label: label, description: description, uuid: uuid }]);
        dispatchProject({
            type: types_1.UpdateProjectEnum.SELECT_TEMPLATE_HANDLER,
            payload: __spreadArrays(newSelected)
        });
        setTemplates(newSelected);
    };
    var templateStyleIds = project.templateStyleIds, activeTemplateId = project.activeTemplateId, templateThemeIds = project.templateThemeIds, selectedTemplates = project.selectedTemplates;
    var updateAndSaveEvents = function () {
        onSubmit(__assign(__assign({}, watch()), { albumId: albumId, templateStyleIds: templateStyleIds && __spreadArrays(templateStyleIds), templateThemeIds: templateThemeIds && templateThemeIds }));
    };
    var clickOnSelectedTemplate = function (_a) {
        var uuid = _a.uuid, index = _a.index, value = _a.value, ssJson = _a.ssJson, clickMediaColor = _a.clickMediaColor;
        dispatchProject({
            type: types_1.UpdateProjectEnum.CLICK_ON_SELECTED_TEMPLATE,
            ssJson: ssJson,
            clickMediaColor: clickMediaColor,
            activeTemplateId: value,
            activeTemplateUuid: uuid,
            activeTemplateIndex: index
        });
    };
    var deleteSelectedTemplate = function (_a) {
        var _b, _c;
        var templates = _a.templates, selectedTemplates = _a.selectedTemplates, value = _a.value, uuid = _a.uuid;
        var selectedTemplatesFilterData = selectedTemplates === null || selectedTemplates === void 0 ? void 0 : selectedTemplates.filter(function (x) { return x.uuid !== uuid; });
        setValue("templateIds", selectedTemplatesFilterData === null || selectedTemplatesFilterData === void 0 ? void 0 : selectedTemplatesFilterData.map(function (x) { return ({ templateId: x === null || x === void 0 ? void 0 : x.value, uuid: x === null || x === void 0 ? void 0 : x.uuid }); }));
        dispatchProject({
            type: types_1.UpdateProjectEnum.DELETE_SELECTED_TEMPLATE,
            ssJson: false,
            templates: templates === null || templates === void 0 ? void 0 : templates.filter(function (x) { return x.id !== value; }),
            activeTemplateId: value !== activeTemplateId ? activeTemplateId : "",
            activeTemplateUuid: "",
            selectedTemplates: selectedTemplatesFilterData,
            templatesData: (_b = project === null || project === void 0 ? void 0 : project.templatesData) === null || _b === void 0 ? void 0 : _b.filter(function (x) { return x._id !== value; }),
            templateStyleIds: (_c = project === null || project === void 0 ? void 0 : project.templateStyleIds) === null || _c === void 0 ? void 0 : _c.filter(function (x) { return x.uuid !== uuid; })
        });
    };
    var assemblyHandleEvent = function () {
        return dispatchProject({
            type: types_1.UpdateProjectEnum.ASSEMBLY_HANDLE_EVENT,
            payload: {
                activeTab: "assembly",
                ssJson: false,
                clickMediaColor: null
            }
        });
    };
    var draftHandleEvent = function () {
        return dispatchProject({
            type: types_1.UpdateProjectEnum.ASSEMBLY_HANDLE_EVENT,
            payload: {
                activeTab: "drafts",
                ssJson: false,
                clickMediaColor: null
            }
        });
    };
    var stagingHandleEvent = function () {
        return dispatchProject({
            type: types_1.UpdateProjectEnum.STAGEING_HANDLE_EVENT,
            payload: {
                activeTab: "stagingTab",
                ssJson: false,
                clickMediaColor: null,
                activeTemplateUuid: ""
            }
        });
    };
    var templateHandleEvent = function () {
        return dispatchProject({
            type: types_1.UpdateProjectEnum.TEMPLATE_HANDLE_EVENT,
            payload: {
                activeTab: "templateTab",
                ssJson: false,
                clickMediaColor: null
            }
        });
    };
    var cancelActiveTemplateId = function () {
        return dispatchProject({
            type: types_1.UpdateProjectEnum.CANCEL_ACTIVE_TEMPLATEID,
            payload: {
                ssJson: false,
                activeTemplateId: "",
                activeTemplateUuid: ""
            }
        });
    };
    var handleUpdateModalOpen = function () {
        setIsUpdateModal(true);
    };
    var handleUpdateModalClose = function () {
        setIsUpdateModal(false);
    };
    var handleTemplateToogle = function () {
        setShowSelectTemplate(function (prev) { return !prev; });
    };
    var handleSelectTemplateModalClose = function () {
        setShowSelectTemplate(false);
        setValue("searchTemplate", "");
    };
    var handleSelectionClear = function () {
        dispatchProject({
            type: types_1.UpdateProjectEnum.HANDLE_SELECTION_CLEAR,
            payload: {
                selectionClear: undefined
            }
        });
    };
    var handleSelectedVideoClip = function () {
        dispatchProject({
            type: types_1.UpdateProjectEnum.HANDLE_SELECTION_CLEAR,
            payload: {
                selectedVideoClip: undefined
            }
        });
    };
    var handleEmptyVideoPlayerClickEvent = function () {
        dispatchProject({
            type: types_1.UpdateProjectEnum.HANDLE_EMPTY_VIDEOPLAYER_CLICKEVENT
        });
    };
    var handleSelectTemplateOpen = function () {
        setShowSelectTemplate(true);
    };
    react_1.useEffect(function () {
        dispatchProject({
            type: types_1.UpdateProjectEnum.IS_JSONLOAD_LOADING,
            payload: true
        });
        if (project.ssJson) {
            dispatchProject({
                type: types_1.UpdateProjectEnum.SS_JSON,
                payload: project.ssJson
            });
        }
        dispatchProject({
            type: types_1.UpdateProjectEnum.IS_JSONLOAD_LOADING,
            payload: false
        });
    }, [project.ssJson]);
    react_1.useEffect(function () {
        setTemplates((selectedTemplates === null || selectedTemplates === void 0 ? void 0 : selectedTemplates.length) > 0 ? selectedTemplates : []);
        setValue("templateIds", (selectedTemplates === null || selectedTemplates === void 0 ? void 0 : selectedTemplates.length) > 0
            ? selectedTemplates === null || selectedTemplates === void 0 ? void 0 : selectedTemplates.map(function (x) { return ({ templateId: x === null || x === void 0 ? void 0 : x.value, uuid: x === null || x === void 0 ? void 0 : x.uuid }); }) : []);
    }, [selectedTemplates, loading === null || loading === void 0 ? void 0 : loading.isLoading]);
    //
    // draft api
    var handleAddComments = function (_a) {
        var comment = _a.comment, videoProjectId = _a.videoProjectId, clientId = _a.clientId, videoDraftId = _a.videoDraftId, currentUser = _a.currentUser;
        return __awaiter(void 0, void 0, void 0, function () {
            var response, updatedDraftVideo_1, draftVideoIndex, updatedVideoDrafts, error_1;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, video_draft_1.addComments({
                                videoDraftId: videoDraftId,
                                clientId: clientId,
                                videoProjectId: videoProjectId,
                                userData: currentUser,
                                comments: comment
                            })];
                    case 1:
                        response = _c.sent();
                        if (response) {
                            updatedDraftVideo_1 = (_b = response === null || response === void 0 ? void 0 : response.data) === null || _b === void 0 ? void 0 : _b.draftVideo;
                            draftVideoIndex = videoDrafts === null || videoDrafts === void 0 ? void 0 : videoDrafts.findIndex(function (_a) {
                                var _id = _a._id;
                                return _id === (updatedDraftVideo_1 === null || updatedDraftVideo_1 === void 0 ? void 0 : updatedDraftVideo_1._id);
                            });
                            if (draftVideoIndex !== -1) {
                                updatedVideoDrafts = __spreadArrays(videoDrafts);
                                updatedVideoDrafts[draftVideoIndex] = updatedDraftVideo_1;
                                setVideoDrafts(updatedVideoDrafts);
                            }
                        }
                        return [2 /*return*/, response];
                    case 2:
                        error_1 = _c.sent();
                        console.error(error_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    var handleGetAllVideoDraft = function (_a) {
        var selectedClient = _a.selectedClient, videoProjectId = _a.videoProjectId;
        return __awaiter(void 0, void 0, void 0, function () {
            var response, error_2;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, video_draft_1.getVideoDraftByClientId({
                                clientId: selectedClient,
                                videoProjectId: videoProjectId
                            })];
                    case 1:
                        response = _c.sent();
                        if (response.status === 200) {
                            setVideoDrafts((_b = response === null || response === void 0 ? void 0 : response.data) === null || _b === void 0 ? void 0 : _b.getDraftVideo);
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _c.sent();
                        console.error(error_2);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    react_1.useEffect(function () {
        selectedClient && videoProjectId && handleGetAllVideoDraft({ selectedClient: selectedClient, videoProjectId: videoProjectId });
    }, [selectedClient, videoProjectId, addIncrement]);
    // video project Api
    var handleGetVideoProjectById = function (_a) {
        var videoProjectId = _a.videoProjectId;
        return __awaiter(void 0, void 0, void 0, function () {
            var response, error_3;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, video_project_1.getVideoProjectById({ videoProjectId: videoProjectId })];
                    case 1:
                        response = _c.sent();
                        if (response.status === 200) {
                            setVideoProjects((_b = response === null || response === void 0 ? void 0 : response.data) === null || _b === void 0 ? void 0 : _b.videoProjectById);
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _c.sent();
                        throw new Error(error_3);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    react_1.useEffect(function () {
        videoProjectId && handleGetVideoProjectById({ videoProjectId: videoProjectId });
    }, [videoProjectId]);
    // values of context
    var contextValuesObject = {
        id: id,
        watch: watch,
        reset: reset,
        errors: errors,
        project: project,
        loading: loading,
        control: control,
        setValue: setValue,
        register: register,
        onSubmit: onSubmit,
        templates: templates,
        currentUser: currentUser,
        videoDrafts: videoDrafts,
        videoProjects: videoProjects,
        setTemplates: setTemplates,
        isUpdateModal: isUpdateModal,
        currentAllUser: currentAllUser,
        selectedClient: selectedClient,
        setAddIncrement: setAddIncrement,
        submitDisabled: submitDisabled,
        dispatchProject: dispatchProject,
        renameVideoClip: renameVideoClip,
        draftHandleEvent: draftHandleEvent,
        setIsUpdateModal: setIsUpdateModal,
        handleAddComments: handleAddComments,
        setRenameVideoClip: setRenameVideoClip,
        stagingHandleEvent: stagingHandleEvent,
        showSelectTemplate: showSelectTemplate,
        templateHandleEvent: templateHandleEvent,
        updateAndSaveEvents: updateAndSaveEvents,
        assemblyHandleEvent: assemblyHandleEvent,
        handleTemplateToogle: handleTemplateToogle,
        handleSelectionClear: handleSelectionClear,
        selectTemplateHandler: selectTemplateHandler,
        setShowSelectTemplate: setShowSelectTemplate,
        handleUpdateModalOpen: handleUpdateModalOpen,
        cancelActiveTemplateId: cancelActiveTemplateId,
        handleUpdateModalClose: handleUpdateModalClose,
        deleteSelectedTemplate: deleteSelectedTemplate,
        handleSelectedVideoClip: handleSelectedVideoClip,
        clickOnSelectedTemplate: clickOnSelectedTemplate,
        closeAllSelectedTemplate: closeAllSelectedTemplate,
        handleSelectTemplateOpen: handleSelectTemplateOpen,
        handleSelectTemplateModalClose: handleSelectTemplateModalClose,
        handleEmptyVideoPlayerClickEvent: handleEmptyVideoPlayerClickEvent,
        isLoading: loading.addUpdate ? true : false
    };
    return (react_1["default"].createElement(exports.CreateProjectContext.Provider, { value: contextValuesObject }, children));
};
