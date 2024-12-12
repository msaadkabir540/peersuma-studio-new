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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var react_1 = require("react");
var player_1 = require("../player");
var staging_1 = require("../staging");
var assembly_1 = require("../assembly");
var drafts_1 = require("../drafts");
var loading_1 = require("@/components/loading");
var helper_1 = require("../template-tab/helper");
var template_container_1 = require("../../template-container");
var albums_media_list_1 = require("@/components/albums-media-list");
var create_update_project_1 = require("../../create-update-project");
var header_button_component_1 = require("../header-button-component");
var index_1 = require("@/context/create-project/index");
var types_1 = require("@/context/create-project/types");
var edit_svg_1 = require("@/assets/edit.svg");
var index_module_scss_1 = require("./index.module.scss");
var MediaPlayerContainer = function () {
    var closeMediaRef = react_1.useRef(null);
    // context
    var _a = react_1.useContext(index_1.CreateProjectContext), watch = _a.watch, project = _a.project, isLoading = _a.isLoading, isUpdateModal = _a.isUpdateModal, selectedClient = _a.selectedClient, dispatchProject = _a.dispatchProject, handleUpdateModalOpen = _a.handleUpdateModalOpen, handleUpdateModalClose = _a.handleUpdateModalClose;
    var _b = helper_1.useTemplateTab({ watch: watch, project: project, dispatchProject: dispatchProject }), player = _b.player, loading = _b.loading, setPlayer = _b.setPlayer, ssJson = _b.ssJson, isPlaying = _b.isPlaying, setLoading = _b.setLoading, setMoveMenu = _b.setMoveMenu, finalVideo = _b.finalVideo, renderVideo = _b.renderVideo, currentTime = _b.currentTime, mergePlayer = _b.mergePlayer, setIsPlaying = _b.setIsPlaying, currentVideo = _b.currentVideo, currentIndex = _b.currentIndex, setCurrentTime = _b.setCurrentTime, setMergePlayer = _b.setMergePlayer, stageTypeFields = _b.stageTypeFields, setCurrentIndex = _b.setCurrentIndex, setCurrentVideo = _b.setCurrentVideo, moveMediaToField = _b.moveMediaToField, generateUpdateSSJson = _b.generateUpdateSSJson, moveMediaToFieldStaging = _b.moveMediaToFieldStaging;
    var albumId = project.albumId, yourName = project.yourName, templates = project.templates, showField = project.showField, projectName = project.projectName, finalVideos = project.finalVideos, videoProjectId = project.videoProjectId, selectedFieldName = project.selectedFieldName, activeTemplateUuid = project.activeTemplateUuid, subClipCurrentTime = project.subClipCurrentTime;
    var templateIndexUuid = react_1.useMemo(function () {
        return templates === null || templates === void 0 ? void 0 : templates.findIndex(function (x) { return (x === null || x === void 0 ? void 0 : x.uuid) === activeTemplateUuid; });
    }, [templates, activeTemplateUuid]);
    var currentTemplate = (templates === null || templates === void 0 ? void 0 : templates[templateIndexUuid]) || "";
    var templateFields = (currentTemplate === null || currentTemplate === void 0 ? void 0 : currentTemplate.fields) || [];
    var projectModalData = {
        yourName: yourName,
        projectName: projectName
    };
    var _c = react_1.useState({
        controls: false
    }), selection = _c[0], setSelection = _c[1];
    var handleGenerateSSJson = function () {
        dispatchProject({
            type: types_1.UpdateProjectEnum.IS_JSONLOAD,
            payload: true
        });
        generateUpdateSSJson();
    };
    var handleUpdateProjectData = function (_a) {
        var responseData = _a.responseData;
        dispatchProject({
            type: types_1.UpdateProjectEnum.IS_JSONLOAD,
            payload: responseData
        });
    };
    var onDrop = function (_a) {
        var _b, _c, _d, _e, _f;
        var e = _a.e, label = _a.label, _g = _a.name, name = _g === void 0 ? selectedFieldName || "" : _g, _h = _a.noDrop, noDrop = _h === void 0 ? false : _h, _j = _a.videoDataFromClip, videoDataFromClip = _j === void 0 ? null : _j;
        e === null || e === void 0 ? void 0 : e.preventDefault();
        var video_data;
        label =
            ((_c = (_b = project === null || project === void 0 ? void 0 : project.stagingFields) === null || _b === void 0 ? void 0 : _b.find(function (data, index) { return index === showField; })) === null || _c === void 0 ? void 0 : _c.label) || label || "";
        if (noDrop)
            video_data = videoDataFromClip;
        else
            video_data = JSON.parse(((_d = e === null || e === void 0 ? void 0 : e.dataTransfer) === null || _d === void 0 ? void 0 : _d.getData("video_data")) || "");
        var copyProject = __assign({}, project);
        var updatedFields = moveMediaToField(__assign({ prev: copyProject === null || copyProject === void 0 ? void 0 : copyProject.stagingFields, label: label,
            name: name }, video_data));
        var latestDroppedClip = (_f = (_e = updatedFields === null || updatedFields === void 0 ? void 0 : updatedFields.find(function (field) { return field.name === name; })) === null || _e === void 0 ? void 0 : _e.value) === null || _f === void 0 ? void 0 : _f.at(-1);
        dispatchProject({
            type: types_1.UpdateProjectEnum.SET_SELECTED_VIDEO_CLIP,
            selectedVideoClip: latestDroppedClip === null || latestDroppedClip === void 0 ? void 0 : latestDroppedClip.id
        });
        handleClipClicks({
            e: e,
            item: latestDroppedClip || video_data,
            label: label || "",
            name: name || "",
            currentVideoHeadTime: !(video_data === null || video_data === void 0 ? void 0 : video_data.clipDuration) && subClipCurrentTime
        });
    };
    var handleClipClicks = function (_a) {
        var e = _a.e, item = _a.item, label = _a.label, name = _a.name, currentVideoHeadTime = _a.currentVideoHeadTime, templateClip = _a.templateClip;
        e === null || e === void 0 ? void 0 : e.stopPropagation();
        var id = item.id, startTime = item.startTime, endTime = item.endTime, url = item.url, duration = item.duration;
        setCurrentVideo(__assign(__assign({}, item), { label: label, id: id }));
        setPlayer({
            video: {
                url: url,
                duration: duration,
                startTime: startTime,
                endTime: endTime,
                playClip: true
            },
            currentIndex: 0,
            selectionEnd: endTime,
            currentTime: currentVideoHeadTime ? currentVideoHeadTime : startTime,
            selectionStart: startTime
        });
        dispatchProject({
            type: types_1.UpdateProjectEnum.SET_CLIP_PROJECT,
            clickClip: 1,
            clickMediaColor: null,
            selectedFieldName: name,
            templateClip: templateClip
        });
        setSelection({ controls: false });
    };
    var handleUpdateStageField = function (_a) {
        var stagingFields = _a.stagingFields;
        dispatchProject({
            type: types_1.UpdateProjectEnum.UPDATE_STAGING_FIELD,
            stagingFields: stagingFields
        });
    };
    var clickOnFieldFields = function (e, name, label, media) {
        e.stopPropagation();
        var resultStageFields;
        if ((media === null || media === void 0 ? void 0 : media.fileType) === "video") {
            resultStageFields = moveMediaToFieldStaging
                ? moveMediaToFieldStaging({
                    prev: project === null || project === void 0 ? void 0 : project.stagingFields,
                    name: name,
                    label: label,
                    _currentVideo: media,
                    startTime: 0,
                    endTime: media === null || media === void 0 ? void 0 : media.duration,
                    side: "right"
                })
                : [];
        }
        else {
            resultStageFields = moveMediaToField
                ? moveMediaToField({
                    prev: project === null || project === void 0 ? void 0 : project.stagingFields,
                    name: name,
                    label: label,
                    _currentVideo: media,
                    startTime: 0,
                    endTime: media === null || media === void 0 ? void 0 : media.duration
                })
                : [];
        }
        dispatchProject({
            type: types_1.UpdateProjectEnum.MOVE_MEDIA_TO_STAGE_FIELDS,
            stageField: __spreadArrays(resultStageFields)
        });
        setMoveMenu && setMoveMenu(false);
    };
    var clickOnListMedia = function (_a) {
        var index = _a.index, media = _a.media;
        setSelection && setSelection({ controls: false });
        dispatchProject({ type: types_1.UpdateProjectEnum.CLICK_ON_LIST_MEDIA, indexValue: index });
        setPlayer &&
            setPlayer({
                video: {
                    url: media === null || media === void 0 ? void 0 : media.url,
                    startTime: 0,
                    endTime: media === null || media === void 0 ? void 0 : media.duration
                },
                currentTime: 0,
                currentIndex: 0,
                isPlaying: false
            });
        (media === null || media === void 0 ? void 0 : media.fileType) === "video" && setCurrentVideo && setCurrentVideo(media);
    };
    var handleAlbumIdEvent = function (_a) {
        var newAlbumId = _a.newAlbumId;
        dispatchProject({ type: types_1.UpdateProjectEnum.ADD_ALBUM_ID, albumId: newAlbumId });
    };
    var handleCloseMedia = function () { var _a; return closeMediaRef && ((_a = closeMediaRef === null || closeMediaRef === void 0 ? void 0 : closeMediaRef.current) === null || _a === void 0 ? void 0 : _a.handleCloseMedia()); };
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { className: index_module_scss_1["default"].headingContainer },
            React.createElement("div", { className: index_module_scss_1["default"].projectHeading },
                React.createElement("div", { className: index_module_scss_1["default"].projectNameClass },
                    "Project Name: ",
                    React.createElement("span", null,
                        " ",
                        projectName)),
                React.createElement("img", { "aria-hidden": "true", onClick: function () { return handleUpdateModalOpen(); }, src: edit_svg_1["default"], alt: "edit Image", height: "16px" }),
                isUpdateModal && (React.createElement(create_update_project_1["default"], { data: projectModalData, open: isUpdateModal, handleUpdateProjectData: function (_a) {
                        var responseData = _a.responseData;
                        return handleUpdateProjectData({ responseData: responseData });
                    }, handleModalClose: function () { return handleUpdateModalClose(); } }))),
            React.createElement("div", { className: index_module_scss_1["default"].projectButtonContainer },
                React.createElement(header_button_component_1["default"], { isSSJsonLoading: ssJson, renderVideo: renderVideo, isFinalVideoLoading: finalVideo, handleCloseMedia: handleCloseMedia, handleGenerateSSJson: handleGenerateSSJson }))),
        isLoading || finalVideo || ssJson ? (React.createElement(loading_1["default"], { pageLoader: true, loaderClass: index_module_scss_1["default"].stagingLoad, diffHeight: 650 })) : (React.createElement("div", { className: index_module_scss_1["default"].wrappersContainer },
            (project === null || project === void 0 ? void 0 : project.activeTab) !== "assembly" && (React.createElement(React.Fragment, null,
                (project === null || project === void 0 ? void 0 : project.activeTab) === "templateTab" && (React.createElement(staging_1["default"], { handleUpdateStageField: handleUpdateStageField, handleClipClicks: handleClipClicks })),
                (project === null || project === void 0 ? void 0 : project.activeTab) === "stagingTab" && (React.createElement("div", { className: index_module_scss_1["default"].MediaPlayerScss },
                    React.createElement(React.Fragment, null,
                        React.createElement("div", { className: index_module_scss_1["default"].mediaContainer },
                            React.createElement(albums_media_list_1["default"], { albumId: albumId, loadingHeight: 575, selectedClientId: selectedClient, stageTypeFields: stageTypeFields, clickOnListMedia: clickOnListMedia, clickOnFieldFields: clickOnFieldFields, handleAlbumIdEvent: handleAlbumIdEvent, clickMediaColor: project === null || project === void 0 ? void 0 : project.clickMediaColor })),
                        React.createElement(player_1["default"], { onDrop: onDrop, player: player, isPlaying: isPlaying, selection: selection, setPlayer: setPlayer, currentTime: currentTime, mergePlayer: mergePlayer, setSelection: setSelection, currentIndex: currentIndex, setIsPlaying: setIsPlaying, currentVideo: currentVideo, closeMediaRef: closeMediaRef, templateFields: templateFields, setCurrentTime: setCurrentTime, setMergePlayer: setMergePlayer, setCurrentIndex: setCurrentIndex, setCurrentVideo: setCurrentVideo, moveMediaToField: moveMediaToField })))))),
            React.createElement("div", { className: index_module_scss_1["default"].PlayerScss },
                React.createElement(React.Fragment, null,
                    (project === null || project === void 0 ? void 0 : project.activeTab) === "stagingTab" && (React.createElement("div", { className: index_module_scss_1["default"].stagingTabContainer },
                        React.createElement("div", null, "Empty Stage"),
                        React.createElement(staging_1["default"], { handleUpdateStageField: handleUpdateStageField, handleClipClicks: handleClipClicks }))),
                    (project === null || project === void 0 ? void 0 : project.activeTab) === "templateTab" && (React.createElement("div", { className: index_module_scss_1["default"].templateTabContainer },
                        React.createElement("div", { className: index_module_scss_1["default"].templateAssembly },
                            React.createElement("h4", null, "Rendered Videos:"),
                            React.createElement(albums_media_list_1["default"], { isAssembly: true, finalVideos: finalVideos, selectedClientId: null })),
                        React.createElement("div", { className: index_module_scss_1["default"].templateFields },
                            React.createElement(template_container_1["default"], { handleClipClicks: handleClipClicks })))),
                    (project === null || project === void 0 ? void 0 : project.activeTab) === "assembly" && (React.createElement(assembly_1["default"], { loading: loading, setLoading: setLoading })),
                    (project === null || project === void 0 ? void 0 : project.activeTab) === "drafts" && (React.createElement("div", { className: index_module_scss_1["default"].templateFields },
                        React.createElement(drafts_1["default"], null)))))))));
};
exports["default"] = MediaPlayerContainer;
