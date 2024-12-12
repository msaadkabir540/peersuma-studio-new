"use strict";
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
exports.__esModule = true;
var react_hook_form_1 = require("react-hook-form");
var react_redux_1 = require("react-redux");
var react_1 = require("react");
var comments_1 = require("./comments");
var multi_select_box_1 = require("@/components/multi-select-box");
var create_notification_1 = require("@/common/create-notification");
var draft_carousel_section_1 = require("./draft-grid-card/draft-carousel-section");
var video_project_1 = require("@/api-services/video-project");
var create_project_1 = require("@/context/create-project");
var nodata_png_1 = require("@/assets/nodata.png");
var index_module_scss_1 = require("./index.module.scss");
var DraftComponent = function () {
    var _a, _b, _c, _d, _e;
    var users = react_redux_1.useSelector(function (state) { return state.users; }).users;
    var _f = react_1.useContext(create_project_1.CreateProjectContext), currentUser = _f.currentUser, videoDrafts = _f.videoDrafts, videoProjects = _f.videoProjects, selectedClient = _f.selectedClient, currentAllUser = _f.currentAllUser, handleAddComments = _f.handleAddComments;
    var createdUser = users === null || users === void 0 ? void 0 : users.find(function (data) { return (data === null || data === void 0 ? void 0 : data._id) === (videoProjects === null || videoProjects === void 0 ? void 0 : videoProjects.createdByUser); });
    var _g = react_hook_form_1.useForm({
        defaultValues: {
            status: ""
        }
    }), control = _g.control, setValue = _g.setValue, watch = _g.watch;
    var isVideoDrafts = videoDrafts === undefined || null || (videoDrafts === null || videoDrafts === void 0 ? void 0 : videoDrafts.length) === 0;
    react_1.useEffect(function () {
        if (videoProjects === null || videoProjects === void 0 ? void 0 : videoProjects.status) {
            setValue("status", videoProjects === null || videoProjects === void 0 ? void 0 : videoProjects.status);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [videoProjects]);
    var handleStatusChange = function (_a) {
        var value = _a.value;
        return __awaiter(void 0, void 0, void 0, function () {
            var updateData, res, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        if (!watch("status")) return [3 /*break*/, 2];
                        updateData = {
                            name: videoProjects === null || videoProjects === void 0 ? void 0 : videoProjects.name,
                            status: value || watch("status"),
                            oldStatus: videoProjects === null || videoProjects === void 0 ? void 0 : videoProjects.status,
                            videoProjectOwnerId: createdUser === null || createdUser === void 0 ? void 0 : createdUser._id,
                            statusChangeFrom: "peersumaStudio"
                        };
                        return [4 /*yield*/, video_project_1.updateVideoProjectsStatus({
                                videoProjectId: videoProjects === null || videoProjects === void 0 ? void 0 : videoProjects._id,
                                status: updateData
                            })];
                    case 1:
                        res = _b.sent();
                        if (res.status === 200) {
                            create_notification_1["default"]("success", "Status change successfully ");
                        }
                        _b.label = 2;
                    case 2: return [3 /*break*/, 4];
                    case 3:
                        error_1 = _b.sent();
                        console.error(error_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return (react_1["default"].createElement(react_1["default"].Fragment, null,
        react_1["default"].createElement("div", { className: index_module_scss_1["default"].selectionStatusClass },
            react_1["default"].createElement(multi_select_box_1["default"], { label: "Video Project :  " + (videoProjects === null || videoProjects === void 0 ? void 0 : videoProjects.name), name: "status", control: control, isClearable: false, isSearchable: false, options: statusOption || [], handleChange: function () { return handleStatusChange({ value: watch("status") }); } })),
        isVideoDrafts ? (react_1["default"].createElement("div", { className: index_module_scss_1["default"].noDataClass },
            react_1["default"].createElement("img", { style: { cursor: "pointer" }, src: nodata_png_1["default"], alt: "icon" }))) : (react_1["default"].createElement("div", { className: "" + index_module_scss_1["default"].backgroundColor },
            react_1["default"].createElement("div", { className: index_module_scss_1["default"].flexLeft, id: "draft-video-container" },
                react_1["default"].createElement(draft_carousel_section_1["default"], { assets: (_a = videoDrafts === null || videoDrafts === void 0 ? void 0 : videoDrafts[0]) === null || _a === void 0 ? void 0 : _a.draftVideo, videoDraftsId: (_b = videoDrafts === null || videoDrafts === void 0 ? void 0 : videoDrafts[0]) === null || _b === void 0 ? void 0 : _b._id })),
            react_1["default"].createElement("div", { className: index_module_scss_1["default"].flexRight, style: {
                    overflow: "auto"
                } },
                react_1["default"].createElement(comments_1["default"], { draftId: (_c = videoDrafts === null || videoDrafts === void 0 ? void 0 : videoDrafts[0]) === null || _c === void 0 ? void 0 : _c._id, currentUser: currentUser, clientId: selectedClient, commentsData: (_d = videoDrafts === null || videoDrafts === void 0 ? void 0 : videoDrafts[0]) === null || _d === void 0 ? void 0 : _d.comments, handleAddComments: handleAddComments, videoProjectId: (_e = videoDrafts === null || videoDrafts === void 0 ? void 0 : videoDrafts[0]) === null || _e === void 0 ? void 0 : _e.videoProjectId }))))));
};
exports["default"] = DraftComponent;
var statusOption = [
    { value: "in-production", label: "In Production" },
    { value: "in-post-production", label: "In Post Production" },
    {
        value: "in-review",
        label: "Draft Review"
    },
    {
        value: "cancelled",
        label: "Cancelled"
    },
    {
        value: "closed",
        label: "Closed"
    },
];
