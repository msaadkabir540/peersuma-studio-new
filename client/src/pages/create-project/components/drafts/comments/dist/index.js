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
var moment_1 = require("moment");
var react_1 = require("react");
var comment_box_1 = require("./comment-box");
var input_1 = require("@/components/input");
var arrow_simple_svg_1 = require("@/assets/arrow-simple.svg");
var index_module_scss_1 = require("./index.module.scss");
var Comments = function (_a) {
    var commentsData = _a.commentsData, draftId = _a.draftId, currentUser = _a.currentUser, videoProjectId = _a.videoProjectId, clientId = _a.clientId, handleAddComments = _a.handleAddComments;
    var _b = react_1.useState(""), comment = _b[0], setComment = _b[1];
    var handleAddComment = function (_a) {
        var comment = _a.comment, id = _a.id;
        return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, handleAddComments({
                            comment: comment,
                            videoProjectId: videoProjectId,
                            clientId: clientId,
                            currentUser: currentUser,
                            videoDraftId: id
                        })];
                    case 1:
                        _b.sent();
                        setComment("");
                        return [2 /*return*/];
                }
            });
        });
    };
    var commentsResult = react_1.useMemo(function () {
        return ((commentsData === null || commentsData === void 0 ? void 0 : commentsData.map(function (comment) {
            var _a, _b, _c, _d, _e, _f;
            var name = "";
            var color;
            if (((_a = comment === null || comment === void 0 ? void 0 : comment.userId) === null || _a === void 0 ? void 0 : _a._id) === (currentUser === null || currentUser === void 0 ? void 0 : currentUser.userId)) {
                color = index_module_scss_1["default"].colorPink;
                name = ((_b = comment === null || comment === void 0 ? void 0 : comment.userId) === null || _b === void 0 ? void 0 : _b.fullName) || ((_c = comment === null || comment === void 0 ? void 0 : comment.userId) === null || _c === void 0 ? void 0 : _c.username) || "Unknown";
            }
            else {
                name = ((_d = comment === null || comment === void 0 ? void 0 : comment.userId) === null || _d === void 0 ? void 0 : _d.fullName) || ((_e = comment === null || comment === void 0 ? void 0 : comment.userId) === null || _e === void 0 ? void 0 : _e.username) || "Unknown";
                color = index_module_scss_1["default"].colorSkyblue;
            }
            var date = moment_1["default"](comment === null || comment === void 0 ? void 0 : comment.createdAt).format("YYYY-MM-DD | hh:mm A");
            var description = (_f = comment === null || comment === void 0 ? void 0 : comment.comment) !== null && _f !== void 0 ? _f : "";
            return { id: comment === null || comment === void 0 ? void 0 : comment._id, name: name, date: date, description: description, color: color };
        })) || []);
    }, [commentsData, currentUser === null || currentUser === void 0 ? void 0 : currentUser.userId]);
    return (react_1["default"].createElement("div", { className: index_module_scss_1["default"].commentContainer },
        react_1["default"].createElement("div", { className: index_module_scss_1["default"].commentsBody },
            react_1["default"].createElement("div", { className: index_module_scss_1["default"].commentsBox }, commentsResult === null || commentsResult === void 0 ? void 0 : commentsResult.map(function (_a) {
                var name = _a.name, date = _a.date, description = _a.description, id = _a.id, color = _a.color;
                return (react_1["default"].createElement(react_1["default"].Fragment, null,
                    react_1["default"].createElement("div", { className: index_module_scss_1["default"].comments, key: id },
                        react_1["default"].createElement(comment_box_1["default"], { time: date, name: name, comment: description, color: color }))));
            })),
            react_1["default"].createElement("div", { className: index_module_scss_1["default"].sendMessageBox },
                react_1["default"].createElement(input_1["default"], { name: "comment", value: comment, placeholder: "Type Something", inputClass: index_module_scss_1["default"].inputField, onChange: function (e) {
                        setComment(e.target.value);
                    } }),
                react_1["default"].createElement("div", { className: index_module_scss_1["default"].sendBtn },
                    react_1["default"].createElement("img", { src: arrow_simple_svg_1["default"], alt: "send comment icon", onClick: function () { return handleAddComment({ comment: comment, id: draftId }); } }))))));
};
exports["default"] = Comments;
