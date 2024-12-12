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
exports.useMediaList = void 0;
var react_1 = require("react");
var reducer_1 = require("./reducer");
var album_1 = require("@/api-services/album");
var initialState = {
    albumsData: null,
    isVisibility: true
};
exports.useMediaList = function (_a) {
    var albumId = _a.albumId, finalVideos = _a.finalVideos, selectedClientId = _a.selectedClientId, handleAlbumIdEvent = _a.handleAlbumIdEvent;
    var _b = react_1.useState(""), inputValue = _b[0], setInputValue = _b[1];
    var _c = react_1.useState(albumId || ""), selectedAlbumId = _c[0], setSelectedAlbumId = _c[1];
    var _d = react_1.useState(false), isLoading = _d[0], setIsLoading = _d[1];
    var _e = react_1.useReducer(reducer_1.reducer, initialState), albumData = _e[0], dispatchAlbum = _e[1];
    var albumsData = albumData.albumsData, isVisibility = albumData.isVisibility, mediaOptions = albumData.mediaOptions;
    var handleSearchEvent = function (_a) {
        var value = _a.value;
        setInputValue(value);
    };
    var handleSearchOption = function (_a) {
        var selectValue = _a.selectValue;
        setSelectedAlbumId(selectValue);
        handleAlbumIdEvent && handleAlbumIdEvent({ newAlbumId: selectValue });
        dispatchAlbum({ type: "SET_SELECTED_ID", selectionId: selectValue });
    };
    var getAllMediaData = react_1.useCallback(function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    setIsLoading(true);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, album_1.getAllAlbums1({
                            params: {
                                clientId: selectedClientId
                            }
                        })];
                case 2:
                    response = _b.sent();
                    if (response) {
                        dispatchAlbum({ type: "ADD_ALBUM_DATA", payload: response });
                    }
                    return [3 /*break*/, 4];
                case 3:
                    _a = _b.sent();
                    console.error("error");
                    setIsLoading(false);
                    return [3 /*break*/, 4];
                case 4:
                    setIsLoading(false);
                    return [2 /*return*/];
            }
        });
    }); }, [selectedClientId]);
    var mediaList = react_1.useMemo(function () {
        var _a, _b;
        var dataAlbumsMedia = (_b = (_a = albumsData === null || albumsData === void 0 ? void 0 : albumsData.find(function (_a) {
            var _id = _a._id;
            return selectedAlbumId === _id;
        })) === null || _a === void 0 ? void 0 : _a.albumshots) === null || _b === void 0 ? void 0 : _b.flatMap(function (shot) { return shot === null || shot === void 0 ? void 0 : shot.media; });
        var albumMediaList = finalVideos ? finalVideos : dataAlbumsMedia;
        return ((albumMediaList === null || albumMediaList === void 0 ? void 0 : albumMediaList.filter(function (shot) {
            var _a, _b;
            var searchTerm = inputValue;
            var nameMatch = new RegExp(searchTerm, "i").test(shot === null || shot === void 0 ? void 0 : shot.name);
            var transcriptionMatch = new RegExp(searchTerm, "i").test((_b = (_a = shot === null || shot === void 0 ? void 0 : shot.transcription) === null || _a === void 0 ? void 0 : _a.flatMap(function (x) { return "" + (x === null || x === void 0 ? void 0 : x.text); })) === null || _b === void 0 ? void 0 : _b.join(" "));
            return nameMatch || transcriptionMatch;
        }).sort(function (shotMedia1, shotMedia2) {
            var _a, _b, _c, _d;
            var searchTerm = inputValue;
            var transcriptionTextA = ((_b = (_a = shotMedia1 === null || shotMedia1 === void 0 ? void 0 : shotMedia1.transcription) === null || _a === void 0 ? void 0 : _a.flatMap(function (x) { return "" + (x === null || x === void 0 ? void 0 : x.text); })) === null || _b === void 0 ? void 0 : _b.join(" ")) || "";
            var transcriptionTextB = ((_d = (_c = shotMedia2 === null || shotMedia2 === void 0 ? void 0 : shotMedia2.transcription) === null || _c === void 0 ? void 0 : _c.flatMap(function (x) { return "" + (x === null || x === void 0 ? void 0 : x.text); })) === null || _d === void 0 ? void 0 : _d.join(" ")) || "";
            var transcriptionMatchesA = (transcriptionTextA.match(new RegExp(searchTerm, "gi")) || [])
                .length;
            var transcriptionMatchesB = (transcriptionTextB.match(new RegExp(searchTerm, "gi")) || [])
                .length;
            return transcriptionMatchesB - transcriptionMatchesA;
        })) || []);
    }, [albumsData, selectedAlbumId, inputValue, finalVideos]);
    var mediaListMap = react_1.useMemo(function () {
        return mediaList === null || mediaList === void 0 ? void 0 : mediaList.filter(function (x) {
            if (isVisibility === true) {
                return (x === null || x === void 0 ? void 0 : x.isVisible) === true || (x === null || x === void 0 ? void 0 : x.isVisible) === undefined;
            }
            else if (isVisibility === false) {
                return (x === null || x === void 0 ? void 0 : x.isVisible) === false;
            }
        });
    }, [mediaList, isVisibility]);
    react_1.useEffect(function () {
        selectedClientId && getAllMediaData();
    }, [selectedClientId, getAllMediaData]);
    react_1.useEffect(function () {
        if (albumId)
            setSelectedAlbumId(albumId);
    }, [albumId]);
    return {
        isLoading: isLoading,
        inputValue: inputValue,
        isVisibility: isVisibility,
        mediaOptions: mediaOptions,
        dispatchAlbum: dispatchAlbum,
        selectedAlbumId: selectedAlbumId,
        handleSearchEvent: handleSearchEvent,
        handleSearchOption: handleSearchOption,
        mediaList: mediaListMap
    };
};
