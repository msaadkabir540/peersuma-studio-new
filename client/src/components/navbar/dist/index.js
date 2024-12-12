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
var react_redux_1 = require("react-redux");
var react_router_dom_1 = require("react-router-dom");
var modal_1 = require("../modal");
var button_1 = require("../button");
var nav_drop_down_1 = require("./nav-drop-down");
var permission_restrict_1 = require("../permission-restrict");
var index_1 = require("@/reducers/index");
var helper_1 = require("@/utils/helper");
var peersuma_logo_png_1 = require("@/assets/peersuma-logo.png");
var settings_gear_svg_1 = require("@/assets/settings-gear.svg");
require("react-dropdown/style.css");
var index_module_scss_1 = require("./index.module.scss");
var clients_module_scss_1 = require("@/pages/clients/clients.module.scss");
var Navbar = function () {
    var _a;
    var wrapperRef = react_1.useRef(null);
    var navigate = react_router_dom_1.useNavigate();
    var dispatch = react_redux_1.useDispatch();
    var pathname = react_router_dom_1.useLocation().pathname;
    var loggedInUser = react_redux_1.useSelector(function (state) { return state.users; }).loggedInUser;
    var currentClient = react_redux_1.useSelector(function (state) { return state.clients; }).currentClient;
    var _b = react_1.useState({ show: "none", action: false }), navbar = _b[0], setNavbar = _b[1];
    var show = navbar.show, action = navbar.action;
    var _c = react_1.useState(false), open = _c[0], setOpen = _c[1];
    var handleLogout = function () {
        // Clear Local Storage
        localStorage.clear();
        setNavbar(function (prev) { return (__assign(__assign({}, prev), { action: false })); });
        navigate("/sign-in");
        dispatch(index_1.setLogout());
    };
    helper_1.useOutsideClickHook(wrapperRef, function () {
        setNavbar(function (prev) { return (__assign(__assign({}, prev), { show: "none" })); });
    });
    return (React.createElement("div", { className: index_module_scss_1["default"].main, style: { display: "" + showNav(pathname) } },
        React.createElement("div", { className: index_module_scss_1["default"].title },
            React.createElement(react_router_dom_1.Link, { to: "/home", className: index_module_scss_1["default"].link },
                React.createElement("img", { src: peersuma_logo_png_1["default"], alt: "peersuma-logo" })), navTabs === null || navTabs === void 0 ? void 0 :
            navTabs.map(function (_a, index) {
                var title = _a.title, route = _a.route, match = _a.match, checkAccesses = _a.checkAccesses;
                return (React.createElement(permission_restrict_1["default"], __assign({ key: index }, { checkAccesses: checkAccesses }),
                    React.createElement(react_router_dom_1.Link, { to: route, className: match.some(function (x) { return pathname.includes(x); }) || route === pathname
                            ? index_module_scss_1["default"].active
                            : index_module_scss_1["default"].tab }, title)));
            })),
        React.createElement("div", { className: index_module_scss_1["default"].pages },
            React.createElement("p", { className: index_module_scss_1["default"].navText }, (currentClient === null || currentClient === void 0 ? void 0 : currentClient.name) || ""),
            React.createElement(permission_restrict_1["default"], { checkAccesses: ["change_client"] },
                React.createElement(nav_drop_down_1["default"], null)),
            open && React.createElement("div", { className: index_module_scss_1["default"].backdropDiv, onClick: function () { return setOpen(false); } }),
            React.createElement("div", { className: index_module_scss_1["default"].logoutDiv },
                React.createElement("svg", { className: index_module_scss_1["default"].logout, onClick: function () { return setOpen(true); }, focusable: "false", viewBox: "0 0 24 24", "aria-hidden": "true" },
                    React.createElement("path", { d: "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" })),
                open && (React.createElement("div", { className: index_module_scss_1["default"].logoutMenu },
                    React.createElement("span", null,
                        "User Name: ",
                        (loggedInUser === null || loggedInUser === void 0 ? void 0 : loggedInUser.username) || (loggedInUser === null || loggedInUser === void 0 ? void 0 : loggedInUser.fullName)),
                    React.createElement("span", null,
                        "Role: ", (_a = loggedInUser === null || loggedInUser === void 0 ? void 0 : loggedInUser.roles) === null || _a === void 0 ? void 0 :
                        _a[0]),
                    React.createElement(button_1["default"], { title: "Logout", handleClick: function () { return setNavbar(function (prev) { return (__assign(__assign({}, prev), { action: true })); }); } })))),
            React.createElement(permission_restrict_1["default"], { checkAccesses: ["admin", "backend", "producer"] },
                React.createElement("div", { ref: wrapperRef, className: pathname === "/categories" || pathname === "/users" ? index_module_scss_1["default"].settingsActive : "", style: {
                        position: "relative",
                        cursor: "pointer"
                    }, onClick: function () {
                        show === "none"
                            ? setNavbar(function (prev) { return (__assign(__assign({}, prev), { show: "grid" })); })
                            : setNavbar(function (prev) { return (__assign(__assign({}, prev), { show: "none" })); });
                    } },
                    React.createElement("img", { src: settings_gear_svg_1["default"], style: {
                            height: "20px",
                            width: "20px"
                        }, alt: "gear-icon" }),
                    React.createElement("div", { className: index_module_scss_1["default"].menu, style: { display: "" + show } },
                        React.createElement(permission_restrict_1["default"], { checkAccesses: ["backend"] },
                            React.createElement("div", { className: index_module_scss_1["default"].innerDiv },
                                React.createElement("h2", null, "Backend Menu"),
                                React.createElement(react_router_dom_1.Link, { to: "/clients", className: pathname === "/clients" ? index_module_scss_1["default"].active : "" }, "Schools"),
                                React.createElement(react_router_dom_1.Link, { to: "/categories" }, "Tags"))),
                        React.createElement(permission_restrict_1["default"], { checkAccesses: ["producer"] },
                            React.createElement("div", { className: index_module_scss_1["default"].innerDiv },
                                React.createElement("h2", null, "Client Menu"),
                                React.createElement(react_router_dom_1.Link, { to: "/users" }, "Users")))))),
            React.createElement(modal_1["default"], __assign({}, {
                open: action,
                handleClose: function () { return setNavbar(function (prev) { return (__assign(__assign({}, prev), { action: false })); }); }
            }, { className: clients_module_scss_1["default"].bodyModal, modalWrapper: clients_module_scss_1["default"].opacityModal }),
                React.createElement("div", { className: clients_module_scss_1["default"].deleteModal },
                    React.createElement("svg", { focusable: "false", viewBox: "0 0 24 24", "aria-hidden": "true", style: {
                            height: "50px",
                            width: "50px"
                        } },
                        React.createElement("path", { d: "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" })),
                    React.createElement("h2", null, " Logout "),
                    React.createElement("p", { style: {
                            fontSize: "14px",
                            marginBottom: "10px"
                        } }, "Are you sure you want to logout?"),
                    React.createElement("div", { className: clients_module_scss_1["default"].buttonContainer },
                        React.createElement(button_1["default"], { type: "button", title: "No", handleClick: function () {
                                setNavbar(function (prev) { return (__assign(__assign({}, prev), { action: false })); });
                            }, className: clients_module_scss_1["default"].cancelBtn }),
                        React.createElement(button_1["default"], { type: "button", title: "Yes", className: clients_module_scss_1["default"].delBtn, loaderClass: clients_module_scss_1["default"].loading, isLoading: false, handleClick: handleLogout })))))));
};
exports["default"] = react_1.memo(Navbar);
var pagesWithoutNavbar = ["/sign-in", "/sign-email", "/forgot-password", "/authentication"];
var showNav = function (pathname) {
    return pagesWithoutNavbar.includes(pathname) ||
        /^\/(password-reset|showcase|embed|player|album-media-upload)\//.test(pathname)
        ? "none"
        : "flex";
};
var navTabs = [
    { title: "Projects", route: "/", match: ["project"], checkAccesses: ["get_all_projects"] },
    {
        title: "Templates",
        route: "/templates",
        match: ["template"],
        checkAccesses: ["get_all_templates"]
    },
    {
        title: "Media Library",
        route: "/media-library",
        match: ["/media-library"],
        checkAccesses: ["get_all_media_library"]
    },
    {
        title: "Themes",
        route: "/themes",
        match: ["/themes"],
        checkAccesses: ["get_all_media_library"]
    },
    {
        title: "Inventory",
        route: "/inventory",
        match: ["/inventory"],
        checkAccesses: ["get_all_projects"]
    },
];
