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
exports.handleDownloadMedia = exports.convertHeicToJpeg = exports.getSameAndSubOrdinateRoles = exports.roleOptions = exports.s3TransloaditUploadMap = exports.vimeoTransloaditUploadMap = exports.s3TransloaditCompletionCheck = exports.clearTextSelection = exports.convertTimeToSeconds = exports.convertTime = exports.convertFileSize = exports.callWithTimeout = exports.useOutsideClickHook = exports.apiRequest = void 0;
var heic2any_1 = require("heic2any");
var axios_1 = require("@/utils/axios");
var react_1 = require("react");
var utils_1 = require("@/api-services/utils");
var create_notification_1 = require("@/common/create-notification");
exports.apiRequest = function (_a) {
    var type = _a.type, path = _a.path, body = _a.body, params = _a.params, config = _a.config, formData = _a.formData, setLoading = _a.setLoading;
    return __awaiter(void 0, void 0, void 0, function () {
        var res, err_1;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    setLoading && setLoading(true);
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios_1["default"][type](path, formData
                            ? body
                            : __assign(__assign({}, (body && body)), (((_b = ["get", "delete"]) === null || _b === void 0 ? void 0 : _b.includes(type)) && params && { params: params })), __assign(__assign({}, config), (["post", "put"].includes(type) && params && { params: params })))];
                case 2:
                    res = _c.sent();
                    setLoading && setLoading(false);
                    return [2 /*return*/, res];
                case 3:
                    err_1 = _c.sent();
                    setLoading && setLoading(false);
                    console.error(err_1);
                    return [2 /*return*/, err_1];
                case 4: return [2 /*return*/];
            }
        });
    });
};
exports.useOutsideClickHook = function (ref, callback) {
    react_1.useEffect(function () {
        var handleClickOutside = function (event) {
            if (ref.current && !ref.current.contains(event.target)) {
                callback();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return function () {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref]);
};
exports.callWithTimeout = function (_a) {
    var fn = _a.fn, _b = _a.params, params = _b === void 0 ? {} : _b, _c = _a.timeout, timeout = _c === void 0 ? 15 * 60 * 1000 : _c, _d = _a.interval, interval = _d === void 0 ? 5 * 1000 : _d;
    return new Promise(function (resolve, reject) {
        var intervalId = setInterval(function () { return __awaiter(void 0, void 0, void 0, function () {
            var result, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, fn(__assign({}, params))];
                    case 1:
                        result = _a.sent();
                        if (result === null || result === void 0 ? void 0 : result.abort) {
                            clearInterval(intervalId);
                            create_notification_1["default"]("error", result === null || result === void 0 ? void 0 : result.response);
                            reject(new Error(result === null || result === void 0 ? void 0 : result.response));
                        }
                        if (result === null || result === void 0 ? void 0 : result.completed) {
                            clearInterval(intervalId);
                            resolve(result);
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        console.error("Error calling function:", error_1);
                        clearInterval(intervalId);
                        reject(error_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); }, interval);
        setTimeout(function () {
            clearInterval(intervalId);
            reject(new Error("Function call timed out."));
        }, timeout);
    });
};
exports.convertFileSize = function (bytes) {
    var units = ["bytes", "KB", "MB", "GB", "TB"];
    var i = 0;
    while (bytes >= 1024 && i < units.length - 1) {
        bytes /= 1024;
        i++;
    }
    return bytes.toFixed(2) + " " + units[i];
};
exports.convertTime = function (decimalTime) {
    var totalSeconds = Math.floor(decimalTime);
    var milliseconds = Math.round((decimalTime - totalSeconds) * 1000);
    var hours = Math.floor(totalSeconds / 3600);
    var minutes = Math.floor((totalSeconds % 3600) / 60);
    var seconds = totalSeconds % 60;
    return "" + (hours ? hours + " " + (hours > 1 ? "hrs " : "hr ") : "") + (minutes ? minutes + " " + (minutes > 1 ? "mins " : "min ") : "") + (seconds || milliseconds ? seconds + milliseconds / 1000 + " sec" : "");
};
exports.convertTimeToSeconds = function (time) {
    if (time === undefined || 0) {
        return 0;
    }
    else {
        // split the time string into hours, minutes, seconds, and milliseconds
        var parts = time.split(":");
        // convert hours to seconds
        var seconds = +parts[0] * 60 * 60;
        // convert minutes to seconds
        seconds += +parts[1] * 60;
        // add the seconds
        seconds += +parts[2];
        // add the milliseconds
        seconds += +parts[3] / 1000;
        return seconds;
    }
};
//done
exports.clearTextSelection = function () {
    if (window.getSelection) {
        var selection = window.getSelection();
        if (selection && selection.empty) {
            // Chrome
            selection.empty();
        }
        else if (selection && selection.removeAllRanges) {
            // Firefox
            selection.removeAllRanges();
        }
    }
    else if (document.selection) {
        // IE
        var selection = document.selection;
        if (selection.empty) {
            selection.empty();
        }
    }
};
// done
exports.s3TransloaditCompletionCheck = function (res) {
    var _a;
    var results = Object.keys((_a = res === null || res === void 0 ? void 0 : res.data) === null || _a === void 0 ? void 0 : _a.results);
    return ((results === null || results === void 0 ? void 0 : results.map(function (x) {
        var _a, _b, _c, _d, _e, _f, _g;
        return ((_c = (((_b = (_a = res === null || res === void 0 ? void 0 : res.data) === null || _a === void 0 ? void 0 : _a.results) === null || _b === void 0 ? void 0 : _b[x]) || [])) === null || _c === void 0 ? void 0 : _c.length) > 0 &&
            ((_g = (_f = (_e = (_d = res === null || res === void 0 ? void 0 : res.data) === null || _d === void 0 ? void 0 : _d.results) === null || _e === void 0 ? void 0 : _e[x]) === null || _f === void 0 ? void 0 : _f.filter(function (x) { var _a; return ((_a = x === null || x === void 0 ? void 0 : x.ssl_url) === null || _a === void 0 ? void 0 : _a.indexOf("peersuma")) === -1; })) === null || _g === void 0 ? void 0 : _g.length) ===
                0;
    }).filter(function (x) { return x === false; }).length) === 0);
};
exports.vimeoTransloaditUploadMap = function (resp) {
    var _a, _b, _c;
    return (((_c = (_b = (_a = resp === null || resp === void 0 ? void 0 : resp.data) === null || _a === void 0 ? void 0 : _a.results) === null || _b === void 0 ? void 0 : _b[":original"]) === null || _c === void 0 ? void 0 : _c.map(function (file) {
        var _a, _b;
        return ({
            id: (_a = file === null || file === void 0 ? void 0 : file.ssl_url) === null || _a === void 0 ? void 0 : _a.split("/").pop(),
            duration: (_b = file === null || file === void 0 ? void 0 : file.meta) === null || _b === void 0 ? void 0 : _b.duration
        });
    })) || []);
};
// export const s3TransloaditUploadMap = (resp: any, fields: any) => {
//   console.log({ resp });
//   const files =
//     resp?.data?.results?.["convert_to_mp4"] ||
//     resp?.data?.results?.["convert_heic_to_jpg"] ||
//     resp?.data?.results?.[":original"];
//   if (!files) return [];
//   return files.map((file: S3TransloaditFiledInterface) => {
//     const urlName = file?.ssl_url?.split(fields?.prefix)[1];
//     const thumbnailUrl =
//       file?.type === "video"
//         ? resp?.data?.results?.["thumbnail"]?.find(
//             ({ original_id }: { original_id: string }) => original_id === file?.original_id,
//           )?.ssl_url
//         : "";
//     const thumbnailUrlName = thumbnailUrl ? thumbnailUrl?.split(fields?.prefix)[1] : "";
//     return {
//       name: urlName || "",
//       url: file?.ssl_url || "",
//       fileType: getFileType(file?.ext as string, file?.type as string),
//       fileSize: file?.size || 0,
//       duration: file?.meta?.duration || 0,
//       s3Key: (fields?.prefix && fields?.prefix?.slice(1) + urlName) || "",
//       ...(file?.type === "video" && {
//         thumbnailUrl: thumbnailUrl || "",
//         thumbnailS3Key: fields?.prefix?.slice(1) + thumbnailUrlName || "",
//       }),
//     };
//   });
// };
exports.s3TransloaditUploadMap = function (resp, fields) {
    var _a, _b;
    var files = [];
    var allFiles = __spreadArrays((((_b = (_a = resp === null || resp === void 0 ? void 0 : resp.data) === null || _a === void 0 ? void 0 : _a.results) === null || _b === void 0 ? void 0 : _b[":original"]) || []));
    allFiles.forEach(function (file) {
        var _a, _b, _c;
        if (file.ext === "mov") {
            var data = (_c = (_b = (_a = resp === null || resp === void 0 ? void 0 : resp.data) === null || _a === void 0 ? void 0 : _a.results) === null || _b === void 0 ? void 0 : _b["convert_to_mp4"]) === null || _c === void 0 ? void 0 : _c.find(function (data) { return data.original_id === (file === null || file === void 0 ? void 0 : file.original_id); });
            files.push(data);
        }
        else {
            files.push(file);
        }
    });
    if (!files.length)
        return [];
    return files.map(function (file) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        var urlName = (_a = file === null || file === void 0 ? void 0 : file.ssl_url) === null || _a === void 0 ? void 0 : _a.split(fields === null || fields === void 0 ? void 0 : fields.prefix)[1];
        var thumbnailUrl = (file === null || file === void 0 ? void 0 : file.type) === "video"
            ? (_e = (_d = (_c = (_b = resp === null || resp === void 0 ? void 0 : resp.data) === null || _b === void 0 ? void 0 : _b.results) === null || _c === void 0 ? void 0 : _c["thumbnail"]) === null || _d === void 0 ? void 0 : _d.find(function (_a) {
                var original_id = _a.original_id;
                return original_id === (file === null || file === void 0 ? void 0 : file.original_id);
            })) === null || _e === void 0 ? void 0 : _e.ssl_url : "";
        var thumbnailUrlName = thumbnailUrl ? thumbnailUrl === null || thumbnailUrl === void 0 ? void 0 : thumbnailUrl.split(fields === null || fields === void 0 ? void 0 : fields.prefix)[1] : "";
        return __assign({ name: urlName || "", url: (file === null || file === void 0 ? void 0 : file.ssl_url) || "", fileType: getFileType(file === null || file === void 0 ? void 0 : file.ext, file === null || file === void 0 ? void 0 : file.type), fileSize: (file === null || file === void 0 ? void 0 : file.size) || 0, duration: ((_f = file === null || file === void 0 ? void 0 : file.meta) === null || _f === void 0 ? void 0 : _f.duration) || 0, s3Key: ((fields === null || fields === void 0 ? void 0 : fields.prefix) && ((_g = fields === null || fields === void 0 ? void 0 : fields.prefix) === null || _g === void 0 ? void 0 : _g.slice(1)) + urlName) || "" }, ((file === null || file === void 0 ? void 0 : file.type) === "video" && {
            thumbnailUrl: thumbnailUrl || "",
            thumbnailS3Key: ((_h = fields === null || fields === void 0 ? void 0 : fields.prefix) === null || _h === void 0 ? void 0 : _h.slice(1)) + thumbnailUrlName || ""
        }));
    });
};
var fontExtensions = ["ttf", "otf", "woff", "woff2", "eot"];
var audioExtensions = ["m4a"];
// done
var getFileType = function (extension, type) {
    return (fontExtensions.includes(extension)
        ? "font"
        : audioExtensions.includes(extension)
            ? "audio"
            : type) || "";
};
// done
exports.roleOptions = [
    // { value: "superadmin", label: "Superadmin" },
    // { value: "backend", label: "Backend" },
    { value: "executive-producer", label: "Executive Producer" },
    { value: "producer", label: "Producer" },
];
exports.getSameAndSubOrdinateRoles = function (currentUserRole) {
    var roleHierarchy = {
        superadmin: 0,
        backend: 1,
        "executive-producer": 2,
        producer: 3
    };
    return exports.roleOptions.filter(function (role) { return roleHierarchy[currentUserRole] <= roleHierarchy[role.value]; });
};
exports.convertHeicToJpeg = function (_a) {
    var file = _a.file;
    return __awaiter(void 0, void 0, void 0, function () {
        var convertedBlob, convertedFile, error_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, heic2any_1["default"]({
                            blob: file,
                            toType: "image/jpeg",
                            quality: 0.8
                        })];
                case 1:
                    convertedBlob = _b.sent();
                    convertedFile = new File([convertedBlob], file.name.replace(/\.heic$/, ".jpeg"), {
                        type: "image/jpeg"
                    });
                    return [2 /*return*/, convertedFile];
                case 2:
                    error_2 = _b.sent();
                    console.error("Error converting HEIC to JPEG:", error_2);
                    return [2 /*return*/, null];
                case 3: return [2 /*return*/];
            }
        });
    });
};
exports.handleDownloadMedia = function (_a) {
    var url = _a.url, name = _a.name, s3Key = _a.s3Key;
    return __awaiter(void 0, void 0, void 0, function () {
        var response, blob, blobUrl, fileName, link, error_3, error_4;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!url) {
                        console.error("No URL provided");
                        return [2 /*return*/];
                    }
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 4, , 9]);
                    return [4 /*yield*/, fetch(url)];
                case 2:
                    response = _b.sent();
                    if (!response.ok) {
                        throw new Error("Network response was not ok");
                    }
                    return [4 /*yield*/, response.blob()];
                case 3:
                    blob = _b.sent();
                    blobUrl = window.URL.createObjectURL(blob);
                    fileName = name;
                    link = document.createElement("a");
                    link.href = blobUrl;
                    link.download = fileName;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(blobUrl);
                    return [2 /*return*/, true];
                case 4:
                    error_3 = _b.sent();
                    _b.label = 5;
                case 5:
                    _b.trys.push([5, 7, , 8]);
                    return [4 /*yield*/, utils_1.handleDownload({ name: name, finalFileName: name, s3Key: s3Key })];
                case 6:
                    _b.sent();
                    return [3 /*break*/, 8];
                case 7:
                    error_4 = _b.sent();
                    console.error("Download failed:", error_4);
                    return [3 /*break*/, 8];
                case 8:
                    console.error("Download failed:", error_3);
                    return [3 /*break*/, 9];
                case 9: return [2 /*return*/];
            }
        });
    });
};
