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
exports.__esModule = true;
var react_1 = require("react");
var clipboard_polyfill_1 = require("clipboard-polyfill");
var jsoneditor_react_1 = require("jsoneditor-react");
var modal_1 = require("@/components/modal");
var switch_1 = require("@/components/switch");
var button_1 = require("@/components/button");
var create_notification_1 = require("@/common/create-notification");
var types_1 = require("@/context/create-project/types");
var index_1 = require("@/context/create-project/index");
var code_png_1 = require("@/assets/code.png");
var render_png_1 = require("@/assets/render.png");
var update_icon_svg_1 = require("@/assets/update-icon.svg");
var index_module_scss_1 = require("../../components/media-player-container/index.module.scss");
var HeaderButtonComponent = function (_a) {
    var renderVideo = _a.renderVideo, isSSJsonLoading = _a.isSSJsonLoading, handleCloseMedia = _a.handleCloseMedia, isFinalVideoLoading = _a.isFinalVideoLoading, handleGenerateSSJson = _a.handleGenerateSSJson;
    var _b = react_1.useContext(index_1.CreateProjectContext), id = _b.id, watch = _b.watch, control = _b.control, project = _b.project, isLoading = _b.isLoading, dispatchProject = _b.dispatchProject, draftHandleEvent = _b.draftHandleEvent, stagingHandleEvent = _b.stagingHandleEvent, updateAndSaveEvents = _b.updateAndSaveEvents, assemblyHandleEvent = _b.assemblyHandleEvent, templateHandleEvent = _b.templateHandleEvent;
    var HandleDownloadFile = function (_a) {
        var jsonData = _a.jsonData;
        var fileName = "ssJosnfile.json";
        var data = new Blob([JSON.stringify(jsonData, null, 2)], { type: "application/json" });
        var jsonURL = window.URL.createObjectURL(data);
        var link = document.createElement("a");
        link.href = jsonURL;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    return (React.createElement("div", { className: index_module_scss_1["default"].projectButtonContainer },
        (project === null || project === void 0 ? void 0 : project.activeTab) !== "assembly" &&
            (project === null || project === void 0 ? void 0 : project.activeTab) !== "stagingTab" && (project === null || project === void 0 ? void 0 : project.activeTemplateId) && (React.createElement(React.Fragment, null,
            React.createElement("span", { className: index_module_scss_1["default"].switchClass },
                React.createElement(switch_1["default"], { control: control, className: index_module_scss_1["default"].switchClassChild, name: "mySwitch", defaultValue: false, silderClass: index_module_scss_1["default"].silderClass, switchContainer: index_module_scss_1["default"].switchContainer, title: watch("mySwitch") ? "High resolution" : "Low resolution" })),
            React.createElement(button_1["default"], { type: "button", tooltip: "Render", icon: render_png_1["default"], handleClick: function () {
                    dispatchProject({
                        type: types_1.UpdateProjectEnum.FINAL_VIDEO_RENDERED,
                        mergeFileName: { callback: renderVideo }
                    });
                }, iconSize: { width: 27, height: 27 }, isLoading: isFinalVideoLoading, loaderClass: index_module_scss_1["default"].loaderClass, className: index_module_scss_1["default"].generateButton + " " + index_module_scss_1["default"].createButton }),
            React.createElement(button_1["default"], { type: "button", icon: code_png_1["default"], isLoading: isSSJsonLoading, tooltip: "Generate SS Json", loaderClass: index_module_scss_1["default"].loaderClass, iconSize: { width: 25, height: 25 }, handleClick: handleGenerateSSJson, className: index_module_scss_1["default"].generateButton + " " + index_module_scss_1["default"].createButton }))),
        React.createElement("div", { className: index_module_scss_1["default"].buttonBox },
            React.createElement(button_1["default"], { type: "button", title: "Staging", tooltip: "Staging", handleClick: function () {
                    stagingHandleEvent();
                    handleCloseMedia();
                }, titleClass: index_module_scss_1["default"].titleClass, className: ((project === null || project === void 0 ? void 0 : project.activeTab) === "stagingTab" ? index_module_scss_1["default"].ActiveBtn : "") + " " + index_module_scss_1["default"].generateButton }),
            React.createElement(button_1["default"], { type: "button", title: "Template", tooltip: "Template", handleClick: function () {
                    templateHandleEvent();
                    handleCloseMedia();
                }, titleClass: index_module_scss_1["default"].titleClass, className: ((project === null || project === void 0 ? void 0 : project.activeTab) === "templateTab" ? index_module_scss_1["default"].ActiveBtn : "") + " " + index_module_scss_1["default"].generateButton }),
            React.createElement(button_1["default"], { type: "button", title: "Assembly", tooltip: "Assembly", handleClick: function () {
                    assemblyHandleEvent();
                    handleCloseMedia();
                }, titleClass: index_module_scss_1["default"].titleClass, className: ((project === null || project === void 0 ? void 0 : project.activeTab) === "assembly" ? index_module_scss_1["default"].ActiveBtn : "") + " " + index_module_scss_1["default"].generateButton }),
            React.createElement(button_1["default"], { type: "button", title: "Drafts", tooltip: "Drafts", handleClick: function () {
                    draftHandleEvent();
                    handleCloseMedia();
                }, titleClass: index_module_scss_1["default"].titleClass, className: ((project === null || project === void 0 ? void 0 : project.activeTab) === "drafts" ? index_module_scss_1["default"].ActiveBtn : "") + " " + index_module_scss_1["default"].generateButton })),
        React.createElement(button_1["default"], { tooltip: id ? "Update" : "Save", type: "submit", isLoading: isLoading, icon: update_icon_svg_1["default"], iconSize: { width: 20, height: 20 }, className: " " + index_module_scss_1["default"].createButton, loaderClass: index_module_scss_1["default"].loaderClass, handleClick: function () { return updateAndSaveEvents(); } }),
        (project === null || project === void 0 ? void 0 : project.ssJsonFinalModal) && (project === null || project === void 0 ? void 0 : project.ssJson) && (React.createElement(modal_1["default"], __assign({}, {
            showCross: true,
            open: project === null || project === void 0 ? void 0 : project.ssJsonFinalModal,
            handleClose: function () {
                return dispatchProject({
                    type: types_1.UpdateProjectEnum.IS_SSJSON_FINAL_MODAL,
                    ssJsonFinalModal: false
                });
            }
        }, { className: index_module_scss_1["default"].jsonContainer, iconClassName: index_module_scss_1["default"].jsonClass }),
            React.createElement("div", { className: index_module_scss_1["default"].ssJsonContainer },
                React.createElement("div", { className: index_module_scss_1["default"].ssJsonButton },
                    React.createElement("label", { htmlFor: "ssJson" }, "SS.json"),
                    React.createElement("div", { style: { display: "flex" } },
                        React.createElement(button_1["default"], { title: "Copy SSJson", handleClick: function () {
                                var data = JSON.stringify(project === null || project === void 0 ? void 0 : project.ssJson, null, 2);
                                clipboard_polyfill_1.writeText(data);
                                create_notification_1["default"]("success", "File Copy Successfully!");
                            } }),
                        React.createElement(button_1["default"], { title: "Download SSJson", handleClick: function () {
                                HandleDownloadFile({ jsonData: project === null || project === void 0 ? void 0 : project.ssJson });
                            } }))),
                React.createElement(jsoneditor_react_1.JsonEditor, { value: project === null || project === void 0 ? void 0 : project.ssJson, mode: "code", search: false }))))));
};
exports["default"] = react_1.memo(HeaderButtonComponent);
