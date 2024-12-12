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
var loading_1 = require("../loading");
var media_card_1 = require("./media-card");
var filter_bar_1 = require("./filter-bar");
var video_modal_1 = require("./video-modal");
var useMediaList_1 = require("./useMediaList");
var index_module_scss_1 = require("./index.module.scss");
var AlbumsMediaList = function (_a) {
    var albumId = _a.albumId, isAssembly = _a.isAssembly, finalVideos = _a.finalVideos, handleDragEnd = _a.handleDragEnd, loadingHeight = _a.loadingHeight, handleDragStart = _a.handleDragStart, stageTypeFields = _a.stageTypeFields, handleDeleteFile = _a.handleDeleteFile, selectedClientId = _a.selectedClientId, handleAlbumIdEvent = _a.handleAlbumIdEvent, clickOnListMedia = _a.clickOnListMedia, clickMediaColor = _a.clickMediaColor, clickOnFieldFields = _a.clickOnFieldFields;
    var _b = react_1.useState(false), viewFile = _b[0], setViewFile = _b[1];
    var _c = useMediaList_1.useMediaList({
        albumId: albumId,
        finalVideos: finalVideos,
        selectedClientId: selectedClientId,
        handleAlbumIdEvent: handleAlbumIdEvent
    }), mediaList = _c.mediaList, isLoading = _c.isLoading, inputValue = _c.inputValue, isVisibility = _c.isVisibility, mediaOptions = _c.mediaOptions, dispatchAlbum = _c.dispatchAlbum, selectedAlbumId = _c.selectedAlbumId, handleSearchEvent = _c.handleSearchEvent, handleSearchOption = _c.handleSearchOption;
    var loadingDiffHedight = loadingHeight ? loadingHeight : 500;
    var mediaResult = react_1.useMemo(function () {
        return mediaList === null || mediaList === void 0 ? void 0 : mediaList.filter(function (_a) {
            var _b;
            var name = _a.name;
            return (_b = name === null || name === void 0 ? void 0 : name.toLowerCase()) === null || _b === void 0 ? void 0 : _b.includes(inputValue === null || inputValue === void 0 ? void 0 : inputValue.toLowerCase());
        });
    }, [mediaList, inputValue]);
    var handleFilterFields = react_1.useCallback(function (_a) {
        var fileType = _a.fileType;
        return stageTypeFields && stageTypeFields(fileType);
    }, [stageTypeFields]);
    var clickToSelectedAlbumMedia = react_1.useCallback(function (_a) {
        var index = _a.index, media = _a.media;
        if (clickOnListMedia) {
            clickOnListMedia && clickOnListMedia({ index: index, media: media });
        }
        else {
            (media === null || media === void 0 ? void 0 : media.fileType) != "font" &&
                (media === null || media === void 0 ? void 0 : media.fileType) != "document" &&
                setViewFile({ url: media === null || media === void 0 ? void 0 : media.url, fileType: media === null || media === void 0 ? void 0 : media.fileType });
        }
    }, [clickOnListMedia]);
    return (React.createElement("div", { className: index_module_scss_1["default"].mediaContainer },
        isLoading ? (React.createElement(loading_1["default"], { pageLoader: true, diffHeight: loadingDiffHedight })) : (React.createElement(React.Fragment, null,
            !isAssembly && (React.createElement(filter_bar_1["default"], { mediaOptions: mediaOptions, isVisibility: isVisibility, dispatchAlbum: dispatchAlbum, selectedAlbumId: selectedAlbumId, handleSearchEvent: handleSearchEvent, handleSearchOption: handleSearchOption })),
            React.createElement("div", { className: index_module_scss_1["default"].divName }, mediaResult === null || mediaResult === void 0 ? void 0 : mediaResult.map(function (media, index) {
                var fileFields = handleFilterFields({ fileType: media === null || media === void 0 ? void 0 : media.fileType });
                return (React.createElement(media_card_1["default"], { media: media, index: index, key: media === null || media === void 0 ? void 0 : media._id, fileFields: fileFields, isAssembly: isAssembly, isVisibility: isVisibility, handleDragEnd: handleDragEnd, dispatchAlbum: dispatchAlbum, selectedAlbumId: selectedAlbumId, handleDragStart: handleDragStart, clickMediaColor: clickMediaColor, handleDeleteFile: handleDeleteFile, clickOnFieldFields: clickOnFieldFields, clickToSelectedAlbumMedia: clickToSelectedAlbumMedia }));
            })))),
        !clickOnListMedia && React.createElement(video_modal_1["default"], __assign({}, { setViewFile: setViewFile, viewFile: viewFile }))));
};
exports["default"] = react_1.memo(AlbumsMediaList);
