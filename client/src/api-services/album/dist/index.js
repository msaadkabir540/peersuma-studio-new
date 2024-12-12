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
exports.getAlbumsById = exports.updateAlbum = exports.addAlbum = exports.getAllAlbums1 = exports.getAllAlbums = void 0;
var api_1 = require("@/utils/api");
var create_notification_1 = require("@/common/create-notification");
exports.getAllAlbums = function (_a) {
    var params = _a.params;
    return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, api_1.axiosApiRequest({
                        method: "get",
                        url: "/albums",
                        params: params
                    })];
                case 1:
                    res = _b.sent();
                    if (res.status === 200) {
                        return [2 /*return*/, res];
                    }
                    return [2 /*return*/];
            }
        });
    });
};
exports.getAllAlbums1 = function (_a) {
    var params = _a.params;
    return __awaiter(void 0, void 0, void 0, function () {
        var _b, status, data;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, api_1.axiosApiRequest({
                        method: "get",
                        url: "/albums/get-all-album",
                        params: params
                    })];
                case 1:
                    _b = _c.sent(), status = _b.status, data = _b.data;
                    if (status === 200) {
                        return [2 /*return*/, {
                                albumsData: (data === null || data === void 0 ? void 0 : data.data) || []
                            }];
                    }
                    return [2 /*return*/];
            }
        });
    });
};
exports.addAlbum = function (_a) {
    var data = _a.data;
    return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, api_1.axiosApiRequest({
                        method: "post",
                        url: "/albums",
                        data: data
                    })];
                case 1:
                    res = _b.sent();
                    if (res.status === 200) {
                        create_notification_1["default"]("success", res.data.msg);
                        return [2 /*return*/, res];
                    }
                    return [2 /*return*/];
            }
        });
    });
};
exports.updateAlbum = function (_a) {
    var id = _a.id, data = _a.data;
    return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, api_1.axiosApiRequest({
                        method: "put",
                        url: "/albums/" + id,
                        data: data
                    })];
                case 1:
                    res = _b.sent();
                    if (res.status === 200) {
                        create_notification_1["default"]("success", res.data.msg);
                        return [2 /*return*/, res === null || res === void 0 ? void 0 : res.data];
                    }
                    return [2 /*return*/];
            }
        });
    });
};
exports.getAlbumsById = function (_a) {
    var params = _a.params;
    return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, api_1.axiosApiRequest({
                        method: "get",
                        url: "/albums/single_album",
                        params: params
                    })];
                case 1:
                    res = _b.sent();
                    if (res.status === 200) {
                        return [2 /*return*/, res];
                    }
                    else {
                        return [2 /*return*/, res];
                    }
                    return [2 /*return*/];
            }
        });
    });
};
