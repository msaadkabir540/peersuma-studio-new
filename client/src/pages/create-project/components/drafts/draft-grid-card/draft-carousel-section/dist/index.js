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
exports.__esModule = true;
var react_1 = require("react");
var react_slick_1 = require("react-slick");
require("slick-carousel/slick/slick.css");
require("slick-carousel/slick/slick-theme.css");
var modal_1 = require("@/components/modal");
var input_1 = require("@/components/input");
var button_1 = require("@/components/button");
var loading_1 = require("@/components/loading");
var draft_sub_card_1 = require("./draft-sub-card");
var index_module_scss_1 = require("./index.module.scss");
var DraftCarouselSection = function (_a) {
    var assets = _a.assets, widget = _a.widget, handleChangeVideoName = _a.handleChangeVideoName, videoDraftId = _a.videoDraftId, handleDownload = _a.handleDownload;
    var sliderRef = react_1.useRef(null);
    var _b = react_1.useState({
        _id: "",
        url: "",
        name: "",
        thumbnailUrl: ""
    }), selected = _b[0], setSelected = _b[1];
    react_1.useEffect(function () {
        if (assets && (assets === null || assets === void 0 ? void 0 : assets.length)) {
            setSelected(__assign({}, assets[0]));
        }
    }, [assets]);
    var handleSelect = function (_a) {
        var item = _a.item;
        setSelected(__assign({}, item));
    };
    var _c = react_1.useState(""), value = _c[0], setValue = _c[1];
    var _d = react_1.useState(""), error = _d[0], setError = _d[1];
    var _e = react_1.useState({
        isOpen: false,
        videoUrl: ""
    }), isClipOpen = _e[0], setIsClipOpen = _e[1];
    var _f = react_1.useState(false), isVideoRename = _f[0], setIsVideoRename = _f[1];
    var _g = react_1.useState(false), isRename = _g[0], setIsRename = _g[1];
    var handleChangeName = function (_a) {
        var value = _a.value, videoDraftId = _a.videoDraftId, mediaId = _a.mediaId;
        return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(value.trim().length === 0)) return [3 /*break*/, 1];
                        setError("Enter the Comment");
                        return [3 /*break*/, 3];
                    case 1:
                        setIsRename(true);
                        return [4 /*yield*/, handleChangeVideoName({ value: value, videoDraftId: videoDraftId, mediaId: mediaId })];
                    case 2:
                        _b.sent();
                        setIsRename(false);
                        setIsVideoRename(false);
                        _b.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return (react_1["default"].createElement(react_1["default"].Fragment, null,
        react_1["default"].createElement("div", { className: index_module_scss_1["default"].main, "aria-label": " Title\": " + (selected === null || selected === void 0 ? void 0 : selected.name) },
            react_1["default"].createElement("div", { className: index_module_scss_1["default"].widgetContainer, "aria-label": "Video Player" },
                react_1["default"].createElement("div", { className: index_module_scss_1["default"].flexBetween },
                    react_1["default"].createElement("div", { className: index_module_scss_1["default"].textLarge }, selected === null || selected === void 0 ? void 0 : selected.name)),
                react_1["default"].createElement("video", { key: selected === null || selected === void 0 ? void 0 : selected.url, controls: true, className: index_module_scss_1["default"].video },
                    react_1["default"].createElement("source", { src: selected === null || selected === void 0 ? void 0 : selected.url, type: "video/mp4" }),
                    react_1["default"].createElement("track", { kind: "captions", src: selected === null || selected === void 0 ? void 0 : selected.url }))),
            react_1["default"].createElement("div", { className: index_module_scss_1["default"].sliderWrapper },
                react_1["default"].createElement("div", { className: index_module_scss_1["default"].SliderMain },
                    react_1["default"].createElement("div", { className: index_module_scss_1["default"].textTitle }, "Previous Drafts"),
                    react_1["default"].createElement(react_slick_1["default"], __assign({}, settings(assets), { ref: sliderRef }), assets === null || assets === void 0 ? void 0 : assets.map(function (item) { return (react_1["default"].createElement("div", { key: item === null || item === void 0 ? void 0 : item._id },
                        react_1["default"].createElement("div", { style: {
                                margin: "0px 5px",
                                width: "200px"
                            } },
                            react_1["default"].createElement(draft_sub_card_1["default"], { item: item, handleSelect: handleSelect, thumbnailTitleColor: widget === null || widget === void 0 ? void 0 : widget.thumbnailTitleColor, selected: (selected === null || selected === void 0 ? void 0 : selected._id) === (item === null || item === void 0 ? void 0 : item._id) })))); }))),
                react_1["default"].createElement("div", { className: index_module_scss_1["default"].mobileClass },
                    react_1["default"].createElement("div", { className: index_module_scss_1["default"].textTitle }, "Previous Drafts"), assets === null || assets === void 0 ? void 0 :
                    assets.map(function (item) { return (react_1["default"].createElement("div", { key: item === null || item === void 0 ? void 0 : item._id },
                        react_1["default"].createElement(draft_sub_card_1["default"], { item: item, handleSelect: handleSelect, thumbnailTitleColor: widget === null || widget === void 0 ? void 0 : widget.thumbnailTitleColor, selected: (selected === null || selected === void 0 ? void 0 : selected._id) === (item === null || item === void 0 ? void 0 : item._id) }))); })))),
        isVideoRename && (react_1["default"].createElement(modal_1["default"], { showCross: true, className: index_module_scss_1["default"].modalContentWrapper, open: isVideoRename, handleClose: function () { return setIsVideoRename(false); } },
            react_1["default"].createElement("div", null,
                react_1["default"].createElement("div", { className: index_module_scss_1["default"].textLarge }, "Rename Draft")),
            react_1["default"].createElement(input_1["default"], { name: "videoDraftName", onChange: function (e) { return setValue(e.target.value); }, value: value, required: true, inputField: index_module_scss_1["default"].input, errorMessage: error, type: "text" }),
            react_1["default"].createElement("div", { className: index_module_scss_1["default"].flexBetween },
                react_1["default"].createElement(button_1["default"], { title: "Cancel", handleClick: function () { return setIsVideoRename(false); } }),
                react_1["default"].createElement(button_1["default"], { isLoading: isRename, title: isRename ? "" + (react_1["default"].createElement(loading_1["default"], { loaderClass: index_module_scss_1["default"].loaderSaveClass })) : "Save", handleClick: function () { return handleChangeName({ value: value, videoDraftId: videoDraftId, mediaId: selected === null || selected === void 0 ? void 0 : selected._id }); } }))))));
};
exports["default"] = DraftCarouselSection;
var settings = function (assets) {
    if (assets === void 0) { assets = []; }
    return {
        centerMode: true,
        centerPadding: "40px",
        slidesToShow: assets.length > 4 ? 4 : assets.length,
        slidesToScroll: 4,
        dots: true,
        arrows: true,
        autoplay: false,
        autoplaySpeed: 300,
        infinite: assets.length > 1 ? true : false,
        speed: 300,
        responsive: [
            {
                breakpoint: 1440,
                settings: {
                    slidesToShow: assets.length > 4 ? 4 : assets.length,
                    centerPadding: "30px"
                }
            },
            {
                breakpoint: 1000,
                settings: {
                    slidesToShow: assets.length > 3 ? 3 : assets.length,
                    centerPadding: "20px"
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: assets.length > 2 ? 2 : assets.length,
                    centerPadding: "10px"
                }
            },
            {
                breakpoint: 500,
                settings: {
                    slidesToShow: 1,
                    centerPadding: "0px"
                }
            },
        ]
    };
};
