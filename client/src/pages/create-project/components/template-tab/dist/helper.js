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
exports.useTemplateTab = void 0;
var react_router_dom_1 = require("react-router-dom");
var react_1 = require("react");
var project_field_render_hook_1 = require("@/components/project-field-render-hook");
var create_notification_1 = require("@/common/create-notification");
var helper_1 = require("@/utils/helper");
var templates_1 = require("@/api-services/templates");
var helper_2 = require("../../services/helper");
var types_1 = require("@/context/create-project/types");
var index_module_scss_1 = require("../../index.module.scss");
exports.useTemplateTab = function (_a) {
    var watch = _a.watch, prefix = _a.prefix, project = _a.project, dispatchProject = _a.dispatchProject;
    var _b = react_router_dom_1.useParams().id, id = _b === void 0 ? "" : _b;
    var wrapperRef = react_1.useRef(null);
    var fieldRenderers = project_field_render_hook_1["default"]({ styles: index_module_scss_1["default"] });
    var _c = react_1.useState(__assign({}, helper_2.playerDefaultValues)), player = _c[0], setPlayer = _c[1];
    var _d = react_1.useState(false), moveMenu = _d[0], setMoveMenu = _d[1];
    var _e = react_1.useState(true), isPlaying = _e[0], setIsPlaying = _e[1];
    var _f = react_1.useState(false), fieldName = _f[0], setFieldName = _f[1];
    var _g = react_1.useState(0), currentTime = _g[0], setCurrentTime = _g[1];
    var _h = react_1.useState(__assign({}, helper_2.mergePlayerDefaultValue)), mergePlayer = _h[0], setMergePlayer = _h[1];
    var _j = react_1.useState(0), currentIndex = _j[0], setCurrentIndex = _j[1];
    var _k = react_1.useState({}), currentVideo = _k[0], setCurrentVideo = _k[1];
    var _l = react_1.useState(__assign({}, helper_2.loadingDefaultValues)), loading = _l[0], setLoading = _l[1];
    var ssJson = loading.ssJson, finalVideo = loading.finalVideo;
    var activeTemplateId = project.activeTemplateId, _m = project.templates, templates = _m === void 0 ? [] : _m, templatesData = project.templatesData, activeTemplateUuid = project.activeTemplateUuid, templateStyleIds = project.templateStyleIds, templateThemeIds = project.templateThemeIds, selectedFieldName = project.selectedFieldName, themesData = project.themesData, stagingFields = project.stagingFields;
    var _o = react_1.useMemo(function () {
        var _a;
        var templateFields = ((_a = templates === null || templates === void 0 ? void 0 : templates.find(function (x) { return (x === null || x === void 0 ? void 0 : x.uuid) === activeTemplateUuid; })) === null || _a === void 0 ? void 0 : _a.fields) || [];
        var currentTemplateIndex = templates === null || templates === void 0 ? void 0 : templates.findIndex(function (x) { return (x === null || x === void 0 ? void 0 : x.uuid) === activeTemplateUuid; });
        var templateId = templateStyleIds === null || templateStyleIds === void 0 ? void 0 : templateStyleIds.find(function (x) { return (x === null || x === void 0 ? void 0 : x.uuid) === activeTemplateUuid; });
        var themesOptions = themesData === null || themesData === void 0 ? void 0 : themesData.map(function (x) { return ({
            label: x.themeName,
            value: x._id
        }); });
        return {
            templateId: templateId,
            themesOptions: themesOptions,
            templateFields: templateFields,
            currentTemplateIndex: currentTemplateIndex
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [project]), templateFields = _o.templateFields, currentTemplateIndex = _o.currentTemplateIndex, templateId = _o.templateId, themesOptions = _o.themesOptions;
    var currentTemplate = templatesData === null || templatesData === void 0 ? void 0 : templatesData.find(function (x) { return (x === null || x === void 0 ? void 0 : x._id) === activeTemplateId || (x === null || x === void 0 ? void 0 : x.uuid) === activeTemplateUuid; });
    var templeStylesOptions = react_1.useMemo(function () {
        var _a;
        return (_a = currentTemplate === null || currentTemplate === void 0 ? void 0 : currentTemplate.templateStyles) === null || _a === void 0 ? void 0 : _a.map(function (x) { return ({
            label: x.name,
            value: x._id
        }); });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTemplateUuid, currentTemplate, templatesData, activeTemplateId]);
    helper_1.useOutsideClickHook(wrapperRef, function () {
        setMoveMenu(false);
    });
    react_1.useEffect(function () {
        activeTemplateUuid &&
            getTemplate({
                templateIdsFieldsAndUUid: {
                    templateId: activeTemplateId || "",
                    fields: !templates.find(function (x) { return (x === null || x === void 0 ? void 0 : x.uuid) === activeTemplateUuid; }) || false,
                    uuid: activeTemplateUuid
                },
                getTemplateData: !templatesData.find(function (x) { return (x === null || x === void 0 ? void 0 : x._id) === activeTemplateId; })
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTemplateId, activeTemplateUuid]);
    var typeFields = function (fileType) { return templateFields === null || templateFields === void 0 ? void 0 : templateFields.filter(function (_a) {
        var type = _a.type;
        return type === fileType;
    }); };
    var stageTypeFields = function (fileType) { return stagingFields === null || stagingFields === void 0 ? void 0 : stagingFields.filter(function (_a) {
        var type = _a.type;
        return type === fileType;
    }); };
    var handleGetTemplateFields = function (templateId, uuid) { return __awaiter(void 0, void 0, void 0, function () {
        var res, fieldValues, currentTemplateDataIndex, keys_1, copyProject, fields;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    setLoading(function (prev) { return (__assign(__assign({}, prev), { templateFields: true })); });
                    return [4 /*yield*/, templates_1.getTemplateFields({ templateId: templateId })];
                case 1:
                    res = _b.sent();
                    if (res) {
                        fieldValues = res && Object.values(res);
                        if (fieldValues.length) {
                            currentTemplateDataIndex = templatesData.length - 1;
                            keys_1 = Object.keys(res);
                            copyProject = __assign({}, project);
                            copyProject.templatesData[currentTemplateDataIndex].fields = JSON.stringify(res);
                            fields = (_a = fieldValues === null || fieldValues === void 0 ? void 0 : fieldValues.filter(function (x) {
                                return Object.keys(fieldRenderers).includes(x === null || x === void 0 ? void 0 : x.type);
                            })) === null || _a === void 0 ? void 0 : _a.map(function (x, index) { return (__assign(__assign({}, x), { name: keys_1[index], value: "", fieldLabel: "", render: fieldRenderers[x === null || x === void 0 ? void 0 : x.type] })); });
                            copyProject.templates.push({
                                id: templateId,
                                fields: fields,
                                uuid: uuid
                            });
                            dispatchProject({
                                type: types_1.UpdateProjectEnum.GET_TEMPLATE_FIELD,
                                payload: __assign({}, copyProject)
                            });
                        }
                    }
                    setLoading(function (prev) { return (__assign(__assign({}, prev), { templateFields: false })); });
                    return [2 /*return*/];
            }
        });
    }); };
    var prepareVars = function () {
        var _a, _b, _c;
        var variables = {};
        variables["videosToMerge"] = (variables === null || variables === void 0 ? void 0 : variables.videosToMerge) || {};
        (_a = templateFields === null || templateFields === void 0 ? void 0 : templateFields.filter(function (x) { return x.type === "video" && Array.isArray(x.value) && x.value.length > 0; })) === null || _a === void 0 ? void 0 : _a.forEach(function (_a) {
            var name = _a.name, value = _a.value;
            variables.videosToMerge[name] = ((value === null || value === void 0 ? void 0 : value.map(function (_a) {
                var _b = _a.name, name = _b === void 0 ? "" : _b, s3Key = _a.s3Key, startTime = _a.startTime, endTime = _a.endTime;
                return {
                    name: name,
                    s3Key: s3Key,
                    startTime: startTime === 0 ? 0.3 : Math.round(startTime * 100) / 100,
                    endTime: Math.round(endTime * 100) / 100,
                    duration: Math.round((endTime - startTime) * 100) / 100
                };
            })) || []);
        });
        (_b = templateFields === null || templateFields === void 0 ? void 0 : templateFields.filter(function (x) { return x.type !== "video" && x.value; })) === null || _b === void 0 ? void 0 : _b.forEach(function (_a) {
            var name = _a.name, value = _a.value;
            variables[name] = value;
        });
        (_c = templateFields === null || templateFields === void 0 ? void 0 : templateFields.filter(function (x) { return x.type === "image"; })) === null || _c === void 0 ? void 0 : _c.forEach(function (_a) {
            var _b;
            var name = _a.name, value = _a.value;
            variables[name] = (_b = value === null || value === void 0 ? void 0 : value[value.length - 1]) === null || _b === void 0 ? void 0 : _b.url;
        });
        return variables;
    };
    var generateUpdateSSJson = function () { return __awaiter(void 0, void 0, void 0, function () {
        var variables, res;
        var _a, _b, _c, _d, _e, _f, _g, _h;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0:
                    setLoading(function (prev) { return (__assign(__assign({}, prev), { ssJson: true })); });
                    variables = prepareVars();
                    return [4 /*yield*/, helper_1.apiRequest({
                            type: "post",
                            path: "/project/generateMergeBlockFields",
                            body: {
                                templateId: activeTemplateId,
                                variables: variables,
                                projectId: id,
                                templateUuid: activeTemplateUuid,
                                templateStyleId: templateId === null || templateId === void 0 ? void 0 : templateId.templateStyleId,
                                templateThemeId: templateThemeIds && templateThemeIds
                            }
                        })];
                case 1:
                    res = _j.sent();
                    if (res.status === 200) {
                        dispatchProject({
                            type: types_1.UpdateProjectEnum.SSJSON_MODAL_DATA,
                            payload: {
                                ssJson: res.data,
                                templates: (_a = project.templates) === null || _a === void 0 ? void 0 : _a.map(function (template, index) {
                                    return index === currentTemplateIndex ? __assign(__assign({}, template), { ssJson: res.data }) : template;
                                })
                            }
                        });
                        setLoading(function (prev) { return (__assign({}, prev)); });
                    }
                    else {
                        create_notification_1["default"]("error", ((_b = res === null || res === void 0 ? void 0 : res.data) === null || _b === void 0 ? void 0 : _b.msg) ||
                            ((_d = (_c = res === null || res === void 0 ? void 0 : res.response) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.msg) + " " + ((_e = res === null || res === void 0 ? void 0 : res.data) === null || _e === void 0 ? void 0 : _e.pythonFile) ||
                            "Failed to generate update SSJson.", 15000);
                        dispatchProject({
                            type: types_1.UpdateProjectEnum.SSJSON_MODAL_DATA,
                            payload: {
                                mailBox: true,
                                isJsonLoad: false,
                                ssJsonModal: ((_f = res === null || res === void 0 ? void 0 : res.data) === null || _f === void 0 ? void 0 : _f.pythonFile) || ((_h = (_g = res === null || res === void 0 ? void 0 : res.response) === null || _g === void 0 ? void 0 : _g.data) === null || _h === void 0 ? void 0 : _h.pythonFile)
                            }
                        });
                    }
                    setLoading(function (prev) { return (__assign(__assign({}, prev), { ssJson: false })); });
                    dispatchProject({
                        type: types_1.UpdateProjectEnum.SSJSON_FINALMODAL_IS_JSONLOAD,
                        payload: {
                            isJsonLoad: false,
                            ssJsonFinalModal: true
                        }
                    });
                    return [2 /*return*/];
            }
        });
    }); };
    var renderVideo = function (finalFileName) { return __awaiter(void 0, void 0, void 0, function () {
        var variables, res;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    setLoading(function (prev) { return (__assign(__assign({}, prev), { finalVideo: true })); });
                    variables = prepareVars();
                    return [4 /*yield*/, helper_1.apiRequest({
                            type: "post",
                            path: "/project/renderTemplateVideo",
                            body: {
                                id: id,
                                variables: variables,
                                finalFileName: finalFileName,
                                templateId: activeTemplateId,
                                templateUuid: activeTemplateUuid,
                                templateThemeId: templateThemeIds,
                                templateStyleId: templateId === null || templateId === void 0 ? void 0 : templateId.templateStyleId,
                                resolution: watch("mySwitch") ? "1080" : "sd",
                                quality: watch("mySwitch") ? "high" : "medium"
                            },
                            config: { timeout: 1000 * 60 * 5 }
                        })];
                case 1:
                    res = _b.sent();
                    if (res.status === 200) {
                        dispatchProject({ type: types_1.UpdateProjectEnum.SET_FINAL_VIDEO, payload: res.data.finalVideos });
                    }
                    else {
                        create_notification_1["default"]("error", ((_a = res === null || res === void 0 ? void 0 : res.data) === null || _a === void 0 ? void 0 : _a.msg) || "Failed to generate update SSJson.", 20000);
                    }
                    setLoading(function (prev) { return (__assign(__assign({}, prev), { finalVideo: false })); });
                    return [2 /*return*/];
            }
        });
    }); };
    var moveMediaToField = function (_a) {
        var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        var prev = _a.prev, name = _a.name, id = _a.id, label = _a.label, _currentVideo = _a._currentVideo, startTime = _a.startTime, endTime = _a.endTime;
        var currentIndex = prev === null || prev === void 0 ? void 0 : prev.findIndex(function (x) { return (x === null || x === void 0 ? void 0 : x.label) === label && (x === null || x === void 0 ? void 0 : x.name) === (name ? name : selectedFieldName); });
        if (currentIndex !== -1) {
            if (!((_c = (_b = prev === null || prev === void 0 ? void 0 : prev[currentIndex]) === null || _b === void 0 ? void 0 : _b.value) === null || _c === void 0 ? void 0 : _c.length)) {
                prev[currentIndex].value = [];
            }
            var clip = __assign(__assign({}, _currentVideo), { id: id || ((_d = Math === null || Math === void 0 ? void 0 : Math.random()) === null || _d === void 0 ? void 0 : _d.toString()), startTime: startTime,
                endTime: endTime, clipDuration: (Math === null || Math === void 0 ? void 0 : Math.round((endTime - startTime) * 100)) / 100 });
            prev[currentIndex].fieldLabel = _currentVideo === null || _currentVideo === void 0 ? void 0 : _currentVideo.label;
            if (id) {
                var elementIndex = (_f = (_e = prev[currentIndex]) === null || _e === void 0 ? void 0 : _e.value) === null || _f === void 0 ? void 0 : _f.findIndex(function (x) {
                    return (x === null || x === void 0 ? void 0 : x.id) === id;
                });
                prev[currentIndex].value[elementIndex] = clip;
            }
            else if (((_g = prev[currentIndex]) === null || _g === void 0 ? void 0 : _g.type) === "image") {
                prev[currentIndex].value = [];
                (_j = (_h = prev[currentIndex]) === null || _h === void 0 ? void 0 : _h.value) === null || _j === void 0 ? void 0 : _j.push(clip);
            }
            else {
                (_l = (_k = prev[currentIndex]) === null || _k === void 0 ? void 0 : _k.value) === null || _l === void 0 ? void 0 : _l.push(clip);
            }
        }
        return __spreadArrays(prev);
    };
    var moveMediaToFieldStaging = function (_a) {
        var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2;
        var prev = _a.prev, name = _a.name, id = _a.id, label = _a.label, _currentVideo = _a._currentVideo, startTime = _a.startTime, endTime = _a.endTime, side = _a.side;
        var currentIndex = prev === null || prev === void 0 ? void 0 : prev.findIndex(function (x) { return (x === null || x === void 0 ? void 0 : x.label) === label && (x === null || x === void 0 ? void 0 : x.name) === (name ? name : selectedFieldName); });
        if (currentIndex !== -1) {
            if (!((_b = prev === null || prev === void 0 ? void 0 : prev[currentIndex]) === null || _b === void 0 ? void 0 : _b.value) && !((_c = prev[currentIndex]) === null || _c === void 0 ? void 0 : _c.type) === "video") {
                prev[currentIndex].value = [];
            }
            if (!((_d = prev === null || prev === void 0 ? void 0 : prev[currentIndex]) === null || _d === void 0 ? void 0 : _d.value) && ((_e = prev[currentIndex]) === null || _e === void 0 ? void 0 : _e.type) === "video") {
                prev[currentIndex].value = [];
                prev[currentIndex].value = {
                    leftValue: [],
                    rightValue: []
                };
            }
            if (!((_g = (_f = prev[currentIndex]) === null || _f === void 0 ? void 0 : _f.value) === null || _g === void 0 ? void 0 : _g.leftValue) && ((_h = prev[currentIndex]) === null || _h === void 0 ? void 0 : _h.type) === "video") {
                prev[currentIndex].value = {
                    leftValue: [],
                    rightValue: ((_k = (_j = prev[currentIndex]) === null || _j === void 0 ? void 0 : _j.value) === null || _k === void 0 ? void 0 : _k.rightValue) || []
                };
            }
            if (!((_m = (_l = prev[currentIndex]) === null || _l === void 0 ? void 0 : _l.value) === null || _m === void 0 ? void 0 : _m.rightValue) && ((_o = prev[currentIndex]) === null || _o === void 0 ? void 0 : _o.type) === "video") {
                prev[currentIndex].value = {
                    leftValue: ((_q = (_p = prev[currentIndex]) === null || _p === void 0 ? void 0 : _p.value) === null || _q === void 0 ? void 0 : _q.leftValue) || [],
                    rightValue: []
                };
            }
            var clip = __assign(__assign({}, _currentVideo), { id: id || ((_r = Math === null || Math === void 0 ? void 0 : Math.random()) === null || _r === void 0 ? void 0 : _r.toString()), clipId: (_s = Math === null || Math === void 0 ? void 0 : Math.random()) === null || _s === void 0 ? void 0 : _s.toString(), startTime: startTime,
                side: side,
                endTime: endTime, clipDuration: (Math === null || Math === void 0 ? void 0 : Math.round((endTime - startTime) * 100)) / 100 });
            prev[currentIndex].fieldLabel = _currentVideo === null || _currentVideo === void 0 ? void 0 : _currentVideo.label;
            if (side === "left" && ((_t = prev[currentIndex]) === null || _t === void 0 ? void 0 : _t.type) === "video") {
                (_w = (_v = (_u = prev[currentIndex]) === null || _u === void 0 ? void 0 : _u.value) === null || _v === void 0 ? void 0 : _v.leftValue) === null || _w === void 0 ? void 0 : _w.push(clip);
            }
            else if (side === "right" && ((_x = prev[currentIndex]) === null || _x === void 0 ? void 0 : _x.type) === "video") {
                (_z = (_y = prev[currentIndex]) === null || _y === void 0 ? void 0 : _y.value) === null || _z === void 0 ? void 0 : _z.rightValue.push(clip);
            }
            else if (((_0 = prev[currentIndex]) === null || _0 === void 0 ? void 0 : _0.type) === "image") {
                prev[currentIndex].value = [clip];
            }
            else {
                (_2 = (_1 = prev[currentIndex]) === null || _1 === void 0 ? void 0 : _1.value) === null || _2 === void 0 ? void 0 : _2.push(clip);
            }
        }
        return __spreadArrays(prev);
    };
    var getTemplate = function (args) { return __awaiter(void 0, void 0, void 0, function () {
        var templateIdsFieldsAndUUid, getTemplateData, templateId, fields, uuid, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    templateIdsFieldsAndUUid = args.templateIdsFieldsAndUUid, getTemplateData = args.getTemplateData;
                    templateId = templateIdsFieldsAndUUid.templateId, fields = templateIdsFieldsAndUUid.fields, uuid = templateIdsFieldsAndUUid.uuid;
                    if (!getTemplateData) return [3 /*break*/, 2];
                    return [4 /*yield*/, templates_1.getTemplateById({ templateId: templateId })];
                case 1:
                    res = _a.sent();
                    if (res) {
                        dispatchProject({
                            type: types_1.UpdateProjectEnum.ADD_TEMPLATE_DATA,
                            payload: {
                                templatesData: __spreadArrays(project.templatesData, [__assign({}, res)])
                            }
                        });
                    }
                    _a.label = 2;
                case 2:
                    fields && handleGetTemplateFields(templateId, uuid);
                    return [2 /*return*/];
            }
        });
    }); };
    return {
        id: id,
        ssJson: ssJson,
        prefix: prefix,
        player: player,
        loading: loading,
        moveMenu: moveMenu,
        setPlayer: setPlayer,
        isPlaying: isPlaying,
        fieldName: fieldName,
        finalVideo: finalVideo,
        typeFields: typeFields,
        wrapperRef: wrapperRef,
        setLoading: setLoading,
        setMoveMenu: setMoveMenu,
        currentTime: currentTime,
        mergePlayer: mergePlayer,
        renderVideo: renderVideo,
        setIsPlaying: setIsPlaying,
        themesOptions: themesOptions,
        currentVideo: currentVideo,
        currentIndex: currentIndex,
        setFieldName: setFieldName,
        setCurrentTime: setCurrentTime,
        setMergePlayer: setMergePlayer,
        stageTypeFields: stageTypeFields,
        setCurrentIndex: setCurrentIndex,
        setCurrentVideo: setCurrentVideo,
        moveMediaToField: moveMediaToField,
        templeStylesOptions: templeStylesOptions,
        generateUpdateSSJson: generateUpdateSSJson,
        moveMediaToFieldStaging: moveMediaToFieldStaging
    };
};
