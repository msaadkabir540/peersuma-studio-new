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
var react_redux_1 = require("react-redux");
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var columns_1 = require("./columns");
var input_1 = require("@/components/input");
var table_1 = require("@/components/table");
var button_1 = require("@/components/button");
var inventory_1 = require("@/api-services/inventory");
var debounce_1 = require("@/custom-hook/debounce");
var edit_svg_1 = require("@/assets/edit.svg");
var del_icon_svg_1 = require("@/assets/del-icon.svg");
var cross_fat_svg_1 = require("@/assets/cross-fat.svg");
var index_module_scss_1 = require("./index.module.scss");
var Inventory = function () {
    var navigate = react_router_dom_1.useNavigate();
    var selectedClient = react_redux_1.useSelector(function (state) { return state.clients; }).selectedClient;
    var _a = react_1.useState([]), rows = _a[0], setRows = _a[1];
    var _b = react_1.useState(""), searchValue = _b[0], setSearchValue = _b[1];
    var _c = react_1.useState(""), isDeleting = _c[0], setIsDeleting = _c[1];
    var _d = react_1.useState({
        sortBy: "",
        sortOrder: "asc"
    }), sortColumn = _d[0], setSortColumn = _d[1];
    var searchValueDebounce = debounce_1.useDebounce({ value: searchValue, milliSeconds: 2000 });
    var handleChangeSearch = function (e) {
        setSearchValue(e.target.value);
    };
    var _e = react_1.useState(false), templateLoading = _e[0], setTemplateLoading = _e[1];
    var handleGetAllInventory = function () { return __awaiter(void 0, void 0, Promise, function () {
        var sortBy, sortOrder, res, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setTemplateLoading(true);
                    sortBy = sortColumn.sortBy, sortOrder = sortColumn.sortOrder;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, inventory_1.getAllInventoryData({
                            sortBy: sortBy,
                            sortOrder: sortOrder,
                            search: searchValueDebounce
                        })];
                case 2:
                    res = _a.sent();
                    if (res) {
                        setRows(res);
                    }
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _a.sent();
                    // Handle any errors here if needed
                    console.error("Error fetching templates:", error_1);
                    return [3 /*break*/, 5];
                case 4:
                    setTemplateLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var handleDelete = function (id) { return __awaiter(void 0, void 0, void 0, function () {
        var res, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setIsDeleting(id);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, inventory_1.deleteInventoryById({ id: id })];
                case 2:
                    res = _a.sent();
                    if ((res === null || res === void 0 ? void 0 : res.length) !== 0) {
                        setRows(function (prev) { return __spreadArrays(((prev === null || prev === void 0 ? void 0 : prev.filter(function (_a) {
                            var _id = _a._id;
                            return _id !== id;
                        })) || [])); });
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    console.error(error_2);
                    return [3 /*break*/, 4];
                case 4:
                    setIsDeleting("");
                    return [2 /*return*/];
            }
        });
    }); };
    react_1.useEffect(function () {
        sortColumn && handleGetAllInventory();
    }, [sortColumn, searchValueDebounce]);
    return (React.createElement("div", null,
        React.createElement("div", { className: index_module_scss_1["default"].templateBtn },
            React.createElement(input_1["default"], __assign({ name: "search", label: "Search", value: searchValue, className: index_module_scss_1["default"].inputClassInventory, onChange: handleChangeSearch, iconClass: index_module_scss_1["default"].iconClassInventory }, __assign({}, (searchValue && {
                icon: cross_fat_svg_1["default"],
                onClick: function () {
                    setSearchValue("");
                }
            })))),
            React.createElement(button_1["default"], { type: "button", title: "Create Inventory", handleClick: function () {
                    navigate("/create-inventory");
                } })),
        React.createElement(table_1["default"], { rows: rows, columns: columns_1.Columns, sortColumn: sortColumn, handleSort: function (sort) { return setSortColumn(sort); }, isLoading: templateLoading, actions: function (_a) {
                var row = _a.row;
                return (React.createElement("td", { className: index_module_scss_1["default"].iconRow, key: row === null || row === void 0 ? void 0 : row._id },
                    React.createElement(button_1["default"], { type: "button", icon: edit_svg_1["default"], loaderClass: index_module_scss_1["default"].loading, handleClick: function () {
                            navigate("/inventory/" + (row === null || row === void 0 ? void 0 : row._id));
                        } }),
                    React.createElement(button_1["default"], { type: "button", icon: del_icon_svg_1["default"], loaderClass: index_module_scss_1["default"].loading, isLoading: isDeleting === (row === null || row === void 0 ? void 0 : row._id), handleClick: function () { return handleDelete(row === null || row === void 0 ? void 0 : row._id); } })));
            } })));
};
exports["default"] = Inventory;
