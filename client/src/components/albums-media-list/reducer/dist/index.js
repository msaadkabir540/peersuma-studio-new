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
exports.reducer = void 0;
var updateMediaData = function (_a) {
    var albumData = _a.albumData, updatedData = _a.updatedData, selectionId = _a.selectionId;
    var albumId = selectionId;
    var updatedAlbumData = albumData === null || albumData === void 0 ? void 0 : albumData.map(function (album) {
        var _a;
        if (album._id === albumId) {
            var updatedAlbumshots = (_a = album.albumshots) === null || _a === void 0 ? void 0 : _a.map(function (shot) {
                var _a;
                return (__assign(__assign({}, shot), { media: (_a = shot.media) === null || _a === void 0 ? void 0 : _a.map(function (mediaItem) {
                        var updatedItem = updatedData === null || updatedData === void 0 ? void 0 : updatedData.find(function (updatedMediaItem) { return updatedMediaItem._id === mediaItem._id; });
                        return updatedItem ? __assign(__assign({}, mediaItem), updatedItem) : mediaItem;
                    }) }));
            });
            return __assign(__assign({}, album), { albumshots: updatedAlbumshots });
        }
        return album;
    });
    return updatedAlbumData;
};
exports.reducer = function (state, action) {
    var _a;
    var payload = action.payload, isVisibility = action.isVisibility, selectionId = action.selectionId, visibilityResponse = action.visibilityResponse;
    switch (action.type) {
        case "ADD_ALBUM_DATA":
            var mediaOptions = (_a = payload.albumsData) === null || _a === void 0 ? void 0 : _a.map(function (_a) {
                var _id = _a._id, name = _a.name, description = _a.description;
                return ({
                    label: name,
                    value: _id,
                    description: description
                });
            });
            return __assign(__assign(__assign({}, state), payload), { mediaOptions: mediaOptions });
        case "IS_VISIBILITY_STATE":
            return __assign(__assign({}, state), { isVisibility: isVisibility });
        case "SET_SELECTED_ID":
            return __assign(__assign({}, state), { selectionId: selectionId });
        case "EVENT_ALBUM_VISIBILITY":
            var updatedAlbumData = updateMediaData({
                albumData: state.albumsData,
                updatedData: visibilityResponse,
                selectionId: action === null || action === void 0 ? void 0 : action.visibilityId
            });
            return __assign(__assign({}, state), { albumsData: updatedAlbumData });
        default:
            return state;
    }
};
